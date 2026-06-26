"use client";

import { CircleCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/**
 * Mostra um banner quando o utilizador regressa com ?obrigado=1 (URL configurada no Asaas/Nest).
 * Remove o query param da barra de endereço para não persistir em partilhas; o banner fecha com «Fechar».
 */
export function CampusPagamentoObrigado() {
  const searchParams = useSearchParams();
  const paramObrigado = searchParams.get("obrigado") === "1";
  const [keepVisible, setKeepVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!paramObrigado) return;

    setKeepVisible(true);

    const url = new URL(window.location.href);
    if (url.searchParams.get("obrigado") !== "1") return;
    url.searchParams.delete("obrigado");
    window.history.replaceState(
      null,
      "",
      url.pathname + (url.search ? url.search : "") + url.hash,
    );
  }, [paramObrigado]);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  const visible = (paramObrigado || keepVisible) && !dismissed;

  if (!visible) return null;

  return (
    <div
      className="cb-obrigado"
      role="region"
      aria-labelledby="cb-obrigado-heading"
      aria-live="polite"
    >
      <div className="cb-obrigado__inner">
        <div className="cb-obrigado__card">
          <div className="cb-obrigado__head">
            <h2 id="cb-obrigado-heading" className="cb-obrigado__title">
              <CircleCheck
                className="cb-obrigado__icon"
                aria-hidden
                strokeWidth={2}
              />
              <span className="cb-obrigado__title-text">
                Contribuição efetuada com sucesso
              </span>
            </h2>
            <button
              type="button"
              className="cb-obrigado__close"
              onClick={dismiss}
              aria-label="Fechar mensagem de agradecimento"
            >
              Fechar
            </button>
          </div>
          <p className="cb-obrigado__text">
            Explore o resto da página: visão do projeto, frentes em atividade e contacto.
          </p>
          <div
            className="cb-obrigado__actions"
            role="group"
            aria-label="Atalhos para secções da campanha"
          >
            <a className="cb-obrigado__btn" href="#visao">
              A visão e a missão
            </a>
            <a className="cb-obrigado__btn" href="#projetos">
              Projetos em atividade
            </a>
            <a className="cb-obrigado__btn" href="#contato">
              Fale conosco
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
