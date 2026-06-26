import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { CampusPagamentoObrigado } from "./CampusPagamentoObrigado";
import { CotasPaymentRegion } from "./CotasPaymentRegion";
import "./campus.css";

export const metadata: Metadata = {
  title: "Campus Paraíso | Projeto Cotas",
  description:
    "Conheça o projeto do novo Campus Paraíso, acompanhe as frentes em atividade e participe com cotas mensais.",
};

export default function CotasCampusPage() {
  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de tirar uma dúvida sobre o projeto cotas para o Campus. ",
  );

  return (
    <main className="campus-page">
      <nav id="top">
        <a href="#top" className="nav-logo">
          <Image
            className="nav-logo-img"
            src="/paraiso_logo_branca.png"
            alt="Campus Paraíso — início"
            width={200}
            height={113}
            priority
          />
        </a>
        <ul className="nav-links">
          <li>
            <a href="#visao">A Visão</a>
          </li>
          <li>
            <a href="#projetos">Projetos</a>
          </li>
          <li>
            <a href="#cotas">Cotas</a>
          </li>
          <li>
            <a href="#outro-valor">Outro valor</a>
          </li>
          <li>
            <a href="#contato" className="nav-btn">
              Participar
            </a>
          </li>
        </ul>
      </nav>

      <Suspense fallback={null}>
        <CampusPagamentoObrigado />
      </Suspense>

      <div className="cb-shell">
        <section className="cb-slab cb-slab--hero" aria-label="Destaque do projeto">
          <div className="cb-hero-media">
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/ConferenciaDeFamilias.jpg"
            >
              <source src="/video_campus.MP4" type="video/mp4" />
            </video>
            <div className="cb-hero-overlay" aria-hidden />
            <div className="cb-hero-content">
              <Image
                className="cb-hero-logo"
                src="/paraiso_logo_branca.png"
                alt="Igreja Paraiso"
                width={512}
                height={288}
                priority
              />
              <h1 className="sr-only">Campus Paraíso</h1>
              <a href="#cotas" className="cb-hero-cta">
                Quero participar das cotas
              </a>
            </div>
          </div>
          <div className="cb-hero-bar" aria-hidden />
        </section>

        <CotasPaymentRegion />

        {/* Grande bloco — Visão */}
        <section className="cb-slab" id="visao">
          <div className="cb-inner">
            <header className="cb-head cb-head--center">
              <span className="cb-eyebrow">Nossa missão</span>
              <h2 className="cb-title">Nossa Missão: Um Lugar para Todos</h2>
              <div className="cb-rule cb-rule--center" />
            </header>

            <div className="cb-intro-grid cb-intro-grid--center">
              <div className="cb-prose cb-prose--mission">
                <p>
                  Nossa igreja recebeu a missão de expandir o Reino de Deus por
                  meio desta visão. Queremos anunciar a salvação em Cristo,
                  cuidar de pessoas e fortalecer famílias com amor e
                  compromisso.
                </p>
                <p>
                  Com o novo campus, teremos melhores condições para realizar
                  missões, ações sociais, discipulado e serviço com mais
                  qualidade, estrutura e alcance.
                </p>
                <p>
                  Cremos que Deus levanta semeadores para esta obra, e cada
                  contribuição voluntária é um ato de fidelidade que nos faz avançar
                  mais perto do nosso objetivo, servir com mais excelência!
                </p>
                <p>
                  <strong>
                    Nosso grande desafio é concluir a reforma e construção do
                    novo campus, preparado para receber mais almas e gerar um
                    legado espiritual para as próximas gerações.
                  </strong>
                </p>
                <p>Entramos como igreja nessa missão. E isto é apenas o começo.</p>
              </div>

              <div className="cb-signature">
                {/* <Image
                  className="cb-signature-photo"
                  src="/prevandro_praricele_without.png"
                  alt="Pr. Evandro e Pra. Ricelle"
                  width={992}
                  height={992}
                /> */}
                <p className="cb-signature-name">PR. EVANDRO E PRA. RICELLE</p>
                <p className="cb-signature-role">
                  Pastores seniores da Igreja Paraíso
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="cb-slab cb-slab--pay-return">
          <div className="cb-inner">
            <div
              className="cb-pay-return"
              role="region"
              aria-labelledby="pay-return-title"
            >
              <h2 id="pay-return-title" className="cb-pay-return__title">
                Contribuir com as cotas
              </h2>
              <p className="cb-pay-return__hint">
                <span>
                  Tudo o que viveremos neste novo campus
                  começa com o que o Senhor tem nos direcionado e nós assim o fazemos, juntos.
                  Se você deseja fazer parte deste projeto, pode contribuir com o valor que Deus colocar em seu coração,
                  é só clicar no botão abaixo.</span>
              </p>
              <a href="#cotas" className="cb-hero-cta cb-pay-return__cta">
                Contribuir
              </a>
            </div>
          </div>
        </div>
        {/* Grande bloco — Projetos em atividade */}
        <section className="cb-slab" id="projetos">
          <div className="cb-inner">
            <header className="cb-head">
              <span className="cb-eyebrow">Projetos</span>
              <h2 className="cb-title">Projetos em atividade</h2>
              <p className="cb-subtitle">
                Quatro frentes prioritárias para conclusão do campus
              </p>
              <div className="cb-rule" />
            </header>

            <div className="cb-projects-grid">
              <article className="cb-project-card">
                <div className="cb-project-gallery">
                  <Image
                    src="/templo/templo.jpeg"
                    alt="Infraestrutura do templo - planta e planejamento"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                  <Image
                    src="/templo/templo2.jpeg"
                    alt="Infraestrutura do templo - estrutura externa"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                </div>
                <div className="cb-project-copy">
                  <h3>Infraestrutura do Templo</h3>
                  <p>
                    Finalização do auditório principal e áreas comuns para
                    celebração e comunhão.
                  </p>
                </div>
              </article>
              <article className="cb-project-card">
                <div className="cb-project-gallery">
                  <Image
                    src="/nova-geracao/pic2.jpeg"
                    alt="Área Geracional - famílias reunidas"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                  <Image
                    src="/nova-geracao/pic5.jpeg"
                    alt="Área Geracional - crianças em atividade"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                  <Image
                    src="/nova-geracao/pic4.jpeg"
                    alt="Área Geracional - adolescentes em sala"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                  <Image
                    src="/nova-geracao/pic1.jpeg"
                    alt="Área Geracional - jovens em discipulado"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                </div>
                <div className="cb-project-copy">
                  <h3>Área Geracional</h3>
                  <p>
                    Espaços dedicados e seguros para o desenvolvimento de crianças,
                    adolescentes e jovens.
                  </p>
                </div>
              </article>
              <article className="cb-project-card">
                <div className="cb-project-gallery">
                  <Image
                    src="/acomodacao/pic1.jpeg"
                    alt="Acomodações e chalés - fachada principal"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                  <Image
                    src="/acomodacao/pic2.jpeg"
                    alt="Acomodações e chalés - interior de quarto"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                  <Image
                    src="/acomodacao/pic5.jpeg"
                    alt="Acomodações e chalés - área de convivência"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                  <Image
                    src="/acomodacao/pic6.jpeg"
                    alt="Acomodações e chalés - espaço de descanso"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                </div>
                <div className="cb-project-copy">
                  <h3>Acomodações e Áreas Externas</h3>
                  <p>
                    Áreas para receber irmãos e membros que vêm de fora para
                    retiros, eventos e celebrações.
                  </p>
                </div>
              </article>
              <article className="cb-project-card">
                <div className="cb-project-gallery">
                  <Image
                    src="/getsemani/pic2.jpeg"
                    alt="Jardim Getsemani - paisagem natural"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                  <Image
                    src="/getsemani/pic4.jpeg"
                    alt="Jardim Getsemani - area arborizada"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                  <Image
                    src="/getsemani/pic5.jpeg"
                    alt="Jardim Getsemani - trilha para oracao"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                  <Image
                    src="/getsemani/pic9.jpeg"
                    alt="Jardim Getsemani - ambiente de contemplacao"
                    width={700}
                    height={440}
                    sizes="(max-width: 768px) 50vw, 24vw"
                  />
                </div>
                <div className="cb-project-copy">
                  <h3>Jardim Getsemani</h3>
                  <p>
                    Área arborizada e tranquila dedicada a oração e contemplação.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <div className="cb-slab cb-slab--pay-return">
          <div className="cb-inner">
            <div
              className="cb-pay-return"
              role="region"
              aria-labelledby="pay-return-title-after-projetos"
            >
              <h2
                id="pay-return-title-after-projetos"
                className="cb-pay-return__title"
              >
                Contribuir com as cotas
              </h2>
              <p className="cb-pay-return__hint">
                <span>
                  Tudo o que viveremos neste novo campus
                  começa com o que o Senhor tem nos direcionado e nós assim o fazemos, juntos.
                  Se você deseja fazer parte deste projeto, pode contribuir com o valor que Deus colocar em seu
                  seu coração, é só clicar no botão abaixo.</span>
              </p>
              <a href="#cotas" className="cb-hero-cta cb-pay-return__cta">
                Contribuir
              </a>
            </div>
          </div>
        </div>

        {/* Grande bloco — Contato */}
        <section className="cb-slab cb-slab--navy" id="contato">
          <div className="cb-inner">
            <header className="cb-head">
              <span className="cb-eyebrow cb-eyebrow--light">Fale conosco</span>
              <h2 className="cb-title">Fale Conosco</h2>
              <div className="cb-rule cb-rule--sky" />
            </header>

            <div className="cb-contact-grid">
              <div className="cb-contact-card">
                <div className="cb-contact-wa">
                  <strong className="cb-contact-wa__label">Telefone</strong>
                  <span className="cb-contact-wa__num">+55 (27) 99875-7008</span>
                  <a
                    className="cb-contact-wa-btn"
                    href={`https://wa.me/5527998757008?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Conversar no WhatsApp
                  </a>
                </div>
                <p>
                  <strong>E-mail</strong>
                  <a href="mailto:secretariaibrejetiba@gmail.com">
                    secretariaibrejetiba@gmail.com
                  </a>
                </p>
              </div>
              <div className="cb-contact-card">
                <p>
                  <strong>Endereço do Campus Paraíso</strong>
                  Rua Helmut Gums, 438, Virada, Santa Maria de Jetibá-ES <br />
                  Brasil - 29.646-290 <br />
                </p>
                <p>
                  <strong>Atendimento</strong>
                  Segunda a sexta, das 8h às 17h
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Rodapé em largura total (fora dos blocos) */}
      <footer className="cb-footer-full">
        <div className="cb-inner">
          <div className="cb-footer-grid">
            <div className="cb-footer-col">
              <h4>Projeto</h4>
              <ul>
                <li>
                  <a href="#visao">A Visão</a>
                </li>
                <li>
                  <a href="#projetos">Projetos em atividade</a>
                </li>
                <li>
                  <a href="#cotas">Cotas por mês</a>
                </li>
                <li>
                  <a href="#outro-valor">Outro valor</a>
                </li>
              </ul>
            </div>
            <div className="cb-footer-col">
              <h4>Navegação</h4>
              <ul>
                <li>
                  <a href="/">Início</a>
                </li>
                <li>
                  <a href="#contato">Participar</a>
                </li>
                <li>
                  <a href="#top">Voltar ao topo</a>
                </li>
              </ul>
            </div>
            <div className="cb-footer-col">
              <h4>Conecte-se</h4>
              <ul>
                <li>
                  <a
                    href={`https://wa.me/5527998757008?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:secretariaibrejetiba@gmail.com">E-mail</a>
                </li>
              </ul>
            </div>
            <div className="cb-footer-col">
              <h4>Contato</h4>
              <ul>
                <li>
                  <a href="tel:+5527998757008">(27) 99875-7008</a>
                </li>
                <li>
                  <span className="cb-footer-note">Santa Maria de Jetiba, ES</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="cb-footer-bottom">
            <a href="#top" className="nav-logo cb-footer-brand">
              Campus<span className="cb-footer-dot">.</span>Paraíso
            </a>
            <p>
              © {new Date().getFullYear()} Campus Paraíso · Igreja Paraíso ·
              Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
