"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { COTAS_DESC, parseReaisFromCotaLabel } from "./cotasCampusData";

const COTA_OPTIONS = COTAS_DESC.map((label) => ({
  label,
  value: parseReaisFromCotaLabel(label),
}));

export function CotasIntentPanel() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const pushContribuir = useCallback(
    (valor: number, mensal: boolean) => {
      const params = new URLSearchParams();
      params.set("valor", String(valor));
      params.set("mensal", mensal ? "true" : "false");
      router.push(`/cotas/campus/contribuir?${params.toString()}`);
    },
    [router],
  );

  function handleValorMensal(value: number) {
    if (isNavigating) return;
    setIsNavigating(true);
    pushContribuir(value, true);
  }

  return (
    <>
      <p className="period-note">
        Toque num valor para seguir com o <strong>plano mensal</strong> (12
        meses). Para <strong>outro valor</strong> ou <strong>pagamento unico</strong>,{" "}
        <a href="#outro-valor">abaixo</a>.
      </p>
      <div className="cotas-grid">
        {COTA_OPTIONS.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            className="cota-btn"
            onClick={() => handleValorMensal(value)}
            disabled={isNavigating}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
