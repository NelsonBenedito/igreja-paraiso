# QA — integração institucional (PARAISO-8906)

- **SHA testado:** `1d601c1` (HEAD da branch = `origin/homologacao`, nada a mesclar; sem conflitos). Data: 22/10/2026.
- **Linha de base visual:** `13055ee` (build separado, mesma API mock).

## Gates (saídas reais)

| Gate | Resultado |
|---|---|
| `npm ci` | OK (npm audit aponta vulnerabilidades em dependências; fora do escopo) |
| `npx tsc --noEmit` | exit 0, sem saída |
| `npm run lint` | 76 problemas: **27 erros** (linha de base 28) e 49 avisos (base 53). Por regra: no-explicit-any 13/14, no-unescaped-entities 6/6, set-state-in-effect 3/3, no-html-link-for-pages 2/2, static-components 2/2, ban-ts-comment 1/1; avisos: no-unused-vars 28, no-img-element 20, exhaustive-deps 1. Nada pior que a base. O comando sai com código ≠ 0 por causa dos erros da base (não de erro novo). |
| `npm test` | 7 arquivos, **57 testes passando** (normalize 13, consumption 12, revalidate route 12, env 4, remote-patterns 4, contact view 3, legacy-admin-routes 9) |
| `npm run build` | OK; rotas listadas, só `/admin` (dashboard Supabase) resta, sem `/admin/eventos|programacao|inscricoes` nem `/api/admin/*` |

`grep -rn CHURCHMANAGER_ADMIN` (fora de node_modules/.next/.seeds): só uma linha em `docs/events-api-integration.md`, que diz que foram **removidas**. Nenhuma ocorrência em `src` ou `.env.example`.

## Verificação no navegador (Playwright MCP, `npm run build && npm start`)

API: **mock** com a forma do contrato (a API QA do ChurchManager não é acessível daqui). Supabase com valores fictícios só para o middleware subir.
Páginas: `/`, `/nossas-igrejas`, `/time-pastoral`, `/contato` em 1280px e 375px; comparação pixel a pixel com a base 13055ee.

- `/nossas-igrejas`: diferença de ~1 mil px (só onde a imagem vazia agora mostra o substituto — autorizado pela tarefa de imagens).
- `/time-pastoral`: imagem quebrada mostra o ícone substituto no lugar do `<img>` quebrado (autorizado); layout igual.
- `/`: mesmas alturas; diferença restrita ao fundo do hero (vídeo/ruído, inspeção visual das duas capturas sem diferença perceptível) e substituto de imagem vazia.
- `/contato`: dados vêm do painel (endereço, telefone, e-mail, horários). Layout/cards iguais; difere o conteúdo (autorizado) e o cartão de e-mail agora aparece quando há e-mail.
- Capturas ficaram em `/tmp/qa/shots` (não versionadas).

Comportamentos testados com curl contra `next start` (REVALIDATION_SECRET definido):
1. Mock alterado (item removido + novo texto), **sem** revalidar → site ainda mostra o antigo (cache de até 300 s). ✔
2. Revalidação sem segredo → 401; com segredo errado → 401; o conteúdo continua o antigo. ✔
3. `POST` com header `x-revalidation-secret` correto → `{"revalidated":true}` 200; **primeira visita seguinte** já mostra: item removido sumiu em `/` e `/nossas-igrejas`, endereço novo e horário novo (`/schedules`) em `/contato`. ✔
4. `?secret=` (compatibilidade) → 200. O segredo não aparece nos logs do servidor nem na resposta.
5. API fora (503) após revalidar: `/nossas-igrejas`, `/time-pastoral`, `/contato` sem nenhuma igreja/pastor/horário fixo; só textos institucionais de reserva (a home e o rodapé usam o endereço de reserva — ver pendências).
6. `/admin/eventos` → 307 para `/membros`.

## Revisão de segurança (diff desde 13055ee)

- Rota de revalidação: comparação com `timingSafeEqual` (tamanhos diferentes consomem comparação e rejeitam); produção sem `REVALIDATION_SECRET` → 401; respostas não ecoam o segredo; sem `console.*` na rota. OK.
- Variáveis novas (`SITE_MEDIA_HOSTNAMES`, `REVALIDATION_SECRET`): `.env.example` só com exemplos (`pub-xxxx.r2.dev`), nenhum valor real. OK.
- Hosts de imagem: `remotePatterns` com `protocol: "https"` fixo; entradas `http://`, porta, caminho ou inválidas são ignoradas (testado). OK.
- Credencial admin do ChurchManager: código e variáveis removidos. OK.
- Dado administrativo exibido: o consumo declarado (`consumption.ts`) não inclui campos administrativos; `/admin` restante exige usuário Supabase. OK.
- `.claude/.credentials.json` e `.claude/settings.local.json` aparecem não rastreados no workspace: **não** foram adicionados ao commit.

### Achados (fora do escopo, não corrigidos)
1. `fetchPublicSchedules` usa `revalidate: 300` também no Preview; `site-content` usa `no-store` no Preview. "Preview sem cache" não vale para `/schedules`. Impacto: só homologação (até 300 s de atraso).
2. `fallbacks.ts` mantém chave PIX fixa (`projeto@visaodofuturo.com.br`, com TODO de confirmação da tesouraria), endereço/telefone de reserva e `visit.hours`. São textos, não listas (política permitida), mas com a API fora o visitante pode ver uma chave PIX possivelmente desatualizada. **Decisão externa necessária** (tesouraria/produto): manter, esconder ou ajustar.
3. `middleware` deprecated no Next 16 (aviso de build; usar `proxy`).

## Critérios de aceite do plano pl-5edb

| # | Critério | Status |
|---|---|---|
| 1 | Imagem do R2 em `/`, `/nossas-igrejas`, `/time-pastoral`; URL quebrada mostra substituto | **Parcial/verificado em parte:** substituto verificado (imagem vazia/quebrada); host R2 real **não verificável** aqui (sem bucket nem `SITE_MEDIA_HOSTNAMES` real); coberto por teste unitário de `remotePatterns` |
| 2 | API fora → sem igreja/pastor/ministério fixo; textos usam reserva | Atendido (item 5 acima) |
| 3 | Item desativado some após a revalidação | Atendido (mock; item removido some na 1ª visita) |
| 4 | Revalidação → próxima visita mostra o novo; segredo inválido/ausente → 401 sem invalidar | Atendido |
| 5 | `/contato` mostra endereço, telefone, e-mail e horários do painel, mesmo layout | Atendido (mock); API real: não verificável aqui |
| 6 | tsc, lint (sem `.claude`), testes, build verdes; mapa de consumo testado contra o contrato | Atendido, com ressalva: fixture do contrato ainda não foi conferida com `docs/api/site-content-contract.md` do ChurchManager (repositório inacessível) |
| — | Nenhuma divergência visual não autorizada | Atendido (diferenças só as listadas) |

## Casos do roteiro E2E já cobertos aqui
Revalidação com header, 401 sem/errado, compat `?secret=`, item removido, API fora sem listas, `/contato` com dados do painel e programação, redirect de `/admin/*` removido. **Fora do Warren (ChurchManager real):** upload real no R2 e imagem no site, painel enviando o header de revalidação, `isHeadquarters`/`mapsUrl` reais, schedules reais.

## Pendências operacionais
1. Vercel (Preview **e** Production), antes do build: `SITE_MEDIA_HOSTNAMES` (= host de `R2_PUBLIC_URL`); mudar o valor exige novo deploy.
2. Vercel: `REVALIDATION_SECRET` igual ao do painel; sem ele, produção responde 401.
3. Ordem de deploy: site primeiro (aceita header e query), depois o painel passa a enviar `x-revalidation-secret`.
4. **Remover `?secret=`** da rota (e do `.env.example`/AGENTS.md) quando a API só enviar o header.
5. Remover `CHURCHMANAGER_ADMIN_EMAIL/PASSWORD/TOKEN` da Vercel e desativar/trocar a senha do usuário técnico no ChurchManager.
6. Decidir sobre o achado 2 (PIX de reserva).
