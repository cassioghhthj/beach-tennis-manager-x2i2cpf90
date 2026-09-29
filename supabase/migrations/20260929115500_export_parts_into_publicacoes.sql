-- Export script runner migration
DO $$
DECLARE
  v_liga jsonb;
  v_atletas jsonb;
  v_atleta_ligas jsonb;
  v_sistemas jsonb;
  v_regras jsonb;
  v_rodadas jsonb;
  v_pontuacoes jsonb;
  v_podios jsonb;
  v_full jsonb;
BEGIN
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', l.id,
      'nome', l.nome,
      'categoria', l.categoria,
      'temporada', l.temporada,
      'total_rodadas', l.total_rodadas,
      'status', l.status,
      'descricao', l.descricao,
      'observacoes', l.observacoes
    )
  ), '[]'::jsonb)
  INTO v_liga
  FROM public.ligas l
  WHERE l.id = 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', a.id,
      'nome_completo', a.nome_completo,
      'telefone', a.telefone,
      'sexo', a.sexo,
      'categoria_principal', a.categoria_principal,
      'status', a.status
    ) ORDER BY a.nome_completo
  ), '[]'::jsonb)
  INTO v_atletas
  FROM public.atletas a
  WHERE a.id IN (SELECT al.atleta_id FROM public.atleta_ligas al WHERE al.liga_id = 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid);

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', al.id,
      'atleta_id', al.atleta_id,
      'liga_id', al.liga_id
    )
  ), '[]'::jsonb)
  INTO v_atleta_ligas
  FROM public.atleta_ligas al
  WHERE al.liga_id = 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', sp.id,
      'nome', sp.nome,
      'tipo', sp.tipo,
      'ativo', sp.ativo
    )
  ), '[]'::jsonb)
  INTO v_sistemas
  FROM public.sistemas_pontuacao sp
  WHERE sp.id = 'd2f77168-0055-4c26-a7a1-ec8dd094b4d1'::uuid;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', rp.id,
      'sistema_id', rp.sistema_id,
      'chave', rp.chave,
      'valor_pontos', rp.valor_pontos
    )
  ), '[]'::jsonb)
  INTO v_regras
  FROM public.regras_pontuacao rp
  WHERE rp.sistema_id = 'd2f77168-0055-4c26-a7a1-ec8dd094b4d1'::uuid;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', r.id,
      'liga_id', r.liga_id,
      'numero', r.numero,
      'data', r.data,
      'hora', r.hora,
      'local', r.local,
      'sistema_id', r.sistema_id,
      'status', r.status,
      'snapshot_regras', r.snapshot_regras
    ) ORDER BY r.numero
  ), '[]'::jsonb)
  INTO v_rodadas
  FROM public.rodadas r
  WHERE r.liga_id = 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', pr.id,
      'rodada_id', pr.rodada_id,
      'atleta_id', pr.atleta_id,
      'pontos_grupo', pr.pontos_grupo,
      'pontos_vitorias', pr.pontos_vitorias,
      'bonus_5x0', pr.bonus_5x0,
      'pontos_podio_principal', pr.pontos_podio_principal,
      'pontos_podio_consolacao', pr.pontos_podio_consolacao,
      'pontos_presenca', pr.pontos_presenca,
      'pontos_manuais', pr.pontos_manuais,
      'observacao_manuais', pr.observacao_manuais,
      'vitorias', pr.vitorias,
      'derrotas', pr.derrotas,
      'games_pro', pr.games_pro,
      'games_contra', pr.games_contra,
      'saldo_games', pr.saldo_games,
      'total', pr.total
    ) ORDER BY pr.rodada_id, pr.total DESC
  ), '[]'::jsonb)
  INTO v_pontuacoes
  FROM public.pontuacoes_rodada pr
  WHERE pr.rodada_id IN (SELECT r.id FROM public.rodadas r WHERE r.liga_id = 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid);

  SELECT COALESCE(jsonb_agg(
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
  ), '[]'::jsonb)
  INTO v_podios
  FROM public.podios p
  LEFT JOIN public.atletas a1 ON a1.id = p.atleta1_id
  LEFT JOIN public.atletas a2 ON a2.id = p.atleta2_id
  WHERE p.rodada_id IN (SELECT r.id FROM public.rodadas r WHERE r.liga_id = 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid);

  v_full := jsonb_build_object(
    'liga', v_liga,
    'atletas', v_atletas,
    'atleta_ligas', v_atleta_ligas,
    'sistemas_pontuacao', v_sistemas,
    'regras_pontuacao', v_regras,
    'rodadas', v_rodadas,
    'pontuacoes_rodada', v_pontuacoes,
    'podios', v_podios
  );

  -- Store individual chunks in publicacoes so any part can be read cleanly
  DELETE FROM public.publicacoes WHERE liga_nome LIKE 'EXPORT_PART_%';

  INSERT INTO public.publicacoes (user_id, liga_id, liga_nome, temporada, ranking, data_publicacao)
  VALUES
    ('89544e41-82ca-4122-8b53-41cbfa0e7c10'::uuid, 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid, 'EXPORT_PART_1_LIGA', '1', v_liga, NOW()),
    ('89544e41-82ca-4122-8b53-41cbfa0e7c10'::uuid, 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid, 'EXPORT_PART_2_ATLETAS', '1', v_atletas, NOW()),
    ('89544e41-82ca-4122-8b53-41cbfa0e7c10'::uuid, 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid, 'EXPORT_PART_3_ATLETA_LIGAS', '1', v_atleta_ligas, NOW()),
    ('89544e41-82ca-4122-8b53-41cbfa0e7c10'::uuid, 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid, 'EXPORT_PART_4_SISTEMAS', '1', v_sistemas, NOW()),
    ('89544e41-82ca-4122-8b53-41cbfa0e7c10'::uuid, 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid, 'EXPORT_PART_5_REGRAS', '1', v_regras, NOW()),
    ('89544e41-82ca-4122-8b53-41cbfa0e7c10'::uuid, 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid, 'EXPORT_PART_6_RODADAS', '1', v_rodadas, NOW()),
    ('89544e41-82ca-4122-8b53-41cbfa0e7c10'::uuid, 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid, 'EXPORT_PART_7_PONTUACOES', '1', v_pontuacoes, NOW()),
    ('89544e41-82ca-4122-8b53-41cbfa0e7c10'::uuid, 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid, 'EXPORT_PART_8_PODIOS', '1', v_podios, NOW());

END $$;
