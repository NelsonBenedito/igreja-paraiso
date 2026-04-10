"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function parseValorReais(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  if (t === "") return null;
  const n = Number.parseFloat(t);
  if (!Number.isFinite(n) || n < 0.01) return null;
  return Math.round(n * 100) / 100;
}

export function OutroValorUnicoPanel() {
  const router = useRouter();
  const [modo, setModo] = useState<"mensal" | "unico">("unico");
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
          ? "Informe o valor em reais."
          : "Valor invalido. Use ex.: 100 ou 1.500,00.",
      );
      return;
    }
    setErro("");
    setBusy(true);
    const params = new URLSearchParams();
    params.set("valor", String(v));
    params.set("mensal", modo === "mensal" ? "true" : "false");
    router.push(`/cotas/campus/contribuir?${params.toString()}`);
  }

  return (
      <form className="cb-outro-valor__aside" onSubmit={handleGerarLink}>
        <div
          className="cb-outro-valor__modo"
          role="radiogroup"
          aria-labelledby="outro-valor-period-label"
        >
          <div id="outro-valor-period-label" className="cb-outro-valor__legend">
            Periodicidade
          </div>
          <div className="cb-outro-valor__modo-grid">
            <label
              className={
                modo === "mensal"
                  ? "cb-outro-valor__pill is-on"
                  : "cb-outro-valor__pill"
              }
            >
              <input
                type="radio"
                name="modo-outro-valor"
                value="mensal"
                checked={modo === "mensal"}
                onChange={() => {
                  setModo("mensal");
                  setErro("");
                }}
              />
              <span>Pagar por 12 meses</span>
            </label>
            <label
              className={
                modo === "unico"
                  ? "cb-outro-valor__pill is-on"
                  : "cb-outro-valor__pill"
              }
            >
              <input
                type="radio"
                name="modo-outro-valor"
                value="unico"
                checked={modo === "unico"}
                onChange={() => {
                  setModo("unico");
                  setErro("");
                }}
              />
              <span>Pagamento unico</span>
            </label>
          </div>
        </div>

        <label className="cb-outro-valor__field-label" htmlFor="outro-valor-campo">
          Valor (R$)
        </label>
        <input
          id="outro-valor-campo"
          name="valor"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="Ex.: 250 ou 1.200,00"
          className="cb-outro-valor__input"
          value={valorTexto}
          onChange={(e) => {
            setValorTexto(e.target.value);
            setErro("");
          }}
          disabled={busy}
          aria-describedby="outro-valor-form-hint"
        />
        <p id="outro-valor-form-hint" className="cb-outro-valor__field-hint">
          Obrigatorio para montar o link com o montante certo.
        </p>

        {erro ? (
          <p className="cb-outro-valor__erro" role="alert">
            {erro}
          </p>
        ) : null}

        <button
          type="submit"
          className="cb-outro-valor__submit"
          disabled={busy}
        >
          {busy ? "A abrir…" : "Gerar link de pagamento"}
        </button>
      </form>
  );
}
