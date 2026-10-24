import {
  createEventRegistrationClient,
  createEventCheckoutClient,
  fetchOrderPayment,
  isDuplicateRegistrationError,
  isIdempotencyConflict,
  isSoldOutConflict,
  EventsApiError,
} from "./client";
import type {
  EventRegistrationRequest,
  EventCheckoutRequest,
  EventCheckoutResponse,
  OrderPaymentResponse,
} from "./types";

export type RegistrationResult =
  | { ok: true; communityLink: string | null }
  | { ok: false; reason: "duplicate" | "error"; message?: string };

export async function submitEventRegistration(
  eventId: string,
  body: EventRegistrationRequest,
): Promise<RegistrationResult> {
  try {
    const dto = await createEventRegistrationClient(eventId, body);
    return { ok: true, communityLink: dto.communityLink ?? null };
  } catch (error) {
    if (isDuplicateRegistrationError(error)) {
      return { ok: false, reason: "duplicate" };
    }
    const message = error instanceof EventsApiError ? error.message : undefined;
    console.error("[registrations] API error:", error);
    return { ok: false, reason: "error", message };
  }
}

export type CheckoutResult =
  | { ok: true; data: EventCheckoutResponse }
  | { ok: false; reason: "sold_out" | "error"; message?: string };

function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Cria o checkout gerando uma `idempotencyKey` nova por tentativa.
 *
 * A chave protege apenas contra retry de rede da mesma tentativa: reutilizá-la
 * devolve uma resposta degradada, sem `pix`/`invoiceUrl`, da qual não se
 * consegue reconstruir o QR. Por isso um `409` de idempotência é repetido uma
 * única vez com chave nova, em vez de propagado ao utilizador.
 */
export async function submitEventCheckout(
  eventId: string,
  body: EventCheckoutRequest,
): Promise<CheckoutResult> {
  let request = { ...body, idempotencyKey: body.idempotencyKey ?? newIdempotencyKey() };

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const data = await createEventCheckoutClient(eventId, request);
      return { ok: true, data };
    } catch (error) {
      if (isIdempotencyConflict(error) && attempt === 0) {
        request = { ...request, idempotencyKey: newIdempotencyKey() };
        continue;
      }
      const message = error instanceof EventsApiError ? error.message : undefined;
      console.error("[checkout] API error:", error);
      return {
        ok: false,
        reason: isSoldOutConflict(error) ? "sold_out" : "error",
        message,
      };
    }
  }
  return { ok: false, reason: "error" };
}

/**
 * Consulta o pagamento até sair de `PENDING` ou até `timeoutMs`.
 * Cadência conforme o contrato: 2,5 s nos primeiros 30 s, depois 5 s.
 * Devolve `null` se expirou ou foi abortado.
 */
export async function pollOrderPayment(
  eventId: string,
  orderId: string,
  options: {
    timeoutMs?: number;
    onUpdate?: (status: OrderPaymentResponse) => void;
    signal?: AbortSignal;
  } = {},
): Promise<OrderPaymentResponse | null> {
  const timeoutMs = options.timeoutMs ?? 15 * 60 * 1000;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (options.signal?.aborted) return null;

    const elapsed = Date.now() - startedAt;
    await new Promise((r) => setTimeout(r, elapsed < 30_000 ? 2_500 : 5_000));
    if (options.signal?.aborted) return null;

    try {
      const status = await fetchOrderPayment(eventId, orderId);
      options.onUpdate?.(status);
      if (status.status !== "PENDING") return status;
    } catch (error) {
      // Falha transitória de rede não deve encerrar o polling — o utilizador
      // pode já ter pago. Continua a tentar até ao timeout.
      console.warn("[checkout] polling falhou, a repetir:", error);
    }
  }
  return null;
}

/**
 * IDs dos eventos em que o membro autenticado está inscrito. A consulta passa
 * pelo servidor (`/api/membros/inscricoes`), que lê o e-mail da sessão e envia
 * o segredo de participante; sem sessão ou com falha, devolve `[]`.
 */
export async function loadRegisteredEventIdsClient(): Promise<string[]> {
  try {
    const res = await fetch("/api/membros/inscricoes", { cache: "no-store" });
    if (!res.ok) return [];
    const { eventIds } = (await res.json()) as { eventIds?: string[] };
    return Array.isArray(eventIds) ? eventIds : [];
  } catch (error) {
    console.error("[registrations] /api/membros/inscricoes failed:", error);
    return [];
  }
}

