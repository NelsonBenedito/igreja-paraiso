import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PublicEventDto } from "@/lib/events/types";

const fetchProjectionAgenda = vi.fn();
const fetchPublicEvents = vi.fn();
vi.mock("@/lib/events/client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/events/client")>()),
  fetchProjectionAgenda: (...args: unknown[]) => fetchProjectionAgenda(...args),
  fetchPublicEvents: (...args: unknown[]) => fetchPublicEvents(...args),
}));

import { EventsApiError } from "@/lib/events/client";
import { GET } from "./route";

const evento = {
  id: "e1",
  title: "Festa das Águas",
  date: "2026-10-24",
  timeStart: "19:00:00",
  timeEnd: null,
  shortDescription: null,
  location: null,
  published: true,
} as unknown as PublicEventDto;

describe("GET /api/projecao-agenda", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_API_BASE", "https://api.exemplo.com");
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_TENANT_SLUG", "paraiso");
    fetchProjectionAgenda.mockReset();
    fetchPublicEvents.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("usa a agenda do telão da API (eventos + programação)", async () => {
    fetchProjectionAgenda.mockResolvedValue({
      items: [
        {
          key: "schedule:s1:2026-10-25",
          kind: "schedule",
          sourceId: "s1",
          title: "Culto da Família",
          date: "2026-10-25",
          timeStart: "18:30",
          timeEnd: null,
          location: null,
          note: "Santa Ceia",
        },
      ],
    });

    const res = await GET();

    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    const corpo = await res.json();
    expect(corpo.avisos).toEqual([
      {
        id: "schedule:s1:2026-10-25",
        titulo: "Culto da Família",
        inicio: "2026-10-25T18:30:00-03:00",
        fim: null,
        subtitulo: null,
        observacao: "Santa Ceia",
        local: null,
      },
    ]);
    expect(fetchPublicEvents).not.toHaveBeenCalled();
    expect(corpo.topicos).toEqual([]);
    expect(corpo.rotuloTopicos).toBe("participe");
  });

  it("repassa os tópicos fixos da API", async () => {
    fetchProjectionAgenda.mockResolvedValue({
      items: [],
      topics: [
        { id: "t1", title: " Células ", text: "Encontre uma célula perto de você", callToAction: "Procure a recepção" },
        { id: "t2", title: "Batismo", text: "Inscrições abertas", callToAction: "" },
      ],
    });

    const res = await GET();

    expect(res.status).toBe(200);
    const corpo = await res.json();
    expect(corpo.topicos).toEqual([
      { id: "t1", titulo: "Células", texto: "Encontre uma célula perto de você", chamada: "Procure a recepção" },
      { id: "t2", titulo: "Batismo", texto: "Inscrições abertas", chamada: null },
    ]);
    expect(corpo.avisos).toEqual([]);
  });

  it("API antiga (404) → volta a mostrar só os eventos", async () => {
    fetchProjectionAgenda.mockRejectedValue(new EventsApiError(404, "Cannot GET"));
    fetchPublicEvents.mockResolvedValue({ items: [evento] });

    const res = await GET();

    expect(res.status).toBe(200);
    expect(fetchPublicEvents).toHaveBeenCalledWith({ upcomingOnly: true });
    const corpo = await res.json();
    expect(corpo.avisos.map((a: { id: string; inicio: string }) => [a.id, a.inicio])).toEqual([
      ["e1", "2026-10-24T19:00:00-03:00"],
    ]);
    expect(corpo.topicos).toEqual([]);
  });

  it("outro erro da API → 503 sem cache e sem tentar os eventos", async () => {
    fetchProjectionAgenda.mockRejectedValue(new EventsApiError(500, "Erro 500"));

    const res = await GET();

    expect(res.status).toBe(503);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(fetchPublicEvents).not.toHaveBeenCalled();
  });

  it("404 e depois falha nos eventos → 503", async () => {
    fetchProjectionAgenda.mockRejectedValue(new EventsApiError(404, "Cannot GET"));
    fetchPublicEvents.mockRejectedValue(new EventsApiError(0, "[network] fetch failed"));

    const res = await GET();

    expect(res.status).toBe(503);
  });

  it("API não configurada → 503 sem consultar nada", async () => {
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_API_BASE", "");

    const res = await GET();

    expect(res.status).toBe(503);
    expect(fetchProjectionAgenda).not.toHaveBeenCalled();
  });
});
