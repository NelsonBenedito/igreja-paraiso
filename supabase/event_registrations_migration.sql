-- ============================================================
-- MIGRATION: adiciona user_id e corrige políticas de select
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- 1. Adiciona coluna user_id (nullable → suporte a inscrições públicas sem conta)
ALTER TABLE public.event_registrations
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Remove políticas antigas de SELECT
DROP POLICY IF EXISTS "Admins podem ver inscrições" ON public.event_registrations;

-- 3. Cria política de SELECT mais confiável:
--    - Usuário vê suas próprias inscrições por user_id
--    - OU qualquer usuário autenticado (uid não nulo) pode ver
--      inscrições antigas sem user_id (criadas antes da migration)
CREATE POLICY "Usuários veem suas próprias inscrições"
  ON public.event_registrations FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      user_id = auth.uid()
      OR user_id IS NULL  -- inscrições legadas sem user_id
    )
  );
