import { describe, expect, it } from "vitest";
import { isRemovedAdminRoute } from "./legacy-admin-routes";

describe("isRemovedAdminRoute", () => {
  it.each(["/admin/eventos", "/admin/programacao", "/admin/inscricoes", "/admin/eventos/novo"])(
    "%s é rota removida",
    (p) => expect(isRemovedAdminRoute(p)).toBe(true),
  );
  it.each(["/admin", "/admin/", "/eventos", "/membros", "/admin/eventosx"])(
    "%s não é rota removida",
    (p) => expect(isRemovedAdminRoute(p)).toBe(false),
  );
});
