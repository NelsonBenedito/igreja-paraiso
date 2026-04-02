import type { Metadata } from "next";
import Image from "next/image";
import { PixCopyButton } from "./PixCopyButton";
import "./campus.css";

export const metadata: Metadata = {
  title: "Visão do Futuro — Novo Campus | Cotas",
  description:
    "Contribua com o Novo Campus: cotas, Pix e informações do projeto Visão do Futuro.",
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
  return (
    <main className="campus-page">
      <nav id="top">
        <a href="#top" className="nav-logo">
          Visão<span>.</span>Futuro
        </a>
        <ul className="nav-links">
          <li>
            <a href="#visao">A Visão</a>
          </li>
          <li>
            <a href="#projeto">Projeto</a>
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
          <Image
            className="hero-img"
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80"
            alt="Projeto Novo Campus"
            width={1600}
            height={520}
            sizes="(max-width: 1180px) 100vw, 1180px"
            priority
          />
          <div className="cb-hero-bar" aria-hidden />
        </section>

        {/* Grande bloco — Visão */}
        <section className="cb-slab" id="visao">
          <div className="cb-inner">
          <header className="cb-head">
            <span className="cb-eyebrow">Nossa missão</span>
            <h1 className="cb-title">
              A Visão do Futuro nasceu no coração de Deus para a nossa
              comunidade.
            </h1>
            <div className="cb-rule" />
          </header>

          <div className="cb-intro-grid">
            <p className="cb-intro-lead">
              Expandir o Reino de Deus, anunciar a salvação em Cristo e servir
              com excelência — com o espaço que o futuro da nossa igreja
              precisa.
            </p>
            <div className="cb-prose">
              <p>
                Nossa comunidade recebeu a missão de expandir o Reino de Deus
                através desta Visão de anunciar a salvação em Cristo Jesus a
                toda criatura. O Reino de Deus é chegado no Brasil e no mundo, e
                a nossa comunidade está totalmente envolvida neste grande
                avivamento.
              </p>
              <p>
                Com a Visão do Futuro teremos as condições necessárias para
                realizarmos ações de missões, serviço, amor e cuidado,
                excelência, salvação de vidas e ação social, com muito mais
                agilidade.
              </p>
              <p>
                Para que tudo isto se concretize necessitamos de pessoas como
                você, escolhidas por Deus, que contribuem voluntariamente para
                vencermos os desafios que envolvem os projetos da Visão do
                Futuro.
              </p>
              <p>
                <strong>
                  Nosso grande desafio é a reforma e inauguração do nosso novo
                  campus, com capacidade para mais de 1.800 pessoas por culto,
                  incluindo a linda área infantil.
                </strong>
              </p>
              <p>Você faz parte desta grandiosa missão! E isto é só o começo!</p>

              <div className="cb-card cb-card--accent">
                <p className="cb-card-name">Pastores seniores</p>
                <p className="cb-card-role">
                  Liderança da comunidade — Igreja Paraíso
                </p>
              </div>
            </div>
          </div>
        </div>
        </section>

        {/* Grande bloco — Projeto / galeria */}
        <section className="cb-slab" id="projeto">
          <div className="cb-inner">
          <header className="cb-head">
            <span className="cb-eyebrow">Projeto</span>
            <h2 className="cb-title">Apresentação do projeto</h2>
            <p className="cb-subtitle">Local do futuro campus</p>
            <div className="cb-rule" />
          </header>

          <div className="cb-gallery-wrap">
            <div className="gallery-grid">
              <Image
                className="wide"
                src="https://images.unsplash.com/photo-1585577685870-4c399b8c9e9c?w=900&q=80"
                alt="Fachada"
                width={900}
                height={600}
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <Image
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80"
                alt="Interior"
                width={600}
                height={400}
                sizes="(max-width: 768px) 100vw, 30vw"
              />
              <Image
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80"
                alt="Auditório"
                width={600}
                height={400}
                sizes="(max-width: 768px) 100vw, 30vw"
              />
              <Image
                className="wide"
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80"
                alt="Vista geral"
                width={900}
                height={600}
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <Image
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80"
                alt="Espaço"
                width={600}
                height={400}
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>
          </div>
          </div>
        </section>

        {/* Grande bloco — Cotas */}
        <section className="cb-slab" id="cotas">
          <div className="cb-inner">
          <header className="cb-head">
            <span className="cb-eyebrow">Contribua</span>
            <h2 className="cb-title">Contribua com esse sonho</h2>
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
                O período de doações do projeto é de 12 meses. Escolha abaixo
                com qual valor mensal você deseja participar.
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
            <h2 className="cb-title">Entre em contato</h2>
            <div className="cb-rule cb-rule--sky" />
          </header>

          <div className="cb-contact-grid">
            <div className="cb-contact-card">
              <p>
                <strong>(11) 96452-8525 (WhatsApp)</strong>
                De segunda a sexta, em horário comercial
              </p>
              <p>
                <strong>Sugestões e dúvidas</strong>
                <a href="mailto:projeto@visaodofuturo.com.br">
                  projeto@visaodofuturo.com.br
                </a>
              </p>
            </div>
            <div className="cb-contact-card">
              <p>
                <strong>Endereço</strong>
                São Paulo, SP — Brasil
              </p>
              <p>
                <strong>Atendimento</strong>
                Segunda a sexta, 9h às 18h
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
                  <a href="#projeto">Apresentação</a>
                </li>
                <li>
                  <a href="#cotas">Cotas mensais</a>
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
                    href="https://wa.me/5511964528525"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:projeto@visaodofuturo.com.br">E-mail</a>
                </li>
              </ul>
            </div>
            <div className="cb-footer-col">
              <h4>Contato</h4>
              <ul>
                <li>
                  <a href="tel:+5511964528525">(11) 96452-8525</a>
                </li>
                <li>
                  <span className="cb-footer-note">São Paulo, SP</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="cb-footer-bottom">
            <a href="#top" className="nav-logo cb-footer-brand">
              Visão<span className="cb-footer-dot">.</span>Futuro
            </a>
            <p>
              © {new Date().getFullYear()} Visão do Futuro · Igreja Paraíso ·
              Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
