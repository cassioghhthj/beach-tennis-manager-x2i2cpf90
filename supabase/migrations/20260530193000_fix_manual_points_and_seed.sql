-- 1. Seed user ferricontabilidade@uol.com.br
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ferricontabilidade@uol.com.br') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'ferricontabilidade@uol.com.br',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin Arena Beach"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL,
      '', '', ''
    );
  END IF;
END $$;

-- 2. Update processar_presenca_rodada to preserve manual points and podium points correctly
CREATE OR REPLACE FUNCTION public.processar_presenca_rodada(p_rodada_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
  v_sistema_id uuid;
  v_snapshot jsonb;
  v_pontos_presenca integer := 0;
  v_atleta record;
  v_new_id uuid;
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

  -- 2. Fallback: Se não achou no snapshot, tentar buscar direto do sistema de pontuação ativo
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

  -- Processar para todos os atletas de todos os grupos da rodada
  FOR v_atleta IN (
    SELECT DISTINCT ga.atleta_id
    FROM public.grupo_atletas ga
    JOIN public.grupos g ON ga.grupo_id = g.id
    WHERE g.rodada_id = p_rodada_id AND ga.atleta_id IS NOT NULL
  ) LOOP

    -- Calcular estatísticas de partidas para o atleta nesta rodada
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

    -- Verifica se já existe pontuação para o atleta nesta rodada
    IF EXISTS (SELECT 1 FROM public.pontuacoes_rodada WHERE rodada_id = p_rodada_id AND atleta_id = v_atleta.atleta_id) THEN
      -- Atualiza os pontos de presença, novas estatísticas, e refaz o somatório total garantindo preservação de pódios e manuais
      UPDATE public.pontuacoes_rodada
      SET
        pontos_presenca = v_pontos_presenca,
        vitorias = v_vitorias,
        derrotas = v_derrotas,
        games_pro = v_games_pro,
        games_contra = v_games_contra,
        saldo_games = v_saldo_games,
        total = COALESCE(pontos_grupo, 0) + COALESCE(pontos_vitorias, 0) + COALESCE(bonus_5x0, 0) + COALESCE(pontos_podio_principal, 0) + COALESCE(pontos_podio_consolacao, 0) + COALESCE(pontos_manuais, 0) + v_pontos_presenca
      WHERE rodada_id = p_rodada_id AND atleta_id = v_atleta.atleta_id;
    ELSE
      -- Insere o atleta garantindo valores corretos (default 0 para manuais, podios etc)
      v_new_id := gen_random_uuid();
      INSERT INTO public.pontuacoes_rodada (
        id, rodada_id, atleta_id, pontos_grupo, pontos_vitorias, bonus_5x0,
        pontos_podio_principal, pontos_podio_consolacao, pontos_manuais,
        pontos_presenca, total, vitorias, derrotas, games_pro, games_contra, saldo_games
      ) VALUES (
        v_new_id, p_rodada_id, v_atleta.atleta_id, 0, 0, 0,
        0, 0, 0,
        v_pontos_presenca, v_pontos_presenca, v_vitorias, v_derrotas, v_games_pro, v_games_contra, v_saldo_games
      );
    END IF;

  END LOOP;
END;
$function$;
