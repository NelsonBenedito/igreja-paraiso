"use client";

import { AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getDonationsApiBase,
  getDonationsTenantSlug,
} from "@/lib/donations/env";
import { MIN_PAYMENT_LINK_VALUE_BRL } from "@/lib/donations/minPaymentValue";
import type {
  CreatePublicPaymentLinkBody,
  CreatePublicPaymentLinkResponse,
} from "@/lib/donations/types";

const FETCH_TIMEOUT_MS = 8000;

const MSG_INSTABILITY =
  "Tivemos uma instabilidade temporária ao conectar com o sistema financeiro. Por favor, tente novamente em alguns instantes.";

const MSG_TIMEOUT =
  "A ligação ao sistema financeiro demorou demasiado. Verifique a rede e tente novamente.";

const MSG_CONFIG =
  "O pagamento online não está disponível no momento. Tente mais tarde ou fale conosco pela página da campanha.";

const MSG_RATE_LIMIT =
  "Foram feitas demasiadas tentativas a partir deste dispositivo. Aguarde cerca de um minuto e tente novamente.";

const MSG_ASAAS_UPSTREAM =
  "O serviço de pagamentos não respondeu como esperado. Tente novamente mais tarde ou fale conosco pela página da campanha.";

/** Texto para o utilizador final — nunca mostrar mensagens cruas da API. */
const MSG_VALOR_MINIMO = `O valor por mês precisa ser de pelo menos R$ ${MIN_PAYMENT_LINK_VALUE_BRL.toFixed(2).replace(".", ",")}. Corrija na campanha e abra o pagamento de novo.`;

const MSG_VALIDATION_AMIGAVEL =
  "Não foi possível preparar o pagamento com estes dados. Volte à campanha, confira o valor e as opções, e tente novamente.";

type ErrorVariant = "validation" | "system";

/**
 * Converte respostas 400 do Nest em texto legível. Nunca devolver jargão (value, Asaas, omitir…).
 */
function humanizarMensagem400(apiDetail: string | null): string {
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

function formatNestMessage(raw: unknown, maxLen: number): string | null {
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

function onlyDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  const nums = digits.split("").map((c) => Number.parseInt(c, 10));
  const calc = (size: number) => {
    let sum = 0;
    for (let i = 0; i < size; i += 1) sum += nums[i] * (size + 1 - i);
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };
  return calc(9) === nums[9] && calc(10) === nums[10];
}

function parseContribuirParams(
  searchParams: URLSearchParams,
): CreatePublicPaymentLinkBody {
  const rawValor = searchParams.get("valor");
  const rawMensal = searchParams.get("mensal");
  const isMonthly = rawMensal === "true";
  const name = (searchParams.get("name") ?? "").trim();
  const cpf = onlyDigits(searchParams.get("cpf") ?? "");

  const body: CreatePublicPaymentLinkBody = {
    reuseMode: "cpf_custom",
    isMonthly,
    name,
    cpf,
  };

  if (rawValor != null && rawValor !== "") {
    const v = Number.parseFloat(rawValor);
    if (Number.isFinite(v) && v >= 0.01) {
      body.value = Math.round(v * 100) / 100;
    }
  }

  if (isMonthly) {
    const rawMeses = searchParams.get("meses");
    let meses = 12;
    if (rawMeses != null && rawMeses !== "") {
      const m = Number.parseInt(rawMeses, 10);
      if (Number.isInteger(m) && m >= 1) {
        /* Campanha campus: no máximo 12 meses (a API Nest permite até 120). */
        meses = Math.min(12, m);
      }
    }
    body.subscriptionDurationMonths = meses;
  }

  return body;
}

export function ContribuirRedirectClient() {
  const searchParams = useSearchParams();
  const requestBody = useMemo(
    () => parseContribuirParams(searchParams),
    [searchParams],
  );

  const [phase, setPhase] = useState<"loading" | "error" | "config">("loading");
  const [errorMessage, setErrorMessage] = useState(MSG_INSTABILITY);
  const [errorVariant, setErrorVariant] = useState<ErrorVariant>("system");
  const runRef = useRef<AbortController | null>(null);

  const execute = useCallback(() => {
    runRef.current?.abort();

    const base = getDonationsApiBase();
    const tenantSlug = getDonationsTenantSlug();

    if (!base || !tenantSlug) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[cotas/contribuir] Defina NEXT_PUBLIC_DONATIONS_API_BASE e NEXT_PUBLIC_DONATIONS_TENANT_SLUG (ou NEXT_PUBLIC_TENANT_SLUG).",
        );
      }
      setPhase("config");
      return;
    }

    if (
      requestBody.value !== undefined &&
      requestBody.value < MIN_PAYMENT_LINK_VALUE_BRL
    ) {
      setErrorMessage(MSG_VALOR_MINIMO);
      setErrorVariant("validation");
      setPhase("error");
      return;
    }

    if (!requestBody.name || requestBody.name.trim().length < 3 || !requestBody.cpf || !isValidCpf(requestBody.cpf)) {
      setErrorMessage("Nao foi possivel preparar o pagamento. Volte e informe nome e CPF validos.");
      setErrorVariant("validation");
      setPhase("error");
      return;
    }

    setPhase("loading");
    setErrorMessage(MSG_INSTABILITY);
    setErrorVariant("system");
    const ac = new AbortController();
    runRef.current = ac;
    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      ac.abort();
    }, FETCH_TIMEOUT_MS);
    const url = `${base}/api/public/tenants/${encodeURIComponent(tenantSlug)}/links`;

    void (async () => {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: ac.signal,
        });

        window.clearTimeout(timeoutId);

        if (ac.signal.aborted && !timedOut) return;

        if (res.status === 503 || res.status === 404) {
          setPhase("config");
          return;
        }

        if (res.status === 201) {
          const data = (await res.json()) as CreatePublicPaymentLinkResponse;
          if (data?.url && typeof data.url === "string") {
            window.location.href = data.url;
            return;
          }
        }

        if (res.status === 429) {
          setErrorMessage(MSG_RATE_LIMIT);
          setErrorVariant("system");
          setPhase("error");
          return;
        }

        if (res.status === 502) {
          setErrorMessage(MSG_ASAAS_UPSTREAM);
          setErrorVariant("system");
          setPhase("error");
          return;
        }

        if (res.status === 400) {
          let detail: string | null = null;
          try {
            const json = (await res.json()) as { message?: unknown };
            detail = formatNestMessage(json?.message, 280);
          } catch {
            /* ignore */
          }
          setErrorMessage(humanizarMensagem400(detail));
          setErrorVariant("validation");
          setPhase("error");
          return;
        }

        setErrorMessage(MSG_INSTABILITY);
        setErrorVariant("system");
        setPhase("error");
      } catch {
        window.clearTimeout(timeoutId);
        if (ac.signal.aborted && !timedOut) return;
        setErrorMessage(timedOut ? MSG_TIMEOUT : MSG_INSTABILITY);
        setErrorVariant("system");
        setPhase("error");
      }
    })();
  }, [requestBody]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      execute();
    }, 0);
    return () => {
      window.clearTimeout(id);
      runRef.current?.abort();
    };
  }, [execute]);

  return (
    <main className="campus-page cotas-contribuir">
      <div className="cb-shell cotas-contribuir__shell">
        {phase === "loading" && (
          <>
            <h1 className="cotas-contribuir__title">A preparar o pagamento</h1>
            <p className="cotas-contribuir__sub">
              Estamos abrindo a pagina segura do parceiro financeiro. Aguarde um
              instante.
            </p>
            <div className="cotas-contribuir__spinner" aria-hidden />
            <p className="cotas-contribuir__sub">Isso costuma levar poucos segundos.</p>
          </>
        )}

        {phase === "error" && (
          <div className="cotas-contribuir__error-panel">
            <div
              className={
                errorVariant === "validation"
                  ? "cotas-contribuir__error-card cotas-contribuir__error-card--soft"
                  : "cotas-contribuir__error-card"
              }
              role="alert"
            >
              {errorVariant === "validation" ? (
                <Info
                  className="cotas-contribuir__error-icon cotas-contribuir__error-icon--info"
                  aria-hidden
                  strokeWidth={2}
                />
              ) : (
                <AlertCircle
                  className="cotas-contribuir__error-icon"
                  aria-hidden
                  strokeWidth={2}
                />
              )}
              <h1 className="cotas-contribuir__error-heading">
                {errorVariant === "validation"
                  ? "Não foi possível abrir o pagamento"
                  : "Algo correu mal"}
              </h1>
              <p className="cotas-contribuir__error-body">{errorMessage}</p>
              <div className="cotas-contribuir__error-actions">
                {errorVariant === "validation" ? (
                  <Link
                    className="cotas-contribuir__cta-primary"
                    href="/cotas/campus#outro-valor"
                  >
                    Corrigir valor na campanha
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="cotas-contribuir__retry"
                    onClick={() => execute()}
                  >
                    Tentar novamente
                  </button>
                )}
                <Link
                  className="cotas-contribuir__cta-secondary"
                  href="/cotas/campus#cotas"
                >
                  Voltar à campanha
                </Link>
              </div>
            </div>
          </div>
        )}

        {phase === "config" && (
          <>
            <h1 className="cotas-contribuir__title">Pagamento indisponível</h1>
            <p className="cotas-contribuir__error">{MSG_CONFIG}</p>
            <p className="cotas-contribuir__sub">
              <Link href="/cotas/campus#outro-valor">Outro valor / assinatura</Link>
              {" · "}
              <Link href="/cotas/campus#cotas">Voltar à campanha</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
