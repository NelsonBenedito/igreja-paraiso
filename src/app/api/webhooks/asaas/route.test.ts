import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const TOKEN = "token-do-webhook-123";

/** Corpo sem `data`: passada a autenticação, a rota responde 400. */
function req(headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/webhooks/asaas", { method: "POST", headers, body: "" });
}

describe("webhook Asaas — token", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ASAAS_WEBHOOK_TOKEN", TOKEN);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it.each([
    ["asaas-access-token", { "asaas-access-token": TOKEN }],
    ["x-asaas-access-token", { "x-asaas-access-token": TOKEN }],
  ])("token correto em %s → segue para o payload", async (_n, headers) => {
    const res = await POST(req(headers));
    expect(res.status).toBe(400);
  });

  it.each([
    ["ausente", {}],
    ["errado", { "asaas-access-token": "outro" }],
    ["de tamanho diferente", { "asaas-access-token": TOKEN + "x" }],
  ])("token %s → 401", async (_n, headers) => {
    const res = await POST(req(headers));
    expect(res.status).toBe(401);
  });

  it("sem token configurado em produção → 401", async () => {
    vi.stubEnv("ASAAS_WEBHOOK_TOKEN", "");
    const res = await POST(req({ "asaas-access-token": "" }));
    expect(res.status).toBe(401);
  });

  it("token configurado fora de produção, header errado → 401", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const res = await POST(req({ "asaas-access-token": "outro" }));
    expect(res.status).toBe(401);
  });

  it("fora de produção, sem token configurado, não exige token", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("ASAAS_WEBHOOK_TOKEN", "");
    const res = await POST(req());
    expect(res.status).toBe(400);
  });
});
