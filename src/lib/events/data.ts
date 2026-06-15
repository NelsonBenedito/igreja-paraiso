import { createClient } from "@/utils/supabase/server";
import { isPublicApiConfigured } from "@/lib/public-api/env";
import { toSiteEvent, toSiteSchedule } from "./adapters";
import {
  checkEventRegistration,
  fetchPublicEventById,
  fetchPublicEvents,
  fetchPublicSchedules,
  fetchMyRegistrations,
} from "./client";
import type { SiteEvent, SiteSchedule } from "./types";

async function getEventsFromSupabase(options: {
  upcomingOnly?: boolean;
}): Promise<SiteEvent[]> {
  const supabase = await createClient();
  let query = supabase.from("events").select("*").eq("published", true).order("date", {
    ascending: true,
  });

  if (options.upcomingOnly) {
    query = query.gte("date", new Date().toISOString().split("T")[0]);
  }

  const { data } = await query;
  return (data ?? []) as SiteEvent[];
}

async function getEventByIdFromSupabase(eventId: string): Promise<SiteEvent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .maybeSingle();

  if (error || !data) return null;
  return data as SiteEvent;
}

async function getSchedulesFromSupabase(): Promise<SiteSchedule[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("schedules")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  return (data ?? []) as SiteSchedule[];
}

async function getRegisteredEventIdsFromSupabase(email: string): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_registrations")
    .select("event_id")
    .eq("email", email.toLowerCase());

  return (data ?? []).map((r) => r.event_id);
}

/** Lista eventos publicados (API Nest ou fallback Supabase). */
export async function getPublicEvents(options: {
  upcomingOnly?: boolean;
} = {}): Promise<SiteEvent[]> {
  if (isPublicApiConfigured()) {
    try {
      const { items } = await fetchPublicEvents({
        upcomingOnly: options.upcomingOnly ?? true,
      });
      return items.map(toSiteEvent);
    } catch (error) {
      console.error("[events] API Nest indisponível, fallback Supabase:", error);
    }
  }

  return getEventsFromSupabase({ upcomingOnly: options.upcomingOnly ?? true });
}

/** Detalhe de um evento publicado. */
export async function getPublicEventById(eventId: string): Promise<SiteEvent | null> {
  if (isPublicApiConfigured()) {
    try {
      const dto = await fetchPublicEventById(eventId);
      return toSiteEvent(dto);
    } catch (error) {
      if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) {
        return null;
      }
      console.error("[events] API Nest indisponível, fallback Supabase:", error);
    }
  }

  return getEventByIdFromSupabase(eventId);
}

/** Programação semanal activa. */
export async function getActiveSchedules(): Promise<SiteSchedule[]> {
  if (isPublicApiConfigured()) {
    try {
      const { items } = await fetchPublicSchedules();
      return items.filter((s) => s.active).map(toSiteSchedule);
    } catch (error) {
      console.error("[schedules] API Nest indisponível, fallback Supabase:", error);
    }
  }

  return getSchedulesFromSupabase();
}

/** IDs de eventos em que o utilizador está inscrito. */
export async function getRegisteredEventIdsForUser(
  email: string,
  userId?: string | null,
): Promise<string[]> {
  if (isPublicApiConfigured()) {
    try {
      const { items } = await fetchMyRegistrations({ email, userId });
      return items.map((r) => r.eventId);
    } catch (error) {
      console.error("[registrations] API Nest indisponível, fallback Supabase:", error);
    }
  }

  return getRegisteredEventIdsFromSupabase(email);
}

/** Verifica se o e-mail já está inscrito num evento. */
export async function isUserRegisteredForEvent(
  eventId: string,
  email: string,
): Promise<boolean> {
  if (isPublicApiConfigured()) {
    try {
      const { registered } = await checkEventRegistration(eventId, { email });
      return registered;
    } catch {
      // fallback abaixo
    }
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", eventId)
    .eq("email", email.toLowerCase())
    .maybeSingle();

  return !!data;
}
