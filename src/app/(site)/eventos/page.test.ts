import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SiteEvent } from "@/lib/events/types";

const getPublicEvents = vi.fn<() => Promise<SiteEvent[]>>();
vi.mock("@/lib/events/data", () => ({ getPublicEvents: () => getPublicEvents() }));

const { default: EventsPage } = await import("./page");

const EVENTO: SiteEvent = {
  id: "3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b",
  title: "Conferência de Jovens",
  description: "Descrição longa do evento",
  short_description: "Resumo do painel",
  details_html: null,
  format: "IN_PERSON",
  online_url: null,
  video_url: null,
  date: "2026-11-01",
  time_start: "19:00:00",
  time_end: null,
  location: "Templo sede",
  image_url: "https://media.example/antiga.jpg",
  cover_image_url: "https://media.example/capa.jpg",
  tag: "Legado",
  tags: [{ id: "t1", name: "Jovens", slug: "jovens" }],
  published: true,
  registration_closes_at: null,
  terms_url: null,
  currency: null,
};

describe("/eventos — cards", () => {
  beforeEach(() => getPublicEvents.mockReset());

  it("cada card leva ao detalhe e mostra os campos do painel", async () => {
    getPublicEvents.mockResolvedValue([EVENTO]);
    const html = renderToStaticMarkup(await EventsPage());
    expect(html).toContain(`href="/evento/${EVENTO.id}"`);
    expect(html).toContain("Resumo do painel");
    expect(html).not.toContain("Descrição longa do evento");
    expect(html).toContain('src="https://media.example/capa.jpg"');
    expect(html).toContain("Jovens");
    expect(html).not.toContain("Legado");
  });

  it("sem eventos mostra só o texto de reserva", async () => {
    getPublicEvents.mockResolvedValue([]);
    const html = renderToStaticMarkup(await EventsPage());
    expect(html).toContain("Nenhum evento programado no momento.");
    expect(html).not.toContain('href="/evento/');
  });
});
