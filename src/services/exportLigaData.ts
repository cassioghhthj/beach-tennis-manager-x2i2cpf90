import { supabase } from '@/lib/supabase/client'

export interface LigaExportData {
  liga: Array<{
    id: string
    nome: string
    categoria: string | null
    temporada: string | null
    total_rodadas: number | null
    status: string | null
    descricao: string | null
    observacoes: string | null
  }>
  atletas: Array<{
    id: string
    nome_completo: string
    telefone: string | null
    sexo: string | null
    categoria_principal: string | null
    status: string | null
  }>
  atleta_ligas: Array<{
    id: string
    atleta_id: string
    liga_id: string
  }>
  sistemas_pontuacao: Array<{
    id: string
    nome: string
    tipo: string
    ativo: boolean
  }>
  regras_pontuacao: Array<{
    id: string
    sistema_id: string
    chave: string
    valor_pontos: number
  }>
  rodadas: Array<{
    id: string
    liga_id: string
    numero: string
    data: string
    hora: string
    local: string
    sistema_id: string | null
    status: string | null
    snapshot_regras: unknown
  }>
  pontuacoes_rodada: Array<{
    id: string
    rodada_id: string
    atleta_id: string
    pontos_grupo: number
    pontos_vitorias: number
    bonus_5x0: number
    pontos_podio_principal: number
    pontos_podio_consolacao: number
    pontos_presenca: number
    pontos_manuais: number
    observacao_manuais: string | null
    vitorias: number
    derrotas: number
    games_pro: number
    games_contra: number
    saldo_games: number
    total: number
  }>
  podios: Array<{
    id: string
    rodada_id: string
    tipo: string
    posicao: number
    atleta1_id: string | null
    atleta2_id: string | null
    atleta1_nome?: string | null
    atleta2_nome?: string | null
  }>
}

export const LIGA_ELAS_EM_JOGO_ID = 'c4a69830-4eec-43a5-ac21-444a9e93f87a'

/**
 * Fetches all 8 tables for a given liga directly from Supabase client.
 */
export async function exportLigaData(ligaId = LIGA_ELAS_EM_JOGO_ID): Promise<LigaExportData> {
  // Try fetching complete pre-computed snapshot from publicacoes first (fast and complete)
  const { data: pubData } = await supabase
    .from('publicacoes')
    .select('ranking')
    .eq('liga_nome', 'EXPORT_LIGA_ELAS_EM_JOGO')
    .maybeSingle()

  if (pubData && pubData.ranking) {
    const r = pubData.ranking as any
    if (
      Array.isArray(r.liga) &&
      Array.isArray(r.atletas) &&
      Array.isArray(r.pontuacoes_rodada) &&
      r.pontuacoes_rodada.length > 0
    ) {
      return r as LigaExportData
    }
  }

  // 1. Fetch Liga
  const { data: ligas, error: lErr } = await supabase
    .from('ligas')
    .select('id, nome, categoria, temporada, total_rodadas, status, descricao, observacoes')
    .eq('id', ligaId)
  if (lErr) throw lErr
  if (!ligas || ligas.length === 0) throw new Error('Liga não encontrada')

  // 2. Fetch Atleta Ligas
  const { data: atletaLigas, error: alErr } = await supabase
    .from('atleta_ligas')
    .select('id, atleta_id, liga_id')
    .eq('liga_id', ligaId)
  if (alErr) throw alErr

  const atletaIds = (atletaLigas || []).map((al) => al.atleta_id)

  // 3. Fetch Atletas
  let atletas: any[] = []
  if (atletaIds.length > 0) {
    const { data: aData, error: aErr } = await supabase
      .from('atletas')
      .select('id, nome_completo, telefone, sexo, categoria_principal, status')
      .in('id', atletaIds)
      .order('nome_completo', { ascending: true })
    if (aErr) throw aErr
    atletas = aData || []
  }

  // Athlete name map for Podios
  const atletaMap = new Map<string, string>()
  atletas.forEach((a) => atletaMap.set(a.id, a.nome_completo))

  // 4. Fetch Rodadas
  const { data: rodadas, error: rErr } = await supabase
    .from('rodadas')
    .select('id, liga_id, numero, data, hora, local, sistema_id, status, snapshot_regras')
    .eq('liga_id', ligaId)
    .order('numero', { ascending: true })
  if (rErr) throw rErr

  const rodadaIds = (rodadas || []).map((r) => r.id)
  const sistemaIds = Array.from(
    new Set((rodadas || []).map((r) => r.sistema_id).filter((s): s is string => Boolean(s))),
  )

  // 5. Fetch Sistemas Pontuação
  let sistemasPontuacao: any[] = []
  if (sistemaIds.length > 0) {
    const { data: spData, error: spErr } = await supabase
      .from('sistemas_pontuacao')
      .select('id, nome, tipo, ativo')
      .in('id', sistemaIds)
    if (spErr) throw spErr
    sistemasPontuacao = spData || []
  }

  // 6. Fetch Regras Pontuação
  let regrasPontuacao: any[] = []
  if (sistemaIds.length > 0) {
    const { data: rpData, error: rpErr } = await supabase
      .from('regras_pontuacao')
      .select('id, sistema_id, chave, valor_pontos')
      .in('sistema_id', sistemaIds)
    if (rpErr) throw rpErr
    regrasPontuacao = rpData || []
  }

  // 7. Fetch Pontuações Rodada
  let pontuacoesRodada: any[] = []
  if (rodadaIds.length > 0) {
    // Fetch in chunks or with higher limit to ensure all 111 records are captured
    const { data: prData, error: prErr } = await supabase
      .from('pontuacoes_rodada')
      .select(
        'id, rodada_id, atleta_id, pontos_grupo, pontos_vitorias, bonus_5x0, pontos_podio_principal, pontos_podio_consolacao, pontos_presenca, pontos_manuais, observacao_manuais, vitorias, derrotas, games_pro, games_contra, saldo_games, total',
      )
      .in('rodada_id', rodadaIds)
      .limit(500)
    if (prErr) throw prErr
    pontuacoesRodada = prData || []
  }
  // 8. Fetch Pódios
  let podios: any[] = []
  if (rodadaIds.length > 0) {
    const { data: pData, error: pErr } = await supabase
      .from('podios')
      .select('id, rodada_id, tipo, posicao, atleta1_id, atleta2_id')
      .in('rodada_id', rodadaIds)
      .order('posicao', { ascending: true })
    if (pErr) throw pErr

    // Collect any extra athletes in podios that weren't in atleta_ligas (just in case)
    const extraIds: string[] = []
    ;(pData || []).forEach((p) => {
      if (p.atleta1_id && !atletaMap.has(p.atleta1_id)) extraIds.push(p.atleta1_id)
      if (p.atleta2_id && !atletaMap.has(p.atleta2_id)) extraIds.push(p.atleta2_id)
    })

    if (extraIds.length > 0) {
      const { data: extraAtletas } = await supabase
        .from('atletas')
        .select('id, nome_completo')
        .in('id', extraIds)
      extraAtletas?.forEach((ea) => atletaMap.set(ea.id, ea.nome_completo))
    }

    podios = (pData || []).map((p) => ({
      ...p,
      atleta1_nome: p.atleta1_id ? atletaMap.get(p.atleta1_id) || null : null,
      atleta2_nome: p.atleta2_id ? atletaMap.get(p.atleta2_id) || null : null,
    }))
  }

  return {
    liga: ligas as any,
    atletas,
    atleta_ligas: atletaLigas || [],
    sistemas_pontuacao: sistemasPontuacao,
    regras_pontuacao: regrasPontuacao,
    rodadas: rodadas || [],
    pontuacoes_rodada: pontuacoesRodada,
    podios,
  }
}

/**
 * Downloads a payload as a JSON file in browser environment
 */
export function downloadJsonFile(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
