"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { COTAS_DESC, parseReaisFromCotaLabel } from "./cotasCampusData";

const COTA_OPTIONS = COTAS_DESC.map((label) => ({
  label,
  value: parseReaisFromCotaLabel(label),
}));

type CotasIntentPanelProps = {
  donorName: string;
  donorCpf: string;
  isIdentityValid: boolean;
};

export function CotasIntentPanel({
  donorName,
  donorCpf,
  isIdentityValid,
}: CotasIntentPanelProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const pushContribuirMensal12 = useCallback(
    (valor: number) => {
      const params = new URLSearchParams();
      params.set("valor", String(valor));
      params.set("mensal", "true");
      params.set("meses", "12");
      params.set("name", donorName);
      params.set("cpf", donorCpf);
      router.push(`/cotas/campus/contribuir?${params.toString()}`);
    },
    [donorCpf, donorName, router],
  );

  function handleValorMensal(value: number) {
    if (isNavigating || !isIdentityValid) return;
    setIsNavigating(true);
    pushContribuirMensal12(value);
  }

  return (
    <>
      <p className="period-note">
        Toque num valor para seguir com o <strong>plano mensal</strong> (12
        meses). Para <strong>outro valor</strong> e{" "}
        <strong>assinatura de 1 a 12 meses</strong>,{" "}
        <a href="#outro-valor">veja abaixo</a>.
      </p>
      <div className="cotas-grid">
        {COTA_OPTIONS.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            className="cota-btn"
            onClick={() => handleValorMensal(value)}
            disabled={isNavigating || !isIdentityValid}
          >
            {label}
          </button>
        ))}
      </div>
      {!isIdentityValid ? (
        <p className="period-note" role="status">
          Preencha nome e CPF para continuar.
        </p>
      ) : null}
    </>
  );
}
