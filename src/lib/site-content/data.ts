import { cache } from "react";
import { isPublicApiConfigured } from "@/lib/public-api/env";
import { fetchSiteContent } from "./client";
import { SITE_CONTENT_FALLBACK } from "./fallbacks";
import type { SiteSections } from "./types";

/**
 * Busca o conteúdo institucional na API pública.
 * Deduplicado por request (React `cache`). Em falha devolve `null`
 * para o caller aplicar o fallback estático.
 */
export const fetchSiteSections = cache(async (): Promise<SiteSections | null> => {
  if (!isPublicApiConfigured()) {
    console.warn("[site-content] API pública não configurada.");
    return null;
  }
  try {
    const { sections } = await fetchSiteContent();
    return sections;
  } catch (error) {
    console.warn("[site-content] a usar fallback estático:", error);
    return null;
  }
});

/**
 * Secções prontas para render — API ou fallback completo.
 * Preferir isto nos Server Components para nunca quebrar a página.
 */
export async function getSiteContent(): Promise<SiteSections> {
  const sections = await fetchSiteSections();
  return sections ?? SITE_CONTENT_FALLBACK;
}
