"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const MESES_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function parseValorReais(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  if (t === "") return null;
  const n = Number.parseFloat(t);
  if (!Number.isFinite(n) || n < 0.01) return null;
  return Math.round(n * 100) / 100;
}

export function OutroValorUnicoPanel() {
  const router = useRouter();
  const [plano, setPlano] = useState<"assinatura" | "unico">("unico");
  const [mesesAssinatura, setMesesAssinatura] = useState(12);
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
    setErro("");
    setBusy(true);
    const params = new URLSearchParams();
    params.set("valor", String(v));
    if (plano === "assinatura") {
      params.set("mensal", "true");
      params.set("meses", String(mesesAssinatura));
    } else {
      params.set("mensal", "false");
    }
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
        />
      </div>

      <div className="cb-outro-valor__block">
        <span className="cb-outro-valor__step">2</span>
        <p className="cb-outro-valor__simple-label" id="outro-valor-tipo-label">
          Como deseja pagar?
        </p>
        <div
          className="cb-outro-valor__choices"
          role="radiogroup"
          aria-labelledby="outro-valor-tipo-label"
        >
          <label
            className={
              plano === "unico"
                ? "cb-outro-valor__choice is-on"
                : "cb-outro-valor__choice"
            }
          >
            <input
              type="radio"
              name="modo-outro-valor"
              value="unico"
              checked={plano === "unico"}
              onChange={() => {
                setPlano("unico");
                setErro("");
              }}
            />
            <span className="cb-outro-valor__choice-title">Uma vez só</span>
            <span className="cb-outro-valor__choice-desc">
              Paga uma única vez o valor acima
            </span>
          </label>
          <label
            className={
              plano === "assinatura"
                ? "cb-outro-valor__choice is-on"
                : "cb-outro-valor__choice"
            }
          >
            <input
              type="radio"
              name="modo-outro-valor"
              value="assinatura"
              checked={plano === "assinatura"}
              onChange={() => {
                setPlano("assinatura");
                setErro("");
              }}
            />
            <span className="cb-outro-valor__choice-title">Todos os meses</span>
            <span className="cb-outro-valor__choice-desc">
              O mesmo valor, todos os meses (você escolhe quantos meses)
            </span>
          </label>
        </div>
      </div>

      {plano === "assinatura" ? (
        <div className="cb-outro-valor__block">
          <span className="cb-outro-valor__step">3</span>
          <label
            className="cb-outro-valor__simple-label"
            htmlFor="outro-valor-meses"
          >
            Por quantos meses?
          </label>
          <select
            id="outro-valor-meses"
            name="meses"
            className="cb-outro-valor__select cb-outro-valor__select--touch"
            value={mesesAssinatura}
            onChange={(e) => {
              setMesesAssinatura(Number.parseInt(e.target.value, 10));
              setErro("");
            }}
            disabled={busy}
          >
            {MESES_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "mês" : "meses"}
              </option>
            ))}
          </select>
        </div>
      ) : null}

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
