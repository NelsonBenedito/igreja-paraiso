import { getPublicApiBase, getTenantSlug } from "@/lib/public-api/env";
import type { SiteContentResponse } from "./types";

export class SiteContentApiNotConfiguredError extends Error {
  constructor() {
    super(
      "API pública não configurada. Defina NEXT_PUBLIC_DONATIONS_API_BASE e NEXT_PUBLIC_DONATIONS_TENANT_SLUG.",
    );
    this.name = "SiteContentApiNotConfiguredError";
  }
}

export class SiteContentApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "SiteContentApiError";
  }
}

type FetchCacheOptions = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

/**
 * Conteúdo institucional completo do tenant.
 *
 * - Production: cache 5 min + tag `site-content` (webhook
 *   `/api/revalidate-site-content` invalida sob demanda).
 * - Preview (homologacao/QA): sem cache — o webhook do CMS não alcança o
 *   Preview (SSO da Vercel) e `REVALIDATION_SECRET` pode não estar no Preview.
 */
function siteContentFetchCache(): FetchCacheOptions {
  if (process.env.VERCEL_ENV === "preview") {
    return { cache: "no-store" };
  }
  return { next: { revalidate: 300, tags: ["site-content"] } };
}

export async function fetchSiteContent(): Promise<SiteContentResponse> {
  const base = getPublicApiBase();
  const slug = getTenantSlug();
  if (!base || !slug) throw new SiteContentApiNotConfiguredError();

  const url = `${base}/api/public/tenants/${encodeURIComponent(slug)}/site-content`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      ...siteContentFetchCache(),
    });
  } catch (networkError) {
    const message =
      networkError instanceof Error
        ? networkError.message
        : "Falha de conexão com a API";
    throw new SiteContentApiError(0, `[network] ${message}`, networkError);
  }

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = undefined;
    }
    throw new SiteContentApiError(
      res.status,
      `site-content ${res.status}`,
      body,
    );
  }

  return res.json() as Promise<SiteContentResponse>;
}
