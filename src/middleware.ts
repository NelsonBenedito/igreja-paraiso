import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * Modo “só campus” em produção: defina `NEXT_PUBLIC_ONLY_CAMPUS_LIVE=true` no
 * hosting (junto com `NODE_ENV=production`). Todas as rotas exceto as
 * permitidas abaixo redirecionam para `/em-construcao`.
 */
function isCampusOnlyMode(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ONLY_CAMPUS_LIVE === "true"
  );
}

function isAllowedWhenCampusOnly(pathname: string): boolean {
  if (pathname === "/cotas/campus" || pathname.startsWith("/cotas/campus/")) {
    return true;
  }
  if (pathname === "/em-construcao" || pathname.startsWith("/em-construcao/")) {
    return true;
  }
  if (pathname.startsWith("/_next")) {
    return true;
  }
  if (pathname === "/favicon.ico") {
    return true;
  }
  if (pathname.startsWith("/auth/callback")) {
    return true;
  }
  if (pathname.startsWith("/api/")) {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  if (isCampusOnlyMode() && !isAllowedWhenCampusOnly(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/em-construcao", request.url));
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
