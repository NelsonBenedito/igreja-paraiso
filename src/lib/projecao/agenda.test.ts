import { describe, expect, it } from "vitest";
import type { PublicEventDto, PublicProjectionAgendaItemDto } from "@/lib/events/types";
import { montarProjecaoAgenda, montarProjecaoDaAgenda, toProjecaoAviso } from "./agenda";

function evento(parcial: Partial<PublicEventDto>): PublicEventDto {
  return {
    id: "8a1f6c1e-2b7d-4f7a-9d3e-1c2b3a4d5e6f",
    title: "Festa das Águas",
    description: null,
    format: "IN_PERSON",
    onlineUrl: null,
    shortDescription: null,
    detailsHtml: null,
    videoUrl: null,
    coverImageUrl: null,
    mediaMeta: null,
    date: "2026-10-24",
    timeStart: null,
    timeEnd: null,
    location: null,
    imageUrl: null,
    tag: null,
    tags: [],
    published: true,
    slug: null,
    timezone: "America/Sao_Paulo",
    registrationClosesAt: null,
    termsUrl: null,
    currency: "BRL",
    createdAt: "2026-10-01T12:00:00.000Z",
    updatedAt: "2026-10-01T12:00:00.000Z",
    ...parcial,
  };
}

describe("toProjecaoAviso", () => {
  it("junta data e horário no fuso de São Paulo", () => {
    const aviso = toProjecaoAviso(evento({ timeStart: "10:00:00", timeEnd: "12:30:00" }));
    expect(aviso.inicio).toBe("2026-10-24T10:00:00-03:00");
    expect(aviso.fim).toBe("2026-10-24T12:30:00-03:00");
  });

  it("evento sem horário vira só a data", () => {
    const aviso = toProjecaoAviso(evento({ timeEnd: "12:00:00" }));
    expect(aviso.inicio).toBe("2026-10-24");
    expect(aviso.fim).toBeNull();
  });

  it("usa a descrição curta como observação e limpa espaços", () => {
    const aviso = toProjecaoAviso(
      evento({ title: "  Churrasco ", shortDescription: "  Aniversário   de 29 anos ", location: "" }),
    );
    expect(aviso.titulo).toBe("Churrasco");
    expect(aviso.observacao).toBe("Aniversário de 29 anos");
    expect(aviso.local).toBeNull();
    expect(aviso.subtitulo).toBeNull();
  });
});

describe("montarProjecaoAgenda", () => {
  it("mantém a ordem da API e descarta evento não publicado", () => {
    const agenda = montarProjecaoAgenda(
      [
        evento({ id: "a", title: "Festa das Águas" }),
        evento({ id: "b", title: "Rascunho", published: false }),
        evento({ id: "c", title: "Churrasco" }),
      ],
      new Date("2026-10-23T15:00:00Z"),
    );
    expect(agenda.avisos.map((a) => a.id)).toEqual(["a", "c"]);
    expect(agenda.atualizadoEm).toBe("2026-10-23T15:00:00.000Z");
    expect(agenda.rotulo).toBe("programação");
  });
});

function item(parcial: Partial<PublicProjectionAgendaItemDto>): PublicProjectionAgendaItemDto {
  return {
    key: "schedule:5b1d2c3e-4f5a-4b6c-8d7e-9f0a1b2c3d4e:2026-10-25",
    kind: "schedule",
    sourceId: "5b1d2c3e-4f5a-4b6c-8d7e-9f0a1b2c3d4e",
    title: "Culto da Família",
    date: "2026-10-25",
    timeStart: null,
    timeEnd: null,
    location: null,
    note: null,
    ...parcial,
  };
}

describe("montarProjecaoDaAgenda", () => {
  const agora = new Date("2026-10-24T15:00:00Z");

  it("horário da programação: id é a key e início no fuso de São Paulo, sem fim", () => {
    const [aviso] = montarProjecaoDaAgenda([item({ timeStart: "18:30" })], agora).avisos;
    expect(aviso).toEqual({
      id: "schedule:5b1d2c3e-4f5a-4b6c-8d7e-9f0a1b2c3d4e:2026-10-25",
      titulo: "Culto da Família",
      inicio: "2026-10-25T18:30:00-03:00",
      fim: null,
      subtitulo: null,
      observacao: null,
      local: null,
    });
  });

  it("evento com início e término", () => {
    const [aviso] = montarProjecaoDaAgenda(
      [item({ key: "event:e1", kind: "event", sourceId: "e1", timeStart: "10:00", timeEnd: "12:30" })],
      agora,
    ).avisos;
    expect(aviso.id).toBe("event:e1");
    expect(aviso.inicio).toBe("2026-10-25T10:00:00-03:00");
    expect(aviso.fim).toBe("2026-10-25T12:30:00-03:00");
  });

  it("sem horário vira só a data e ignora o término", () => {
    const [aviso] = montarProjecaoDaAgenda([item({ timeEnd: "12:00" })], agora).avisos;
    expect(aviso.inicio).toBe("2026-10-25");
    expect(aviso.fim).toBeNull();
  });

  it("note vira observação; título, observação e local sem espaços sobrando", () => {
    const [aviso] = montarProjecaoDaAgenda(
      [item({ title: "  Escola Bíblica ", note: "  Todas as   idades ", location: "   " })],
      agora,
    ).avisos;
    expect(aviso.titulo).toBe("Escola Bíblica");
    expect(aviso.observacao).toBe("Todas as idades");
    expect(aviso.local).toBeNull();
  });

  it("mantém a ordem da API e os mesmos textos fixos do caminho de eventos", () => {
    const agenda = montarProjecaoDaAgenda(
      [item({ key: "b", location: " Templo " }), item({ key: "a" })],
      agora,
    );
    expect(agenda.avisos.map((a) => a.id)).toEqual(["b", "a"]);
    expect(agenda.avisos[0].local).toBe("Templo");
    expect(agenda.atualizadoEm).toBe("2026-10-24T15:00:00.000Z");
    const soEventos = montarProjecaoAgenda([], agora);
    expect(agenda.rotulo).toBe(soEventos.rotulo);
    expect(agenda.boasVindas).toEqual(soEventos.boasVindas);
  });
});
