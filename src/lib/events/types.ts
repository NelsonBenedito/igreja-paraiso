/** DTOs da API Nest — espelham events-public-api-reference.md */

export interface PublicEventTagDto {
  id: string;
  name: string;
  slug: string;
}

export interface PublicEventDto {
  id: string;
  title: string;
  description: string | null;
  format: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
  onlineUrl: string | null;
  shortDescription: string | null;
  detailsHtml: string | null;
  videoUrl: string | null;
  coverImageUrl: string | null;
  mediaMeta: any | null;
  date: string;
  timeStart: string | null;
  timeEnd: string | null;
  location: string | null;
  imageUrl: string | null;
  tag: string | null;
  tags: PublicEventTagDto[];
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

export interface PublicTicketFieldDto {
  fieldId: string;
  key: string;
  label: string;
  type: 'TEXT' | 'EMAIL' | 'PHONE' | 'CPF' | 'TEXTAREA' | 'SELECT' | 'CHECKBOX';
  options: string[] | null;
  required: boolean;
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
  visibility: 'PUBLIC' | 'PRIVATE';
  allowGuestRegistration: boolean;
  communityLink: string | null;
  allowedBillingTypes: string[];
  maxInstallments: number | null;
  isSoldOut: boolean;
  fields: PublicTicketFieldDto[];
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
  ticketTypeId?: string | null;
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
  short_description: string | null;
  details_html: string | null;
  format: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
  online_url: string | null;
  video_url: string | null;
  date: string;
  time_start: string | null;
  time_end: string | null;
  location: string | null;
  image_url: string | null;
  cover_image_url: string | null;
  tag: string | null;
  tags: PublicEventTagDto[];
  published: boolean;
  registration_closes_at: string | null;
  terms_url: string | null;
  currency: string | null;
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

export interface EventCheckoutLineRequest {
  ticketTypeId: string;
  quantity: number;
}

export interface EventCheckoutRequest {
  payer: {
    cpf: string;
    name: string;
    email: string;
    phone?: string;
  };
  lines: EventCheckoutLineRequest[];
  billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD' | 'UNDEFINED';
  installmentCount?: number;
}

export interface EventCheckoutResponse {
  orderId: string;
  eventId: string;
  transactionId: string;
  asaasPaymentId: string | null;
  status: string;
  billingType: string | null;
  value: number;
  dueDate: string | null;
  invoiceUrl: string | null;
  bankSlipUrl: string | null;
  pix: {
    encodedImage: string;
    payload: string;
    expirationDate: string;
  } | null;
}
