/**
 * DTOs do conteúdo institucional do site — espelham o contrato público
 * `GET /api/public/tenants/:slug/site-content` do ChurchManager (SiteModule).
 *
 * Garantias da API (ver doc):
 *  1. As 9 secções existem sempre.
 *  2. Todos os campos de cada secção existem sempre (merge sobre defaults).
 *  3. As listas já vêm filtradas por `active: true` nesta rota.
 * O que NÃO é garantido: strings podem vir vazias ("") — tratar como
 * "não mostrar esta linha", não como erro.
 */

/** Nomes de ícone válidos (enum fechado, validado na escrita pela API). */
export type SiteIconName =
  | "Heart"
  | "Users"
  | "BookOpen"
  | "MapPin"
  | "Music"
  | "Church"
  | "Calendar"
  | "Star"
  | "Sparkles"
  | "HandHeart"
  | "Baby"
  | "Flame"
  | "Globe"
  | "Phone"
  | "Mail";

/** Secção `mission` — Missão / Sobre. */
export interface SiteMission {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  paragraph1: string;
  paragraph2: string;
  quote: string;
  signature: string;
}

/** Benefício de célula (`celulas.benefits[]`). */
export interface SiteCelulasBenefit {
  icon: SiteIconName;
  titulo: string;
  descricao: string;
}

/** Secção `celulas` — Células. */
export interface SiteCelulas {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  paragraph1: string;
  paragraph2: string;
  verseText: string;
  verseReference: string;
  benefits: SiteCelulasBenefit[];
  ctaLabel: string;
  ctaUrl: string;
}

/** Secção `visit` — Venha nos visitar. `address` e `hours` são multilinha (`\n`). */
export interface SiteVisit {
  titlePart1: string;
  titleHighlight: string;
  backgroundImage: string;
  addressTitle: string;
  address: string;
  hoursTitle: string;
  hours: string;
  mapsUrl: string;
}

/** Item de igreja (`churches.items[]`). */
export interface SiteChurch {
  name: string;
  location: string;
  address: string;
  pastor: string;
  image: string;
  mapsUrl: string;
  /** Usar isto para identificar a sede — não a posição no array. */
  isHeadquarters: boolean;
  active: boolean;
}

/** Secção `churches` — Igrejas & Missões. */
export interface SiteChurches {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  intro: string;
  items: SiteChurch[];
}

/** Item de pastor (`pastors.items[]`). */
export interface SitePastor {
  name: string;
  role: string;
  location: string;
  image: string;
  /** Nome (texto) da igreja — deve bater com `churches.items[].name`. */
  church: string;
  active: boolean;
}

/** Secção `pastors` — Time Pastoral. */
export interface SitePastors {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  intro: string;
  items: SitePastor[];
}

/** Item de ministério (`ministries.items[]`). */
export interface SiteMinistry {
  name: string;
  description: string;
  icon: SiteIconName;
  image: string;
  active: boolean;
}

/** Secção `ministries` — Ministérios (só lista). */
export interface SiteMinistries {
  items: SiteMinistry[];
}

/**
 * Secção `giving` — Ofertório.
 * ⚠️ `account` e `holderDocument` vêm vazios de propósito (pendência da
 * tesouraria). Quando vazios, o card de transferência bancária não é renderizado.
 */
export interface SiteGiving {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  intro: string;
  pixKey: string;
  bankName: string;
  bankCode: string;
  agency: string;
  account: string;
  holderName: string;
  holderDocument: string;
}

/** Secção `contact` — Contato & Rodapé. */
export interface SiteContact {
  phone: string;
  email: string;
  address: string;
  tagline: string;
  copyright: string;
  youtubeUrl: string;
  instagramUrl: string;
  facebookUrl: string;
}

/** Secção `youtube` — Transmissões. `channelHandle` vem sem `@`. */
export interface SiteYoutube {
  channelHandle: string;
  sectionTitle: string;
}

/** Conjunto completo das 9 secções. */
export interface SiteSections {
  mission: SiteMission;
  celulas: SiteCelulas;
  visit: SiteVisit;
  churches: SiteChurches;
  pastors: SitePastors;
  ministries: SiteMinistries;
  giving: SiteGiving;
  contact: SiteContact;
  youtube: SiteYoutube;
}

export interface SiteContentResponse {
  sections: SiteSections;
}
