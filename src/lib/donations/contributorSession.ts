/**
 * Sessão de leitura de "Minhas contribuições": cookie httpOnly com o JWT
 * devolvido por `POST /contributions/session` e validação das respostas.
 */
import type {
  ContributionPayment,
  ContributionPendingLink,
  ContributionSubscription,
  ContributionsMeResponse,
  ContributionsSessionResponse,
} from "./types";

export const CONTRIBUTOR_SESSION_COOKIE = "cotas_contribuinte";

/** 30 dias, em segundos. */
export const CONTRIBUTOR_SESSION_MAX_AGE_S = 30 * 24 * 60 * 60;

export function parseSessionResponse(body: unknown): ContributionsSessionResponse | null {
  if (!body || typeof body !== "object") return null;
  const { sessionToken, expiresAt } = body as Record<string, unknown>;
  if (typeof sessionToken !== "string" || !sessionToken.trim()) return null;
  return {
    sessionToken: sessionToken.trim(),
    expiresAt: typeof expiresAt === "string" ? expiresAt : "",
  };
}

/** Duração do cookie: até `expiresAt` da API, limitada a 30 dias; padrão 30 dias. */
export function sessionCookieMaxAge(expiresAt: string, now: Date = new Date()): number {
  const t = Date.parse(expiresAt);
  if (!Number.isFinite(t)) return CONTRIBUTOR_SESSION_MAX_AGE_S;
  const seconds = Math.floor((t - now.getTime()) / 1000);
  if (seconds <= 0) return CONTRIBUTOR_SESSION_MAX_AGE_S;
  return Math.min(seconds, CONTRIBUTOR_SESSION_MAX_AGE_S);
}

/** Opções do cookie de sessão (httpOnly, Secure em produção, SameSite=Lax). */
export function contributorCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

function str(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function cents(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null;
}

function rec(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function parseSubscription(v: unknown): ContributionSubscription | null {
  const o = rec(v);
  if (!o) return null;
  const valueCents = cents(o.valueCents);
  const status = str(o.status);
  if (valueCents === null || !status) return null;
  return {
    id: str(o.id) ?? "",
    status,
    valueCents,
    label: str(o.label) ?? "",
    createdAt: str(o.createdAt) ?? "",
    currentPeriodEnd: str(o.currentPeriodEnd),
  };
}

function parsePayment(v: unknown): ContributionPayment | null {
  const o = rec(v);
  if (!o) return null;
  const valueCents = cents(o.valueCents);
  const date = str(o.date);
  if (valueCents === null || !date) return null;
  return {
    date,
    valueCents,
    status: str(o.status) ?? "",
    billingType: str(o.billingType),
  };
}

function parsePendingLink(v: unknown): ContributionPendingLink | null {
  const o = rec(v);
  if (!o) return null;
  const url = str(o.url);
  const valueCents = cents(o.valueCents);
  if (!url || !/^https:\/\//i.test(url)) return null;
  const months = o.subscriptionDurationMonths;
  return {
    url,
    valueCents,
    isMonthly: o.isMonthly === true,
    subscriptionDurationMonths:
      typeof months === "number" && Number.isInteger(months) && months > 0 ? months : null,
    createdAt: str(o.createdAt) ?? "",
  };
}

function parseList<T>(v: unknown, parse: (x: unknown) => T | null): T[] {
  if (!Array.isArray(v)) return [];
  return v.map(parse).filter((x): x is T => x !== null);
}

/** Valida a resposta de `GET /contributions/me`; `null` se não tiver o formato esperado. */
export function parseContributionsMe(body: unknown): ContributionsMeResponse | null {
  const o = rec(body);
  if (!o) return null;
  const payer = rec(o.payer);
  return {
    payer: {
      name: str(payer?.name)?.trim() ?? "",
      emailHint: str(payer?.emailHint),
    },
    subscriptions: parseList(o.subscriptions, parseSubscription),
    payments: parseList(o.payments, parsePayment),
    pendingLink: parsePendingLink(o.pendingLink),
  };
}
