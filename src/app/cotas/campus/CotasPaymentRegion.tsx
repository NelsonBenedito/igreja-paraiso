"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useMemo, useState } from "react";
import { CotasIntentPanel } from "./CotasIntentPanel";
import { OutroValorUnicoPanel } from "./OutroValorUnicoPanel";

function onlyDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

function formatCpf(raw: string): string {
  const digits = onlyDigits(raw).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  const nums = digits.split("").map((c) => Number.parseInt(c, 10));
  const calc = (size: number) => {
    let sum = 0;
    for (let i = 0; i < size; i += 1) sum += nums[i] * (size + 1 - i);
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };
  return calc(9) === nums[9] && calc(10) === nums[10];
}

export function CotasPaymentRegion() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");

  const donorName = name.trim();
  const donorCpf = onlyDigits(cpf);
  const validName = donorName.length >= 3;
  const validCpf = isValidCpf(donorCpf);
  const isIdentityValid = validName && validCpf;

  const identityHint = useMemo(() => {
    if (isIdentityValid) return null;
    if (!validName) return "Informe o nome completo para continuar.";
    if (!validCpf) return "Informe um CPF valido para continuar.";
    return null;
  }, [isIdentityValid, validCpf, validName]);

  return (
    <div className="cb-payment-region flex flex-col gap-6" id="pagamento">
      <Card>
        <CardHeader>
          <CardTitle>Identificacao do contribuinte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cotas-donor-name">Nome completo</Label>
              <Input
                id="cotas-donor-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Ex.: Maria Silva"
                aria-invalid={name.length > 0 && !validName}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cotas-donor-cpf">CPF</Label>
              <Input
                id="cotas-donor-cpf"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                inputMode="numeric"
                placeholder="000.000.000-00"
                aria-invalid={cpf.length > 0 && !validCpf}
              />
            </div>
          </div>
          {identityHint ? (
            <p className="mt-3 text-sm text-muted-foreground" role="status">
              {identityHint}
            </p>
          ) : null}
        </CardContent>
      </Card>

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
              <CotasIntentPanel
                donorName={donorName}
                donorCpf={donorCpf}
                isIdentityValid={isIdentityValid}
              />
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
              <OutroValorUnicoPanel
                donorName={donorName}
                donorCpf={donorCpf}
                isIdentityValid={isIdentityValid}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
