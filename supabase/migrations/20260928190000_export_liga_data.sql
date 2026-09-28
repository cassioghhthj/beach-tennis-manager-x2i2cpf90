-- Restore 20260928190000_export_liga_data.sql so migration files match applied history
DO $$
DECLARE
  v_liga_id uuid := 'c46e61d2-d2e8-4bba-b524-045169d3bc1b'::uuid;
  v_payload jsonb;
BEGIN
  -- Build the JSON structure matching the export requirements
  SELECT jsonb_build_object(
    'liga', (
      SELECT jsonb_agg(l) FROM public.ligas l WHERE l.id = v_liga_id
    ),
    'atletas', (
      SELECT jsonb_agg(a ORDER BY a.nome_completo) 
      FROM public.atletas a 
      WHERE a.id IN (SELECT al.atleta_id FROM public.atleta_ligas al WHERE al.liga_id = v_liga_id)
    ),
    'atleta_ligas', (
      SELECT jsonb_agg(al) FROM public.atleta_ligas al WHERE al.liga_id = v_liga_id
    ),
    'sistemas_pontuacao', (
      SELECT jsonb_agg(sp) FROM public.sistemas_pontuacao sp 
      WHERE sp.id IN (SELECT DISTINCT r.sistema_id FROM public.rodadas r WHERE r.liga_id = v_liga_id)
    ),
    'regras_pontuacao', (
      SELECT jsonb_agg(rp) FROM public.regras_pontuacao rp 
      WHERE rp.sistema_id IN (SELECT DISTINCT r.sistema_id FROM public.rodadas r WHERE r.liga_id = v_liga_id)
    ),
    'rodadas', (
      SELECT jsonb_agg(r ORDER BY r.numero) FROM public.rodadas r WHERE r.liga_id = v_liga_id
    ),
    'pontuacoes_rodada', (
      SELECT jsonb_agg(pr) FROM public.pontuacoes_rodada pr 
      WHERE pr.rodada_id IN (SELECT r.id FROM public.rodadas r WHERE r.liga_id = v_liga_id)
    ),
    'podios', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'rodada_id', p.rodada_id,
          'tipo', p.tipo,
          'posicao', p.posicao,
          'atleta1_id', p.atleta1_id,
          'atleta2_id', p.atleta2_id,
          'atleta1_nome', a1.nome_completo,
          'atleta2_nome', a2.nome_completo
        ) ORDER BY p.rodada_id, p.posicao
      )
      FROM public.podios p
      LEFT JOIN public.atletas a1 ON a1.id = p.atleta1_id
      LEFT JOIN public.atletas a2 ON a2.id = p.atleta2_id
      WHERE p.rodada_id IN (SELECT r.id FROM public.rodadas r WHERE r.liga_id = v_liga_id)
    )
  ) INTO v_payload;

  -- Remove any existing export entry with this name to keep clean
  DELETE FROM public.publicacoes WHERE liga_nome = 'EXPORT_LIGA_BEACH_SISTERS_5T_MIGRATION';

  -- Insert consolidated export
  INSERT INTO public.publicacoes (
    user_id,
    liga_id,
    liga_nome,
    temporada,
    ranking,
    data_publicacao
  ) VALUES (
    '89544e41-82ca-4122-8b53-41cbfa0e7c10'::uuid,
    v_liga_id,
    'EXPORT_LIGA_BEACH_SISTERS_5T_MIGRATION',
    '5',
    v_payload,
    NOW()
  );
END $$;
