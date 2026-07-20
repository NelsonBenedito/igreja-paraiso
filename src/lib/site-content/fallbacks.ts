import type { SiteSections } from "./types";

/**
 * Conteúdo estático actual do site — usado quando a API está em baixo
 * ou não configurada. Remover só depois do seed em produção estar validado.
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
    ctaUrl: "/membros",
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
    items: [
      {
        name: "Igreja Paraíso — Sede",
        location: "Santa Maria de Jetibá - ES",
        address: "Rua Helmut Gums, 438 - Virada, Santa Maria de Jetibá - ES",
        image: "/pastor.jpg",
        mapsUrl: "https://maps.app.goo.gl/UsxnnZ69miAvFzvs6",
        pastor: "Pr. Evandro Menezes (Presidente)",
        isHeadquarters: true,
        active: true,
      },
      {
        name: "Igreja Paraíso — Itaguaçu",
        location: "Itaguaçu - ES",
        address: "Centro, Itaguaçu - ES, CEP 29690-000",
        image: "/prRobsonJ.jpg",
        mapsUrl: "https://maps.google.com/?q=Igreja+Paraiso+Itaguacu",
        pastor: "Pr. Robson Jose Maria",
        isHeadquarters: false,
        active: true,
      },
      {
        name: "Igreja Paraíso — Santa Teresa",
        location: "Santa Teresa - ES",
        address: "Centro, Santa Teresa - ES, CEP 29650-000",
        image: "/pastorTiagoP.jpg",
        mapsUrl: "https://maps.google.com/?q=Igreja+Paraiso+Santa+Teresa",
        pastor: "Pr. Tiago Pio",
        isHeadquarters: false,
        active: true,
      },
      {
        name: "Igreja Paraíso — Rio Possmoser",
        location: "Rio Possmoser - ES",
        address: "Rio Possmoser, Santa Maria de Jetibá - ES",
        image: "/prJhefersonM.jpg",
        mapsUrl: "https://maps.google.com/?q=Igreja+Paraiso+Rio+Possmoser",
        pastor: "Pr. Jheferson M. Rosa",
        isHeadquarters: false,
        active: true,
      },
      {
        name: "Igreja Paraíso — Aracruz",
        location: "Aracruz - ES",
        address: "Centro, Aracruz - ES, CEP 29190-000",
        image: "/prHerbertN.jpg",
        mapsUrl: "https://maps.google.com/?q=Igreja+Paraiso+Aracruz",
        pastor: "Pr. Herbert Neiva",
        isHeadquarters: false,
        active: true,
      },
      {
        name: "Igreja Paraíso — Anchieta",
        location: "Anchieta - ES",
        address: "Centro, Anchieta - ES, CEP 29230-000",
        image: "/prClovesS.jpg",
        mapsUrl: "https://maps.google.com/?q=Igreja+Paraiso+Anchieta",
        pastor: "Pr. Cloves Souza",
        isHeadquarters: false,
        active: true,
      },
    ],
  },
  pastors: {
    badge: "Liderança e Cuidado",
    titlePart1: "Nosso Time",
    titleHighlight: "pastoral",
    intro:
      "Uma liderança dedicada a guiar, instruir e caminhar junto com cada família no amor de Cristo.",
    items: [
      {
        name: "Pr. Clétson Barros",
        role: "Pastor Auxiliar - Sede",
        location: "Santa Maria de Jetibá - ES",
        image: "/prCletsonB.jpg",
        church: "Igreja Paraíso — Sede",
        active: true,
      },
      {
        name: "Pr. Leandro Hins de Brito",
        role: "Pastor Auxiliar - Sede",
        location: "Santa Maria de Jetibá - ES",
        image: "/prLeandroB.jpg",
        church: "Igreja Paraíso — Sede",
        active: true,
      },
      {
        name: "Pr. Robson Jose Maria",
        role: "Pastor Local",
        location: "Itaguaçu - ES",
        image: "/prRobsonJ.jpg",
        church: "Igreja Paraíso — Itaguaçu",
        active: true,
      },
      {
        name: "Pr. Tiago Pio",
        role: "Pastor Local",
        location: "Santa Teresa - ES",
        image: "/pastorTiagoP.jpg",
        church: "Igreja Paraíso — Santa Teresa",
        active: true,
      },
      {
        name: "Pr. Jheferson M. Rosa",
        role: "Pastor Local",
        location: "Rio Possmoser - ES",
        image: "/prJhefersonM.jpg",
        church: "Igreja Paraíso — Rio Possmoser",
        active: true,
      },
      {
        name: "Pr. Herbert Neiva",
        role: "Pastor Local",
        location: "Aracruz - ES",
        image: "/prHerbertN.jpg",
        church: "Igreja Paraíso — Aracruz",
        active: true,
      },
      {
        name: "Pr. Cloves Souza",
        role: "Pastor Local",
        location: "Anchieta - ES",
        image: "/prClovesS.jpg",
        church: "Igreja Paraíso — Anchieta",
        active: true,
      },
    ],
  },
  ministries: {
    items: [
      {
        name: "Ignição",
        description:
          "Ministério infantil: Ensinando os pequenos no caminho em que devem andar com alegria e cor.",
        image:
          "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?q=80&w=600",
        icon: "Heart",
        active: true,
      },
      {
        name: "Eleve",
        description:
          "Juventude: Uma geração apaixonada por Jesus que busca transformar o mundo.",
        image:
          "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600",
        icon: "Music",
        active: true,
      },
      {
        name: "Diamante",
        description:
          "Ministério de Mulheres: Preciosas para Deus, brilhando em todas as áreas da vida.",
        image:
          "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=600",
        icon: "Users",
        active: true,
      },
    ],
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
