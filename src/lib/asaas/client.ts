import { readEnvSecretFromFiles } from "./loadEnvSecret";

/** Produção. Chaves sandbox ($aact_hmlg_…) exigem https://api-sandbox.asaas.com */
const DEFAULT_BASE = "https://api.asaas.com";
const SANDBOX_BASE = "https://api-sandbox.asaas.com";
export function getAsaasApiBase(): string {
  const explicit = process.env.ASAAS_API_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const key = process.env.ASAAS_API_KEY?.trim() ?? "";
  if (key.includes("_hmlg_") || key.startsWith("$aact_hmlg")) {
    return SANDBOX_BASE;
  }
  return DEFAULT_BASE;
}

function normalizeEnvSecret(raw: string | undefined): string | null {
  const t = raw?.trim();
  if (!t) return null;
  if (
    (t.startsWith("'") && t.endsWith("'")) ||
    (t.startsWith('"') && t.endsWith('"'))
  ) {
    return t.slice(1, -1).trim() || null;
  }
  return t;
}

export function getAsaasApiKey(): string | null {
  const fromProcess = normalizeEnvSecret(process.env.ASAAS_API_KEY);
  if (fromProcess) return fromProcess;
  return normalizeEnvSecret(readEnvSecretFromFiles("ASAAS_API_KEY") ?? undefined);
}

export function isAsaasConfigured(): boolean {
  return !!getAsaasApiKey();
}

type AsaasErrorItem = { code?: string; description?: string };

export class AsaasApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors?: AsaasErrorItem[],
  ) {
    super(message);
    this.name = "AsaasApiError";
  }
}

export async function asaasRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const apiKey = getAsaasApiKey();
  if (!apiKey) {
    throw new AsaasApiError("Asaas API key não configurada", 503);
  }

  const url = `${getAsaasApiBase()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      access_token: apiKey,
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      /* ignore */
    }
  }

  if (!res.ok) {
    const errors =
      json &&
      typeof json === "object" &&
      "errors" in json &&
      Array.isArray((json as { errors: unknown }).errors)
        ? ((json as { errors: AsaasErrorItem[] }).errors ?? [])
        : undefined;
    const detail =
      errors?.map((e) => e.description).filter(Boolean).join("; ") ||
      `Erro Asaas (${res.status})`;
    throw new AsaasApiError(detail, res.status, errors);
  }

  return json as T;
}
