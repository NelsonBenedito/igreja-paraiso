import { describe, expect, it } from "vitest";
import {
  billingTypeLabel,
  describePendingLink,
  formatCentsBRL,
  formatDateBR,
  paymentStatusLabel,
  statusTone,
  subscriptionStatusLabel,
} from "./contributionsFormat";
import { interpretContributionsMe } from "./contributionsServer";
import {
  CONTRIBUTOR_SESSION_MAX_AGE_S,
  parseContributionsMe,
  parseSessionResponse,
  sessionCookieMaxAge,
} from "./contributorSession";
import { buildPublicTenantUrl } from "./publicApi";

const ME_FIXTURE = {
  payer: { name: "Fulano de Tal", emailHint: "fu***@gmail.com" },
  subscriptions: [
    {
      id: "sub_1",
      status: "ACTIVE",
      valueCents: 10000,
      label: "Cotas - Novo Campus",
      createdAt: "2026-03-01T12:00:00.000Z",
      currentPeriodEnd: null,
    },
    { id: "bad", status: "ACTIVE" },
  ],
  payments: [
    { date: "2026-11-01T12:00:00.000Z", valueCents: 10000, status: "CONFIRMED", billingType: "PIX" },
    { date: "2026-10-01T12:00:00.000Z", valueCents: 10000, status: "PENDING", billingType: null },
  ],
  pendingLink: {
    url: "https://www.asaas.com/c/xyz",
    valueCents: 15050,
    isMonthly: true,
    subscriptionDurationMonths: 12,
    createdAt: "2026-11-10T12:00:00.000Z",
  },
};

describe("formatadores", () => {
  it("formatCentsBRL", () => {
    expect(formatCentsBRL(10000)).toBe("R$ 100,00");
    expect(formatCentsBRL(123456)).toBe("R$ 1.234,56");
    expect(formatCentsBRL(5)).toBe("R$ 0,05");
    expect(formatCentsBRL(Number.NaN)).toBe("—");
  });

  it("formatDateBR no fuso de Brasília", () => {
    expect(formatDateBR("2026-11-15T12:00:00.000Z")).toBe("15/11/2026");
    // 01:00 UTC ainda é dia 14 em Brasília
    expect(formatDateBR("2026-11-15T01:00:00.000Z")).toBe("14/11/2026");
    expect(formatDateBR(null)).toBe("—");
    expect(formatDateBR("lixo")).toBe("—");
  });

  it("rótulos de status e forma de pagamento", () => {
    expect(subscriptionStatusLabel("ACTIVE")).toBe("Ativa");
    expect(subscriptionStatusLabel("cancelled")).toBe("Cancelada");
    expect(subscriptionStatusLabel("EXPIRED")).toBe("Encerrada");
    expect(subscriptionStatusLabel("XYZ")).toBe("Inativa");
    expect(paymentStatusLabel("CONFIRMED")).toBe("Confirmado");
    expect(paymentStatusLabel("RECEIVED")).toBe("Confirmado");
    expect(paymentStatusLabel("OVERDUE")).toBe("Vencido");
    expect(paymentStatusLabel("XYZ")).toBe("Em processamento");
    expect(billingTypeLabel("PIX")).toBe("Pix");
    expect(billingTypeLabel("CREDIT_CARD")).toBe("Cartão de crédito");
    expect(billingTypeLabel(null)).toBe("—");
    expect(statusTone("ACTIVE")).toBe("ok");
    expect(statusTone("PENDING")).toBe("warn");
    expect(statusTone("CANCELLED")).toBe("muted");
  });

  it("describePendingLink", () => {
    const base = { url: "https://x", createdAt: "", valueCents: 10000 };
    expect(
      describePendingLink({ ...base, isMonthly: true, subscriptionDurationMonths: 12 }),
    ).toBe("R$ 100,00 por mês, durante 12 meses");
    expect(
      describePendingLink({ ...base, isMonthly: true, subscriptionDurationMonths: 1 }),
    ).toBe("R$ 100,00 por mês, durante 1 mês");
    expect(
      describePendingLink({ ...base, isMonthly: false, subscriptionDurationMonths: null }),
    ).toBe("R$ 100,00 (pagamento único)");
    expect(
      describePendingLink({ ...base, valueCents: null, isMonthly: true, subscriptionDurationMonths: null }),
    ).toBe("Valor livre por mês");
    expect(
      describePendingLink({ ...base, valueCents: null, isMonthly: false, subscriptionDurationMonths: null }),
    ).toBe("Valor livre (pagamento único)");
  });
});

describe("parseContributionsMe", () => {
  it("normaliza a resposta e descarta itens malformados", () => {
    const r = parseContributionsMe(ME_FIXTURE);
    expect(r?.payer).toEqual({ name: "Fulano de Tal", emailHint: "fu***@gmail.com" });
    expect(r?.subscriptions).toHaveLength(1);
    expect(r?.payments).toHaveLength(2);
    expect(r?.payments[1].billingType).toBeNull();
    expect(r?.pendingLink?.subscriptionDurationMonths).toBe(12);
    const nulls = parseContributionsMe({
      ...ME_FIXTURE,
      pendingLink: { ...ME_FIXTURE.pendingLink, valueCents: null, subscriptionDurationMonths: null },
    });
    expect(nulls?.pendingLink).toMatchObject({ valueCents: null, subscriptionDurationMonths: null });
  });

  it("tolera listas ausentes e pendingLink null ou sem https", () => {
    const r = parseContributionsMe({ payer: { name: "A" }, pendingLink: null });
    expect(r).toEqual({
      payer: { name: "A", emailHint: null },
      subscriptions: [],
      payments: [],
      pendingLink: null,
    });
    expect(
      parseContributionsMe({ ...ME_FIXTURE, pendingLink: { ...ME_FIXTURE.pendingLink, url: "http://x" } })
        ?.pendingLink,
    ).toBeNull();
  });

  it("rejeita corpo que não é objeto", () => {
    expect(parseContributionsMe(null)).toBeNull();
    expect(parseContributionsMe("x")).toBeNull();
  });
});

describe("interpretContributionsMe", () => {
  it("mapeia status", () => {
    expect(interpretContributionsMe(200, ME_FIXTURE).kind).toBe("ok");
    expect(
      interpretContributionsMe(401, { statusCode: 401, message: "Unauthorized" }),
    ).toEqual({ kind: "unauthorized" });
    expect(interpretContributionsMe(403, null)).toEqual({ kind: "unauthorized" });
    expect(interpretContributionsMe(404, null)).toEqual({ kind: "config" });
    expect(interpretContributionsMe(500, null)).toEqual({ kind: "error" });
    expect(interpretContributionsMe(200, null)).toEqual({ kind: "error" });
  });
});

describe("sessão", () => {
  it("parseSessionResponse", () => {
    expect(
      parseSessionResponse({ sessionToken: "jwt", expiresAt: "2026-12-15T00:00:00.000Z" }),
    ).toEqual({ sessionToken: "jwt", expiresAt: "2026-12-15T00:00:00.000Z" });
    expect(parseSessionResponse({ code: "INVALID_TOKEN" })).toBeNull();
    expect(parseSessionResponse({ sessionToken: "  " })).toBeNull();
    expect(parseSessionResponse(null)).toBeNull();
  });

  it("sessionCookieMaxAge respeita expiresAt e limita a 30 dias", () => {
    const now = new Date("2026-11-15T00:00:00.000Z");
    expect(sessionCookieMaxAge("2026-11-16T00:00:00.000Z", now)).toBe(86400);
    expect(sessionCookieMaxAge("2027-06-01T00:00:00.000Z", now)).toBe(
      CONTRIBUTOR_SESSION_MAX_AGE_S,
    );
    expect(sessionCookieMaxAge("", now)).toBe(CONTRIBUTOR_SESSION_MAX_AGE_S);
    expect(sessionCookieMaxAge("2026-01-01T00:00:00.000Z", now)).toBe(
      CONTRIBUTOR_SESSION_MAX_AGE_S,
    );
  });
});

describe("buildPublicTenantUrl", () => {
  it("monta a rota pública e escapa o slug", () => {
    expect(buildPublicTenantUrl("https://api.x", "igreja paraiso", "/contributions/me")).toBe(
      "https://api.x/api/public/tenants/igreja%20paraiso/contributions/me",
    );
    expect(buildPublicTenantUrl(null, "s", "/links")).toBeNull();
    expect(buildPublicTenantUrl("https://api.x", null, "/links")).toBeNull();
  });
});
