/** Telas do painel paralelo removidas (a administração é feita no ChurchManager). */
const REMOVED_ADMIN_ROUTES = ["/admin/eventos", "/admin/programacao", "/admin/inscricoes"];

export function isRemovedAdminRoute(pathname: string): boolean {
  return REMOVED_ADMIN_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
}
