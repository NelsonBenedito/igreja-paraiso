import { getPublicApiBase, getTenantSlug } from "@/lib/public-api/env";
import type {
  EventRegistrationRequest,
  EventRegistrationDto,
  MyRegistrationsResponse,
  PublicEventDto,
  PublicEventListResponse,
  PublicScheduleListResponse,
  PublicTicketsResponse,
  PublicTicketTypeDto,
  PublicTicketDto,
  OrderPaymentResponse,
  RegistrationCheckResponse,
  EventCheckoutRequest,
  EventCheckoutResponse,
} from "./types";

export class EventsApiNotConfiguredError extends Error {
  constructor() {
    super(
      "API pública não configurada. Defina NEXT_PUBLIC_DONATIONS_API_BASE e NEXT_PUBLIC_DONATIONS_TENANT_SLUG.",
    );
    this.name = "EventsApiNotConfiguredError";
  }
}

export class EventsApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "EventsApiError";
  }
}

function tenantBasePath(): string {
  const base = getPublicApiBase();
  const slug = getTenantSlug();
  if (!base || !slug) throw new EventsApiNotConfiguredError();
  return `${base}/api/public/tenants/${encodeURIComponent(slug)}`;
}

type FetchOptions = RequestInit & { next?: { revalidate?: number | false; tags?: string[] } };

async function publicFetch<T>(path: string, init?: FetchOptions): Promise<T> {
  const url = `${tenantBasePath()}${path}`;
  // `cache` e `next` são mutuamente exclusivos no fetch do Next: passar ambos
  // faz o Next ignorar um deles. Quem chama escolhe — `cache: "no-store"` para
  // dados voláteis (stock, pagamentos), `next.revalidate` para conteúdo estável.
  // Sem indicação, 30 s de revalidação para aliviar o Throttler do Nest.
  const { cache, next, ...restOfInit } = init ?? {};
  const cacheOptions: FetchOptions = cache
    ? { cache }
    : { next: next ?? { revalidate: 30 } };

  let res: Response;
  try {
    res = await fetch(url, {
      ...restOfInit,
      ...cacheOptions,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch (networkError) {
    // Converte falhas de rede (ex: "fetch failed", ECONNREFUSED) em EventsApiError
    const message =
      networkError instanceof Error
        ? networkError.message
        : "Falha de conexão com a API";
    throw new EventsApiError(0, `[network] ${message}`, networkError);
  }

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = undefined;
    }
    const message =
      typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof (body as { message: unknown }).message === "string"
        ? (body as { message: string }).message
        : `Erro ${res.status}`;
    throw new EventsApiError(res.status, message, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function fetchPublicEvents(
  options: { upcomingOnly?: boolean; revalidate?: number } = {},
): Promise<PublicEventListResponse> {
  const q = options.upcomingOnly ? "?upcomingOnly=true" : "";
  return publicFetch<PublicEventListResponse>(`/events${q}`, {
    next: { revalidate: options.revalidate ?? 60 },
  });
}

export async function fetchPublishedEvents(
  revalidate = 60,
): Promise<PublicEventListResponse> {
  return publicFetch<PublicEventListResponse>("/events/published", {
    next: { revalidate },
  });
}

export async function fetchPublicEventById(
  eventId: string,
  revalidate = 60,
): Promise<PublicEventDto> {
  return publicFetch<PublicEventDto>(`/events/${encodeURIComponent(eventId)}`, {
    next: { revalidate },
  });
}

export async function fetchPublicSchedules(
  revalidate = 300,
): Promise<PublicScheduleListResponse> {
  return publicFetch<PublicScheduleListResponse>("/schedules", {
    next: { revalidate },
  });
}

export async function fetchEventTickets(eventId: string): Promise<PublicTicketsResponse> {
  return publicFetch<PublicTicketsResponse>(
    `/events/${encodeURIComponent(eventId)}/tickets`,
    { cache: "no-store" },
  );
}

/**
 * Um tipo de ingresso por UUID — inclui `visibility: "PRIVATE"`, para páginas
 * de link directo. A API filtra só por `active`, não aplica a janela de venda:
 * um ingresso fora da janela responde 200 com `isSoldOut: true`.
 */
export async function fetchEventTicketById(
  eventId: string,
  ticketId: string,
): Promise<PublicTicketTypeDto> {
  return publicFetch<PublicTicketTypeDto>(
    `/events/${encodeURIComponent(eventId)}/tickets/${encodeURIComponent(ticketId)}`,
    { cache: "no-store" },
  );
}

/** Estado do pagamento de um pedido (polling pós-checkout). */
export async function fetchOrderPayment(
  eventId: string,
  orderId: string,
): Promise<OrderPaymentResponse> {
  return publicFetch<OrderPaymentResponse>(
    `/events/${encodeURIComponent(eventId)}/orders/${encodeURIComponent(orderId)}/payment`,
    { cache: "no-store" },
  );
}

/** Bilhete emitido — aceita o UUID do bilhete ou o `publicCode`. */
export async function fetchPublicTicket(ticketId: string): Promise<PublicTicketDto> {
  return publicFetch<PublicTicketDto>(
    `/tickets/${encodeURIComponent(ticketId)}`,
    { cache: "no-store" },
  );
}

export async function createEventRegistration(
  eventId: string,
  body: EventRegistrationRequest,
): Promise<EventRegistrationDto> {
  return publicFetch<EventRegistrationDto>(
    `/events/${encodeURIComponent(eventId)}/registrations`,
    {
      method: "POST",
      body: JSON.stringify({
        ...body,
        email: body.email.trim().toLowerCase(),
      }),
      cache: "no-store",
    },
  );
}

export async function createEventCheckout(
  eventId: string,
  body: EventCheckoutRequest,
): Promise<EventCheckoutResponse> {
  return publicFetch<EventCheckoutResponse>(
    `/events/${encodeURIComponent(eventId)}/checkout`,
    {
      method: "POST",
      body: JSON.stringify({
        ...body,
        payer: {
          ...body.payer,
          email: body.payer.email.trim().toLowerCase(),
        },
      }),
      cache: "no-store",
    },
  );
}

export async function checkEventRegistration(
  eventId: string,
  params: { email?: string; userId?: string },
): Promise<RegistrationCheckResponse> {
  const search = new URLSearchParams();
  if (params.email) search.set("email", params.email.trim().toLowerCase());
  if (params.userId) search.set("userId", params.userId);
  const qs = search.toString();
  return publicFetch<RegistrationCheckResponse>(
    `/events/${encodeURIComponent(eventId)}/registrations/check${qs ? `?${qs}` : ""}`,
    { cache: "no-store" },
  );
}

export async function fetchMyRegistrations(params: {
  email: string;
  userId?: string | null;
}): Promise<MyRegistrationsResponse> {
  const search = new URLSearchParams();
  search.set("email", params.email.trim().toLowerCase());
  if (params.userId) search.set("userId", params.userId);
  return publicFetch<MyRegistrationsResponse>(
    `/registrations/mine?${search.toString()}`,
    { cache: "no-store" },
  );
}

/** Client-side fetch (sem opções `next`). */
export async function createEventRegistrationClient(
  eventId: string,
  body: EventRegistrationRequest,
): Promise<EventRegistrationDto> {
  return createEventRegistration(eventId, body);
}

export async function createEventCheckoutClient(
  eventId: string,
  body: EventCheckoutRequest,
): Promise<EventCheckoutResponse> {
  return createEventCheckout(eventId, body);
}

export async function fetchMyRegistrationsClient(params: {
  email: string;
  userId?: string | null;
}): Promise<MyRegistrationsResponse> {
  return fetchMyRegistrations(params);
}

export async function checkEventRegistrationClient(
  eventId: string,
  params: { email?: string; userId?: string },
): Promise<RegistrationCheckResponse> {
  return checkEventRegistration(eventId, params);
}

export function isDuplicateRegistrationError(error: unknown): boolean {
  return error instanceof EventsApiError && error.status === 409;
}

/**
 * `409` no checkout cobre dois casos distintos que exigem respostas diferentes:
 * stock esgotado (refetch dos ingressos) e `idempotencyKey` inutilizável
 * (repetir com chave nova). A API distingue-os apenas pela mensagem.
 */
export function isIdempotencyConflict(error: unknown): boolean {
  if (!(error instanceof EventsApiError) || error.status !== 409) return false;
  return /idempot/i.test(error.message);
}

export function isSoldOutConflict(error: unknown): boolean {
  return (
    error instanceof EventsApiError &&
    error.status === 409 &&
    !isIdempotencyConflict(error)
  );
}
