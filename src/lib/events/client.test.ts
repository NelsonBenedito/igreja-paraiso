import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPublicEvents, fetchPublishedEvents } from "./client";

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
