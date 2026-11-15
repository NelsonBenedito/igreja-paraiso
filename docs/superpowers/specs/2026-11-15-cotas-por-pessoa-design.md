# Cotas por pessoa — design

Data: 15/11/2026 · Repositórios: `igreja-paraiso` (site) e `churchmanager` (API, `apps/api`)

## Problema
- A página `/cotas/campus` gera links de pagamento do Asaas que ninguém usa: cada combinação
  CPF + valor + meses cria um link novo, e os anteriores ficam ativos para sempre.
- Os botões de cota fixa não identificam a pessoa (`preset_global`), então não dá para validar por pessoa.
- O doador não tem como ver o que já gerou ou assina e fica perdido. Não queremos login.

## Decisões (aprovadas)
1. Etapa única **"Quem está contribuindo?"** (nome + CPF) no topo da seção de cotas. Vale para os botões de
   cota fixa e para "Outro valor". Todo pagamento do site passa a ser `reuseMode: "cpf_custom"`.
2. Ao gerar um link para um CPF, a API **desativa os outros links `cpf_custom` ativos desse CPF**
   (no banco e no Asaas). Se for igual a um existente, reaproveita, como hoje.
3. Se o CPF tem **assinatura ativa**, a API não gera nada e responde `409 HAS_ACTIVE_CONTRIBUTION` com o e-mail
   mascarado. O site oferece **Receber acesso no e-mail** ou **Fazer contribuição adicional**
   (reenvia com `confirmAdditional: true`).
4. **Minhas contribuições** sem login: CPF → link mágico enviado ao e-mail cadastrado (perfil do pagador) →
   o navegador fica liberado por 30 dias. Só leitura. Alterar ou cancelar fica com a secretaria.
5. O CPF e o nome deixam de ir na URL de `/cotas/campus/contribuir` (passam por `sessionStorage`).

## Contrato da API (ChurchManager, rotas públicas `/api/public/tenants/:slug`)

### `POST /links` (existente, alterado)
- Corpo: campos atuais + `confirmAdditional?: boolean` (só faz sentido com `cpf_custom`).
- `cpf_custom` e o CPF tem `FinancialSubscription` com status `ACTIVE` (via `FinancialPayerProfile` do tenant)
  e `confirmAdditional !== true` → **409**
  `{ "code": "HAS_ACTIVE_CONTRIBUTION", "emailHint": "pa***@gmail.com" | null }`.
- Caso contrário, gera ou reaproveita o link como hoje. Depois de garantir o link, marca `active=false` e chama
  `deletePaymentLink` no Asaas para os **outros** links `CPF_CUSTOM` ativos do mesmo tenant + CPF. Uma falha no Asaas
  ao remover é registrada no log e não derruba a resposta. Desativar um link não cancela assinaturas já criadas por ele.
- Resposta 201 inalterada.

### `POST /contributions/access-link` (novo)
- Corpo: `{ "cpf": string, "returnUrl": string }`. `returnUrl` é a página do site que recebe o token e precisa
  ter origin em `tenant_public_web_origins` (mesma regra do `successUrl`).
- Se existe `FinancialPayerProfile` (tenant + CPF) com e-mail: cria um token aleatório de uso único
  (armazenado só como hash SHA-256, expira em 30 min) e envia por e-mail (Resend, pt-BR) o link
  `returnUrl?token=<token>`.
- Responde **sempre 202** `{ "sent": true }`, com ou sem perfil (não revela se o CPF existe).
- Rate limit: 3 por minuto por IP.

### `POST /contributions/session` (novo)
- Corpo: `{ "token": string }`. Token válido, não usado e não expirado → marca como usado e devolve
  `{ "sessionToken": string, "expiresAt": ISO }`: JWT assinado, válido por 30 dias, com
  `aud: "contributor"`, `tenantId` e `cpf`. Caso contrário, **401** `{ "code": "INVALID_TOKEN" }`.

### `GET /contributions/me` (novo)
- Header `Authorization: Bearer <sessionToken>`. O JWT deve ter `aud` igual a contributor e o tenant igual ao do slug.
  Senão, **401**.
- Resposta:
```json
{
  "payer": { "name": "Fulano", "emailHint": "fu***@gmail.com" },
  "subscriptions": [
    { "id": "...", "status": "ACTIVE", "valueCents": 10000, "label": "Cotas - ...",
      "createdAt": "ISO", "currentPeriodEnd": "ISO|null" }
  ],
  "payments": [
    { "date": "ISO", "valueCents": 10000, "status": "CONFIRMED", "billingType": "PIX|null" }
  ],
  "pendingLink": { "url": "https://...", "valueCents": 10000, "isMonthly": true,
                   "subscriptionDurationMonths": 12, "createdAt": "ISO" } | null
}
```
- `payments`: os últimos 12 `FinancialTransaction` do perfil, do mais recente para o mais antigo.
- `pendingLink`: o link `CPF_CUSTOM` ativo mais recente do CPF que não tenha nenhuma transação confirmada
  do perfil criada depois dele. Caso contrário, `null`.

## Site (igreja-paraiso)
- `CotasPaymentRegion`: os campos de nome e CPF sobem para um bloco "Quem está contribuindo?" acima das cotas.
  Botões de cota e "Outro valor" ficam desabilitados até nome e CPF serem válidos (com mensagem curta).
- `CotasIntentPanel` passa a usar `cpf_custom`, com valor da cota, mensal e 12 meses.
- Os dados do pagamento vão por `sessionStorage` (chave única) para `/cotas/campus/contribuir`. Sem nome e CPF na URL.
  Valor, mensal e meses podem continuar na URL.
- `ContribuirRedirectClient`: trata o 409 com um cartão "Você já contribui com o Novo Campus" e dois botões:
  **Receber acesso no e-mail** (chama access-link e mostra "Enviamos para {emailHint}") e
  **Fazer contribuição adicional** (reenvia com `confirmAdditional: true`).
- Link "Minhas contribuições" na página de cotas → `/cotas/minhas-contribuicoes`:
  - Sem sessão: formulário de CPF → access-link (`returnUrl` = `<origin>/api/cotas/acesso`) → mensagem neutra
    "Se houver contribuições para este CPF, enviamos um link para o e-mail cadastrado."
  - `GET /api/cotas/acesso?token=` (Route Handler): troca o token em `/contributions/session`, grava cookie
    httpOnly, `Secure` em produção, `SameSite=Lax`, 30 dias, e redireciona para `/cotas/minhas-contribuicoes`.
    Token inválido → redireciona com `?erro=link`.
  - Com sessão: a página (server component, `no-store`) chama `/contributions/me` com o cookie e mostra assinaturas,
    últimos pagamentos, link pendente (botão "Continuar pagamento") e "Para alterar ou cancelar, fale com a secretaria".
    Botão "Sair" apaga o cookie. Sessão expirada (401) → apaga o cookie e volta ao formulário.
- Visual: reaproveitar classes de `campus.css`. Diferença visual só nos blocos novos.

## Fora de escopo
Cancelar ou alterar assinatura pelo site, WhatsApp/SMS, limpeza retroativa de links antigos (pode ser
um script depois), login.

## Testes
- API (Jest): 409 com e sem `confirmAdditional`; desativação dos outros links do CPF (e falha no Asaas tolerada);
  access-link sempre 202 e só envia com perfil + e-mail; token de uso único e expirado; `/me` rejeita outro
  `aud` ou outro tenant; regra do `pendingLink`.
- Site (Vitest): parse e validação do payload do `sessionStorage`; mapeamento do 409; máscara/formatadores da
  página de contribuições. Navegador: 1280px e 375px.
