-- Function to process presence points for all athletes in a round
CREATE OR REPLACE FUNCTION public.processar_presenca_rodada(p_rodada_id uuid)
RETURNS void AS $$
DECLARE
  v_sistema_id uuid;
  v_pontos_presenca integer := 0;
  v_atleta record;
  v_new_id uuid;
BEGIN
  -- Obter o sistema da rodada
  SELECT sistema_id INTO v_sistema_id FROM public.rodadas WHERE id = p_rodada_id;
  
  IF v_sistema_id IS NOT NULL THEN
    -- Obter a regra de pontos_presenca para o sistema (se existir)
    SELECT valor_pontos INTO v_pontos_presenca 
    FROM public.regras_pontuacao 
    WHERE sistema_id = v_sistema_id AND chave = 'pontos_presenca';
    
    IF v_pontos_presenca IS NULL THEN
      v_pontos_presenca := 0;
    END IF;
  END IF;

  -- Processar para todos os atletas de todos os grupos da rodada
  FOR v_atleta IN (
    SELECT DISTINCT ga.atleta_id 
    FROM public.grupo_atletas ga
    JOIN public.grupos g ON ga.grupo_id = g.id
    WHERE g.rodada_id = p_rodada_id AND ga.atleta_id IS NOT NULL
  ) LOOP
    
    -- Verifica se já existe pontuação para o atleta nesta rodada
    IF EXISTS (SELECT 1 FROM public.pontuacoes_rodada WHERE rodada_id = p_rodada_id AND atleta_id = v_atleta.atleta_id) THEN
      -- Atualiza apenas os pontos de presença e refaz o somatório total garantindo que nulos sejam 0
      UPDATE public.pontuacoes_rodada
      SET 
        pontos_presenca = v_pontos_presenca,
        total = COALESCE(pontos_grupo, 0) + COALESCE(pontos_vitorias, 0) + COALESCE(bonus_5x0, 0) + COALESCE(pontos_podio_principal, 0) + COALESCE(pontos_podio_consolacao, 0) + COALESCE(pontos_manuais, 0) + v_pontos_presenca
      WHERE rodada_id = p_rodada_id AND atleta_id = v_atleta.atleta_id;
    ELSE
      -- Insere o atleta garantindo os pontos de presença, já que ele participou mas não teve jogos pontuados
      v_new_id := gen_random_uuid();
      INSERT INTO public.pontuacoes_rodada (
        id, rodada_id, atleta_id, pontos_grupo, pontos_vitorias, bonus_5x0, 
        pontos_podio_principal, pontos_podio_consolacao, pontos_manuais, 
        pontos_presenca, total
      ) VALUES (
        v_new_id, p_rodada_id, v_atleta.atleta_id, 0, 0, 0,
        0, 0, 0,
        v_pontos_presenca, v_pontos_presenca
      );
    END IF;

  END LOOP;
END;
$$ LANGUAGE plpgsql;
