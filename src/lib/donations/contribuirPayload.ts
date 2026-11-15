/**
 * Dados que a página de cotas passa para `/cotas/campus/contribuir`.
 *
 * Nome e CPF vão por `sessionStorage` (nunca pela URL); valor, mensal e meses
 * continuam na query string. Todo pagamento do site usa `reuseMode: "cpf_custom"`.
 */
import { isValidCpf, isValidDonorName, onlyDigits } from "./cpf";
import type { CreatePublicPaymentLinkBody } from "./types";

/** Chave única do `sessionStorage` para a identidade do contribuinte. */
export const CONTRIBUIR_IDENTITY_STORAGE_KEY = "igreja-paraiso:cotas:contribuinte";

/** Campanha campus: no máximo 12 meses (a API permite até 120). */
export const MAX_MESES_CAMPUS = 12;

export const MSG_STORAGE_BLOQUEADO =
  "Seu navegador bloqueou o armazenamento temporário desta página. Desative o modo restrito (ou use outro navegador) e tente de novo.";

export type ContribuinteIdentity = {
  name: string;
  /** Só dígitos. */
  cpf: string;
};

type StorageLike = Pick<Storage, "getItem" | "setItem">;

/** Normaliza e valida; devolve `null` se nome ou CPF não forem válidos. */
export function normalizeIdentity(
  name: string,
  cpf: string,
): ContribuinteIdentity | null {
  const n = name.trim().replace(/\s+/g, " ");
  const c = onlyDigits(cpf);
  if (!isValidDonorName(n) || !isValidCpf(c)) return null;
  return { name: n, cpf: c };
}

/** Lê o JSON gravado no `sessionStorage`; qualquer coisa inválida vira `null`. */
export function parseStoredIdentity(raw: string | null): ContribuinteIdentity | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;
  const { name, cpf } = data as { name?: unknown; cpf?: unknown };
  if (typeof name !== "string" || typeof cpf !== "string") return null;
  return normalizeIdentity(name, cpf);
}

/** Grava a identidade; `false` se o navegador bloquear o armazenamento. */
export function saveIdentity(
  storage: StorageLike | null | undefined,
  identity: ContribuinteIdentity,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(CONTRIBUIR_IDENTITY_STORAGE_KEY, JSON.stringify(identity));
    return true;
  } catch {
    return false;
  }
}

export function loadIdentity(
  storage: StorageLike | null | undefined,
): ContribuinteIdentity | null {
  if (!storage) return null;
  try {
    return parseStoredIdentity(storage.getItem(CONTRIBUIR_IDENTITY_STORAGE_KEY));
  } catch {
    return null;
  }
}

/** `window.sessionStorage` sem lançar (modo privado, cookies bloqueados…). */
export function getSessionStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

/** Query string de `/cotas/campus/contribuir` (sem dados pessoais). */
export function buildContribuirQuery(valor: number, meses: number): string {
  const params = new URLSearchParams();
  params.set("valor", String(valor));
  params.set("mensal", "true");
  params.set("meses", String(meses));
  return params.toString();
}

export type ContribuirBodyResult =
  | { ok: true; body: CreatePublicPaymentLinkBody }
  | { ok: false; reason: "identity" };

/** Monta o corpo do `POST /links` a partir da URL e da identidade guardada. */
export function buildContribuirBody(
  searchParams: Pick<URLSearchParams, "get">,
  identity: ContribuinteIdentity | null,
  options: { confirmAdditional?: boolean } = {},
): ContribuirBodyResult {
  if (!identity) return { ok: false, reason: "identity" };

  const isMonthly = searchParams.get("mensal") === "true";
  const body: CreatePublicPaymentLinkBody = {
    isMonthly,
    reuseMode: "cpf_custom",
    name: identity.name,
    cpf: identity.cpf,
  };

  const rawValor = searchParams.get("valor");
  if (rawValor != null && rawValor !== "") {
    const v = Number.parseFloat(rawValor);
    if (Number.isFinite(v) && v >= 0.01) {
      body.value = Math.round(v * 100) / 100;
    }
  }

  if (isMonthly) {
    const rawMeses = searchParams.get("meses");
    let meses = MAX_MESES_CAMPUS;
    if (rawMeses != null && rawMeses !== "") {
      const m = Number.parseInt(rawMeses, 10);
      if (Number.isInteger(m) && m >= 1) meses = Math.min(MAX_MESES_CAMPUS, m);
    }
    body.subscriptionDurationMonths = meses;
  }

  if (options.confirmAdditional) body.confirmAdditional = true;

  return { ok: true, body };
}
