import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  billingTypeLabel,
  describePendingLink,
  formatCentsBRL,
  formatDateBR,
  paymentStatusLabel,
  statusTone,
  subscriptionStatusLabel,
} from "@/lib/donations/contributionsFormat";
import { fetchContributionsMe } from "@/lib/donations/contributionsServer";
import { CONTRIBUTOR_SESSION_COOKIE } from "@/lib/donations/contributorSession";
import { MSG_CONFIG } from "@/lib/donations/linkResponse";
import type { ContributionsMeResponse } from "@/lib/donations/types";
import { AcessoContribuicoesForm } from "./AcessoContribuicoesForm";
import "../campus/campus.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Minhas contribuições | Campus Paraíso",
  description: "Consulte suas contribuições para o Novo Campus.",
  robots: { index: false, follow: false },
};

const MSG_ERRO: Record<string, string> = {
  link: "Este link de acesso expirou ou já foi usado. Peça um novo abaixo.",
  sessao: "Seu acesso expirou. Informe o CPF para receber um novo link.",
};

type PageProps = {
  searchParams: Promise<{ erro?: string | string[] }>;
};

function Header({ subtitle }: { subtitle: string }) {
  return (
    <header className="cb-head">
      <span className="cb-eyebrow">Novo Campus</span>
      <h1 className="cb-title">Minhas contribuições</h1>
      <p className="cb-subtitle">{subtitle}</p>
      <div className="cb-rule" />
    </header>
  );
}

function BackLink() {
  return (
    <p className="cb-contrib__back">
      <Link href="/cotas/campus#cotas">← Voltar à campanha</Link>
    </p>
  );
}

function AccessView({ erro }: { erro?: string }) {
  const message = erro ? MSG_ERRO[erro] : undefined;
  return (
    <section className="cb-slab">
      <Header subtitle="Veja o que você já contribuiu, sem criar senha." />
      {message ? (
        <p className="cb-contrib__alert" role="alert">
          {message}
        </p>
      ) : null}
      <AcessoContribuicoesForm />
      <BackLink />
    </section>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  return <span className={`cb-contrib__badge cb-contrib__badge--${statusTone(status)}`}>{label}</span>;
}

function ContributionsView({ data }: { data: ContributionsMeResponse }) {
  const { payer, subscriptions, payments, pendingLink } = data;
  const firstName = payer.name.split(" ")[0];
  return (
    <section className="cb-slab">
      <div className="cb-contrib__top">
        <Header
          subtitle={
            firstName
              ? `Olá, ${firstName}! Estas são as suas contribuições.`
              : "Estas são as suas contribuições."
          }
        />
        <form action="/api/cotas/sair" method="post">
          <button type="submit" className="cb-contrib__text-btn cb-contrib__logout">
            Sair
          </button>
        </form>
      </div>

      {pendingLink ? (
        <div className="cb-outro-valor__aside cb-contrib__pending">
          <h2 className="cb-contrib__h2">Pagamento não concluído</h2>
          <p className="cb-contrib__line">
            {describePendingLink(pendingLink)} · gerado em {formatDateBR(pendingLink.createdAt)}
          </p>
          <a className="cotas-contribuir__cta-primary cb-contrib__cta" href={pendingLink.url}>
            Continuar pagamento
          </a>
        </div>
      ) : null}

      <h2 className="cb-contrib__h2">Assinaturas</h2>
      {subscriptions.length === 0 ? (
        <p className="cb-contrib__empty">Nenhuma assinatura encontrada.</p>
      ) : (
        <ul className="cb-contrib__list">
          {subscriptions.map((s, i) => (
            <li key={s.id || i} className="cb-contrib__item">
              <div className="cb-contrib__item-main">
                <span className="cb-contrib__value">{formatCentsBRL(s.valueCents)} por mês</span>
                <StatusBadge status={s.status} label={subscriptionStatusLabel(s.status)} />
              </div>
              <p className="cb-contrib__meta">
                {s.label ? `${s.label} · ` : ""}desde {formatDateBR(s.createdAt)}
                {s.currentPeriodEnd ? ` · até ${formatDateBR(s.currentPeriodEnd)}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="cb-contrib__h2">Últimos pagamentos</h2>
      {payments.length === 0 ? (
        <p className="cb-contrib__empty">Nenhum pagamento registrado ainda.</p>
      ) : (
        <ul className="cb-contrib__list">
          {payments.map((p, i) => (
            <li key={`${p.date}-${i}`} className="cb-contrib__item">
              <div className="cb-contrib__item-main">
                <span className="cb-contrib__value">{formatCentsBRL(p.valueCents)}</span>
                <StatusBadge status={p.status} label={paymentStatusLabel(p.status)} />
              </div>
              <p className="cb-contrib__meta">
                {formatDateBR(p.date)} · {billingTypeLabel(p.billingType)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="cb-contrib__help">
        Para alterar ou cancelar uma contribuição, fale com a secretaria da igreja.
        {payer.emailHint ? ` E-mail cadastrado: ${payer.emailHint}.` : ""}
      </p>
      <BackLink />
    </section>
  );
}

function MessageView({ title, body, retry }: { title: string; body: string; retry: boolean }) {
  return (
    <section className="cb-slab">
      <Header subtitle={title} />
      <p className="cb-contrib__alert" role="alert">
        {body}
      </p>
      {retry ? (
        <p className="cb-contrib__line">
          <Link href="/cotas/minhas-contribuicoes">Tentar novamente</Link>
        </p>
      ) : null}
      <BackLink />
    </section>
  );
}

export default async function MinhasContribuicoesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const erro = typeof params.erro === "string" ? params.erro : undefined;
  const sessionToken = (await cookies()).get(CONTRIBUTOR_SESSION_COOKIE)?.value;

  let content: ReactNode;
  if (!sessionToken) {
    content = <AccessView erro={erro} />;
  } else {
    const result = await fetchContributionsMe(sessionToken);
    if (result.kind === "unauthorized") {
      // Apagar cookie só é possível num Route Handler.
      redirect("/api/cotas/sair?motivo=expirada");
    }
    if (result.kind === "ok") {
      content = <ContributionsView data={result.data} />;
    } else if (result.kind === "config") {
      content = <MessageView title="Consulta indisponível" body={MSG_CONFIG} retry={false} />;
    } else {
      content = (
        <MessageView
          title="Não foi possível carregar"
          body="Tivemos uma instabilidade ao buscar suas contribuições. Tente novamente em alguns instantes."
          retry
        />
      );
    }
  }

  return (
    <main className="campus-page cb-contrib">
      <div className="cb-shell cb-contrib__shell">{content}</div>
    </main>
  );
}
