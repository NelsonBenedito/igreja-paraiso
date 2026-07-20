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

export function formatEventDate(d: string): string {
  return new Date(d + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
