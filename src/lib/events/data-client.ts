import {
  checkEventRegistrationClient,
  createEventRegistrationClient,
  createEventCheckoutClient,
  fetchMyRegistrationsClient,
  isDuplicateRegistrationError,
  EventsApiError,
} from "./client";
import type { 
  EventRegistrationRequest,
  EventCheckoutRequest,
  EventCheckoutResponse
} from "./types";

export type RegistrationResult =
  | { ok: true }
  | { ok: false; reason: "duplicate" | "error"; message?: string };

export async function submitEventRegistration(
  eventId: string,
  body: EventRegistrationRequest,
): Promise<RegistrationResult> {
  try {
    await createEventRegistrationClient(eventId, body);
    return { ok: true };
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
  | { ok: false; reason: "error"; message?: string };

export async function submitEventCheckout(
  eventId: string,
  body: EventCheckoutRequest,
): Promise<CheckoutResult> {
  try {
    const data = await createEventCheckoutClient(eventId, body);
    return { ok: true, data };
  } catch (error) {
    const message = error instanceof EventsApiError ? error.message : undefined;
    console.error("[checkout] API error:", error);
    return { ok: false, reason: "error", message };
  }
}

export async function loadRegisteredEventIdsClient(
  email: string,
  userId?: string | null,
): Promise<string[]> {
  try {
    const { items } = await fetchMyRegistrationsClient({ email, userId });
    return items.map((r) => r.eventId);
  } catch (error) {
    console.error("[registrations] API mine failed:", error);
    return [];
  }
}

export async function checkRegisteredClient(
  eventId: string,
  params: { email?: string; userId?: string },
): Promise<boolean> {
  try {
    const { registered } = await checkEventRegistrationClient(eventId, params);
    return registered;
  } catch (error) {
    console.error("[registrations] API check registered failed:", error);
    return false;
  }
}

