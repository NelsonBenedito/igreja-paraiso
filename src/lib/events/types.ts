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
  mediaMeta: unknown | null;
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

/** Valor de um campo personalizado do ingresso (ver `PublicTicketFieldDto`). */
export interface EventFieldValue {
  fieldId: string;
  value: string;
}

export interface EventRegistrationRequest {
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  userId?: string | null;
  ticketTypeId?: string | null;
  /** Ignorado pela API se `ticketTypeId` for omitido. */
  fieldValues?: EventFieldValue[];
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
  /** Só vem preenchido quando a inscrição indica `ticketTypeId`. */
  communityLink: string | null;
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

export type BillingType = 'PIX' | 'BOLETO' | 'CREDIT_CARD' | 'UNDEFINED';

export interface EventCheckoutLineRequest {
  ticketTypeId: string;
  quantity: number;
  /**
   * Nome por ingresso — índice = unidade. Unidades sem nome herdam
   * `payer.name`; excedentes são ignorados pela API.
   */
  holderNames?: string[];
}

export interface EventCheckoutRequest {
  payer: {
    cpf: string;
    name: string;
    email: string;
    phone?: string;
  };
  lines: EventCheckoutLineRequest[];
  billingType: BillingType;
  /** Só aplicado com `billingType: "CREDIT_CARD"`. */
  installmentCount?: number;
  fieldValues?: EventFieldValue[];
  /** Único global. Gerar uma por tentativa de checkout — ver `submitEventCheckout`. */
  idempotencyKey?: string;
}

export interface EventCheckoutResponse {
  orderId: string;
  eventId: string;
  transactionId: string;
  asaasPaymentId: string | null;
  status: 'PENDING' | 'CONFIRMED';
  billingType: string | null;
  /** Valor em reais (decimal), não em cêntimos. */
  value: number;
  dueDate: string | null;
  invoiceUrl: string | null;
  bankSlipUrl: string | null;
  /** Todos os campos vêm `null` numa resposta idempotente. */
  pix: {
    encodedImage: string | null;
    payload: string | null;
    expirationDate: string | null;
  } | null;
}

export type OrderPaymentStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'EXPIRED';

export interface OrderPaymentResponse {
  transactionId: string | null;
  orderId: string;
  status: OrderPaymentStatus;
  asaasPaymentId: string | null;
  value: number;
  currency: string;
  confirmedAt: string | null;
}

export type TicketStatus = 'VALID' | 'CANCELLED' | 'REFUNDED' | 'USED';

export interface PublicTicketDto {
  id: string;
  /** Payload recomendado para o QR de entrada. */
  publicCode: string;
  status: TicketStatus;
  event: {
    id: string;
    title: string;
    startsAt: string;
    venueName: string | null;
  };
  ticketTypeName: string;
  holderName: string;
  orderId: string;
}
