# Integração — API Nest (eventos públicos)

O site consome a API Nest via `src/lib/events/` quando estas variáveis estão definidas:

- `NEXT_PUBLIC_DONATIONS_API_BASE` — origem da API (ex.: `https://api.exemplo.com`)
- `NEXT_PUBLIC_DONATIONS_TENANT_SLUG` — slug do tenant (igreja)

## Rotas usadas pelo site

| Uso | Método | Rota |
|-----|--------|------|
| Home / listagem | GET | `/api/public/tenants/:slug/events?upcomingOnly=true` |
| Detalhe | GET | `/api/public/tenants/:slug/events/:eventId` |
| Inscrição gratuita | POST | `/api/public/tenants/:slug/events/:eventId/registrations` |
| Minhas inscrições | GET | `/api/public/tenants/:slug/registrations/mine?email=` |
| Programação | GET | `/api/public/tenants/:slug/schedules` |

Referência completa da API (checkout, ingressos, polling): documento **API Reference — Eventos** no repositório do admin Nest.

## Fallback Supabase

Se a API não estiver configurada, o site usa temporariamente as tabelas Supabase (`events`, `event_registrations`, `schedules`) para não quebrar ambientes legados.

## Camada de código

```
src/lib/public-api/env.ts     → base URL + tenant slug
src/lib/events/types.ts       → DTOs + SiteEvent/SiteSchedule
src/lib/events/client.ts      → fetch HTTP (server + client)
src/lib/events/adapters.ts    → camelCase API → snake_case UI
src/lib/events/data.ts        → server: API + fallback Supabase
src/lib/events/data-client.ts → browser: inscrições
```
