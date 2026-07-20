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

/** Lista eventos publicados (API Nest). */
export async function getPublicEvents(options: {
  upcomingOnly?: boolean;
} = {}): Promise<SiteEvent[]> {
  if (!isPublicApiConfigured()) {
    console.warn("[events] API Nest não configurada.");
    return [];
  }
  const { items } = await fetchPublicEvents({
    upcomingOnly: options.upcomingOnly ?? true,
  });
  return items.map(toSiteEvent);
}

/** Detalhe de um evento publicado. */
export async function getPublicEventById(eventId: string): Promise<SiteEvent | null> {
  if (!isPublicApiConfigured()) {
    console.warn("[events] API Nest não configurada.");
    return null;
  }
  try {
    const dto = await fetchPublicEventById(eventId);
    return toSiteEvent(dto);
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) {
      return null;
    }
    throw error;
  }
}

/** Programação semanal activa. */
export async function getActiveSchedules(): Promise<SiteSchedule[]> {
  if (!isPublicApiConfigured()) {
    console.warn("[schedules] API Nest não configurada.");
    return [];
  }
  const { items } = await fetchPublicSchedules();
  return items.filter((s) => s.active).map(toSiteSchedule);
}

/** IDs de eventos em que o utilizador está inscrito. */
export async function getRegisteredEventIdsForUser(
  email: string,
  userId?: string | null,
): Promise<string[]> {
  if (!isPublicApiConfigured()) {
    console.warn("[registrations] API Nest não configurada.");
    return [];
  }
  const { items } = await fetchMyRegistrations({ email, userId });
  return items.map((r) => r.eventId);
}

/** Verifica se o e-mail já está inscrito num evento. */
export async function isUserRegisteredForEvent(
  eventId: string,
  email: string,
): Promise<boolean> {
  if (!isPublicApiConfigured()) {
    console.warn("[registrations] API Nest não configurada.");
    return false;
  }
  const { registered } = await checkEventRegistration(eventId, { email });
  return registered;
}

