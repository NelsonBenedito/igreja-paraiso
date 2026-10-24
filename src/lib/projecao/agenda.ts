import type { PublicEventDto, PublicProjectionAgendaItemDto } from "@/lib/events/types";

/**
 * Contrato da tela de projeção (`/projecao-agenda`, exibida no Holyrics).
 * A página estática em `public/projecao-agenda` lê este formato em `/api/projecao-agenda`.
 *
 * Datas em ISO 8601 com o fuso de São Paulo (`-03:00`), ou só `YYYY-MM-DD` para
 * evento sem horário. A página formata tudo ("segunda às 18:30h", "hoje", "amanhã").
 */
export interface ProjecaoAviso {
  id: string;
  titulo: string;
  inicio: string;
  /** Término; a página só usa para eventos de vários dias. */
  fim: string | null;
  /** Substitui "dia às hora" na 2ª linha. A API ainda não tem campo para isso. */
  subtitulo: string | null;
  /** Linha pequena abaixo do detalhe (`shortDescription` do evento / descrição do horário). */
  observacao: string | null;
  /** Ainda não exibido; disponível para futuras versões da arte. */
  local: string | null;
}

export interface ProjecaoAgenda {
  rotulo: string;
  boasVindas: { linhas: string[]; cursiva: string };
  atualizadoEm: string;
  avisos: ProjecaoAviso[];
}

/** America/Sao_Paulo não tem horário de verão desde 2019. */
const OFFSET_SAO_PAULO = "-03:00";

function horaCurta(time: string | null): string | null {
  const m = time ? /^(\d{2}):(\d{2})/.exec(time) : null;
  return m ? `${m[1]}:${m[2]}` : null;
}

function texto(v: string | null | undefined): string | null {
  const t = v?.replace(/\s+/g, " ").trim();
  return t ? t : null;
}

/** Campos comuns a evento e item da agenda do telão. */
interface OrigemAviso {
  id: string;
  title: string;
  date: string;
  timeStart: string | null;
  timeEnd: string | null;
  note: string | null | undefined;
  location: string | null;
}

function montarAviso(o: OrigemAviso): ProjecaoAviso {
  const inicio = horaCurta(o.timeStart);
  const fim = horaCurta(o.timeEnd);
  return {
    id: o.id,
    titulo: o.title.trim(),
    inicio: inicio ? `${o.date}T${inicio}:00${OFFSET_SAO_PAULO}` : o.date,
    fim: inicio && fim ? `${o.date}T${fim}:00${OFFSET_SAO_PAULO}` : null,
    subtitulo: null,
    observacao: texto(o.note),
    local: texto(o.location),
  };
}

function montarAgenda(avisos: ProjecaoAviso[], agora: Date): ProjecaoAgenda {
  return {
    rotulo: "programação",
    boasVindas: { linhas: ["Seja muito", "bem-vindo"], cursiva: "bem-vindo" },
    atualizadoEm: agora.toISOString(),
    avisos,
  };
}

export function toProjecaoAviso(evento: PublicEventDto): ProjecaoAviso {
  return montarAviso({ ...evento, note: evento.shortDescription });
}

/** Caminho antigo (API sem `/projection-agenda`): só eventos publicados. */
export function montarProjecaoAgenda(eventos: PublicEventDto[], agora = new Date()): ProjecaoAgenda {
  return montarAgenda(eventos.filter((e) => e.published).map(toProjecaoAviso), agora);
}

/**
 * Agenda do telão vinda da API (eventos + programação semanal), já filtrada e
 * ordenada lá. `id` é a `key` do item, única também para cada ocorrência de horário.
 */
export function montarProjecaoDaAgenda(
  items: PublicProjectionAgendaItemDto[],
  agora = new Date(),
): ProjecaoAgenda {
  return montarAgenda(
    items.map((item) => montarAviso({ ...item, id: item.key })),
    agora,
  );
}
