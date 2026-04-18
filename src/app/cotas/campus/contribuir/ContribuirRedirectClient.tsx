"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getDonationsApiBase,
  getDonationsTenantSlug,
} from "@/lib/donations/env";
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

function parseContribuirParams(
  searchParams: URLSearchParams,
): CreatePublicPaymentLinkBody {
  const rawValor = searchParams.get("valor");
  const rawMensal = searchParams.get("mensal");
  const isMonthly = rawMensal === "true";

  const body: CreatePublicPaymentLinkBody = { isMonthly };

  if (rawValor != null && rawValor !== "") {
    const v = Number.parseFloat(rawValor);
    if (Number.isFinite(v) && v >= 0.01) {
      body.value = Math.round(v * 100) / 100;
    }
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
  const runRef = useRef<AbortController | null>(null);

  const execute = useCallback(() => {
    runRef.current?.abort();

    const base = getDonationsApiBase();
    const tenantSlug = getDonationsTenantSlug();

    if (!base || !tenantSlug) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console -- diagnóstico local apenas
        console.warn(
          "[cotas/contribuir] Defina NEXT_PUBLIC_DONATIONS_API_BASE e NEXT_PUBLIC_DONATIONS_TENANT_SLUG (ou NEXT_PUBLIC_TENANT_SLUG).",
        );
      }
      setPhase("config");
      return;
    }

    setPhase("loading");
    setErrorMessage(MSG_INSTABILITY);
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

        setErrorMessage(MSG_INSTABILITY);
        setPhase("error");
      } catch {
        window.clearTimeout(timeoutId);
        if (ac.signal.aborted && !timedOut) return;
        setErrorMessage(timedOut ? MSG_TIMEOUT : MSG_INSTABILITY);
        setPhase("error");
      }
    })();
  }, [requestBody]);

  useEffect(() => {
    execute();
    return () => {
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
          <>
            <h1 className="cotas-contribuir__title">Algo correu mal</h1>
            <p className="cotas-contribuir__error">{errorMessage}</p>
            <button
              type="button"
              className="cotas-contribuir__retry"
              onClick={() => execute()}
            >
              Tentar novamente
            </button>
            <p className="cotas-contribuir__sub" style={{ marginTop: "1.25rem" }}>
              <Link href="/cotas/campus#cotas">Voltar à campanha</Link>
            </p>
          </>
        )}

        {phase === "config" && (
          <>
            <h1 className="cotas-contribuir__title">Pagamento indisponível</h1>
            <p className="cotas-contribuir__error">{MSG_CONFIG}</p>
            <p className="cotas-contribuir__sub">
              <Link href="/cotas/campus#outro-valor">Outro valor / pagamento único</Link>
              {" · "}
              <Link href="/cotas/campus#cotas">Voltar à campanha</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
