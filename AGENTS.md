# AGENTS.md — site da Igreja Paraíso

## Stack
Next 16 (App Router), React 19, Tailwind 4, TypeScript. Deploy na Vercel:
`master` = produção, `homologacao` = Preview. Nunca faça push/merge/deploy sem pedido explícito.

## De onde vêm os dados
- API do ChurchManager (painel), configurada por `NEXT_PUBLIC_DONATIONS_API_BASE` e
  `NEXT_PUBLIC_DONATIONS_TENANT_SLUG` (ver `src/lib/donations/env.ts`, `src/lib/public-api/env.ts`).
- Contrato: `docs/api/site-content-contract.md` do repositório ChurchManager.
- **O painel é fornecedor e não conhece o site; é o site que declara o que consome.**
- Fonte por campo: endereço/telefone/e-mail/redes = `contact.*`; PIX/banco = `giving.*`;
  link do Maps = filial `isHeadquarters` em `churches.items` (`mapsUrl`); horários de culto =
  `GET /api/public/tenants/:slug/schedules` (só `active`); listas = `churches/pastors/ministries.items`.
  `visit.address` e `visit.hours` são texto da seção Visite-nos, não fonte de endereço/horário.
- Revalidação: `GET|POST /api/revalidate-site-content` com header `x-revalidation-secret` (= `REVALIDATION_SECRET`);
  em produção sem o segredo configurado → 401; expira a tag `site-content` na hora (`{ expire: 0 }`), que cobre
  site-content e `/schedules`. `?secret=` ainda é aceito por compatibilidade — **REMOVER** quando o painel só enviar o header.
- Atualização: revalidação OK → próxima visita mostra o novo; revalidação ausente/falha → até 300 s;
  Preview sem cache; eventos 60 s.

## Imagens do painel (R2)
`SITE_MEDIA_HOSTNAMES` (hostnames https separados por vírgula, = host de `R2_PUBLIC_URL`) é lida no **build**
por `next.config.ts` (`src/lib/media/remote-patterns.ts`). Precisa existir nos ambientes **Preview e Production
da Vercel ANTES do build**; alterar o valor exige novo deploy. Imagens do painel usam
`src/components/ImageWithFallback.tsx` (substituto quando vazia/quebrada).

## Política de reserva (API fora ou sem configuração)
Só textos de reserva. **Nunca** exibir listas (igrejas, pastores, ministérios, horários) com dados fixos no código.

## Gates (todos verdes antes de commit)
```
npm ci && npx tsc --noEmit && npm run lint && npm test && npm run build
```
`npm run lint` ignora `.claude/**` e `coverage/**`. Testes: Vitest (`npm test`), ambiente node,
alias `@/` = `src/`, arquivos `src/**/*.test.ts`. Playwright não é dependência do projeto (use o MCP).

### Linha de base do lint (22/10/2026): 28 erros, 53 avisos — não pode piorar
Arquivos que você tocar ficam sem erro de lint.
- Erros: `@typescript-eslint/no-explicit-any` 14, `react/no-unescaped-entities` 6,
  `react-hooks/set-state-in-effect` 3, `@next/next/no-html-link-for-pages` 2,
  `react-hooks/static-components` 2, `@typescript-eslint/ban-ts-comment` 1.
- Avisos: `@typescript-eslint/no-unused-vars` 29, `@next/next/no-img-element` 23,
  `react-hooks/exhaustive-deps` 1.

## Ciclo
Implementar → testar → inspecionar o diff → corrigir → testar de novo → validar o que o visitante vê.
Teste antes da correção quando o bug for reproduzível. Sem erro novo de tipo/lint.

## Preservação visual
O visual aprovado das páginas é a referência. Antes de mexer numa página, tire screenshots
(1280px e 375px, dados de exemplo) e compare depois. Diferença visual só onde a tarefa pede.

## Como rodar
`npm run dev` (porta 3000; config em `.claude/launch.json`). Sem API configurada o site usa os textos de reserva.
