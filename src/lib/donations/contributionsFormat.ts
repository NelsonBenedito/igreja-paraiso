/** Formatadores da página "Minhas contribuições" (pt-BR, fuso de Brasília). */
import type { ContributionPendingLink } from "./types";

const numberFormat = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** `10000` → `"R$ 100,00"` (espaço comum, sem NBSP). */
export function formatCentsBRL(cents: number): string {
  if (!Number.isFinite(cents)) return "—";
  const sign = cents < 0 ? "-" : "";
  return `${sign}R$ ${numberFormat.format(Math.abs(cents) / 100)}`;
}

/** ISO → `"15/11/2026"`; inválido ou vazio → `"—"`. */
export function formatDateBR(iso: string | null | undefined): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(t));
}

const SUBSCRIPTION_STATUS: Record<string, string> = {
  ACTIVE: "Ativa",
  INACTIVE: "Inativa",
  PENDING: "Pendente",
  OVERDUE: "Em atraso",
  EXPIRED: "Encerrada",
  CANCELLED: "Cancelada",
  CANCELED: "Cancelada",
};

export function subscriptionStatusLabel(status: string): string {
  return SUBSCRIPTION_STATUS[status.toUpperCase()] ?? "Inativa";
}

const PAYMENT_STATUS: Record<string, string> = {
  CONFIRMED: "Confirmado",
  RECEIVED: "Confirmado",
  RECEIVED_IN_CASH: "Confirmado",
  PAID: "Confirmado",
  PENDING: "Pendente",
  OVERDUE: "Vencido",
  REFUNDED: "Estornado",
  REFUND_REQUESTED: "Estorno solicitado",
  CANCELLED: "Cancelado",
  CANCELED: "Cancelado",
  FAILED: "Não aprovado",
};

export function paymentStatusLabel(status: string): string {
  return PAYMENT_STATUS[status.toUpperCase()] ?? "Em processamento";
}

/** Tom visual do status: `ok` (verde), `warn` (âmbar) ou `muted`. */
export function statusTone(status: string): "ok" | "warn" | "muted" {
  const s = status.toUpperCase();
  if (["ACTIVE", "CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH", "PAID"].includes(s)) return "ok";
  if (["PENDING", "OVERDUE", "REFUND_REQUESTED"].includes(s)) return "warn";
  return "muted";
}

const BILLING_TYPE: Record<string, string> = {
  PIX: "Pix",
  BOLETO: "Boleto",
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
};

export function billingTypeLabel(billingType: string | null): string {
  if (!billingType) return "—";
  return BILLING_TYPE[billingType.toUpperCase()] ?? "Outro";
}

/**
 * `"R$ 100,00 por mês, durante 12 meses"`, `"R$ 100,00 (pagamento único)"`;
 * sem valor → `"Valor livre"`; sem meses → omite a duração.
 */
export function describePendingLink(link: ContributionPendingLink): string {
  const valor = link.valueCents === null ? "Valor livre" : formatCentsBRL(link.valueCents);
  if (!link.isMonthly) return `${valor} (pagamento único)`;
  const m = link.subscriptionDurationMonths;
  if (!m) return `${valor} por mês`;
  return `${valor} por mês, durante ${m} ${m === 1 ? "mês" : "meses"}`;
}
