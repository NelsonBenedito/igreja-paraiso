/**
 * Interpretação das respostas da API pública de pagamentos para o visitante.
 * Nunca mostra mensagens cruas da API.
 */
import { MIN_PAYMENT_LINK_VALUE_BRL } from "./minPaymentValue";

export const MSG_INSTABILITY =
  "Tivemos uma instabilidade temporária ao conectar com o sistema financeiro. Por favor, tente novamente em alguns instantes.";

export const MSG_TIMEOUT =
  "A conexão com o sistema financeiro demorou demais. Verifique a internet e tente novamente.";

export const MSG_CONFIG =
  "O pagamento online não está disponível no momento. Tente mais tarde ou fale conosco pela página da campanha.";

export const MSG_RATE_LIMIT =
  "Foram feitas muitas tentativas a partir deste dispositivo. Aguarde cerca de um minuto e tente novamente.";

export const MSG_ASAAS_UPSTREAM =
  "O serviço de pagamentos não respondeu como esperado. Tente novamente mais tarde ou fale conosco pela página da campanha.";

export const MSG_ACCESS_CONFIG =
  "O envio do link de acesso não está disponível no momento. Tente mais tarde ou fale com a secretaria da igreja.";

export const MSG_VALOR_MINIMO = `O valor por mês precisa ser de pelo menos R$ ${MIN_PAYMENT_LINK_VALUE_BRL.toFixed(2).replace(".", ",")}. Corrija na campanha e abra o pagamento de novo.`;

export const MSG_VALIDATION_AMIGAVEL =
  "Não foi possível preparar o pagamento com estes dados. Volte à campanha, confira o valor e as opções, e tente novamente.";

export const MSG_IDENTIDADE =
  "Para continuar, volte à campanha e informe nome completo e CPF em “Quem está contribuindo?”.";

export type ErrorVariant = "validation" | "system";

/** O que fazer com a resposta do `POST /links`. */
export type CreateLinkOutcome =
  | { kind: "redirect"; url: string }
  | { kind: "active"; emailHint: string | null }
  | { kind: "config" }
  | { kind: "error"; variant: ErrorVariant; message: string };

export function formatNestMessage(raw: unknown, maxLen: number): string | null {
  if (raw == null) return null;
  if (typeof raw === "string" && raw.trim()) {
    const t = raw.trim();
    return t.length > maxLen ? `${t.slice(0, maxLen)}…` : t;
  }
  if (Array.isArray(raw)) {
    const parts = raw
      .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
      .map((x) => x.trim());
    if (parts.length === 0) return null;
    const joined = parts.join(" ");
    return joined.length > maxLen ? `${joined.slice(0, maxLen)}…` : joined;
  }
  return null;
}

/** Converte respostas 400 do Nest em texto legível (sem jargão: value, Asaas…). */
export function humanizarMensagem400(apiDetail: string | null): string {
  if (!apiDetail?.trim()) return MSG_VALIDATION_AMIGAVEL;
  const d = apiDetail.toLowerCase();
  const falaMinimo =
    (d.includes("mínimo") || d.includes("minimo")) &&
    (d.includes("5") || d.includes("r$"));
  const regraValor =
    d.includes("value") ||
    d.includes("asaas") ||
    d.includes("omit") ||
    d.includes("informado");
  if (falaMinimo || (regraValor && d.includes("5"))) {
    return MSG_VALOR_MINIMO;
  }
  return MSG_VALIDATION_AMIGAVEL;
}

function asRecord(body: unknown): Record<string, unknown> | null {
  return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
}

/**
 * Mapeia status + corpo JSON (já lido; `null` se não for JSON) do `POST /links`.
 */
export function interpretCreateLinkResponse(
  status: number,
  body: unknown,
): CreateLinkOutcome {
  const json = asRecord(body);

  if (status === 503 || status === 404) return { kind: "config" };

  if (status === 201 || status === 200) {
    const url = json?.url;
    if (typeof url === "string" && /^https:\/\//i.test(url)) {
      return { kind: "redirect", url };
    }
    return { kind: "error", variant: "system", message: MSG_INSTABILITY };
  }

  if (status === 409 && json?.code === "HAS_ACTIVE_CONTRIBUTION") {
    const hint = json.emailHint;
    return {
      kind: "active",
      emailHint: typeof hint === "string" && hint.trim() ? hint.trim() : null,
    };
  }

  if (status === 429) {
    return { kind: "error", variant: "system", message: MSG_RATE_LIMIT };
  }

  if (status === 502) {
    return { kind: "error", variant: "system", message: MSG_ASAAS_UPSTREAM };
  }

  if (status === 400) {
    const detail = formatNestMessage(json?.message, 280);
    return {
      kind: "error",
      variant: "validation",
      message: humanizarMensagem400(detail),
    };
  }

  return { kind: "error", variant: "system", message: MSG_INSTABILITY };
}

/** Resultado do `POST /contributions/access-link` (a API responde sempre 202). */
export type AccessLinkOutcome = "sent" | "rate_limit" | "config" | "error";

/** 400 = `returnUrl` fora das origens públicas do tenant → tratado como configuração. */
export function interpretAccessLinkStatus(status: number): AccessLinkOutcome {
  if (status >= 200 && status < 300) return "sent";
  if (status === 429) return "rate_limit";
  if (status === 400 || status === 404 || status === 503) return "config";
  return "error";
}

export function accessLinkErrorMessage(outcome: Exclude<AccessLinkOutcome, "sent">): string {
  if (outcome === "rate_limit") return MSG_RATE_LIMIT;
  if (outcome === "config") return MSG_ACCESS_CONFIG;
  return MSG_INSTABILITY;
}
