import { describe, expect, it } from "vitest";
import { eventCardContent, isEventFinished } from "./display";

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
