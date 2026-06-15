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
};

export function mapDayOfWeekFromApi(dayOfWeek: string): string {
  const key = dayOfWeek.trim().toLowerCase();
  return DAY_OF_WEEK_FROM_API[key] ?? dayOfWeek;
}

export function toSiteEvent(dto: PublicEventDto): SiteEvent {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    date: dto.date,
    time_start: dto.timeStart,
    time_end: dto.timeEnd,
    location: dto.location,
    image_url: dto.imageUrl,
    tag: dto.tag,
    published: dto.published,
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
