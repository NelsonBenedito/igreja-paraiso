import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { SiteEvent } from "@/lib/events/types";

vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }),
}));

const { default: EventRegistrationModal } = await import("./EventRegistrationModal");

const EVENTO: SiteEvent = {
  id: "3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b",
  title: "Conferência",
  description: null,
  short_description: null,
  details_html: null,
  format: "IN_PERSON",
  online_url: null,
  video_url: null,
  date: "2099-11-01",
  time_start: "19:00:00",
  time_end: null,
  location: null,
  image_url: "https://media.example/antiga.jpg",
  cover_image_url: "https://media.example/capa.jpg",
  tag: "Legado",
  tags: [{ id: "t1", name: "Jovens", slug: "jovens" }],
  published: true,
  registration_closes_at: null,
  terms_url: null,
  currency: null,
};

const render = (event: SiteEvent) =>
  renderToStaticMarkup(createElement(EventRegistrationModal, { event, onClose: () => {} }));

describe("EventRegistrationModal — cabeçalho", () => {
  it("usa a capa e a primeira tag do painel, como os cards", () => {
    const html = render(EVENTO);
    expect(html).toContain("https://media.example/capa.jpg");
    expect(html).not.toContain("antiga.jpg");
    expect(html).toContain(">Jovens<");
    expect(html).not.toContain("Legado");
  });

  it("sem os campos novos, cai na imagem e etiqueta antigas", () => {
    const html = render({ ...EVENTO, cover_image_url: null, tags: [] });
    expect(html).toContain("https://media.example/antiga.jpg");
    expect(html).toContain(">Legado<");
  });
});
