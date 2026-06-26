import Link from "next/link";
import "./campus/campus.css";

export function CampaignNotFoundContent() {
  return (
    <main className="campus-page cotas-campaign-missing">
      <div className="cb-shell cotas-campaign-missing__shell">
        <section className="cb-slab cotas-campaign-missing__card">
          <h1 className="cotas-campaign-missing__title">Campanha não encontrada</h1>
          <p className="cotas-campaign-missing__text">
            Verifique o link e tente novamente.
          </p>
          <Link href="/" className="cotas-campaign-missing__link">
            Voltar ao início
          </Link>
        </section>
      </div>
    </main>
  );
}
