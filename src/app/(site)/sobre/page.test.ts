import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SITE_CONTENT_FALLBACK } from "@/lib/site-content/fallbacks";
import type { SiteSections } from "@/lib/site-content/types";

const getSiteContent = vi.fn<() => Promise<SiteSections>>();
vi.mock("@/lib/site-content/data", () => ({ getSiteContent: () => getSiteContent() }));

const { default: AboutPage } = await import("./page");

/** Pastores que ficavam fixos no código desta página antes de virem do painel. */
const NOMES_ANTES_FIXOS = [
  "Pr. Clétson Barros",
  "Pr. Leandro Hins de Brito",
  "Pr. Robson Jose Maria",
  "Pr. Tiago Pio",
  "Pr. Jheferson Marlo Marcal Rosa",
  "Pr. Herbert Neiva",
  "Pr. Cloves Souza",
];

async function render() {
  return renderToStaticMarkup(await AboutPage());
}

describe("/sobre — pastores e missões", () => {
  beforeEach(() => getSiteContent.mockReset());

  it("mostra os pastores publicados no painel", async () => {
    getSiteContent.mockResolvedValue({
      ...SITE_CONTENT_FALLBACK,
      pastors: {
        ...SITE_CONTENT_FALLBACK.pastors,
        items: [
          { name: "Pr. Ana do Painel", image: "https://pub-x.r2.dev/ana.jpg", active: true },
          { name: "Pr. Bruno do Painel", image: "", active: true },
        ],
      },
    });
    const html = await render();
    expect(html).toContain("Pr. Ana do Painel");
    expect(html).toContain("Pr. Bruno do Painel");
    for (const nome of NOMES_ANTES_FIXOS) expect(html).not.toContain(nome);
  });

  it("com a API fora (reserva) não mostra nenhum pastor fixo do código", async () => {
    getSiteContent.mockResolvedValue(SITE_CONTENT_FALLBACK);
    const html = await render();
    for (const nome of NOMES_ANTES_FIXOS) expect(html).not.toContain(nome);
    expect(html).toContain("Nenhum pastor disponível no momento.");
  });
});
