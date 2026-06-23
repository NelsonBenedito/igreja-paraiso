-- ============================================================
-- Pagamento de inscrições em eventos (Asaas)
-- Execute no SQL Editor do Supabase
-- ============================================================

-- Valor da inscrição em reais (NULL ou 0 = gratuito)
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS registration_price numeric(10, 2);

-- Dados de pagamento na inscrição
ALTER TABLE public.event_registrations
  ADD COLUMN IF NOT EXISTS cpf text,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS asaas_payment_id text,
  ADD COLUMN IF NOT EXISTS asaas_customer_id text;

-- Inscrições antigas sem status explícito
UPDATE public.event_registrations
SET payment_status = 'free'
WHERE payment_status IS NULL;

COMMENT ON COLUMN public.events.registration_price IS 'Valor da inscrição em BRL; NULL ou 0 = gratuito';
COMMENT ON COLUMN public.event_registrations.payment_status IS 'free | pending | paid | cancelled';

-- Depois execute também: supabase/event_registrations_rls.sql
