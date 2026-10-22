import type { SiteSections } from "../types";

/**
 * Resposta de exemplo de GET /api/public/tenants/:slug/site-content, no formato
 * de apps/api/src/modules/site/site-content.service.ts (ChurchManager).
 * Pendência: `docs/api/site-content-contract.md` do ChurchManager ainda não foi
 * atualizado; ao atualizar, conferir esta fixture contra ele.
 * Os itens de lista de exemplo existem só aqui (testes) — nunca no código do site.
 */
export const CONTRACT_SECTIONS: SiteSections = {
  mission: {
    badge: "Missão",
    titlePart1: "A",
    titleHighlight: "missão",
    titlePart2: "b",
    paragraph1: "p1",
    paragraph2: "p2",
    quote: "q",
    signature: "s",
  },
  celulas: {
    badge: "Células",
    titlePart1: "A",
    titleHighlight: "b",
    titlePart2: "c",
    paragraph1: "p1",
    paragraph2: "p2",
    verseText: "v",
    verseReference: "r",
    benefits: [{ icon: "Heart", titulo: "T", descricao: "D" }],
    ctaLabel: "cta",
    ctaUrl: "https://exemplo.com/cta",
  },
  visit: {
    titlePart1: "VENHA",
    titleHighlight: "visitar",
    backgroundImage: "https://exemplo.com/bg.jpg",
    addressTitle: "Endereço",
    address: "Rua X, 1",
    hoursTitle: "Horários",
    hours: "Domingo: 18h",
    mapsUrl: "https://maps.example/visit",
  },
  churches: {
    badge: "Presença",
    titlePart1: "NOSSAS",
    titleHighlight: "igrejas",
    intro: "intro",
    items: [
      {
        name: "Sede",
        location: "Cidade - ES",
        address: "Rua X, 1",
        image: "https://exemplo.com/sede.jpg",
        mapsUrl: "https://maps.example/sede",
        isHeadquarters: true,
        active: true,
      },
    ],
  },
  pastors: {
    badge: "Liderança",
    titlePart1: "Nosso Time",
    titleHighlight: "pastoral",
    intro: "intro",
    items: [{ name: "Pr. Fulano", image: "https://exemplo.com/p.jpg", active: true }],
  },
  ministries: {
    items: [
      { name: "Min", description: "d", icon: "Heart", image: "https://exemplo.com/m.jpg", active: true },
    ],
  },
  giving: {
    badge: "Ofertório",
    titlePart1: "A",
    titleHighlight: "b",
    titlePart2: "c",
    intro: "i",
    pixKey: "pix",
    bankName: "Banco",
    bankCode: "001",
    agency: "1234",
    account: "",
    holderName: "Igreja",
    holderDocument: "",
  },
  contact: {
    phone: "(27) 99999-9999",
    email: "a@b.com",
    address: "Rua X, 1",
    tagline: "tag",
    copyright: "c",
    youtubeUrl: "https://youtube.com/x",
    instagramUrl: "https://instagram.com/x",
    facebookUrl: "https://facebook.com/x",
  },
  youtube: { channelHandle: "canal", sectionTitle: "Transmissões" },
};
