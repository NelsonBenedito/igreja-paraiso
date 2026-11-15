"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  type ContribuinteIdentity,
  MAX_MESES_CAMPUS,
  MSG_STORAGE_BLOQUEADO,
  buildContribuirQuery,
  getSessionStorage,
  saveIdentity,
} from "@/lib/donations/contribuirPayload";
import { COTAS_DESC, parseReaisFromCotaLabel } from "./cotasCampusData";

const COTA_OPTIONS = COTAS_DESC.map((label) => ({
  label,
  value: parseReaisFromCotaLabel(label),
}));

type CotasIntentPanelProps = {
  /** Identidade válida do bloco "Quem está contribuindo?"; `null` mantém os botões desabilitados. */
  identity: ContribuinteIdentity | null;
};

export function CotasIntentPanel({ identity }: CotasIntentPanelProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [erro, setErro] = useState("");

  function handleValorMensal(value: number) {
    if (isNavigating || !identity) return;
    if (!saveIdentity(getSessionStorage(), identity)) {
      setErro(MSG_STORAGE_BLOQUEADO);
      return;
    }
    setErro("");
    setIsNavigating(true);
    router.push(`/cotas/campus/contribuir?${buildContribuirQuery(value, MAX_MESES_CAMPUS)}`);
  }

  return (
    <>
      <p className="period-note">
        Toque num valor para seguir com o <strong>plano mensal</strong> (12
        meses). Para <strong>outro valor</strong> e{" "}
        <strong>assinatura de 1 a 12 meses</strong>,{" "}
        <a href="#outro-valor">veja abaixo</a>.
      </p>
      {!identity ? (
        <p className="cb-identity__gate" id="cotas-gate">
          Preencha nome e CPF acima para escolher uma cota.
        </p>
      ) : null}
      <div className="cotas-grid">
        {COTA_OPTIONS.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            className={identity ? "cota-btn" : "cota-btn cota-btn--locked"}
            onClick={() => handleValorMensal(value)}
            disabled={isNavigating || !identity}
            aria-describedby={!identity ? "cotas-gate" : undefined}
          >
            {label}
          </button>
        ))}
      </div>
      {erro ? (
        <p className="cb-outro-valor__erro cb-identity__erro" role="alert">
          {erro}
        </p>
      ) : null}
    </>
  );
}
