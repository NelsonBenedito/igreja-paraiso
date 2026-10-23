import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { SiteEvent } from "@/lib/events/types";
import EventoClient from "./EventoClient";

function evento(o: Partial<SiteEvent>): SiteEvent {
  return {
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
    time_end: "21:00:00",
    location: null,
    image_url: null,
    cover_image_url: null,
    tag: null,
    tags: [],
    published: true,
    registration_closes_at: null,
    terms_url: null,
    currency: null,
    ...o,
  };
}

const render = (event: SiteEvent, isRegisteredServer = false) =>
  renderToStaticMarkup(createElement(EventoClient, { event, isRegisteredServer }));

describe("/evento/[id] — ação de inscrição", () => {
  it("evento futuro oferece a inscrição", () => {
    const html = render(evento({}));
    expect(html).toContain("Inscrever-se Agora");
    expect(html).not.toContain("Evento encerrado");
  });

  it("evento já passado mostra \"Evento encerrado\" no lugar do botão", () => {
    const html = render(evento({ date: "2020-03-01" }), true);
    expect(html).toContain("Evento encerrado");
    expect(html).not.toContain("Inscrever-se Agora");
    expect(html).not.toContain("Inscrição Confirmada");
  });

  it("prazo de inscrição vencido continua a mostrar \"Inscrições encerradas\"", () => {
    const html = render(evento({ registration_closes_at: "2020-01-01T00:00:00Z" }));
    expect(html).toContain("Inscrições encerradas");
    expect(html).not.toContain("Inscrever-se Agora");
  });
});

describe("/evento/[id] — conteúdo do painel", () => {
  it("details_html (já sanitizado no servidor) é exibido como recebido", () => {
    const details = '<p>Programação</p><a href="https://exemplo.com" target="_blank" rel="noopener noreferrer">site</a>';
    const html = render(evento({ details_html: details }));
    expect(html).toContain(details);
    expect(html).not.toContain("Nenhuma descrição fornecida");
  });

  it("vídeo do YouTube vira iframe youtube-nocookie", () => {
    const html = render(evento({ video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }));
    expect(html).toContain('<iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"');
    expect(html).not.toContain("Assistir ao vídeo");
  });

  it("vídeo com URL que não é http(s) não vira link nem iframe", () => {
    const html = render(evento({ video_url: "javascript:alert(1)" }));
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("Assistir ao vídeo");
    expect(html).not.toContain("javascript:");
  });

  it("vídeo sem embed conhecido vira link em nova aba, sem iframe", () => {
    const html = render(evento({ video_url: "https://example.com/video.mp4" }));
    expect(html).not.toContain("<iframe");
    expect(html).toMatch(
      /<a href="https:\/\/example\.com\/video\.mp4" target="_blank" rel="noopener noreferrer"[^>]*>.*Assistir ao vídeo/,
    );
  });

  it("espaço nas pontas da URL do vídeo não esconde o link", () => {
    const html = render(evento({ video_url: "  https://example.com/video.mp4 " }));
    expect(html).not.toContain("<iframe");
    expect(html).toMatch(
      /<a href="https:\/\/example\.com\/video\.mp4" target="_blank" rel="noopener noreferrer"[^>]*>.*Assistir ao vídeo/,
    );
  });
});

describe("/evento/[id] — hero", () => {
  it("usa capa e primeira tag do painel, como os cards, sem repetir a tag", () => {
    const html = render(
      evento({
        cover_image_url: "https://media.example/capa.jpg",
        image_url: "https://media.example/antiga.jpg",
        tags: [
          { id: "t1", name: "Jovens", slug: "jovens" },
          { id: "t2", name: "Louvor", slug: "louvor" },
        ],
        tag: "Legado",
      }),
    );
    expect(html).toContain('src="https://media.example/capa.jpg"');
    expect(html).not.toContain("antiga.jpg");
    expect(html).not.toContain("Legado");
    expect(html.match(/>Jovens</g)).toHaveLength(1);
    expect(html.match(/>Louvor</g)).toHaveLength(1);
  });

  it("sem os campos novos, cai na imagem e etiqueta antigas", () => {
    const html = render(evento({ image_url: "https://media.example/antiga.jpg", tag: "Legado" }));
    expect(html).toContain('src="https://media.example/antiga.jpg"');
    expect(html).toContain(">Legado<");
  });
});
