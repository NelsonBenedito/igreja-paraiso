import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkEventRegistration,
  fetchMyRegistrations,
  fetchPublicEvents,
  fetchPublishedEvents,
} from "./client";

const fetchMock = vi.fn<typeof fetch>();

describe("listas de eventos — cache", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_API_BASE", "https://api.exemplo.com");
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_TENANT_SLUG", "paraiso");
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => Response.json({ items: [], nextCursor: null }));
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  function nextOptions() {
    return (fetchMock.mock.calls[0][1] as { next?: { revalidate?: number; tags?: string[] } }).next;
  }

  it("/events usa a tag site-content, com 60 s de fallback", async () => {
    await fetchPublicEvents({ upcomingOnly: true });
    expect(nextOptions()).toEqual({ revalidate: 60, tags: ["site-content"] });
  });

  it("/events/published usa a tag site-content, com 60 s de fallback", async () => {
    await fetchPublishedEvents();
    expect(nextOptions()).toEqual({ revalidate: 60, tags: ["site-content"] });
  });
});

const EVENT_ID = "3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b";

describe("consultas de inscrição — segredo de participante", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_API_BASE", "https://api.exemplo.com");
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_TENANT_SLUG", "paraiso");
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => Response.json({ items: [], registered: false }));
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  function lastRequest(): { url: string; headers: Record<string, string> } {
    const [url, init] = fetchMock.mock.calls.at(-1)!;
    return { url: String(url), headers: (init?.headers ?? {}) as Record<string, string> };
  }

  it("fetchMyRegistrations envia x-participant-secret quando configurado", async () => {
    vi.stubEnv("CHURCHMANAGER_PARTICIPANT_SECRET", "segredo-123");
    await fetchMyRegistrations({ email: "Membro@Exemplo.com", userId: "u1" });
    const { url, headers } = lastRequest();
    expect(url).toBe(
      "https://api.exemplo.com/api/public/tenants/paraiso/registrations/mine?email=membro%40exemplo.com&userId=u1",
    );
    expect(headers["x-participant-secret"]).toBe("segredo-123");
  });

  it("checkEventRegistration envia x-participant-secret quando configurado", async () => {
    vi.stubEnv("CHURCHMANAGER_PARTICIPANT_SECRET", "segredo-123");
    await checkEventRegistration(EVENT_ID, { email: "a@b.com" });
    const { url, headers } = lastRequest();
    expect(url).toContain(`/events/${EVENT_ID}/registrations/check?email=a%40b.com`);
    expect(headers["x-participant-secret"]).toBe("segredo-123");
  });

  it("sem o segredo configurado, não envia o header", async () => {
    vi.stubEnv("CHURCHMANAGER_PARTICIPANT_SECRET", "");
    await fetchMyRegistrations({ email: "a@b.com" });
    expect(lastRequest().headers).not.toHaveProperty("x-participant-secret");
    await checkEventRegistration(EVENT_ID, { email: "a@b.com" });
    expect(lastRequest().headers).not.toHaveProperty("x-participant-secret");
  });
});
