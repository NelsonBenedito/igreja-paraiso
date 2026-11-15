import { type NextRequest, NextResponse } from "next/server";
import { exchangeAccessToken } from "@/lib/donations/contributionsServer";
import {
  CONTRIBUTOR_SESSION_COOKIE,
  contributorCookieOptions,
  sessionCookieMaxAge,
} from "@/lib/donations/contributorSession";
import { MINHAS_CONTRIBUICOES_PATH } from "@/lib/donations/publicApi";

export const dynamic = "force-dynamic";

function redirectTo(request: NextRequest, search: string) {
  const res = NextResponse.redirect(
    new URL(`${MINHAS_CONTRIBUICOES_PATH}${search}`, request.url),
    303,
  );
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Referrer-Policy", "no-referrer");
  return res;
}

/**
 * GET /api/cotas/acesso?token= — destino do link mágico enviado por e-mail.
 * Troca o token de uso único em `/contributions/session`, grava o cookie de
 * sessão (httpOnly, 30 dias) e abre "Minhas contribuições". Token inválido,
 * expirado ou já usado → `?erro=link`.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim() ?? "";
  if (!token) return redirectTo(request, "?erro=link");

  const session = await exchangeAccessToken(token);
  if (!session) return redirectTo(request, "?erro=link");

  const res = redirectTo(request, "");
  res.cookies.set(
    CONTRIBUTOR_SESSION_COOKIE,
    session.sessionToken,
    contributorCookieOptions(sessionCookieMaxAge(session.expiresAt)),
  );
  return res;
}
