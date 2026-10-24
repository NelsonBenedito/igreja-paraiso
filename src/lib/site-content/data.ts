import { cache } from "react";
import { isPublicApiConfigured } from "@/lib/public-api/env";
import { fetchSiteContent } from "./client";
import { SITE_CONTENT_FALLBACK } from "./fallbacks";
import { resolveHomeOrder, type HomeBlock } from "./home-order";
import type { SiteContentResponse, SiteSections } from "./types";

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
    console.warn("[site-content] a usar fallback estático:", error);
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
