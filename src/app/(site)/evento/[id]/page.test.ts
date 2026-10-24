import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SiteEvent } from "@/lib/events/types";

const getPublicEventById = vi.fn<(id: string) => Promise<SiteEvent | null>>();
vi.mock("@/lib/events/data", () => ({
  getPublicEventById: (id: string) => getPublicEventById(id),
  isUserRegisteredForEvent: async () => false,
}));
vi.mock("@/utils/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }),
}));

const { default: EventoPage, generateMetadata } = await import("./page");

const EVENTO: SiteEvent = {
  id: "3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b",
  title: "Conferência de Jovens",
  description: "Descrição longa do evento",
  short_description: "Resumo do painel",
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
  tag: null,
  tags: [],
  published: true,
  registration_closes_at: null,
  terms_url: null,
  currency: null,
};

const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe("/evento/[id] — metadados", () => {
  beforeEach(() => getPublicEventById.mockReset());

  it("Open Graph leva título, descrição e capa do evento", async () => {
    getPublicEventById.mockResolvedValue(EVENTO);
    const meta = await generateMetadata(params(EVENTO.id));
    expect(meta.title).toBe("Conferência de Jovens | Igreja Paraíso");
    expect(meta.description).toBe("Resumo do painel");
    expect(meta.openGraph).toEqual({
      title: "Conferência de Jovens | Igreja Paraíso",
      description: "Resumo do painel",
      images: ["https://media.example/capa.jpg"],
    });
  });

  it("sem imagem, Open Graph não inventa uma", async () => {
    getPublicEventById.mockResolvedValue({ ...EVENTO, cover_image_url: null, image_url: null });
    const meta = await generateMetadata(params(EVENTO.id));
    expect(meta.openGraph).toEqual({
      title: "Conferência de Jovens | Igreja Paraíso",
      description: "Resumo do painel",
    });
  });

  it("evento inexistente → sem metadados próprios", async () => {
    getPublicEventById.mockResolvedValue(null);
    expect(await generateMetadata(params("x"))).toEqual({});
  });
});

describe("/evento/[id] — details_html", () => {
  beforeEach(() => getPublicEventById.mockReset());

  it("é sanitizado no servidor antes de chegar ao componente cliente", async () => {
    getPublicEventById.mockResolvedValue({
      ...EVENTO,
      details_html: '<p>Programação</p><script>alert(1)</script><a href="https://exemplo.com" target="_blank">site</a>',
    });
    const page = (await EventoPage(params(EVENTO.id))) as { props: { event: SiteEvent } };
    expect(page.props.event.details_html).toBe(
      '<p>Programação</p><a href="https://exemplo.com" target="_blank" rel="noopener noreferrer">site</a>',
    );
  });

  it("sem details_html continua nulo", async () => {
    getPublicEventById.mockResolvedValue(EVENTO);
    const page = (await EventoPage(params(EVENTO.id))) as { props: { event: SiteEvent } };
    expect(page.props.event.details_html).toBeNull();
  });
});
