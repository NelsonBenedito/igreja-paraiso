import type { Metadata } from "next";
import Image from "next/image";
import { PixCopyButton } from "./PixCopyButton";
import "./campus.css";

export const metadata: Metadata = {
  title: "Campus Paraíso | Projeto Cotas",
  description:
    "Conheca o projeto do novo Campus Paraiso, acompanhe as frentes em atividade e participe com cotas mensais.",
};

const COTAS_DESC = [
  "R$10.000,00",
  "R$ 6.000,00",
  "R$ 5.000,00",
  "R$ 3.000,00",
  "R$ 2.000,00",
  "R$ 1.000,00",
  "R$ 500,00",
  "R$ 400,00",
  "R$ 300,00",
  "R$ 200,00",
  "R$ 100,00",
  "R$ 50,00",
] as const;

export default function CotasCampusPage() {
  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de tirar uma dúvida sobre o projeto cotas para o Campus. ",
  );

  return (
    <main className="campus-page">
      <nav id="top">
        <a href="#top" className="nav-logo">
          Campus<span>.</span>Paraiso
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
            <a href="#pix">Pix</a>
          </li>
          <li>
            <a href="#contato" className="nav-btn">
              Participar
            </a>
          </li>
        </ul>
      </nav>

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
              <span className="cb-eyebrow cb-eyebrow--light">Cotas Campus Paraiso</span>
              <Image
                className="cb-hero-logo"
                src="/paraiso_logo_branca.png"
                alt="Igreja Paraiso"
                width={512}
                height={288}
                priority
              />
              <h1 className="sr-only">Campus Paraiso</h1>
              <p className="cb-hero-subtitle">
                Casa de Deus, minha família.
              </p>
              <a href="#cotas" className="cb-hero-cta">
                Quero participar das cotas
              </a>
            </div>
          </div>
          <div className="cb-hero-bar" aria-hidden />
        </section>

        {/* Grande bloco — Visão */}
        <section className="cb-slab" id="visao">
          <div className="cb-inner">
            <header className="cb-head cb-head--center">
              <span className="cb-eyebrow">Nossa missao</span>
              <h2 className="cb-title">Nossa Missao: Um Lugar para Todos</h2>
              <div className="cb-rule cb-rule--center" />
            </header>

            <div className="cb-intro-grid cb-intro-grid--center">
              <div className="cb-prose cb-prose--mission">
                <p>
                  Nossa igreja recebeu a missao de expandir o Reino de Deus por
                  meio desta visao. Queremos anunciar a salvacao em Cristo,
                  cuidar de pessoas e fortalecer familias com amor e
                  compromisso.
                </p>
                <p>
                  Com o novo campus, teremos melhores condicoes para realizar
                  missoes, acoes sociais, discipulado e servico com mais
                  qualidade, estrutura e alcance.
                </p>
                <p>
                  Cremos que Deus levanta semeadores para esta obra, e cada
                  contribuicao voluntaria e um ato de fidelidade que nos faz avançar
                  mais perto do nosso objetivo, servir com mais excelência!
                </p>
                <p>
                  <strong>
                    Nosso grande desafio e concluir a reforma e construção do
                    novo campus, preparado para receber mais almas e gerar um
                    legado espiritual para as proximas geracoes.
                  </strong>
                </p>
                <p>Entramos como igreja nessa missão. E isto é apenas o começo.</p>
              </div>

              <div className="cb-signature">
                <Image
                  className="cb-signature-photo"
                  src="/prevandro_praricele_without.png"
                  alt="Pr. Evandro e Pra. Ricelle"
                  width={992}
                  height={992}
                />
                <p className="cb-signature-name">PR. EVANDRO E PRA. RICELLE</p>
                <p className="cb-signature-role">
                  Pastores seniores da Igreja Paraiso
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Grande bloco — Projetos em atividade */}
        <section className="cb-slab" id="projetos">
          <div className="cb-inner">
          <header className="cb-head">
            <span className="cb-eyebrow">Projetos</span>
            <h2 className="cb-title">Projetos em atividade</h2>
            <p className="cb-subtitle">
              Quatro frentes prioritarias para conclusao do campus
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
                  Finalizacao do auditorio principal e areas comuns para
                  celebração e comunhão.
                </p>
              </div>
            </article>
            <article className="cb-project-card">
              <div className="cb-project-gallery">
                <Image
                  src="/nova-geracao/pic2.jpeg"
                  alt="Projeto Nova Geracao - familias reunidas"
                  width={700}
                  height={440}
                  sizes="(max-width: 768px) 50vw, 24vw"
                />
                <Image
                  src="/nova-geracao/pic3.jpeg"
                  alt="Projeto Nova Geracao - criancas em atividade"
                  width={700}
                  height={440}
                  sizes="(max-width: 768px) 50vw, 24vw"
                />
                <Image
                  src="/nova-geracao/pic4.jpeg"
                  alt="Projeto Nova Geracao - adolescentes em sala"
                  width={700}
                  height={440}
                  sizes="(max-width: 768px) 50vw, 24vw"
                />
                <Image
                  src="/nova-geracao/pic1.jpeg"
                  alt="Projeto Nova Geracao - jovens em discipulado"
                  width={700}
                  height={440}
                  sizes="(max-width: 768px) 50vw, 24vw"
                />
              </div>
              <div className="cb-project-copy">
                <h3>Projeto Nova Geracao</h3>
                <p>
                  Espacos dedicados e seguros para o desenvolvimento de criancas,
                  adolescentes e jovens.
                </p>
              </div>
            </article>
            <article className="cb-project-card">
              <div className="cb-project-gallery">
                <Image
                  src="/acomodacao/pic1.jpeg"
                  alt="Acomodacoes e chales - fachada principal"
                  width={700}
                  height={440}
                  sizes="(max-width: 768px) 50vw, 24vw"
                />
                <Image
                  src="/acomodacao/pic2.jpeg"
                  alt="Acomodacoes e chales - interior de quarto"
                  width={700}
                  height={440}
                  sizes="(max-width: 768px) 50vw, 24vw"
                />
                <Image
                  src="/acomodacao/pic5.jpeg"
                  alt="Acomodacoes e chales - area de convivencia"
                  width={700}
                  height={440}
                  sizes="(max-width: 768px) 50vw, 24vw"
                />
                <Image
                  src="/acomodacao/pic6.jpeg"
                  alt="Acomodacoes e chales - espaco de descanso"
                  width={700}
                  height={440}
                  sizes="(max-width: 768px) 50vw, 24vw"
                />
              </div>
              <div className="cb-project-copy">
                <h3>Acomodacões e Áreas Externas</h3>
                <p>
                  Áreas para receber irmãos e membros que vem de fora para
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

        {/* Grande bloco — Cotas */}
        <section className="cb-slab" id="cotas">
          <div className="cb-inner">
          <header className="cb-head">
            <span className="cb-eyebrow">Contribua</span>
            <h2 className="cb-title">Escolha sua Cota de Participacao</h2>
            <div className="cb-rule" />
          </header>

          <div className="cb-donate-split">
            <figure>
              <Image
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80"
                alt="Novo campus"
                width={600}
                height={400}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </figure>
            <div className="contribute-text">
              <div className="cb-prose">
                <p>
                  Ajude a construir o <strong>Novo Campus</strong> e deixe sua
                  marca na realização deste sonho! Sua doação e fidelidade,
                  independente do valor, é essencial para levarmos adiante este
                  projeto de transformação de vidas. Você pode escolher o valor
                  que deseja contribuir e a forma de pagamento que melhor se
                  adapta a você, com toda a comodidade e segurança. Faça parte
                  desta grande obra e ajude a impactar gerações!
                </p>
              </div>
              <p className="period-note">
                Plano de contribuicao em 12 meses. Os valores abaixo sao
                referencia de participacao <strong>por mes</strong>.
              </p>
              <div className="cotas-grid">
                {COTAS_DESC.map((label) => (
                  <a
                    key={label}
                    href="#pix"
                    className={
                      label === "R$ 500,00"
                        ? "cota-btn highlight"
                        : "cota-btn"
                    }
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Grande bloco — Pix */}
        <section className="cb-slab" id="pix">
          <div className="cb-inner">
          <header className="cb-head">
            <span className="cb-eyebrow">Doação</span>
            <h2 className="cb-title">Outro valor</h2>
            <p className="cb-subtitle">Pix — conta exclusiva do projeto</p>
            <div className="cb-rule" />
          </header>

          <div className="cb-pix-split">
            <div className="pix-text cb-pix-lines">
              <p>
                Para doar qualquer outro valor, utilize o{" "}
                <strong>Pix</strong> (e-mail abaixo ou QR Code) da conta
                exclusiva do projeto:
              </p>
              <p>
                <strong>Pix E-mail:</strong> projeto@visaodofuturo.com.br
              </p>
              <p>
                <strong>Pix Fone:</strong> (11) 95598-0601
              </p>
              <p>
                <strong>Itaú</strong> · Agência 0138 · CC: 19811-4
              </p>
              <p>
                <strong>CNPJ:</strong> 26.407.664/0001-63
              </p>
              <PixCopyButton />
            </div>
            <div className="pix-qr">
              <Image
                className="pix-qr-img"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/240px-QR_code_for_mobile_English_Wikipedia.svg.png"
                alt="QR Code Pix"
                width={160}
                height={160}
                sizes="160px"
                unoptimized
              />
              <p>Aponte a câmera do seu celular para o QR Code e doe via Pix</p>
            </div>
          </div>
          </div>
        </section>

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
              <p>
                <strong>WhatsApp: 5527998757008</strong>
                Segunda a sexta, em horario comercial
                <a
                  href={`https://wa.me/5527998757008?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar mensagem automatica
                </a>
              </p>
              <p>
                <strong>Sugestões e dúvidas</strong>
                <a href="mailto:secretariaibrejetiba@gmail.com">
                  secretariaibrejetiba@gmail.com
                </a>
              </p>
            </div>
            <div className="cb-contact-card">
              <p>
                <strong>Endereço</strong>
                End.: Rua Helmut Gums, 438, Virada, Santa Maria de Jetiba-ES,
                Brasil - 29.646-290. Complemento: Campus Paraiso
              </p>
              <p>
                <strong>Atendimento</strong>
                Segunda a sexta, das 8h as 17h
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
                  <a href="#cotas">Cotas por mes</a>
                </li>
                <li>
                  <a href="#pix">Pix</a>
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
              Campus<span className="cb-footer-dot">.</span>Paraiso
            </a>
            <p>
              © {new Date().getFullYear()} Campus Paraiso · Igreja Paraiso ·
              Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
