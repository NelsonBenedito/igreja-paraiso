/**
 * URLs e chamadas às rotas públicas de pagamentos do ChurchManager
 * (`/api/public/tenants/:slug/...`). Usável no navegador e no servidor.
 */
import { getDonationsApiBase, getDonationsTenantSlug } from "./env";
import { type AccessLinkOutcome, interpretAccessLinkStatus } from "./linkResponse";
import type { ContributionsAccessLinkBody } from "./types";

export const PUBLIC_API_TIMEOUT_MS = 8000;

/** Monta a URL da rota pública; `null` quando a API não está configurada. */
export function buildPublicTenantUrl(
  base: string | null,
  slug: string | null,
  path: string,
): string | null {
  if (!base || !slug) return null;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api/public/tenants/${encodeURIComponent(slug)}${cleanPath}`;
}

export function publicTenantUrl(path: string): string | null {
  return buildPublicTenantUrl(getDonationsApiBase(), getDonationsTenantSlug(), path);
}

/** Página do site que recebe o token do link mágico (troca por cookie de sessão). */
export const CONTRIBUTIONS_ACCESS_PATH = "/api/cotas/acesso";
export const MINHAS_CONTRIBUICOES_PATH = "/cotas/minhas-contribuicoes";

/**
 * Pede o link de acesso por e-mail. Chamado do navegador (o rate limit da API é por IP).
 * Nunca lança: falhas de rede viram `"error"`.
 */
export async function requestContributionsAccessLink(
  cpf: string,
  origin: string,
): Promise<AccessLinkOutcome> {
  const url = publicTenantUrl("/contributions/access-link");
  if (!url) return "config";
  const body: ContributionsAccessLinkBody = {
    cpf,
    returnUrl: `${origin}${CONTRIBUTIONS_ACCESS_PATH}`,
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(PUBLIC_API_TIMEOUT_MS),
    });
    return interpretAccessLinkStatus(res.status);
  } catch {
    return "error";
  }
}
