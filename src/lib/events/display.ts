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
 */
export function isEventFinished(
  event: { date: string; time_end: string | null; time_start: string | null },
  now = new Date(),
): boolean {
  const endTime = (event.time_end ?? event.time_start ?? "23:59").slice(0, 5);
  return saoPauloNow(now) > `${event.date} ${endTime}`;
}

const YOUTUBE_ID = /^[\w-]{11}$/;

function youtubeEmbed(id: string | null | undefined): string | null {
  return id && YOUTUBE_ID.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

/**
 * URL de vídeo do painel → URL de embed: YouTube (`watch?v=`, `youtu.be/`,
 * `shorts/`, `embed/`) → `youtube-nocookie.com/embed/<id>`; Vimeo
 * (`vimeo.com/<id>`) → `player.vimeo.com/video/<id>`. Outro → `null`.
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
  const [first, second] = parsed.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") return youtubeEmbed(first);
  if (host === "youtube.com") {
    if (first === "watch") return youtubeEmbed(parsed.searchParams.get("v"));
    if (first === "shorts" || first === "embed") return youtubeEmbed(second);
    return null;
  }
  if (host === "vimeo.com" && first && !second && /^\d+$/.test(first)) {
    return `https://player.vimeo.com/video/${first}`;
  }
  return null;
}
