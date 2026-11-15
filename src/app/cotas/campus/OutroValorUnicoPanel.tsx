"use client";

import { Info } from "lucide-react";
import {
  type ContribuinteIdentity,
  MAX_MESES_CAMPUS as MESES_MAX_CAMPUS,
  MSG_STORAGE_BLOQUEADO,
  buildContribuirQuery,
  getSessionStorage,
  saveIdentity,
} from "@/lib/donations/contribuirPayload";
import { MIN_PAYMENT_LINK_VALUE_BRL } from "@/lib/donations/minPaymentValue";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const MSG_IDENTIDADE_PENDENTE =
  "Preencha nome e CPF em “Quem está contribuindo?” para continuar.";

type OutroValorUnicoPanelProps = {
  /** Identidade válida do bloco "Quem está contribuindo?"; `null` desabilita o envio. */
  identity: ContribuinteIdentity | null;
};

function parseValorReais(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  if (t === "") return null;
  const n = Number.parseFloat(t);
  if (!Number.isFinite(n) || n < 0.01) return null;
  return Math.round(n * 100) / 100;
}

export function OutroValorUnicoPanel({ identity }: OutroValorUnicoPanelProps) {
  const router = useRouter();
  const [mesesStr, setMesesStr] = useState("1");
  const [valorTexto, setValorTexto] = useState("");
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState("");

  function handleGerarLink(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!identity) {
      setErro(MSG_IDENTIDADE_PENDENTE);
      return;
    }
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

    if (!saveIdentity(getSessionStorage(), identity)) {
      setErro(MSG_STORAGE_BLOQUEADO);
      return;
    }

    setErro("");
    setBusy(true);
    router.push(`/cotas/campus/contribuir?${buildContribuirQuery(v, m)}`);
  }

  const valorParsed = useMemo(() => parseValorReais(valorTexto), [valorTexto]);
  const abaixoDoMinimo =
    valorParsed !== null && valorParsed < MIN_PAYMENT_LINK_VALUE_BRL;
  const erroRelacionadaAValor = erro.length > 0 && (valorParsed === null || abaixoDoMinimo);

  const valorFieldDescribedBy = [
    ...(erroRelacionadaAValor ? ["outro-valor-min-hint"] : []),
    ...(abaixoDoMinimo ? ["outro-valor-abaixo-msg"] : []),
  ].join(" ");

  return (
    <form
      className="cb-outro-valor__aside cb-outro-valor__aside--simple"
      onSubmit={handleGerarLink}
      noValidate
    >
      <div className="cb-outro-valor__block">
        <span className="cb-outro-valor__step">1</span>
        <label className="cb-outro-valor__simple-label" htmlFor="outro-valor-campo">
          Valor em reais (R$)
        </label>
        {erroRelacionadaAValor ? (
          <div className="cb-outro-valor__aviso" role="note">
            <Info className="cb-outro-valor__aviso-icon" aria-hidden strokeWidth={2} />
            <p className="cb-outro-valor__aviso-text">
              Para <strong>gerar o link de pagamento</strong>, indique pelo menos{" "}
              <strong>
                R$ {MIN_PAYMENT_LINK_VALUE_BRL.toFixed(2).replace(".", ",")} por mês
              </strong>{" "}
              (exigência do sistema de pagamentos).
            </p>
          </div>
        ) : null}
        <input
          id="outro-valor-campo"
          name="valor"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="Ex.: 50 ou 200"
          className={
            abaixoDoMinimo
              ? "cb-outro-valor__input cb-outro-valor__input--touch cb-outro-valor__input--warn"
              : "cb-outro-valor__input cb-outro-valor__input--touch"
          }
          value={valorTexto}
          onChange={(e) => {
            setValorTexto(e.target.value);
            setErro("");
          }}
          disabled={busy}
          aria-invalid={abaixoDoMinimo}
          aria-describedby={valorFieldDescribedBy}
        />
        {abaixoDoMinimo ? (
          <p
            id="outro-valor-abaixo-msg"
            className="cb-outro-valor__aviso-live"
            role="status"
          >
            Este valor ainda não permite criar o link. Indique pelo menos{" "}
            R$ {MIN_PAYMENT_LINK_VALUE_BRL.toFixed(2).replace(".", ",")} ou mais.
          </p>
        ) : null}
        {erroRelacionadaAValor ? (
          <p id="outro-valor-min-hint" className="cb-outro-valor__field-hint">
            Valores como 5, 10 ou 50 são aceitos; centavos podem ser usados (ex.: 5,50).
          </p>
        ) : null}
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
          Cada mês, o mesmo valor que você indicou acima. Escolha só 1 mês para pagamento único ou recorrência
          mensal até {MESES_MAX_CAMPUS}.
        </p>
      </div>

      {erro ? (
        <p className="cb-outro-valor__erro" role="alert">
          {erro}
        </p>
      ) : !identity ? (
        <p className="cb-outro-valor__field-hint">
          Preencha nome e CPF em{" "}
          <a className="cb-identity__inline-link" href="#quem-contribui">
            Quem está contribuindo?
          </a>{" "}
          para continuar.
        </p>
      ) : null}

      <button
        type="submit"
        className="cb-outro-valor__submit cb-outro-valor__submit--touch"
        disabled={busy || abaixoDoMinimo || !identity}
        title={
          !identity
            ? "Preencha nome e CPF para continuar"
            : abaixoDoMinimo
            ? `Indique pelo menos R$ ${MIN_PAYMENT_LINK_VALUE_BRL.toFixed(2).replace(".", ",")} por mês para continuar`
            : undefined
        }
      >
        {busy ? "Abrindo…" : "Continuar para pagar"}
      </button>
    </form>
  );
}
