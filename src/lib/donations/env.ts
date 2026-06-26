/**
 * Origem do API Nest (sem barra final). Ex.: https://api.exemplo.com
 * @see POST /api/public/tenants/:slug/links
 */
export function getDonationsApiBase(): string | null {
  const raw = process.env.NEXT_PUBLIC_DONATIONS_API_BASE;
  if (!raw?.trim()) return null;
  return raw.replace(/\/+$/, "");
}

/** Slug do tenant na API (igreja). Preferir o nome com prefixo `DONATIONS` para alinhar com `NEXT_PUBLIC_DONATIONS_API_BASE`. */
export function getDonationsTenantSlug(): string | null {
  const s =
    process.env.NEXT_PUBLIC_DONATIONS_TENANT_SLUG?.trim() ||
    process.env.NEXT_PUBLIC_TENANT_SLUG?.trim();
  return s || null;
}
