-- Migration: Export LIGA ELAS EM JOGO (id: c4a69830-4eec-43a5-ac21-444a9e93f87a)
DO $$
DECLARE
  v_liga_id uuid := 'c4a69830-4eec-43a5-ac21-444a9e93f87a'::uuid;
  v_payload jsonb;
BEGIN
  -- Build the JSON structure with the exact 8 arrays requested
  SELECT jsonb_build_object(
    'liga', (
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
      FROM public.ligas l
      WHERE l.id = v_liga_id
    ),
    'atletas', (
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
      FROM public.atletas a
      WHERE a.id IN (SELECT al.atleta_id FROM public.atleta_ligas al WHERE al.liga_id = v_liga_id)
    ),
    'atleta_ligas', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', al.id,
          'atleta_id', al.atleta_id,
          'liga_id', al.liga_id
        )
      ), '[]'::jsonb)
      FROM public.atleta_ligas al
      WHERE al.liga_id = v_liga_id
    ),
    'sistemas_pontuacao', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', sp.id,
          'nome', sp.nome,
          'tipo', sp.tipo,
          'ativo', sp.ativo
        )
      ), '[]'::jsonb)
      FROM public.sistemas_pontuacao sp
      WHERE sp.id IN (SELECT DISTINCT r.sistema_id FROM public.rodadas r WHERE r.liga_id = v_liga_id)
    ),
    'regras_pontuacao', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', rp.id,
          'sistema_id', rp.sistema_id,
          'chave', rp.chave,
          'valor_pontos', rp.valor_pontos
        )
      ), '[]'::jsonb)
      FROM public.regras_pontuacao rp
      WHERE rp.sistema_id IN (SELECT DISTINCT r.sistema_id FROM public.rodadas r WHERE r.liga_id = v_liga_id)
    ),
    'rodadas', (
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
      FROM public.rodadas r
      WHERE r.liga_id = v_liga_id
    ),
    'pontuacoes_rodada', (
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
        )
      ), '[]'::jsonb)
      FROM public.pontuacoes_rodada pr
      WHERE pr.rodada_id IN (SELECT r.id FROM public.rodadas r WHERE r.liga_id = v_liga_id)
    ),
    'podios', (
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
      FROM public.podios p
      LEFT JOIN public.atletas a1 ON a1.id = p.atleta1_id
      LEFT JOIN public.atletas a2 ON a2.id = p.atleta2_id
      WHERE p.rodada_id IN (SELECT r.id FROM public.rodadas r WHERE r.liga_id = v_liga_id)
    )
  ) INTO v_payload;

  -- Ensure we persist the export in publicacoes with a well-known key
  DELETE FROM public.publicacoes WHERE liga_nome = 'EXPORT_LIGA_ELAS_EM_JOGO';

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
    'EXPORT_LIGA_ELAS_EM_JOGO',
    '1',
    v_payload,
    NOW()
  );
END $$;
