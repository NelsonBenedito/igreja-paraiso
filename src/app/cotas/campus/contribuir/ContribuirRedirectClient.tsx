"use client";

import { AlertCircle, HeartHandshake, Info } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ContribuinteIdentity,
  buildContribuirBody,
  getSessionStorage,
  loadIdentity,
} from "@/lib/donations/contribuirPayload";
import {
  getDonationsApiBase,
  getDonationsTenantSlug,
} from "@/lib/donations/env";
import {
  type ErrorVariant,
  MSG_CONFIG,
  MSG_IDENTIDADE,
  MSG_INSTABILITY,
  MSG_TIMEOUT,
  MSG_VALOR_MINIMO,
  accessLinkErrorMessage,
  interpretCreateLinkResponse,
} from "@/lib/donations/linkResponse";
import { MIN_PAYMENT_LINK_VALUE_BRL } from "@/lib/donations/minPaymentValue";
import {
  MINHAS_CONTRIBUICOES_PATH,
  PUBLIC_API_TIMEOUT_MS,
  publicTenantUrl,
  requestContributionsAccessLink,
} from "@/lib/donations/publicApi";

/** Para onde mandar o visitante corrigir um erro de validação. */
type FixTarget = "valor" | "identidade";

type AccessState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export function ContribuirRedirectClient() {
  const searchParams = useSearchParams();

  const [phase, setPhase] = useState<"loading" | "error" | "config" | "active">("loading");
  const [errorMessage, setErrorMessage] = useState(MSG_INSTABILITY);
  const [errorVariant, setErrorVariant] = useState<ErrorVariant>("system");
  const [fixTarget, setFixTarget] = useState<FixTarget>("valor");
  const [emailHint, setEmailHint] = useState<string | null>(null);
  const [access, setAccess] = useState<AccessState>({ kind: "idle" });
  const runRef = useRef<AbortController | null>(null);
  const identityRef = useRef<ContribuinteIdentity | null>(null);
  const confirmAdditionalRef = useRef(false);

  const showValidation = useCallback((message: string, target: FixTarget) => {
    setErrorMessage(message);
    setErrorVariant("validation");
    setFixTarget(target);
    setPhase("error");
  }, []);

  const execute = useCallback(
    (options: { confirmAdditional?: boolean } = {}) => {
      runRef.current?.abort();
      confirmAdditionalRef.current = options.confirmAdditional === true;

      const url = publicTenantUrl("/links");
      if (!getDonationsApiBase() || !getDonationsTenantSlug() || !url) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[cotas/contribuir] Defina NEXT_PUBLIC_DONATIONS_API_BASE e NEXT_PUBLIC_DONATIONS_TENANT_SLUG (ou NEXT_PUBLIC_TENANT_SLUG).",
          );
        }
        setPhase("config");
        return;
      }

      const identity = loadIdentity(getSessionStorage());
      identityRef.current = identity;
      const built = buildContribuirBody(searchParams, identity, options);
      if (!built.ok) {
        showValidation(MSG_IDENTIDADE, "identidade");
        return;
      }
      const requestBody = built.body;

      if (
        requestBody.value !== undefined &&
        requestBody.value < MIN_PAYMENT_LINK_VALUE_BRL
      ) {
        showValidation(MSG_VALOR_MINIMO, "valor");
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
      }, PUBLIC_API_TIMEOUT_MS);

      void (async () => {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
            signal: ac.signal,
          });
          let json: unknown = null;
          try {
            json = await res.json();
          } catch {
            /* corpo vazio ou não JSON */
          }

          window.clearTimeout(timeoutId);
          if (ac.signal.aborted && !timedOut) return;

          const outcome = interpretCreateLinkResponse(res.status, json);
          switch (outcome.kind) {
            case "redirect":
              window.location.href = outcome.url;
              return;
            case "config":
              setPhase("config");
              return;
            case "active":
              setEmailHint(outcome.emailHint);
              setAccess({ kind: "idle" });
              setPhase("active");
              return;
            case "error":
              if (outcome.variant === "validation") {
                showValidation(outcome.message, "valor");
              } else {
                setErrorMessage(outcome.message);
                setErrorVariant("system");
                setPhase("error");
              }
              return;
          }
        } catch {
          window.clearTimeout(timeoutId);
          if (ac.signal.aborted && !timedOut) return;
          setErrorMessage(timedOut ? MSG_TIMEOUT : MSG_INSTABILITY);
          setErrorVariant("system");
          setPhase("error");
        }
      })();
    },
    [searchParams, showValidation],
  );

  useEffect(() => {
    const id = window.setTimeout(() => {
      execute();
    }, 0);
    return () => {
      window.clearTimeout(id);
      runRef.current?.abort();
    };
  }, [execute]);

  async function handleRequestAccess() {
    const cpf = identityRef.current?.cpf;
    if (!cpf || access.kind === "sending") return;
    setAccess({ kind: "sending" });
    const outcome = await requestContributionsAccessLink(cpf, window.location.origin);
    setAccess(
      outcome === "sent"
        ? { kind: "sent" }
        : { kind: "error", message: accessLinkErrorMessage(outcome) },
    );
  }

  return (
    <main className="campus-page cotas-contribuir">
      <div className="cb-shell cotas-contribuir__shell">
        {phase === "loading" && (
          <>
            <h1 className="cotas-contribuir__title">Preparando o pagamento</h1>
            <p className="cotas-contribuir__sub">
              Estamos abrindo a página segura do parceiro financeiro. Aguarde um
              instante.
            </p>
            <div className="cotas-contribuir__spinner" aria-hidden />
            <p className="cotas-contribuir__sub">Isso costuma levar poucos segundos.</p>
          </>
        )}

        {phase === "active" && (
          <div className="cotas-contribuir__error-panel">
            <div
              className="cotas-contribuir__error-card cotas-contribuir__error-card--soft"
              role="status"
            >
              <HeartHandshake
                className="cotas-contribuir__error-icon cotas-contribuir__error-icon--info"
                aria-hidden
                strokeWidth={2}
              />
              <h1 className="cotas-contribuir__error-heading">
                Você já contribui com o Novo Campus
              </h1>
              <p className="cotas-contribuir__error-body">
                Encontramos uma contribuição mensal ativa para este CPF. Você pode
                receber no e-mail um link para ver suas contribuições ou fazer uma
                contribuição adicional.
              </p>
              <div className="cotas-contribuir__error-actions">
                {access.kind === "sent" ? (
                  <p className="cotas-contribuir__notice" role="status">
                    Enviamos para {emailHint ?? "o e-mail cadastrado"}. O link vale por
                    30 minutos.
                  </p>
                ) : (
                  <button
                    type="button"
                    className="cotas-contribuir__cta-primary"
                    onClick={() => void handleRequestAccess()}
                    disabled={access.kind === "sending"}
                  >
                    {access.kind === "sending" ? "Enviando…" : "Receber acesso no e-mail"}
                  </button>
                )}
                {access.kind === "error" ? (
                  <p className="cotas-contribuir__notice cotas-contribuir__notice--error" role="alert">
                    {access.message}
                  </p>
                ) : null}
                <button
                  type="button"
                  className="cotas-contribuir__retry"
                  onClick={() => execute({ confirmAdditional: true })}
                >
                  Fazer contribuição adicional
                </button>
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
                  : "Algo deu errado"}
              </h1>
              <p className="cotas-contribuir__error-body">{errorMessage}</p>
              <div className="cotas-contribuir__error-actions">
                {errorVariant === "validation" ? (
                  fixTarget === "identidade" ? (
                    <Link
                      className="cotas-contribuir__cta-primary"
                      href="/cotas/campus#quem-contribui"
                    >
                      Informar nome e CPF
                    </Link>
                  ) : (
                    <Link
                      className="cotas-contribuir__cta-primary"
                      href="/cotas/campus#outro-valor"
                    >
                      Corrigir valor na campanha
                    </Link>
                  )
                ) : (
                  <button
                    type="button"
                    className="cotas-contribuir__retry"
                    onClick={() =>
                      execute({ confirmAdditional: confirmAdditionalRef.current })
                    }
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
              {" · "}
              <Link href={MINHAS_CONTRIBUICOES_PATH}>Minhas contribuições</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
