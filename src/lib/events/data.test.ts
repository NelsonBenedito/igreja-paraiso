import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getPublicEventById } from "./data";

const ID = "3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b";
const fetchMock = vi.fn<typeof fetch>();

function resposta(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("getPublicEventById", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_API_BASE", "https://api.exemplo.com");
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_TENANT_SLUG", "paraiso");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("id que não é UUID → null, sem chamar a API", async () => {
    expect(await getPublicEventById("nao-e-uuid")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([400, 404])("API responde %i → null (página 404)", async (status) => {
    fetchMock.mockResolvedValue(resposta(status, { message: "Evento inválido" }));
    expect(await getPublicEventById(ID)).toBeNull();
  });

  it("outros erros da API continuam a ser lançados", async () => {
    fetchMock.mockResolvedValue(resposta(500, { message: "Falha" }));
    await expect(getPublicEventById(ID)).rejects.toMatchObject({ status: 500 });
  });

  it("UUID válido → busca o evento com a tag de cache do site", async () => {
    fetchMock.mockResolvedValue(
      resposta(200, { id: ID, title: "Conferência", date: "2026-11-01", tags: [] }),
    );
    const event = await getPublicEventById(ID);
    expect(event).toMatchObject({ id: ID, title: "Conferência" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`https://api.exemplo.com/api/public/tenants/paraiso/events/${ID}`);
    expect((init as { next?: { tags?: string[] } }).next?.tags).toEqual(["site-content"]);
  });
});
