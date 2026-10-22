import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * Revalida o cache do conteúdo institucional (`site-content`), que cobre
 * site-content e programação (`/schedules`).
 * Chamado pelo ChurchManager ao guardar no painel.
 *
 * GET|POST /api/revalidate-site-content
 *   Header: x-revalidation-secret: <REVALIDATION_SECRET>
 *   (compat., a remover: ?secret=<REVALIDATION_SECRET>)
 *
 * Em produção, sem REVALIDATION_SECRET configurado → sempre 401.
 * Fora de produção (dev) o segredo não é exigido.
 */

function secretMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // timingSafeEqual exige buffers de mesmo tamanho: compara contra si mesmo
  // quando difere, para manter o custo parecido, e rejeita.
  if (a.length !== b.length) {
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

function handle(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    const expected = process.env.REVALIDATION_SECRET;
    const provided =
      request.headers.get("x-revalidation-secret") ??
      request.nextUrl.searchParams.get("secret");
    if (!expected || !secretMatches(provided, expected)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    // expire: 0 → expira a tag já; a próxima visita busca o conteúdo novo
    // (sem servir o antigo enquanto revalida, como faria o perfil "max").
    revalidateTag("site-content", { expire: 0 });
    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
