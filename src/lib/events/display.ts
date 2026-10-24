import type { PublicEventDto, SiteEvent } from "./types";

export function eventDisplayDateTime(
  event: Pick<PublicEventDto, "date" | "timeStart"> | Pick<SiteEvent, "date" | "time_start">,
): Date | null {
  const date = "date" in event ? event.date : null;
  if (!date) return null;

  const [y, m, d] = date.split("-").map(Number);
  const timeStart =
    "timeStart" in event ? event.timeStart : "time_start" in event ? event.time_start : null;

  if (!timeStart) {
    return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  }

  const [h, min] = timeStart.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, h, min, 0));
}

/** Texto, imagem e etiqueta dos cards de evento, na mesma prioridade do painel. */
export function eventCardContent(
  event: Pick<
    SiteEvent,
    "short_description" | "description" | "cover_image_url" | "image_url" | "tags" | "tag"
  >,
): { text: string | null; imageUrl: string | null; tag: string | null } {
  return {
    text: event.short_description ?? event.description,
    imageUrl: event.cover_image_url ?? event.image_url,
    tag: event.tags[0]?.name ?? event.tag,
  };
}

export function formatEventDate(d: string): string {
  return new Date(d + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const EVENT_TIME_ZONE = "America/Sao_Paulo";

/** "Agora" civil em São Paulo no formato `YYYY-MM-DD HH:MM`. */
function saoPauloNow(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIME_ZONE,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  // Alguns motores escrevem a meia-noite como "24" com `hour12: false`.
  const hour = part("hour") === "24" ? "00" : part("hour");
  return `${part("year")}-${part("month")}-${part("day")} ${hour}:${part("minute")}`;
}

/**
 * O evento já terminou? Compara, no fuso de São Paulo, o fim do evento
 * (`date` + `time_end ?? time_start ?? "23:59"`) com o momento atual.
 * Término antes do início (evento que cruza a meia-noite) → fim às 23:59 do dia.
 */
export function isEventFinished(
  event: { date: string; time_end: string | null; time_start: string | null },
  now = new Date(),
): boolean {
  const start = event.time_start?.slice(0, 5) ?? null;
  const end = event.time_end?.slice(0, 5) ?? null;
  const endTime = end && start && end < start ? "23:59" : (end ?? start ?? "23:59");
  return saoPauloNow(now) > `${event.date} ${endTime}`;
}

const YOUTUBE_ID = /^[\w-]{11}$/;
const SECONDS = /^[1-9]\d*$/;

/** Embed do YouTube; `start`/`t` só em segundos inteiros (`?t=42`), outros formatos são ignorados. */
function youtubeEmbed(id: string | null | undefined, params: URLSearchParams): string | null {
  if (!id || !YOUTUBE_ID.test(id)) return null;
  const start = [params.get("start"), params.get("t")].find((v) => v && SECONDS.test(v));
  return `https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ""}`;
}

function vimeoEmbed(id: string | undefined): string | null {
  return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
}

/**
 * URL de vídeo do painel → URL de embed: YouTube (`watch?v=`, `youtu.be/`,
 * `shorts/`, `embed/`, `youtube-nocookie.com/embed/`) → `youtube-nocookie.com/embed/<id>`;
 * Vimeo (`vimeo.com/<id>`, `player.vimeo.com/video/<id>`) → `player.vimeo.com/video/<id>`.
 * Outro → `null`.
 */
export function toEmbedUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;

  const host = parsed.hostname.replace(/^(www|m)\./, "");
  const params = parsed.searchParams;
  const [first, second, third] = parsed.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") return youtubeEmbed(first, params);
  if (host === "youtube.com") {
    if (first === "watch") return youtubeEmbed(params.get("v"), params);
    if (first === "shorts" || first === "embed") return youtubeEmbed(second, params);
    return null;
  }
  if (host === "youtube-nocookie.com") {
    return first === "embed" ? youtubeEmbed(second, params) : null;
  }

  if (host === "vimeo.com") return second ? null : vimeoEmbed(first);
  if (host === "player.vimeo.com") return first === "video" && !third ? vimeoEmbed(second) : null;
  return null;
}
