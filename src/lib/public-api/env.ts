import {
  getDonationsApiBase,
  getDonationsTenantSlug,
} from "@/lib/donations/env";

/** Origem da API Nest pública (mesma base das cotas). */
export function getPublicApiBase(): string | null {
  return getDonationsApiBase();
}

/** Slug do tenant (igreja) na API Nest. */
export function getTenantSlug(): string | null {
  return getDonationsTenantSlug();
}

export function isPublicApiConfigured(): boolean {
  return !!(getPublicApiBase() && getTenantSlug());
}
