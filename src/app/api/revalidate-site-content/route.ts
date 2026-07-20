import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * Revalida o cache do conteúdo institucional (`site-content`).
 * Chamado pelo ChurchManager após guardar no painel Gestão do Site.
 *
 * GET /api/revalidate-site-content?secret=...
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (
    secret !== process.env.REVALIDATION_SECRET &&
    process.env.NODE_ENV === "production"
  ) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Perfil "max": marca a tag como stale e revalida na próxima request.
    revalidateTag("site-content", "max");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
