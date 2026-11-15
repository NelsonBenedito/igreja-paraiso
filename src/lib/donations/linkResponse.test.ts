import { describe, expect, it } from "vitest";
import {
  MSG_ACCESS_CONFIG,
  MSG_ASAAS_UPSTREAM,
  MSG_INSTABILITY,
  MSG_RATE_LIMIT,
  MSG_VALIDATION_AMIGAVEL,
  MSG_VALOR_MINIMO,
  accessLinkErrorMessage,
  formatNestMessage,
  interpretAccessLinkStatus,
  interpretCreateLinkResponse,
} from "./linkResponse";

describe("interpretCreateLinkResponse", () => {
  it("201 com url https → redireciona", () => {
    expect(
      interpretCreateLinkResponse(201, { id: "1", url: "https://asaas.com/c/abc" }),
    ).toEqual({ kind: "redirect", url: "https://asaas.com/c/abc" });
  });

  it("201 sem url válida → instabilidade", () => {
    expect(interpretCreateLinkResponse(201, { id: "1" })).toEqual({
      kind: "error",
      variant: "system",
      message: MSG_INSTABILITY,
    });
    expect(interpretCreateLinkResponse(201, { url: "javascript:alert(1)" }).kind).toBe("error");
  });

  it("409 HAS_ACTIVE_CONTRIBUTION → cartão de contribuição ativa com emailHint", () => {
    expect(
      interpretCreateLinkResponse(409, {
        code: "HAS_ACTIVE_CONTRIBUTION",
        emailHint: "pa***@gmail.com",
      }),
    ).toEqual({ kind: "active", emailHint: "pa***@gmail.com" });
  });

  it("409 sem emailHint → active com null", () => {
    expect(
      interpretCreateLinkResponse(409, { code: "HAS_ACTIVE_CONTRIBUTION", emailHint: null }),
    ).toEqual({ kind: "active", emailHint: null });
    expect(interpretCreateLinkResponse(409, { code: "HAS_ACTIVE_CONTRIBUTION" })).toEqual({
      kind: "active",
      emailHint: null,
    });
  });

  it("409 com outro código → instabilidade", () => {
    expect(interpretCreateLinkResponse(409, { code: "OTHER" })).toEqual({
      kind: "error",
      variant: "system",
      message: MSG_INSTABILITY,
    });
  });

  it("404/503 → indisponível", () => {
    expect(interpretCreateLinkResponse(404, null)).toEqual({ kind: "config" });
    expect(interpretCreateLinkResponse(503, null)).toEqual({ kind: "config" });
  });

  it("429 e 502 → mensagens de sistema", () => {
    expect(interpretCreateLinkResponse(429, null)).toMatchObject({ message: MSG_RATE_LIMIT });
    expect(interpretCreateLinkResponse(502, null)).toMatchObject({ message: MSG_ASAAS_UPSTREAM });
  });

  it("400 → mensagem amigável de validação, sem texto cru da API", () => {
    expect(
      interpretCreateLinkResponse(400, { message: ["value must be >= 5 (Asaas)"] }),
    ).toEqual({ kind: "error", variant: "validation", message: MSG_VALOR_MINIMO });
    expect(interpretCreateLinkResponse(400, { message: "cpf inválido" })).toEqual({
      kind: "error",
      variant: "validation",
      message: MSG_VALIDATION_AMIGAVEL,
    });
    expect(interpretCreateLinkResponse(400, null)).toMatchObject({
      message: MSG_VALIDATION_AMIGAVEL,
    });
  });

  it("500 → instabilidade", () => {
    expect(interpretCreateLinkResponse(500, {})).toMatchObject({ message: MSG_INSTABILITY });
  });
});

describe("formatNestMessage", () => {
  it("junta arrays e corta no limite", () => {
    expect(formatNestMessage(["a", " b ", 3], 10)).toBe("a b");
    expect(formatNestMessage("x".repeat(12), 10)).toBe(`${"x".repeat(10)}…`);
    expect(formatNestMessage(null, 10)).toBeNull();
  });
});

describe("interpretAccessLinkStatus", () => {
  it("2xx → enviado (resposta neutra)", () => {
    expect(interpretAccessLinkStatus(202)).toBe("sent");
    expect(interpretAccessLinkStatus(200)).toBe("sent");
  });
  it("429, 404/503 e demais", () => {
    expect(interpretAccessLinkStatus(429)).toBe("rate_limit");
    expect(interpretAccessLinkStatus(404)).toBe("config");
    expect(interpretAccessLinkStatus(503)).toBe("config");
    expect(interpretAccessLinkStatus(400)).toBe("config");
    expect(interpretAccessLinkStatus(401)).toBe("error");
    expect(interpretAccessLinkStatus(500)).toBe("error");
  });
  it("mensagens", () => {
    expect(accessLinkErrorMessage("rate_limit")).toBe(MSG_RATE_LIMIT);
    expect(accessLinkErrorMessage("config")).toBe(MSG_ACCESS_CONFIG);
    expect(accessLinkErrorMessage("error")).toBe(MSG_INSTABILITY);
  });
});
