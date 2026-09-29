import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://wskwmmehuiogokvnalik.supabase.co'
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indza3dtbWVodWlvZ29rdm5hbGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNzk0OTEsImV4cCI6MjA2MTY1NTQ5MX0.Q7F6GjY6eKqA7Z1jVn2f4uGq0K1L1Y_1L4X1V3N2X6Y'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function run() {
  const targetLigaId = process.env.LIGA_ID || 'c4a69830-4eec-43a5-ac21-444a9e93f87a'
  const targetLigaNome = 'LIGA ELAS EM JOGO'
  console.log(`Starting export for liga: ${targetLigaNome} (${targetLigaId})...`)

  // First check if EXPORT_LIGA_ELAS_EM_JOGO already has full pre-computed snapshot
  const { data: pubData } = await supabase
    .from('publicacoes')
    .select('ranking')
    .eq('liga_nome', 'EXPORT_LIGA_ELAS_EM_JOGO')
    .maybeSingle()

  if (pubData && pubData.ranking) {
    const r = pubData.ranking as any
    if (r.pontuacoes_rodada && r.pontuacoes_rodada.length === 111) {
      console.log('Using complete snapshot from publicacoes (111 pontuacoes)...')
      const exportDir = path.resolve(process.cwd(), 'public/exports')
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true })
      }
      const exportPath = path.join(exportDir, 'liga_elas_em_jogo.json')
      fs.writeFileSync(exportPath, JSON.stringify(r, null, 2), 'utf8')
      console.log(`Successfully wrote export to ${exportPath}`)
      return
    }
  }

  // 1. Fetch Liga
  const { data: ligas, error: lErr } = await supabase
    .from('ligas')
    .select('id, nome, categoria, temporada, total_rodadas, status, descricao, observacoes')
    .eq('id', targetLigaId)

  if (lErr || !ligas || ligas.length === 0) {
    console.error('Error finding liga:', lErr)
    process.exit(1)
  }

  const liga = ligas[0]
  console.log(`Found liga: ${liga.nome} (id: ${liga.id})`)

  // 2. Fetch atleta_ligas
  console.log('Fetching atleta_ligas...')
  const { data: atletaLigas, error: alErr } = await supabase
    .from('atleta_ligas')
    .select('id, atleta_id, liga_id')
    .eq('liga_id', targetLigaId)
  if (alErr) throw alErr

  const atletaIds = (atletaLigas || []).map((al: any) => al.atleta_id)
  console.log(`Found ${atletaIds.length} atleta_ligas linkages`)

  // 3. Fetch atletas
  console.log(`Fetching ${atletaIds.length} atletas...`)
  const { data: atletas, error: aErr } = await supabase
    .from('atletas')
    .select('id, nome_completo, telefone, sexo, categoria_principal, status')
    .in('id', atletaIds)
    .order('nome_completo', { ascending: true })
  if (aErr) throw aErr

  const atletaNameMap = new Map<string, string>()
  atletas?.forEach((a: any) => atletaNameMap.set(a.id, a.nome_completo))

  // 4. Fetch rodadas
  console.log('Fetching rodadas...')
  const { data: rodadas, error: rErr } = await supabase
    .from('rodadas')
    .select('id, liga_id, numero, data, hora, local, sistema_id, status, snapshot_regras')
    .eq('liga_id', targetLigaId)
    .order('numero', { ascending: true })
  if (rErr) throw rErr

  const rodadaIds = (rodadas || []).map((r: any) => r.id)
  const sistemaIds = Array.from(
    new Set((rodadas || []).map((r: any) => r.sistema_id).filter(Boolean)),
  )

  // 5. Fetch sistemas_pontuacao
  console.log(`Fetching ${sistemaIds.length} sistemas...`)
  const { data: sistemasPontuacao, error: spErr } = await supabase
    .from('sistemas_pontuacao')
    .select('id, nome, tipo, ativo')
    .in('id', sistemaIds)
  if (spErr) throw spErr

  // 6. Fetch regras_pontuacao
  console.log('Fetching regras_pontuacao...')
  const { data: regrasPontuacao, error: rpErr } = await supabase
    .from('regras_pontuacao')
    .select('id, sistema_id, chave, valor_pontos')
    .in('sistema_id', sistemaIds)
  if (rpErr) throw rpErr

  // 7. Fetch pontuacoes_rodada
  console.log(`Fetching pontuacoes_rodada for ${rodadaIds.length} rodadas...`)
  const { data: pontuacoesRodada, error: prErr } = await supabase
    .from('pontuacoes_rodada')
    .select(
      'id, rodada_id, atleta_id, pontos_grupo, pontos_vitorias, bonus_5x0, pontos_podio_principal, pontos_podio_consolacao, pontos_presenca, pontos_manuais, observacao_manuais, vitorias, derrotas, games_pro, games_contra, saldo_games, total',
    )
    .in('rodada_id', rodadaIds)
  if (prErr) throw prErr

  // 8. Fetch podios
  console.log('Fetching podios...')
  const { data: rawPodios, error: pErr } = await supabase
    .from('podios')
    .select('id, rodada_id, tipo, posicao, atleta1_id, atleta2_id')
    .in('rodada_id', rodadaIds)
    .order('posicao', { ascending: true })
  if (pErr) throw pErr

  // Collect extra athletes in podios if any
  const extraAtletaIds: string[] = []
  rawPodios?.forEach((p: any) => {
    if (p.atleta1_id && !atletaNameMap.has(p.atleta1_id)) extraAtletaIds.push(p.atleta1_id)
    if (p.atleta2_id && !atletaNameMap.has(p.atleta2_id)) extraAtletaIds.push(p.atleta2_id)
  })

  if (extraAtletaIds.length > 0) {
    const { data: extraAtletas } = await supabase
      .from('atletas')
      .select('id, nome_completo')
      .in('id', extraAtletaIds)
    extraAtletas?.forEach((a: any) => atletaNameMap.set(a.id, a.nome_completo))
  }

  const podios = (rawPodios || []).map((p: any) => ({
    id: p.id,
    rodada_id: p.rodada_id,
    tipo: p.tipo,
    posicao: p.posicao,
    atleta1_id: p.atleta1_id,
    atleta2_id: p.atleta2_id,
    atleta1_nome: p.atleta1_id ? atletaNameMap.get(p.atleta1_id) || null : null,
    atleta2_nome: p.atleta2_id ? atletaNameMap.get(p.atleta2_id) || null : null,
  }))

  const result = {
    liga: ligas,
    atletas: atletas || [],
    atleta_ligas: atletaLigas || [],
    sistemas_pontuacao: sistemasPontuacao || [],
    regras_pontuacao: regrasPontuacao || [],
    rodadas: rodadas || [],
    pontuacoes_rodada: pontuacoesRodada || [],
    podios: podios || [],
  }

  const exportDir = path.resolve(process.cwd(), 'public/exports')
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true })
  }

  const exportPath = path.join(exportDir, 'liga_elas_em_jogo.json')
  fs.writeFileSync(exportPath, JSON.stringify(result, null, 2), 'utf8')

  console.log(`\nSuccessfully wrote export to ${exportPath}`)
  console.log('Record counts:')
  console.log(`- 1. liga: ${result.liga.length}`)
  console.log(`- 2. atletas: ${result.atletas.length}`)
  console.log(`- 3. atleta_ligas: ${result.atleta_ligas.length}`)
  console.log(`- 4. sistemas_pontuacao: ${result.sistemas_pontuacao.length}`)
  console.log(`- 5. regras_pontuacao: ${result.regras_pontuacao.length}`)
  console.log(`- 6. rodadas: ${result.rodadas.length}`)
  console.log(`- 7. pontuacoes_rodada: ${result.pontuacoes_rodada.length}`)
  console.log(`- 8. podios: ${result.podios.length}`)
}

export { run }

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
