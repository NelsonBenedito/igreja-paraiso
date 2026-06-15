/** DTOs da API Nest — espelham events-public-api-reference.md */

export interface PublicEventDto {
  id: string;
  title: string;
  description: string | null;
  date: string;
  timeStart: string | null;
  timeEnd: string | null;
  location: string | null;
  imageUrl: string | null;
  tag: string | null;
  published: boolean;
  slug: string | null;
  timezone: string | null;
  registrationClosesAt: string | null;
  termsUrl: string | null;
  currency: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicEventListResponse {
  items: PublicEventDto[];
  nextCursor: string | null;
}

export interface PublicTicketTypeDto {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  feeCents: number;
  quantityTotal: number | null;
  quantityRemaining: number | null;
  minPerOrder: number;
  maxPerOrder: number;
  salesOpensAt: string | null;
  salesClosesAt: string | null;
  isSoldOut: boolean;
}

export interface PublicTicketsResponse {
  eventId: string;
  currency: string;
  ticketTypes: PublicTicketTypeDto[];
}

export interface EventRegistrationRequest {
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  userId?: string | null;
}

export interface EventRegistrationDto {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  userId: string | null;
  createdAt: string;
}

export interface RegistrationCheckResponse {
  registered: boolean;
}

export interface MyRegistrationItemDto extends EventRegistrationDto {
  event?: {
    title: string;
    date: string;
    tag: string | null;
  };
}

export interface MyRegistrationsResponse {
  items: MyRegistrationItemDto[];
}

export interface PublicScheduleDto {
  id: string;
  title: string;
  dayOfWeek: string;
  timeStart: string;
  location: string | null;
  description: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface PublicScheduleListResponse {
  items: PublicScheduleDto[];
}

/** Formato usado pelos componentes do site (legado Supabase). */
export interface SiteEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time_start: string | null;
  time_end: string | null;
  location: string | null;
  image_url: string | null;
  tag: string | null;
  published: boolean;
}

export interface SiteSchedule {
  id: string;
  title: string;
  day_of_week: string;
  time_start: string;
  location: string | null;
  description: string | null;
  active: boolean;
  sort_order: number;
}
