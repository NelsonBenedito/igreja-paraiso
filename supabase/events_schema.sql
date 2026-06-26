-- =============================================================================
-- Schema de Eventos — Igreja Paraíso × ChurchManager
-- =============================================================================
-- Este arquivo documenta o schema SQL do módulo de eventos conforme definido
-- no ChurchManager (Prisma + PostgreSQL).  Os dados NÃO ficam mais no Supabase
-- do site: a fonte canônica é o banco PostgreSQL do ChurchManager.
--
-- Referência Prisma: apps/api/prisma/schema.prisma
-- Gerado em: 2026-06-19
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ENUM: formato do evento
-- ---------------------------------------------------------------------------
CREATE TYPE event_format AS ENUM ('IN_PERSON', 'ONLINE');

-- ---------------------------------------------------------------------------
-- ENUM: status de uma ordem de compra
-- ---------------------------------------------------------------------------
CREATE TYPE event_order_status AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'EXPIRED', 'CANCELLED');

-- ---------------------------------------------------------------------------
-- ENUM: status de um ingresso físico/digital emitido
-- ---------------------------------------------------------------------------
CREATE TYPE event_ticket_status AS ENUM ('VALID', 'USED', 'CANCELLED');

-- =============================================================================
-- TABELAS PRINCIPAIS
-- =============================================================================

-- ---------------------------------------------------------------------------
-- events — Evento (um por tenant)
-- ---------------------------------------------------------------------------
CREATE TABLE events (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            uuid        NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    -- Conteúdo básico
    title                varchar(255) NOT NULL,
    description          text,
    short_description    varchar(500),           -- resumo curto para cards/listagens
    details_html         text,                   -- corpo HTML da página pública
    format               event_format NOT NULL DEFAULT 'IN_PERSON',

    -- Mídia
    cover_image_url      text,                   -- capa principal (upload R2)
    image_url            text,                   -- LEGADO — URL simples; preferir cover_image_url
    video_url            text,
    media_meta           jsonb,                  -- futuros assets Cloudflare

    -- Local / Tempo
    date                 date        NOT NULL,
    time_start           time,
    time_end             time,
    location             varchar(255),
    online_url           varchar(2048),          -- URL de stream para formato ONLINE
    timezone             varchar(64)  NOT NULL DEFAULT 'America/Sao_Paulo',

    -- Categorização (legado)
    tag                  varchar(64),            -- LEGADO — etiqueta única; substituída pela tabela event_tags_on_events
    slug                 varchar(120),

    -- Inscrições / Pagamento
    published            boolean     NOT NULL DEFAULT true,
    registration_closes_at timestamptz,
    terms_url            varchar(2048),
    currency             varchar(3)   NOT NULL DEFAULT 'BRL',

    created_at           timestamptz NOT NULL DEFAULT now(),
    updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_tenant_id           ON events (tenant_id);
CREATE INDEX idx_events_tenant_date         ON events (tenant_id, date);

-- ---------------------------------------------------------------------------
-- event_registrations — Inscrição gratuita (sem pagamento)
-- ---------------------------------------------------------------------------
CREATE TABLE event_registrations (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   uuid        NOT NULL REFERENCES tenants(id)  ON DELETE CASCADE,
    event_id    uuid        NOT NULL REFERENCES events(id)   ON DELETE CASCADE,

    name        varchar(255) NOT NULL,
    email       varchar(255) NOT NULL,
    phone       varchar(32),
    message     text,

    -- ID do utilizador no Supabase Auth do site (sem FK — autenticação externa)
    user_id     uuid,

    created_at  timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT event_registrations_event_email_unique UNIQUE (event_id, email)
);

CREATE INDEX idx_event_registrations_tenant   ON event_registrations (tenant_id);
CREATE INDEX idx_event_registrations_event    ON event_registrations (event_id);
CREATE INDEX idx_event_registrations_email    ON event_registrations (email);
CREATE INDEX idx_event_registrations_user_id  ON event_registrations (user_id);

-- ---------------------------------------------------------------------------
-- event_ticket_types — Tipos/lotes de ingresso (pago ou gratuito)
-- ---------------------------------------------------------------------------
CREATE TABLE event_ticket_types (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            uuid        NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    event_id             uuid        NOT NULL REFERENCES events(id)  ON DELETE CASCADE,

    name                 varchar(255) NOT NULL,
    description          text,

    -- Preço em centavos (0 = gratuito)
    price_cents          int         NOT NULL DEFAULT 0,
    -- Taxa de plataforma em centavos (normalmente paga pelo comprador)
    fee_cents            int         NOT NULL DEFAULT 0,

    -- Estoque
    quantity_total       int,                    -- null = ilimitado
    quantity_reserved    int         NOT NULL DEFAULT 0,
    quantity_sold        int         NOT NULL DEFAULT 0,

    -- Controle por pedido
    min_per_order        int         NOT NULL DEFAULT 1,
    max_per_order        int         NOT NULL DEFAULT 10,

    -- Janela de venda
    sales_opens_at       timestamptz,
    sales_closes_at      timestamptz,

    -- Acesso
    allow_guest_registration boolean NOT NULL DEFAULT true,
    community_link       text,                   -- link WhatsApp/grupo enviado após inscrição

    sort_order           int         NOT NULL DEFAULT 0,
    created_at           timestamptz NOT NULL DEFAULT now(),
    updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_ticket_types_tenant ON event_ticket_types (tenant_id);
CREATE INDEX idx_event_ticket_types_event  ON event_ticket_types (event_id);

-- ---------------------------------------------------------------------------
-- event_orders — Pedido de compra (agrupa linhas, pagamento, tickets)
-- ---------------------------------------------------------------------------
CREATE TABLE event_orders (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id        uuid              NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    event_id         uuid              NOT NULL REFERENCES events(id)  ON DELETE CASCADE,
    payer_profile_id uuid              REFERENCES financial_payer_profiles(id) ON DELETE SET NULL,

    status           event_order_status NOT NULL DEFAULT 'PENDING',
    total_cents      int               NOT NULL,
    currency         varchar(3)        NOT NULL DEFAULT 'BRL',
    idempotency_key  varchar(128)      UNIQUE,
    confirmed_at     timestamptz,

    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_orders_tenant        ON event_orders (tenant_id);
CREATE INDEX idx_event_orders_event         ON event_orders (event_id);
CREATE INDEX idx_event_orders_tenant_status ON event_orders (tenant_id, status);

-- ---------------------------------------------------------------------------
-- event_order_lines — Linhas do pedido (ticket_type × quantidade)
-- ---------------------------------------------------------------------------
CREATE TABLE event_order_lines (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id         uuid NOT NULL REFERENCES event_orders(id)       ON DELETE CASCADE,
    ticket_type_id   uuid NOT NULL REFERENCES event_ticket_types(id) ON DELETE RESTRICT,
    quantity         int  NOT NULL,
    unit_price_cents int  NOT NULL,

    UNIQUE (order_id, ticket_type_id)
);

-- ---------------------------------------------------------------------------
-- event_tickets — Ingresso individual emitido após confirmação
-- ---------------------------------------------------------------------------
CREATE TABLE event_tickets (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id      uuid              NOT NULL REFERENCES tenants(id)           ON DELETE CASCADE,
    order_id       uuid              NOT NULL REFERENCES event_orders(id)      ON DELETE CASCADE,
    ticket_type_id uuid              NOT NULL REFERENCES event_ticket_types(id) ON DELETE RESTRICT,
    public_code    varchar(32)       NOT NULL UNIQUE,
    holder_name    varchar(255)      NOT NULL,
    status         event_ticket_status NOT NULL DEFAULT 'VALID',
    created_at     timestamptz       NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_tickets_tenant ON event_tickets (tenant_id);
CREATE INDEX idx_event_tickets_order  ON event_tickets (order_id);

-- =============================================================================
-- CAMPOS DINÂMICOS (formulário de inscrição configurável por lote)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- event_field_definitions — Definição de campo extra (CPF, T-shirt, etc.)
-- ---------------------------------------------------------------------------
CREATE TABLE event_field_definitions (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   uuid        NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    key         varchar(64) NOT NULL,            -- slug único: 'cpf', 'tshirt_size'
    label       varchar(255) NOT NULL,
    type        varchar(32) NOT NULL DEFAULT 'text', -- 'text', 'select', 'number', etc.
    options     jsonb,                           -- para campos 'select'
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- event_ticket_type_fields — Campo habilitado por tipo de ingresso
-- ---------------------------------------------------------------------------
CREATE TABLE event_ticket_type_fields (
    ticket_type_id uuid    NOT NULL REFERENCES event_ticket_types(id)    ON DELETE CASCADE,
    field_id       uuid    NOT NULL REFERENCES event_field_definitions(id) ON DELETE CASCADE,
    enabled        boolean NOT NULL DEFAULT true,
    required       boolean NOT NULL DEFAULT false,

    PRIMARY KEY (ticket_type_id, field_id)
);

-- ---------------------------------------------------------------------------
-- event_registration_field_values — Valores preenchidos em inscrições gratuitas
-- ---------------------------------------------------------------------------
CREATE TABLE event_registration_field_values (
    registration_id uuid   NOT NULL REFERENCES event_registrations(id)    ON DELETE CASCADE,
    field_id        uuid   NOT NULL REFERENCES event_field_definitions(id) ON DELETE CASCADE,
    value           text   NOT NULL,

    PRIMARY KEY (registration_id, field_id)
);

-- ---------------------------------------------------------------------------
-- event_order_field_values — Valores preenchidos em pedidos pagos
-- ---------------------------------------------------------------------------
CREATE TABLE event_order_field_values (
    order_id uuid   NOT NULL REFERENCES event_orders(id)            ON DELETE CASCADE,
    field_id uuid   NOT NULL REFERENCES event_field_definitions(id) ON DELETE CASCADE,
    value    text   NOT NULL,

    PRIMARY KEY (order_id, field_id)
);

-- =============================================================================
-- TAGS (sistema multi-tag novo — substitui coluna 'tag' legada)
-- =============================================================================

CREATE TABLE event_tags (
    id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid        NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name      varchar(64) NOT NULL,
    slug      varchar(64) NOT NULL,
    UNIQUE (tenant_id, slug)
);

CREATE TABLE event_tags_on_events (
    event_id uuid NOT NULL REFERENCES events(id)      ON DELETE CASCADE,
    tag_id   uuid NOT NULL REFERENCES event_tags(id)  ON DELETE CASCADE,
    PRIMARY KEY (event_id, tag_id)
);

-- =============================================================================
-- PROGRAMAÇÃO SEMANAL (schedules)
-- =============================================================================

CREATE TABLE schedules (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   uuid        NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title       varchar(255) NOT NULL,
    day_of_week varchar(16) NOT NULL,  -- 'sunday', 'monday', ... 'saturday'
    time_start  time        NOT NULL,
    location    varchar(255),
    description text,
    active      boolean     NOT NULL DEFAULT true,
    sort_order  int         NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_schedules_tenant ON schedules (tenant_id);

-- =============================================================================
-- NOTAS DE MIGRAÇÃO (Supabase → ChurchManager)
-- =============================================================================
--
-- A migração original estava em supabase/event_registrations_migration.sql.
-- Após a integração com o ChurchManager, os dados de eventos e inscrições
-- são geridos exclusivamente pelo ChurchManager (via API REST).
--
-- Campos renomeados (Supabase → ChurchManager):
--   image_url      → cover_image_url  (imageUrl no DTO público / API)
--   time_start     → time_start        (timeStart no DTO)
--   time_end       → time_end          (timeEnd no DTO)
--   tag            → tags[] / event_tags (mantido tag como legado)
--
-- O campo 'image_url' do modelo Prisma mantém-se como alias de
-- compatibilidade. O DTO público mapeia:
--   imageUrl = coverImageUrl ?? imageUrl
--
-- =============================================================================
