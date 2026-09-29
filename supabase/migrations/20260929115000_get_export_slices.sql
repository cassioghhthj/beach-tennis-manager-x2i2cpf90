-- Return row slice of pontuacoes_rodada for LIGA ELAS EM JOGO
CREATE OR REPLACE FUNCTION public.get_export_pontuacoes_elas(p_offset int, p_limit int)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_res jsonb;
BEGIN
  SELECT jsonb_agg(sub)
  INTO v_res
  FROM (
    SELECT 
      pr.id,
      pr.rodada_id,
      pr.atleta_id,
      pr.pontos_grupo,
      pr.pontos_vitorias,
      pr.bonus_5x0,
      pr.pontos_podio_principal,
      pr.pontos_podio_consolacao,
      pr.pontos_presenca,
      pr.pontos_manuais,
      pr.observacao_manuais,
      pr.vitorias,
      pr.derrotas,
      pr.games_pro,
      pr.games_contra,
      pr.saldo_games,
      pr.total
    FROM public.pontuacoes_rodada pr
    WHERE pr.rodada_id IN (SELECT r.id FROM public.rodadas r WHERE r.liga_id = 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid)
    ORDER BY pr.id
    OFFSET p_offset
    LIMIT p_limit
  ) sub;

  RETURN COALESCE(v_res, '[]'::jsonb);
END;
$$;

-- Return length of pontuacoes_rodada
CREATE OR REPLACE FUNCTION public.get_export_pontuacoes_count()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count int;
BEGIN
  SELECT count(*) INTO v_count
  FROM public.pontuacoes_rodada pr
  WHERE pr.rodada_id IN (SELECT r.id FROM public.rodadas r WHERE r.liga_id = 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid);
  RETURN v_count;
END;
$$;
