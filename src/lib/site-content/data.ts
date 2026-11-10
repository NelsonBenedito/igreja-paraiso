import { cache } from "react";
import {
  getPublicApiBase,
  getTenantSlug,
  isPublicApiConfigured,
} from "@/lib/public-api/env";
import { fetchSiteContent, SiteContentApiError } from "./client";
import { SITE_CONTENT_FALLBACK } from "./fallbacks";
import { resolveHomeOrder, type HomeBlock } from "./home-order";
import type { SiteContentResponse, SiteSections } from "./types";

function warnSiteContentFallback(error: unknown): void {
  if (error instanceof SiteContentApiError) {
    const slug = getTenantSlug() ?? "?";
    const base = getPublicApiBase() ?? "?";
    if (error.status === 404) {
      console.warn(
        `[site-content] 404 em ${base}/api/public/tenants/${slug}/site-content — usando fallback estático. Confirme se o ChurchManager (SiteModule) está publicado neste ambiente e se o slug do tenant está correto.`,
      );
      return;
    }
    console.warn(
      `[site-content] API respondeu ${error.status} — usando fallback estático:`,
      error.message,
    );
    return;
  }
  console.warn("[site-content] a usar fallback estático:", error);
}

/**
 * Busca o conteúdo institucional (seções + layout) na API pública.
 * Uma única chamada por request (React `cache`), compartilhada por
 * `fetchSiteSections` e `getSiteHomeOrder`. Em falha devolve `null`
 * para o caller aplicar o fallback.
 */
const fetchSiteContentOnce = cache(async (): Promise<SiteContentResponse | null> => {
  if (!isPublicApiConfigured()) {
    console.warn("[site-content] API pública não configurada.");
    return null;
  }
  try {
    return await fetchSiteContent();
  } catch (error) {
    warnSiteContentFallback(error);
    return null;
  }
});

/**
 * Busca o conteúdo institucional na API pública.
 * Deduplicado por request (React `cache`). Em falha devolve `null`
 * para o caller aplicar o fallback estático.
 */
export async function fetchSiteSections(): Promise<SiteSections | null> {
  return (await fetchSiteContentOnce())?.sections ?? null;
}

/**
 * Secções prontas para render — API ou reserva (só textos; listas vazias).
 * Preferir isto nos Server Components para nunca quebrar a página.
 */
export async function getSiteContent(): Promise<SiteSections> {
  const sections = await fetchSiteSections();
  return sections ?? SITE_CONTENT_FALLBACK;
}

/**
 * Ordem dos blocos da home (`layout.home` do painel), já normalizada.
 * API fora, sem o campo ou campo inválido → ordem padrão. Reusa a mesma
 * chamada deduplicada de `fetchSiteSections` (sem segunda requisição).
 */
export async function getSiteHomeOrder(): Promise<HomeBlock[]> {
  return resolveHomeOrder((await fetchSiteContentOnce())?.layout);
}
