import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitValidateCoupon, submitEventCheckout } from "./data-client";

const fetchMock = vi.fn<typeof fetch>();

const EVENT_ID = "3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b";

describe("submitValidateCoupon", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_API_BASE", "https://api.exemplo.com");
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_TENANT_SLUG", "paraiso");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("devolve { ok: true, data } quando a API retorna 200", async () => {
    const couponData = {
      valid: true,
      couponId: "uuid-1",
      code: "PROMO10",
      name: "10% OFF",
      discountType: "PERCENTAGE" as const,
      discountValue: 10,
      discountCents: 1500,
      eligibleTicketTypeIds: null,
    };

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(couponData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await submitValidateCoupon(EVENT_ID, {
      code: "PROMO10",
      lines: [{ ticketTypeId: "t-1", quantity: 1 }],
    });

    expect(result).toEqual({ ok: true, data: couponData });
  });

  it("devolve { ok: false, message } com a mensagem da API quando a API retorna 400", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ message: "Este cupom expirou" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await submitValidateCoupon(EVENT_ID, {
      code: "EXPIRADO",
      lines: [{ ticketTypeId: "t-1", quantity: 1 }],
    });

    expect(result).toEqual({ ok: false, message: "Este cupom expirou" });
  });

  it("devolve mensagem de erro em falha de rede", async () => {
    fetchMock.mockRejectedValue(new Error("Network failed"));

    const result = await submitValidateCoupon(EVENT_ID, {
      code: "TESTE",
      lines: [{ ticketTypeId: "t-1", quantity: 1 }],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("Network failed");
    }
  });
});

describe("submitEventCheckout com cupom", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_API_BASE", "https://api.exemplo.com");
    vi.stubEnv("NEXT_PUBLIC_DONATIONS_TENANT_SLUG", "paraiso");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("envia couponCode no payload de checkout quando fornecido", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          orderId: "ord-1",
          eventId: EVENT_ID,
          transactionId: "tx-1",
          asaasPaymentId: null,
          status: "CONFIRMED",
          billingType: "PIX",
          value: 0,
          dueDate: null,
          invoiceUrl: null,
          bankSlipUrl: null,
          pix: null,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const result = await submitEventCheckout(EVENT_ID, {
      payer: {
        name: "João Silva",
        email: "joao@exemplo.com",
        cpf: "12345678909",
      },
      lines: [{ ticketTypeId: "t-1", quantity: 1 }],
      billingType: "PIX",
      couponCode: "PROMO100",
    });

    expect(result.ok).toBe(true);
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init?.body as string);
    expect(body.couponCode).toBe("PROMO100");
  });
});
