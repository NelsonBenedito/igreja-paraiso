import { type NextRequest, NextResponse } from "next/server";
import {
  CONTRIBUTOR_SESSION_COOKIE,
  contributorCookieOptions,
} from "@/lib/donations/contributorSession";
import { MINHAS_CONTRIBUICOES_PATH } from "@/lib/donations/publicApi";

export const dynamic = "force-dynamic";

function signOut(request: NextRequest) {
  const expired = request.nextUrl.searchParams.get("motivo") === "expirada";
  const res = NextResponse.redirect(
    new URL(`${MINHAS_CONTRIBUICOES_PATH}${expired ? "?erro=sessao" : ""}`, request.url),
    303,
  );
  res.headers.set("Cache-Control", "no-store");
  res.cookies.set(CONTRIBUTOR_SESSION_COOKIE, "", contributorCookieOptions(0));
  return res;
}

/**
 * Encerra a sessão de "Minhas contribuições" apagando o cookie.
 * POST = botão "Sair"; GET `?motivo=expirada` = sessão recusada pela API (401).
 */
export async function POST(request: NextRequest) {
  return signOut(request);
}

export async function GET(request: NextRequest) {
  return signOut(request);
}
