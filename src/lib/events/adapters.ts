import type {
  PublicEventDto,
  PublicScheduleDto,
  SiteEvent,
  SiteSchedule,
} from "./types";

const DAY_OF_WEEK_FROM_API: Record<string, string> = {
  sunday: "Domingo",
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  // Formas curtas em português (vindas do ChurchManager)
  domingo: "Domingo",
  segunda: "Segunda-feira",
  terça: "Terça-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sábado: "Sábado",
  sabado: "Sábado",
};

/** Converte o dayOfWeek da API (inglês ou PT abreviado) para o label PT completo do site. */
export function mapDayOfWeekFromApi(dayOfWeek: string): string {
  const key = dayOfWeek.trim().toLowerCase();
  return DAY_OF_WEEK_FROM_API[key] ?? dayOfWeek;
}

/**
 * Mapa do label PT completo para o formato aceito pela API do ChurchManager.
 * O ChurchManager aceita a forma PT abreviada (sem hífen): "Segunda", "Terça", etc.
 */
const DAY_OF_WEEK_TO_API: Record<string, string> = {
  domingo: "Domingo",
  "segunda-feira": "Segunda",
  segunda: "Segunda",
  "terça-feira": "Terça",
  terça: "Terça",
  terca: "Terça",
  "quarta-feira": "Quarta",
  quarta: "Quarta",
  "quinta-feira": "Quinta",
  quinta: "Quinta",
  "sexta-feira": "Sexta",
  sexta: "Sexta",
  sábado: "Sábado",
  sabado: "Sábado",
};

/** Converte o label PT completo do site para o formato aceito pela API do ChurchManager. */
export function mapDayOfWeekToApi(dayOfWeek: string): string {
  const key = dayOfWeek.trim().toLowerCase();
  return DAY_OF_WEEK_TO_API[key] ?? "Domingo";
}

export function toSiteEvent(dto: PublicEventDto): SiteEvent {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    short_description: dto.shortDescription ?? null,
    details_html: dto.detailsHtml ?? null,
    format: dto.format ?? 'IN_PERSON',
    online_url: dto.onlineUrl ?? null,
    video_url: dto.videoUrl ?? null,
    date: dto.date,
    time_start: dto.timeStart,
    time_end: dto.timeEnd,
    location: dto.location,
    image_url: dto.imageUrl,
    cover_image_url: dto.coverImageUrl ?? null,
    tag: dto.tag,
    tags: dto.tags ?? [],
    published: dto.published,
    registration_closes_at: dto.registrationClosesAt ?? null,
    terms_url: dto.termsUrl ?? null,
    currency: dto.currency ?? null,
  };
}

export function toSiteSchedule(dto: PublicScheduleDto): SiteSchedule {
  return {
    id: dto.id,
    title: dto.title,
    day_of_week: mapDayOfWeekFromApi(dto.dayOfWeek),
    time_start: dto.timeStart,
    location: dto.location,
    description: dto.description,
    active: dto.active,
    sort_order: dto.sortOrder,
  };
}
