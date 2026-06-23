-- ============================================================
-- RLS: event_registrations + events (pagamento Asaas)
-- Execute DEPOIS de events_payment_migration.sql
-- ============================================================

-- Função auxiliar: utilizador com role admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    INNER JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ------------------------------------------------------------
-- event_registrations
-- ------------------------------------------------------------
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins podem ver inscrições" ON public.event_registrations;
DROP POLICY IF EXISTS "Usuários veem suas próprias inscrições" ON public.event_registrations;
DROP POLICY IF EXISTS "Inscrição pública" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins veem todas inscrições" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins atualizam inscrições" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins removem inscrições" ON public.event_registrations;

-- Qualquer visitante ou membro pode inscrever-se (com ou sem conta)
CREATE POLICY "Inscrição pública"
  ON public.event_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    payment_status IN ('free', 'pending')
    AND (payment_status <> 'pending' OR cpf IS NOT NULL)
  );

-- Membro autenticado vê inscrições ligadas ao seu user_id ou e-mail
CREATE POLICY "Usuários veem suas próprias inscrições"
  ON public.event_registrations
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- Admin vê e gere todas as inscrições (painel /api com service role também)
CREATE POLICY "Admins veem todas inscrições"
  ON public.event_registrations
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins atualizam inscrições"
  ON public.event_registrations
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins removem inscrições"
  ON public.event_registrations
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Constraint opcional: estados de pagamento válidos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'event_registrations_payment_status_check'
  ) THEN
    ALTER TABLE public.event_registrations
      ADD CONSTRAINT event_registrations_payment_status_check
      CHECK (payment_status IN ('free', 'pending', 'paid', 'cancelled'));
  END IF;
END $$;

-- ------------------------------------------------------------
-- events (preço da inscrição visível no site público)
-- ------------------------------------------------------------
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Eventos publicados visíveis" ON public.events;
DROP POLICY IF EXISTS "Admins gerenciam eventos" ON public.events;

CREATE POLICY "Eventos publicados visíveis"
  ON public.events
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Admins gerenciam eventos"
  ON public.events
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
