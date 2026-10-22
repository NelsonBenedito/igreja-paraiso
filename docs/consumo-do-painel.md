# Consumo do painel (ChurchManager) pelo site

O painel é fornecedor e não conhece o site; **o site declara o que consome**.
Fonte da declaração: `src/lib/site-content/consumption.ts` (testada em
`consumption.test.ts` contra a fixture `__fixtures__/site-content.contract.ts`).
Contrato oficial: `docs/api/site-content-contract.md` (repositório ChurchManager).
Formato conferido em `site-content.service.ts` do painel; fixture a reconferir quando o contrato for atualizado.

Todas as seções vêm de `GET /api/public/tenants/:slug/site-content`, normalizadas em
`fetchSiteContent` (`normalize.ts`): campo ausente/tipo errado → texto de reserva, lista → vazia,
seção ou campo desconhecido → ignorado, item `active: false` ou sem `name` → descartado.

## Política sem dados (API fora, sem configuração ou resposta inválida)

Só **textos** institucionais usam a reserva (`fallbacks.ts`). Listas (`churches`, `pastors`,
`ministries`) ficam **vazias** — nunca dados fixos no código.

| Página | Seção (`site-content`) | Campos usados | Sem dados |
|---|---|---|---|
| `/` | `mission` | badge, titlePart1/Highlight/2, paragraph1/2, quote, signature | textos de reserva |
| `/` | `celulas` | badge, titlePart1/Highlight/2, paragraph1/2, verseText, verseReference, ctaLabel (+ `benefits`); `ctaUrl` é carregado mas **não usado** (o link é constante no componente) | textos de reserva |
| `/` | `churches` | badge, titlePart1/Highlight, intro; itens: name, location, image, isHeadquarters | seção **some** da home |
| `/` | `giving` | badge, titlePart1/Highlight/2, intro, pixKey, bankName, bankCode, agency, account, holderName, holderDocument | textos de reserva; card de banco só com dados |
| `/` | `youtube` | channelHandle, sectionTitle | texto de reserva |
| `/nossas-igrejas` | `churches` | cabeçalho + itens: name, location, address, image, mapsUrl, isHeadquarters | cabeçalho + "Nenhuma igreja disponível no momento." |
| `/time-pastoral` | `pastors` | badge, titlePart1/Highlight, intro; itens: name, image | cabeçalho + "Nenhum pastor disponível no momento." |
| todas (rodapé) | `contact` | phone, email, address, tagline, copyright, youtubeUrl, instagramUrl, facebookUrl | textos de reserva |

## Seções carregadas e não exibidas hoje

`visit` e `ministries` **não são exibidas** (decisão do site, não do painel). `visit.address` e
`visit.hours` não são fonte de endereço nem de horários (ver AGENTS.md).

## Outras fontes (fora de `site-content`)

- Horários de culto: `GET /api/public/tenants/:slug/schedules` (só `active`) — tratado em `/contato` (outra tarefa).
- Eventos: API de eventos (cache 60 s) — fora deste mapa.
