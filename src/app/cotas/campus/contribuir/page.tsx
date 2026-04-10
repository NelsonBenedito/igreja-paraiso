import type { Metadata } from "next";
import { Suspense } from "react";
import { ContribuirRedirectClient } from "./ContribuirRedirectClient";
import "../campus.css";

export const metadata: Metadata = {
  title: "Contribuir | Campus Paraíso",
  description: "Redirecionamento seguro para o pagamento das cotas do campus.",
  robots: { index: false, follow: false },
};

function ContribuirFallback() {
  return (
    <main className="campus-page cotas-contribuir">
      <div className="cb-shell cotas-contribuir__shell">
        <h1 className="cotas-contribuir__title">A preparar o pagamento</h1>
        <p className="cotas-contribuir__sub">
          Estamos abrindo a pagina segura do parceiro financeiro. Aguarde um
          instante.
        </p>
        <div className="cotas-contribuir__spinner" aria-hidden />
        <p className="cotas-contribuir__sub">Isso costuma levar poucos segundos.</p>
      </div>
    </main>
  );
}

export default function CotasCampusContribuirPage() {
  return (
    <Suspense fallback={<ContribuirFallback />}>
      <ContribuirRedirectClient />
    </Suspense>
  );
}
