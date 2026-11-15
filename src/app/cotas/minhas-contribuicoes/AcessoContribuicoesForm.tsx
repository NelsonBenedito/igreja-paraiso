"use client";

import { type FormEvent, useState } from "react";
import { isValidCpf, maskCpf, onlyDigits } from "@/lib/donations/cpf";
import { accessLinkErrorMessage } from "@/lib/donations/linkResponse";
import { requestContributionsAccessLink } from "@/lib/donations/publicApi";

export const MSG_ACESSO_NEUTRO =
  "Se houver contribuições para este CPF, enviamos um link para o e-mail cadastrado.";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

/** Formulário de CPF → pede o link de acesso por e-mail (resposta sempre neutra). */
export function AcessoContribuicoesForm() {
  const [cpf, setCpf] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [erroCpf, setErroCpf] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const digits = onlyDigits(cpf);
    if (!isValidCpf(digits)) {
      setErroCpf("Informe um CPF válido.");
      return;
    }
    setErroCpf("");
    setStatus({ kind: "sending" });
    const outcome = await requestContributionsAccessLink(digits, window.location.origin);
    setStatus(
      outcome === "sent"
        ? { kind: "sent" }
        : { kind: "error", message: accessLinkErrorMessage(outcome) },
    );
  }

  if (status.kind === "sent") {
    return (
      <div className="cb-outro-valor__aside cb-contrib__form" role="status">
        <p className="cb-contrib__notice">{MSG_ACESSO_NEUTRO}</p>
        <p className="cb-outro-valor__field-hint">
          O link vale por 30 minutos. Não recebeu? Confira a caixa de spam ou{" "}
          <button
            type="button"
            className="cb-contrib__text-btn"
            onClick={() => setStatus({ kind: "idle" })}
          >
            peça de novo
          </button>
          .
        </p>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form className="cb-outro-valor__aside cb-contrib__form" onSubmit={handleSubmit} noValidate>
      <label className="cb-outro-valor__simple-label" htmlFor="acesso-cpf">
        CPF usado na contribuição
      </label>
      <input
        id="acesso-cpf"
        name="cpf"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="000.000.000-00"
        className="cb-outro-valor__input cb-outro-valor__input--touch"
        value={cpf}
        onChange={(e) => {
          setCpf(maskCpf(e.target.value));
          setErroCpf("");
        }}
        disabled={sending}
        aria-invalid={erroCpf ? true : undefined}
        aria-describedby="acesso-cpf-hint"
      />
      <p id="acesso-cpf-hint" className="cb-outro-valor__field-hint">
        Enviamos um link de acesso para o e-mail cadastrado no pagamento. Não é
        preciso criar senha.
      </p>
      {erroCpf ? (
        <p className="cb-outro-valor__erro" role="alert">
          {erroCpf}
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p className="cb-outro-valor__erro" role="alert">
          {status.message}
        </p>
      ) : null}
      <button type="submit" className="cb-outro-valor__submit" disabled={sending}>
        {sending ? "Enviando…" : "Receber link no e-mail"}
      </button>
    </form>
  );
}
