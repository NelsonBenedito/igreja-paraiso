import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getPublicApiBase,
  getTenantSlug,
  isPublicApiConfigured,
} from "@/lib/public-api/env";

function setEnv(base?: string, slug?: string, legacySlug?: string) {
  vi.stubEnv("NEXT_PUBLIC_DONATIONS_API_BASE", base ?? "");
  vi.stubEnv("NEXT_PUBLIC_DONATIONS_TENANT_SLUG", slug ?? "");
  vi.stubEnv("NEXT_PUBLIC_TENANT_SLUG", legacySlug ?? "");
}

describe("public-api/env", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("sem variáveis: não configurado", () => {
    setEnv();
    expect(getPublicApiBase()).toBeNull();
    expect(getTenantSlug()).toBeNull();
    expect(isPublicApiConfigured()).toBe(false);
  });

  it("remove barras finais da base e usa o slug", () => {
    setEnv("https://api.exemplo.com//", "paraiso");
    expect(getPublicApiBase()).toBe("https://api.exemplo.com");
    expect(getTenantSlug()).toBe("paraiso");
    expect(isPublicApiConfigured()).toBe(true);
  });

  it("aceita o nome antigo do slug quando o novo está vazio", () => {
    setEnv("https://api.exemplo.com", "", " legado ");
    expect(getTenantSlug()).toBe("legado");
  });

  it("base sem slug (ou slug sem base) não conta como configurado", () => {
    setEnv("https://api.exemplo.com");
    expect(isPublicApiConfigured()).toBe(false);
    setEnv("", "paraiso");
    expect(isPublicApiConfigured()).toBe(false);
  });
});
