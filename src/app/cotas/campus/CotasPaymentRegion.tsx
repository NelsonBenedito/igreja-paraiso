"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { normalizeIdentity } from "@/lib/donations/contribuirPayload";
import { maskCpf } from "@/lib/donations/cpf";
import { MINHAS_CONTRIBUICOES_PATH } from "@/lib/donations/publicApi";
import { CotasIntentPanel } from "./CotasIntentPanel";
import { OutroValorUnicoPanel } from "./OutroValorUnicoPanel";

export function CotasPaymentRegion() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");

  const identity = normalizeIdentity(name, cpf);
  const hasIdentityInput = name.length > 0 || cpf.length > 0;

  return (
    <div className="cb-payment-region" id="pagamento">
      <section className="cb-slab" id="cotas">
        <div className="cb-inner">
          <header className="cb-head">
            <span className="cb-eyebrow">Contribua</span>
            <h2 className="cb-title">Escolha sua Cota de Participacao</h2>
            <div className="cb-rule" />
          </header>

          <div className="cb-donate-split">
            <figure className="cb-donate-split__figure">
              <Image
                src="/ConferenciaDeFamilias.jpg"
                alt="Novo campus"
                fill
                className="cb-donate-split__figure-img"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </figure>
            <div className="contribute-text">
              <div className="cb-prose">
                <p>
                  Ajude a construir o <strong>Novo Campus</strong> e deixe sua marca
                  na realização deste sonho! Sua doação e fidelidade,
                  independente do valor, é essencial para levarmos adiante este
                  projeto de transformação de vidas. Você pode escolher o valor
                  que deseja contribuir e a forma de pagamento que melhor se
                  adapta a você, com toda a comodidade e segurança. Faça parte
                  desta grande obra e ajude a impactar gerações!
                </p>
              </div>

              <div
                className="cb-outro-valor__aside cb-identity"
                id="quem-contribui"
                role="group"
                aria-labelledby="quem-contribui-titulo"
              >
                <div className="cb-identity__head">
                  <h3 className="cb-identity__title" id="quem-contribui-titulo">
                    Quem está contribuindo?
                  </h3>
                  <Link className="cb-identity__link" href={MINHAS_CONTRIBUICOES_PATH}>
                    Minhas contribuições
                  </Link>
                </div>
                <p className="cb-outro-valor__field-hint">
                  Vale para as cotas e para outro valor. Usamos o CPF só para
                  identificar sua contribuição.
                </p>
                <div className="cb-identity__fields">
                  <div className="cb-outro-valor__block">
                    <label className="cb-outro-valor__simple-label" htmlFor="contribuinte-nome">
                      Nome completo
                    </label>
                    <input
                      id="contribuinte-nome"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Ex.: Maria Silva"
                      className="cb-outro-valor__input cb-outro-valor__input--touch"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="cb-outro-valor__block">
                    <label className="cb-outro-valor__simple-label" htmlFor="contribuinte-cpf">
                      CPF
                    </label>
                    <input
                      id="contribuinte-cpf"
                      name="cpf"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="000.000.000-00"
                      className="cb-outro-valor__input cb-outro-valor__input--touch"
                      value={cpf}
                      onChange={(e) => setCpf(maskCpf(e.target.value))}
                    />
                  </div>
                </div>
                {hasIdentityInput && !identity ? (
                  <p className="cb-outro-valor__erro" role="status">
                    Preencha nome completo e um CPF válido para continuar.
                  </p>
                ) : null}
              </div>

              <CotasIntentPanel identity={identity} />
            </div>
          </div>
        </div>
      </section>

      <section className="cb-slab" id="outro-valor">
        <div className="cb-inner">
          <header className="cb-head cb-head--center">
            <span className="cb-eyebrow">Doação</span>
            <h2 className="cb-title">Outro valor</h2>
            <p className="cb-subtitle">
              Digite o valor mensal e por quantos meses deseja contribuir
            </p>
            <div className="cb-rule cb-rule--center" />
          </header>

          <div className="cb-intro-grid cb-intro-grid--center">
            <div className="cb-prose cb-prose--mission cb-prose--outro-valor-simple">
              <p>
                Preencha o formulário abaixo: indique o <strong>valor</strong> em
                reais e, em seguida, por <strong>quantos meses</strong> (de 1 a 12)
                quer manter a assinatura mensal com esse valor. Por fim, clique no
                botão verde para ir ao pagamento seguro.
              </p>
            </div>

            <div className="cb-outro-valor__form-wrap">
              <OutroValorUnicoPanel identity={identity} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
