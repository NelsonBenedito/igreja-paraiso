import { isPublicApiConfigured } from "@/lib/public-api/env";
import { createClient } from "@/utils/supabase/client";
import {
  checkEventRegistrationClient,
  createEventRegistrationClient,
  fetchMyRegistrationsClient,
  isDuplicateRegistrationError,
  EventsApiError,
} from "./client";
import type { EventRegistrationRequest } from "./types";

export type RegistrationResult =
  | { ok: true }
  | { ok: false; reason: "duplicate" | "error"; message?: string };

export async function submitEventRegistration(
  eventId: string,
  body: EventRegistrationRequest,
): Promise<RegistrationResult> {
  if (isPublicApiConfigured()) {
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

  const supabase = createClient();
  const { error } = await supabase.from("event_registrations").insert({
    event_id: eventId,
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone?.trim() || null,
    message: body.message?.trim() || null,
    user_id: body.userId ?? null,
  });

  if (!error) return { ok: true };
  if (error.code === "23505") return { ok: false, reason: "duplicate" };
  console.error("[registrations] Supabase error:", error);
  return { ok: false, reason: "error", message: error.message };
}

export async function loadRegisteredEventIdsClient(
  email: string,
  userId?: string | null,
): Promise<string[]> {
  if (isPublicApiConfigured()) {
    try {
      const { items } = await fetchMyRegistrationsClient({ email, userId });
      return items.map((r) => r.eventId);
    } catch (error) {
      console.error("[registrations] API mine failed, fallback Supabase:", error);
    }
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && !email) return [];

  const { data } = await supabase
    .from("event_registrations")
    .select("event_id")
    .or(
      user
        ? `user_id.eq.${user.id},email.eq.${email.toLowerCase()}`
        : `email.eq.${email.toLowerCase()}`,
    );

  return (data ?? []).map((r) => r.event_id);
}

export async function checkRegisteredClient(
  eventId: string,
  params: { email?: string; userId?: string },
): Promise<boolean> {
  if (isPublicApiConfigured()) {
    try {
      const { registered } = await checkEventRegistrationClient(eventId, params);
      return registered;
    } catch {
      // fallback
    }
  }

  if (!params.email) return false;
  const supabase = createClient();
  const { data } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", eventId)
    .eq("email", params.email.toLowerCase())
    .maybeSingle();

  return !!data;
}
