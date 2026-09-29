import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey || anonKey)

    const url = new URL(req.url)

    // Check if base64 chunked is requested from publicacoes table
    const pubPart = url.searchParams.get('part_key')
    if (pubPart) {
      const { data: partData, error: pErr } = await supabase
        .from('publicacoes')
        .select('ranking')
        .eq('liga_nome', pubPart)
        .maybeSingle()
      if (pErr) throw pErr

      const format = url.searchParams.get('format')
      const offset = url.searchParams.has('offset')
        ? parseInt(url.searchParams.get('offset')!, 10)
        : null
      const limit = url.searchParams.has('limit')
        ? parseInt(url.searchParams.get('limit')!, 10)
        : null

      let dataToReturn = partData?.ranking ?? null
      if (Array.isArray(dataToReturn) && offset !== null && limit !== null) {
        dataToReturn = dataToReturn.slice(offset, offset + limit)
      }

      // String chunk
      if (format === 'text_chunk') {
        const fullStr = JSON.stringify(dataToReturn)
        const charOffset = parseInt(url.searchParams.get('char_offset') || '0', 10)
        const charLimit = parseInt(url.searchParams.get('char_limit') || '3000', 10)
        const chunk = fullStr.substring(charOffset, charOffset + charLimit)
        return new Response(
          `/* CHUNK ${charOffset}-${charOffset + chunk.length} OF ${fullStr.length} */\n${chunk}`,
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'text/plain; charset=utf-8',
            },
            status: 200,
          },
        )
      }

      return new Response(JSON.stringify(dataToReturn, null, 2), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${pubPart.toLowerCase()}.json"`,
        },
        status: 200,
      })
    }

    if (url.searchParams.get('inspect') === '1') {
      const { data: pubs } = await supabase.from('publicacoes').select('liga_nome')
      return new Response(JSON.stringify({ pubNames: pubs?.map((p) => p.liga_nome) }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const ligaId = url.searchParams.get('liga_id') || 'c4a69830-4eec-43a5-ac21-444a9e93f87a'
    const table = url.searchParams.get('table') // optional: allow downloading in parts

    // 1. Liga
    const { data: ligas, error: lErr } = await supabase
      .from('ligas')
      .select('id, nome, categoria, temporada, total_rodadas, status, descricao, observacoes')
      .eq('id', ligaId)
    if (lErr) throw lErr

    // 2. Atleta Ligas
    const { data: atletaLigas, error: alErr } = await supabase
      .from('atleta_ligas')
      .select('id, atleta_id, liga_id')
      .eq('liga_id', ligaId)
    if (alErr) throw alErr

    const atletaIds = (atletaLigas || []).map((al: any) => al.atleta_id)

    // 3. Atletas
    const { data: atletas, error: aErr } = await supabase
      .from('atletas')
      .select('id, nome_completo, telefone, sexo, categoria_principal, status')
      .in('id', atletaIds)
      .order('nome_completo', { ascending: true })
    if (aErr) throw aErr

    const atletaMap = new Map<string, string>()
    atletas?.forEach((a: any) => atletaMap.set(a.id, a.nome_completo))

    // 4. Rodadas
    const { data: rodadas, error: rErr } = await supabase
      .from('rodadas')
      .select('id, liga_id, numero, data, hora, local, sistema_id, status, snapshot_regras')
      .eq('liga_id', ligaId)
      .order('numero', { ascending: true })
    if (rErr) throw rErr

    const rodadaIds = (rodadas || []).map((r: any) => r.id)
    const sistemaIds = Array.from(
      new Set((rodadas || []).map((r: any) => r.sistema_id).filter(Boolean)),
    )

    // 5. Sistemas
    const { data: sistemasPontuacao, error: spErr } = await supabase
      .from('sistemas_pontuacao')
      .select('id, nome, tipo, ativo')
      .in('id', sistemaIds)
    if (spErr) throw spErr

    // 6. Regras
    const { data: regrasPontuacao, error: rpErr } = await supabase
      .from('regras_pontuacao')
      .select('id, sistema_id, chave, valor_pontos')
      .in('sistema_id', sistemaIds)
    if (rpErr) throw rpErr

    // 7. Pontuações
    const { data: pontuacoesRodada, error: prErr } = await supabase
      .from('pontuacoes_rodada')
      .select(
        'id, rodada_id, atleta_id, pontos_grupo, pontos_vitorias, bonus_5x0, pontos_podio_principal, pontos_podio_consolacao, pontos_presenca, pontos_manuais, observacao_manuais, vitorias, derrotas, games_pro, games_contra, saldo_games, total',
      )
      .in('rodada_id', rodadaIds)
    if (prErr) throw prErr

    // 8. Podios
    const { data: rawPodios, error: pErr } = await supabase
      .from('podios')
      .select('id, rodada_id, tipo, posicao, atleta1_id, atleta2_id')
      .in('rodada_id', rodadaIds)
      .order('posicao', { ascending: true })
    if (pErr) throw pErr

    const podios = (rawPodios || []).map((p: any) => ({
      id: p.id,
      rodada_id: p.rodada_id,
      tipo: p.tipo,
      posicao: p.posicao,
      atleta1_id: p.atleta1_id,
      atleta2_id: p.atleta2_id,
      atleta1_nome: p.atleta1_id ? atletaMap.get(p.atleta1_id) || null : null,
      atleta2_nome: p.atleta2_id ? atletaMap.get(p.atleta2_id) || null : null,
    }))

    const fullExport = {
      liga: ligas || [],
      atletas: atletas || [],
      atleta_ligas: atletaLigas || [],
      sistemas_pontuacao: sistemasPontuacao || [],
      regras_pontuacao: regrasPontuacao || [],
      rodadas: rodadas || [],
      pontuacoes_rodada: pontuacoesRodada || [],
      podios: podios || [],
    }

    // Support rodada offset/limit or splitting pontuacoes_rodada into parts
    const part = url.searchParams.get('part')
    if (table === 'pontuacoes_rodada' && part) {
      // 111 pontuacoes: split into parts (e.g. part=1 (50), part=2 (50), part=3 (11))
      const pNum = parseInt(part, 10) || 1
      const pageSize = 40
      const start = (pNum - 1) * pageSize
      const end = start + pageSize
      const slice = pontuacoesRodada.slice(start, end)
      return new Response(JSON.stringify(slice, null, 2), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="pontuacoes_rodada_part${pNum}.json"`,
        },
        status: 200,
      })
    }

    if (table && table in fullExport) {
      return new Response(
        JSON.stringify({ [table]: fullExport[table as keyof typeof fullExport] }, null, 2),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${table}.json"`,
          },
          status: 200,
        },
      )
    }

    return new Response(JSON.stringify(fullExport, null, 2), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="liga_elas_em_jogo.json"',
      },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
