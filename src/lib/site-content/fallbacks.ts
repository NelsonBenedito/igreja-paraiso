import type { SiteSections } from "./types";

/**
 * Reserva (API fora ou não configurada): SÓ textos institucionais.
 * Listas (`churches`, `pastors`, `ministries`) ficam sempre vazias — nunca
 * dados fixos de igrejas/pastores/ministérios. Também é o default de campo
 * ausente no normalizador.
 *
 * Horário de domingo (noite): 18h (confirmado). Manhã 09h mantida da home
 * até confirmação explícita (pendência com `schedules`).
 */
export const SITE_CONTENT_FALLBACK: SiteSections = {
  mission: {
    badge: "Nossa Missão",
    titlePart1: "O mesmo povo.",
    titleHighlight: "A mesma fé.",
    titlePart2: "Um nome novo.",
    paragraph1:
      "Agora, somos a Igreja Paraíso. O mesmo povo, a mesma igreja, com um novo nome, uma nova mentalidade e uma visão renovada.",
    paragraph2:
      "E o nosso compromisso permanece: alcançar todos a quem o Senhor nos enviar.",
    quote:
      "Paraíso é a casa de Deus, o lugar da presença, onde a minha família se reúne, onde Deus habita.",
    signature: "Igreja Paraíso — Casa de Deus. Minha família.",
  },
  celulas: {
    badge: "Grupos de Vida",
    titlePart1: "A igreja",
    titleHighlight: "acontece",
    titlePart2: "em células.",
    paragraph1:
      "Células são grupos pequenos onde a vida em comunidade realmente acontece. É onde você encontra amigos, cresce na fé e descobre o seu propósito — sem grandes palcos, só presença e verdade.",
    paragraph2:
      "Acreditamos que ninguém deveria seguir essa caminhada sozinho.",
    verseText:
      "Onde dois ou três se reúnem em meu nome, ali estou eu no meio deles.",
    verseReference: "Mateus 18:20",
    benefits: [
      {
        icon: "Heart",
        titulo: "Comunhão Real",
        descricao:
          "Relacionamentos genuínos construídos em torno da fé, onde cada pessoa é conhecida pelo nome.",
      },
      {
        icon: "BookOpen",
        titulo: "Crescimento Espiritual",
        descricao:
          "Estudo bíblico aplicado ao cotidiano, com espaço para perguntas e reflexão em grupo.",
      },
      {
        icon: "Users",
        titulo: "Família de Verdade",
        descricao:
          "Grupos pequenos onde ninguém passa por momentos difíceis sozinho. Somos família.",
      },
      {
        icon: "MapPin",
        titulo: "Perto de Você",
        descricao:
          "Células espalhadas pela cidade para que você encontre uma próxima de onde você vive.",
      },
    ],
    ctaLabel: "Quero encontrar uma célula",
    ctaUrl:
      "https://wa.me/5527998757008?text=Olá,+gostaria+de+falar+com+o+setor+de+secretaria+de+células!+",
  },
  visit: {
    titlePart1: "VENHA NOS",
    titleHighlight: "visitar",
    backgroundImage:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2000",
    addressTitle: "Endereço (Sede)",
    address:
      "Rua Helmut Gums, 438 - Virada\nSanta Maria de Jetibá - ES\nCEP 29645-000",
    hoursTitle: "Horários",
    // Noite confirmada: 18h. Manhã 09h da home — confirmar vs schedules.
    hours:
      "Domingo: 09h e 18h\nTerça-feira: 20h00 (Doutrina e Oração)\nSábado: 19h00 (Juventude Eleve)",
    mapsUrl: "https://maps.app.goo.gl/UsxnnZ69miAvFzvs6",
  },
  churches: {
    badge: "Nossa Presença",
    titlePart1: "NOSSAS",
    titleHighlight: "igrejas & missões",
    intro:
      "Estamos presentes em diversas cidades através de nossas filiais e campos missionários, servindo às famílias locais com amor e dedicação.",
    items: [],
  },
  pastors: {
    badge: "Liderança e Cuidado",
    titlePart1: "Nosso Time",
    titleHighlight: "pastoral",
    intro:
      "Uma liderança dedicada a guiar, instruir e caminhar junto com cada família no amor de Cristo.",
    items: [],
  },
  ministries: {
    items: [],
  },
  giving: {
    badge: "Dízimos e Ofertas",
    titlePart1: "Sua contribuição",
    titleHighlight: "edifica",
    titlePart2: "vidas.",
    intro:
      "Acreditamos que a generosidade é uma resposta de amor à graça de Deus. Ao contribuir, você apoia as ações sociais, o sustento da igreja local e os projetos de expansão do Reino de Deus.",
    // TODO: confirmar com a tesouraria — domínio do nome antigo
    pixKey: "projeto@visaodofuturo.com.br",
    bankName: "Sicoob",
    bankCode: "756",
    agency: "3007",
    // Vazios de propósito: placeholders antigos não devem parecer legítimos.
    // TODO: confirmar conta e CNPJ com a tesouraria.
    account: "",
    holderName: "Igreja Paraíso",
    holderDocument: "",
  },
  contact: {
    phone: "(27) 99875-7008",
    email: "",
    address: "Rua Helmut Gums, 438 - Virada, Santa Maria de Jetibá - ES",
    tagline:
      "Um lugar de refúgio e renovo espiritual. Existimos para amar a Deus, servir ao próximo e levar a mensagem de restauração a todos.",
    copyright: "© 2026 Igreja Paraíso. Feitos para a Eternidade.",
    youtubeUrl: "https://www.youtube.com/@paraisoigreja",
    instagramUrl: "https://www.instagram.com/paraisoigreja/",
    facebookUrl: "https://www.facebook.com/paraisoigreja/",
  },
  youtube: {
    channelHandle: "paraisoigreja",
    sectionTitle: "Transmissões online",
  },
};
