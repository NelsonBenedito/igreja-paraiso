import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type SessionUser = { id: string; email?: string } | null;
let sessionUser: SessionUser = null;
vi.mock("@/utils/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: sessionUser } }) },
  }),
}));

import { GET } from "./route";

const fetchMock = vi.fn<typeof fetch>();

describe("GET /api/membros/inscricoes", () => {
  beforeEach(() => {
    sessionUser = null;
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_API_BASE", "https://api.exemplo.com");
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_TENANT_SLUG", "paraiso");
    vi.stubEnv("CHURCHMANAGER_PARTICIPANT_SECRET", "segredo-123");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sem sessão → 401 sem consultar a API", async () => {
    const res = await GET();
    expect(res.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("com sessão → ids das inscrições, consultados com o e-mail da sessão e o segredo", async () => {
    sessionUser = { id: "u1", email: "Membro@Exemplo.com" };
    fetchMock.mockResolvedValue(
      Response.json({ items: [{ eventId: "e1" }, { eventId: "e2" }] }),
    );

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ eventIds: ["e1", "e2"] });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe(
      "https://api.exemplo.com/api/public/tenants/paraiso/registrations/mine?email=membro%40exemplo.com&userId=u1",
    );
    expect((init?.headers as Record<string, string>)["x-participant-secret"]).toBe("segredo-123");
  });

  it("falha da API → 200 com lista vazia (a página degrada sem quebrar)", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    sessionUser = { id: "u1", email: "membro@exemplo.com" };
    fetchMock.mockResolvedValue(Response.json({ message: "Unauthorized" }, { status: 401 }));

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ eventIds: [] });
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("utilizador sem e-mail → lista vazia, sem consultar a API", async () => {
    sessionUser = { id: "u1" };
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ eventIds: [] });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
