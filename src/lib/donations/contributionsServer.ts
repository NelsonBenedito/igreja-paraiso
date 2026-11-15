/**
 * Chamadas server-side de "Minhas contribuições" (sem cache: dados pessoais).
 */
import { parseContributionsMe, parseSessionResponse } from "./contributorSession";
import { PUBLIC_API_TIMEOUT_MS, publicTenantUrl } from "./publicApi";
import type { ContributionsMeResponse, ContributionsSessionResponse } from "./types";

export type ContributionsMeResult =
  | { kind: "ok"; data: ContributionsMeResponse }
  | { kind: "unauthorized" }
  | { kind: "config" }
  | { kind: "error" };

/** Mapeia a resposta de `GET /contributions/me`. */
export function interpretContributionsMe(status: number, body: unknown): ContributionsMeResult {
  if (status === 401 || status === 403) return { kind: "unauthorized" };
  if (status === 404 || status === 503) return { kind: "config" };
  if (status >= 200 && status < 300) {
    const data = parseContributionsMe(body);
    return data ? { kind: "ok", data } : { kind: "error" };
  }
  return { kind: "error" };
}

async function readJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/** Troca o token do link mágico por um sessionToken; `null` se inválido ou falha. */
export async function exchangeAccessToken(
  token: string,
): Promise<ContributionsSessionResponse | null> {
  const url = publicTenantUrl("/contributions/session");
  if (!url) return null;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
      signal: AbortSignal.timeout(PUBLIC_API_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return parseSessionResponse(await readJson(res));
  } catch (error) {
    console.warn("[cotas/acesso] falha ao trocar o token de acesso:", error);
    return null;
  }
}

export async function fetchContributionsMe(sessionToken: string): Promise<ContributionsMeResult> {
  const url = publicTenantUrl("/contributions/me");
  if (!url) return { kind: "config" };
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${sessionToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(PUBLIC_API_TIMEOUT_MS),
    });
    return interpretContributionsMe(res.status, await readJson(res));
  } catch (error) {
    console.warn("[cotas/minhas-contribuicoes] falha ao carregar contribuições:", error);
    return { kind: "error" };
  }
}
