import { describe, expect, it } from "vitest";
import { eventCardContent, isEventFinished, toEmbedUrl } from "./display";

/** 22/10/2026 12:00 em São Paulo (UTC-3). */
const AGORA = new Date("2026-10-22T15:00:00Z");

function evento(date: string, time_start: string | null = null, time_end: string | null = null) {
  return { date, time_start, time_end };
}

describe("isEventFinished", () => {
  it("evento de ontem está encerrado", () => {
    expect(isEventFinished(evento("2026-10-21", "19:00:00", "21:00:00"), AGORA)).toBe(true);
  });

  it("evento de hoje com término ainda por vir não está encerrado", () => {
    expect(isEventFinished(evento("2026-10-22", "10:00:00", "14:00:00"), AGORA)).toBe(false);
  });

  it("evento de hoje com término já passado está encerrado", () => {
    expect(isEventFinished(evento("2026-10-22", "08:00:00", "11:00:00"), AGORA)).toBe(true);
  });

  it("evento de hoje sem horários só encerra no fim do dia", () => {
    expect(isEventFinished(evento("2026-10-22"), AGORA)).toBe(false);
  });

  it("sem término, usa o horário de início", () => {
    expect(isEventFinished(evento("2026-10-22", "11:00:00"), AGORA)).toBe(true);
    expect(isEventFinished(evento("2026-10-22", "13:00"), AGORA)).toBe(false);
  });

  it("evento de amanhã não está encerrado", () => {
    expect(isEventFinished(evento("2026-10-23"), AGORA)).toBe(false);
  });

  it("compara no fuso de São Paulo, não em UTC", () => {
    // 23/10 01:30 UTC = 22/10 22:30 em São Paulo: o evento de 22/10 ainda não acabou.
    const noite = new Date("2026-10-23T01:30:00Z");
    expect(isEventFinished(evento("2026-10-22"), noite)).toBe(false);
    expect(isEventFinished(evento("2026-10-22", "20:00:00", "22:00:00"), noite)).toBe(true);
  });

  it("evento que cruza a meia-noite (término < início) só encerra às 23:59 do dia", () => {
    const virada = evento("2026-10-22", "22:00:00", "01:00:00");
    const as2330 = new Date("2026-10-23T02:30:00Z"); // 22/10 23:30 em São Paulo
    const as2359 = new Date("2026-10-23T02:59:30Z"); // 22/10 23:59 em São Paulo
    const as0030 = new Date("2026-10-23T03:30:00Z"); // 23/10 00:30 em São Paulo
    expect(isEventFinished(virada, AGORA)).toBe(false);
    expect(isEventFinished(virada, as2330)).toBe(false);
    expect(isEventFinished(virada, as2359)).toBe(false);
    expect(isEventFinished(virada, as0030)).toBe(true);
  });

  it("à meia-noite em São Paulo o dia já é o seguinte (00h, não 24h)", () => {
    const meiaNoite = new Date("2026-10-22T03:00:00Z"); // 22/10 00:00 em São Paulo
    expect(isEventFinished(evento("2026-10-21"), meiaNoite)).toBe(true);
    expect(isEventFinished(evento("2026-10-22", "00:00:00", "00:30:00"), meiaNoite)).toBe(false);
  });
});

describe("eventCardContent", () => {
  const base = {
    short_description: null,
    description: null,
    cover_image_url: null,
    image_url: null,
    tags: [],
    tag: null,
  };

  it("prefere descrição curta, capa e primeira tag do painel", () => {
    expect(
      eventCardContent({
        short_description: "Resumo",
        description: "Descrição longa",
        cover_image_url: "https://media.example/capa.jpg",
        image_url: "https://media.example/antiga.jpg",
        tags: [
          { id: "t1", name: "Jovens", slug: "jovens" },
          { id: "t2", name: "Louvor", slug: "louvor" },
        ],
        tag: "Legado",
      }),
    ).toEqual({ text: "Resumo", imageUrl: "https://media.example/capa.jpg", tag: "Jovens" });
  });

  it("sem os campos novos, cai na descrição, imagem e etiqueta antigas", () => {
    expect(
      eventCardContent({
        ...base,
        description: "Descrição longa",
        image_url: "https://media.example/antiga.jpg",
        tag: "Legado",
      }),
    ).toEqual({ text: "Descrição longa", imageUrl: "https://media.example/antiga.jpg", tag: "Legado" });
  });

  it("sem nada, devolve nulos", () => {
    expect(eventCardContent(base)).toEqual({ text: null, imageUrl: null, tag: null });
  });
});

describe("toEmbedUrl", () => {
  const YT = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";

  it.each([
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtube.com/watch?v=dQw4w9WgXcQ&t=42s",
    "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ?si=abc",
    "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "  https://youtu.be/dQw4w9WgXcQ  ",
  ])("YouTube %s → youtube-nocookie", (url) => {
    expect(toEmbedUrl(url)).toBe(YT);
  });

  it("Vimeo → player.vimeo.com", () => {
    expect(toEmbedUrl("https://vimeo.com/76979871")).toBe("https://player.vimeo.com/video/76979871");
    expect(toEmbedUrl("https://www.vimeo.com/76979871")).toBe("https://player.vimeo.com/video/76979871");
  });

  it.each([
    "https://example.com/video.mp4",
    "https://www.youtube.com/watch",
    "https://www.youtube.com/watch?v=curto",
    "https://www.youtube.com/channel/UC123",
    "https://vimeo.com/channels/staffpicks",
    "https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ",
    "javascript:alert(1)",
    "não é url",
    "",
  ])("%s → null (sem embed)", (url) => {
    expect(toEmbedUrl(url)).toBeNull();
  });
});
