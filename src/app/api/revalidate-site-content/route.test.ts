import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const revalidateTag = vi.fn();
vi.mock("next/cache", () => ({ revalidateTag: (...a: unknown[]) => revalidateTag(...a) }));

import { GET, POST } from "./route";

const URL_BASE = "http://localhost/api/revalidate-site-content";
const SECRET = "segredo-de-teste-123";

function req(method: "GET" | "POST", opts: { header?: string; query?: string } = {}) {
  const url = opts.query === undefined ? URL_BASE : `${URL_BASE}?secret=${opts.query}`;
  const headers: Record<string, string> = {};
  if (opts.header !== undefined) headers["x-revalidation-secret"] = opts.header;
  return new NextRequest(url, { method, headers });
}

describe("revalidate-site-content", () => {
  beforeEach(() => {
    revalidateTag.mockReset();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("REVALIDATION_SECRET", SECRET);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("header correto → 200 e expira a tag imediatamente", async () => {
    const res = await GET(req("GET", { header: SECRET }));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("site-content", { expire: 0 });
  });

  it("POST com header correto → 200", async () => {
    const res = await POST(req("POST", { header: SECRET }));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledTimes(1);
  });

  it("query correta (compatibilidade) → 200", async () => {
    const res = await GET(req("GET", { query: SECRET }));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["ausente", {}],
    ["header errado", { header: "outro" }],
    ["header de tamanho diferente", { header: SECRET + "x" }],
    ["query errada", { query: "outro" }],
  ])("%s → 401 sem revalidar", async (_n, opts) => {
    const res = await GET(req("GET", opts));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("POST inválido → 401", async () => {
    const res = await POST(req("POST", { header: "x" }));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("segredo não configurado em produção → 401 mesmo com valor vazio", async () => {
    vi.stubEnv("REVALIDATION_SECRET", "");
    for (const opts of [{ header: "" }, { query: "" }, {}]) {
      const res = await GET(req("GET", opts));
      expect(res.status).toBe(401);
    }
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("resposta não contém o segredo", async () => {
    const ok = await GET(req("GET", { header: SECRET }));
    const bad = await GET(req("GET", { header: "errado-123" }));
    expect(await ok.text()).not.toContain(SECRET);
    expect(await bad.text()).not.toContain(SECRET);
  });

  it("fora de produção não exige segredo", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const res = await GET(req("GET"));
    expect(res.status).toBe(200);
  });

  it("falha ao revalidar → 500 genérico", async () => {
    revalidateTag.mockImplementation(() => {
      throw new Error("detalhe interno");
    });
    const res = await GET(req("GET", { header: SECRET }));
    expect(res.status).toBe(500);
    expect(await res.text()).not.toContain("detalhe");
  });
});
