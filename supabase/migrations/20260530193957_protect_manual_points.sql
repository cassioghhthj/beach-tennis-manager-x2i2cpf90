-- Add unique constraint for UPSERT
CREATE UNIQUE INDEX IF NOT EXISTS pontuacoes_rodada_rodada_id_atleta_id_idx ON public.pontuacoes_rodada (rodada_id, atleta_id);

ALTER TABLE public.pontuacoes_rodada DROP CONSTRAINT IF EXISTS pontuacoes_rodada_rodada_id_atleta_id_key;
ALTER TABLE public.pontuacoes_rodada ADD CONSTRAINT pontuacoes_rodada_rodada_id_atleta_id_key UNIQUE USING INDEX pontuacoes_rodada_rodada_id_atleta_id_idx;

-- Update the function to use an atomic UPSERT that preserves manual columns
CREATE OR REPLACE FUNCTION public.processar_presenca_rodada(p_rodada_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_sistema_id uuid;
  v_snapshot jsonb;
  v_pontos_presenca integer := 0;
  v_atleta record;
  v_vitorias integer;
  v_derrotas integer;
  v_games_pro integer;
  v_games_contra integer;
  v_saldo_games integer;
BEGIN
  -- Obter o sistema e o snapshot da rodada
  SELECT sistema_id, snapshot_regras INTO v_sistema_id, v_snapshot
  FROM public.rodadas
  WHERE id = p_rodada_id;

  -- 1. Tentar extrair do snapshot
  IF v_snapshot IS NOT NULL THEN
    IF jsonb_typeof(v_snapshot) = 'array' THEN
      BEGIN
        SELECT (value->>'valor_pontos')::integer INTO v_pontos_presenca
        FROM jsonb_array_elements(v_snapshot)
        WHERE value->>'chave' = 'pontos_presenca' OR value->>'chave' = 'presenca'
        LIMIT 1;
      EXCEPTION WHEN OTHERS THEN
        v_pontos_presenca := 0;
      END;
    ELSIF jsonb_typeof(v_snapshot) = 'object' THEN
      IF v_snapshot ? 'regras' AND jsonb_typeof(v_snapshot->'regras') = 'array' THEN
        BEGIN
          SELECT (value->>'valor_pontos')::integer INTO v_pontos_presenca
          FROM jsonb_array_elements(v_snapshot->'regras')
          WHERE value->>'chave' = 'pontos_presenca' OR value->>'chave' = 'presenca'
          LIMIT 1;
        EXCEPTION WHEN OTHERS THEN
          v_pontos_presenca := 0;
        END;
      ELSE
        BEGIN
          v_pontos_presenca := COALESCE((v_snapshot->>'pontos_presenca')::integer, (v_snapshot->>'presenca')::integer, 0);
        EXCEPTION WHEN OTHERS THEN
          v_pontos_presenca := 0;
        END;
      END IF;
    END IF;
  END IF;

  -- 2. Fallback
  IF (v_pontos_presenca IS NULL OR v_pontos_presenca = 0) AND v_sistema_id IS NOT NULL THEN
    SELECT valor_pontos INTO v_pontos_presenca
    FROM public.regras_pontuacao
    WHERE sistema_id = v_sistema_id AND (chave = 'pontos_presenca' OR chave = 'presenca')
    ORDER BY chave = 'pontos_presenca' DESC
    LIMIT 1;
  END IF;

  IF v_pontos_presenca IS NULL THEN
    v_pontos_presenca := 0;
  END IF;

  FOR v_atleta IN (
    SELECT DISTINCT atleta_id
    FROM (
      SELECT ga.atleta_id
      FROM public.grupo_atletas ga
      JOIN public.grupos g ON ga.grupo_id = g.id
      WHERE g.rodada_id = p_rodada_id AND ga.atleta_id IS NOT NULL
      UNION
      SELECT atleta_id
      FROM public.pontuacoes_rodada
      WHERE rodada_id = p_rodada_id AND atleta_id IS NOT NULL
    ) all_athletes
  ) LOOP

    -- Calcular estatísticas
    SELECT
      COALESCE(SUM(CASE WHEN is_team1 AND score1 > score2 THEN 1 WHEN NOT is_team1 AND score2 > score1 THEN 1 ELSE 0 END), 0),
      COALESCE(SUM(CASE WHEN is_team1 AND score1 < score2 THEN 1 WHEN NOT is_team1 AND score2 < score1 THEN 1 ELSE 0 END), 0),
      COALESCE(SUM(CASE WHEN is_team1 THEN score1 ELSE score2 END), 0),
      COALESCE(SUM(CASE WHEN is_team1 THEN score2 ELSE score1 END), 0)
    INTO v_vitorias, v_derrotas, v_games_pro, v_games_contra
    FROM (
      SELECT p.score1, p.score2,
             (p.atleta1_id = v_atleta.atleta_id OR p.atleta2_id = v_atleta.atleta_id) as is_team1
      FROM public.partidas p
      JOIN public.grupos g ON p.grupo_id = g.id
      WHERE g.rodada_id = p_rodada_id
        AND (p.atleta1_id = v_atleta.atleta_id OR p.atleta2_id = v_atleta.atleta_id OR p.atleta3_id = v_atleta.atleta_id OR p.atleta4_id = v_atleta.atleta_id)
    ) as stats;

    v_saldo_games := v_games_pro - v_games_contra;

    INSERT INTO public.pontuacoes_rodada (
      rodada_id, atleta_id, pontos_grupo, pontos_vitorias, bonus_5x0,
      pontos_podio_principal, pontos_podio_consolacao, pontos_manuais, observacao_manuais,
      pontos_presenca, vitorias, derrotas, games_pro, games_contra, saldo_games
    ) VALUES (
      p_rodada_id, v_atleta.atleta_id, 0, 0, 0,
      0, 0, 0, NULL,
      v_pontos_presenca, v_vitorias, v_derrotas, v_games_pro, v_games_contra, v_saldo_games
    )
    ON CONFLICT (rodada_id, atleta_id) DO UPDATE SET
      pontos_presenca = EXCLUDED.pontos_presenca,
      vitorias = EXCLUDED.vitorias,
      derrotas = EXCLUDED.derrotas,
      games_pro = EXCLUDED.games_pro,
      games_contra = EXCLUDED.games_contra,
      saldo_games = EXCLUDED.saldo_games
      -- Do not update pontos_manuais, observacao_manuais, pontos_podio_principal, pontos_podio_consolacao!
      ;

  END LOOP;
END;
$function$;
