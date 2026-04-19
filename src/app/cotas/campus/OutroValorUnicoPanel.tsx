"use client";

import { MIN_PAYMENT_LINK_VALUE_BRL } from "@/lib/donations/minPaymentValue";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const MESES_MAX_CAMPUS = 12;

function parseValorReais(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  if (t === "") return null;
  const n = Number.parseFloat(t);
  if (!Number.isFinite(n) || n < 0.01) return null;
  return Math.round(n * 100) / 100;
}

export function OutroValorUnicoPanel() {
  const router = useRouter();
  const [mesesStr, setMesesStr] = useState("1");
  const [valorTexto, setValorTexto] = useState("");
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState("");

  function handleGerarLink(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const v = parseValorReais(valorTexto);
    if (v === null) {
      setErro(
        valorTexto.trim() === ""
          ? "Digite um valor em reais."
          : "Valor não reconhecido. Ex.: 100 ou 1500,50",
      );
      return;
    }
    if (v < MIN_PAYMENT_LINK_VALUE_BRL) {
      setErro(
        `O valor mínimo por mês é R$ ${MIN_PAYMENT_LINK_VALUE_BRL.toFixed(2).replace(".", ",")} (exigência do parceiro de pagamentos).`,
      );
      return;
    }
    const m = Number.parseInt(mesesStr, 10);
    if (!Number.isInteger(m) || m < 1 || m > MESES_MAX_CAMPUS) {
      setErro(`Indique um número de meses entre 1 e ${MESES_MAX_CAMPUS}.`);
      return;
    }

    setErro("");
    setBusy(true);
    const params = new URLSearchParams();
    params.set("valor", String(v));
    params.set("mensal", "true");
    params.set("meses", String(m));
    router.push(`/cotas/campus/contribuir?${params.toString()}`);
  }

  return (
    <form
      className="cb-outro-valor__aside cb-outro-valor__aside--simple"
      onSubmit={handleGerarLink}
    >
      <div className="cb-outro-valor__block">
        <span className="cb-outro-valor__step">1</span>
        <label className="cb-outro-valor__simple-label" htmlFor="outro-valor-campo">
          Valor em reais (R$)
        </label>
        <input
          id="outro-valor-campo"
          name="valor"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="Ex.: 50 ou 200"
          className="cb-outro-valor__input cb-outro-valor__input--touch"
          value={valorTexto}
          onChange={(e) => {
            setValorTexto(e.target.value);
            setErro("");
          }}
          disabled={busy}
          aria-describedby="outro-valor-min-hint"
        />
        <p id="outro-valor-min-hint" className="cb-outro-valor__field-hint">
          Mínimo R$ {MIN_PAYMENT_LINK_VALUE_BRL.toFixed(2).replace(".", ",")} por mês
          (limite do sistema de pagamentos).
        </p>
      </div>

      <div className="cb-outro-valor__block">
        <span className="cb-outro-valor__step">2</span>
        <label
          className="cb-outro-valor__simple-label"
          htmlFor="outro-valor-meses"
        >
          Por quantos meses? (de 1 a {MESES_MAX_CAMPUS})
        </label>
        <input
          id="outro-valor-meses"
          name="meses"
          type="number"
          inputMode="numeric"
          min={1}
          max={MESES_MAX_CAMPUS}
          step={1}
          className="cb-outro-valor__input cb-outro-valor__input--touch"
          value={mesesStr}
          onChange={(e) => {
            setMesesStr(e.target.value);
            setErro("");
          }}
          disabled={busy}
          aria-describedby="outro-valor-meses-hint"
        />
        <p id="outro-valor-meses-hint" className="cb-outro-valor__field-hint">
          Cada mês, o mesmo valor que indicou acima. Escolha só 1 mês para pagamento único ou recorrência
          mensal até {MESES_MAX_CAMPUS}.
        </p>
      </div>

      {erro ? (
        <p className="cb-outro-valor__erro" role="alert">
          {erro}
        </p>
      ) : null}

      <button
        type="submit"
        className="cb-outro-valor__submit cb-outro-valor__submit--touch"
        disabled={busy}
      >
        {busy ? "A abrir…" : "Continuar para pagar"}
      </button>
    </form>
  );
}
