-- Fetch ranking payload in slices or save to public exports helper
CREATE OR REPLACE FUNCTION public.get_export_liga_elas_em_jogo(p_table text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_res jsonb;
BEGIN
  IF p_table IS NULL THEN
    SELECT ranking INTO v_res FROM public.publicacoes WHERE liga_nome = 'EXPORT_LIGA_ELAS_EM_JOGO' LIMIT 1;
  ELSE
    SELECT ranking->p_table INTO v_res FROM public.publicacoes WHERE liga_nome = 'EXPORT_LIGA_ELAS_EM_JOGO' LIMIT 1;
  END IF;
  RETURN v_res;
END;
$$;
