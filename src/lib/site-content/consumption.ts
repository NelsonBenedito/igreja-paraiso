/**
 * Mapa de consumo: o que o SITE lê do painel (o painel não conhece o site).
 * Espelhado em docs/consumo-do-painel.md; verificado por consumption.test.ts
 * contra a fixture do contrato. Ao usar um campo novo, declare-o aqui.
 */
export interface Consumption {
  /** Seção de `site-content`. */
  section: string;
  /** Campos lidos (em `items[]` para listas: use `itemFields`). */
  fields: string[];
  itemFields?: string[];
  /** Campos que o contrato manda mas o site NÃO usa hoje. */
  unused?: string[];
  /** Arquivos que renderizam a seção ([] = seção não exibida hoje). */
  files: string[];
  pages: string[];
}

export const SITE_CONTENT_CONSUMPTION: Consumption[] = [
  {
    section: "mission",
    fields: ["badge", "titlePart1", "titleHighlight", "titlePart2", "paragraph1", "paragraph2", "quote", "signature"],
    files: ["src/components/MissionSection.tsx"],
    pages: ["/"],
  },
  {
    section: "celulas",
    fields: ["badge", "titlePart1", "titleHighlight", "titlePart2", "paragraph1", "paragraph2", "verseText", "verseReference", "ctaLabel"],
    unused: ["ctaUrl"], // o link do CTA é a constante CELULAS_WHATSAPP_URL no componente
    files: ["src/components/CelulasSection.tsx"],
    pages: ["/"],
  },
  {
    section: "churches",
    fields: ["badge", "titlePart1", "titleHighlight", "intro"],
    itemFields: ["name", "location", "address", "image", "mapsUrl", "isHeadquarters"],
    files: ["src/components/Missions.tsx", "src/app/nossas-igrejas/page.tsx", "src/lib/contact/view.ts"],
    pages: ["/", "/nossas-igrejas", "/contato"],
  },
  {
    section: "pastors",
    fields: ["badge", "titlePart1", "titleHighlight", "intro"],
    itemFields: ["name", "image"],
    files: ["src/app/time-pastoral/page.tsx"],
    pages: ["/time-pastoral"],
  },
  {
    section: "giving",
    fields: ["badge", "titlePart1", "titleHighlight", "titlePart2", "intro", "pixKey", "bankName", "bankCode", "agency", "account", "holderName", "holderDocument"],
    files: ["src/components/OfertorioSection.tsx"],
    pages: ["/"],
  },
  {
    section: "contact",
    fields: ["phone", "email", "address", "tagline", "copyright", "youtubeUrl", "instagramUrl", "facebookUrl"],
    files: ["src/components/Footer.tsx", "src/lib/contact/view.ts"],
    pages: ["rodapé de todas as páginas", "/contato"],
  },
  {
    section: "youtube",
    fields: ["channelHandle", "sectionTitle"],
    files: ["src/components/LatestStream.tsx"],
    pages: ["/"],
  },
  // Não exibidas hoje (decisão do site, não do painel).
  { section: "visit", fields: [], files: [], pages: [] },
  { section: "ministries", fields: [], itemFields: [], files: [], pages: [] },
];
