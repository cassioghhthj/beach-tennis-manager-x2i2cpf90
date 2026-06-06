-- Ensure RLS policies for pontuacoes_rodada and grupos allow authenticated users to UPDATE and INSERT.

DO $$
BEGIN
  -- pontuacoes_rodada
  DROP POLICY IF EXISTS "allow_auth_all" ON public.pontuacoes_rodada;
  CREATE POLICY "allow_auth_all" ON public.pontuacoes_rodada
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

  -- grupos
  DROP POLICY IF EXISTS "allow_auth_all" ON public.grupos;
  CREATE POLICY "allow_auth_all" ON public.grupos
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
END $$;
