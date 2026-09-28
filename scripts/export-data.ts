import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://wskwmmehuiogokvnalik.supabase.co'
// Using anon/publishable key: anon has full SELECT on all relevant tables via allow_anon_read
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indza3dtbWVodWlvZ29rdm5hbGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0Nzg3ODcsImV4cCI6MjA2MjA1NDc4N30.C3Y48_18tG3sXmX0i8K7F81l2n6e9Y-O2c2k-bE6fA'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function run() {
  console.log('Fetching liga...')
  const { data: ligas, error: lErr } = await supabase
    .from('ligas')
    .select('*')
    .eq('nome', 'LIGA BEACH SISTERS 5ª T')

  if (lErr || !ligas || ligas.length === 0) {
    console.error('Error finding liga:', lErr)
    process.exit(1)
  }

  const liga = ligas[0]
  const ligaId = liga.id
  console.log(`Found liga: ${liga.nome} (id: ${ligaId})`)

  // 1. atleta_ligas
  console.log('Fetching atleta_ligas...')
  const { data: atletaLigas, error: alErr } = await supabase
    .from('atleta_ligas')
    .select('*')
    .eq('liga_id', ligaId)
  if (alErr) throw alErr

  const atletaIds = (atletaLigas || []).map((al: any) => al.atleta_id)

  // 2. atletas
  console.log(`Fetching ${atletaIds.length} atletas...`)
  const { data: atletas, error: aErr } = await supabase
    .from('atletas')
    .select('*')
    .in('id', atletaIds)
    .order('nome_completo', { ascending: true })
  if (aErr) throw aErr

  // Map to resolve athlete names by ID (includes fallback for any athletes referenced outside)
  const allReferencedAtletaIds = new Set<string>(atletaIds)

  const atletaNameMap = new Map<string, string>()
  atletas?.forEach((a: any) => atletaNameMap.set(a.id, a.nome_completo))

  // 3. rodadas
  console.log('Fetching rodadas...')
  const { data: rodadas, error: rErr } = await supabase
    .from('rodadas')
    .select('*')
    .eq('liga_id', ligaId)
    .order('numero', { ascending: true })
  if (rErr) throw rErr

  const rodadaIds = (rodadas || []).map((r: any) => r.id)
  const sistemaIds = Array.from(
    new Set((rodadas || []).map((r: any) => r.sistema_id).filter(Boolean)),
  )

  // 4. sistemas_pontuacao
  console.log(`Fetching ${sistemaIds.length} sistemas...`)
  const { data: sistemasPontuacao, error: spErr } = await supabase
    .from('sistemas_pontuacao')
    .select('*')
    .in('id', sistemaIds)
  if (spErr) throw spErr

  // 5. regras_pontuacao
  console.log('Fetching regras_pontuacao...')
  const { data: regrasPontuacao, error: rpErr } = await supabase
    .from('regras_pontuacao')
    .select('*')
    .in('sistema_id', sistemaIds)
  if (rpErr) throw rpErr

  // 6. pontuacoes_rodada
  console.log(`Fetching pontuacoes_rodada for rodadas: ${rodadaIds}...`)
  const { data: pontuacoesRodada, error: prErr } = await supabase
    .from('pontuacoes_rodada')
    .select('*')
    .in('rodada_id', rodadaIds)
  if (prErr) throw prErr

  // 7. podios
  console.log('Fetching podios...')
  const { data: rawPodios, error: pErr } = await supabase
    .from('podios')
    .select('*')
    .in('rodada_id', rodadaIds)
  if (pErr) throw pErr

  // Collect any extra athlete IDs that might be in podios but not in atleta_ligas
  const extraAtletaIds: string[] = []
  rawPodios?.forEach((p: any) => {
    if (p.atleta1_id && !atletaNameMap.has(p.atleta1_id)) {
      extraAtletaIds.push(p.atleta1_id)
    }
    if (p.atleta2_id && !atletaNameMap.has(p.atleta2_id)) {
      extraAtletaIds.push(p.atleta2_id)
    }
  })

  if (extraAtletaIds.length > 0) {
    const { data: extraAtletas } = await supabase
      .from('atletas')
      .select('*')
      .in('id', extraAtletaIds)
    extraAtletas?.forEach((a: any) => atletaNameMap.set(a.id, a.nome_completo))
  }

  // Add athlete names to podios via join with atletas when the id exists
  const podios = (rawPodios || []).map((p: any) => ({
    ...p,
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

  const exportPath = path.join(exportDir, 'liga_beach_sisters_5t.json')
  fs.writeFileSync(exportPath, JSON.stringify(result, null, 2), 'utf8')

  console.log(`Successfully wrote export to ${exportPath}`)
  console.log('Record counts:')
  console.log(`- liga: ${result.liga.length}`)
  console.log(`- atletas: ${result.atletas.length}`)
  console.log(`- atleta_ligas: ${result.atleta_ligas.length}`)
  console.log(`- sistemas_pontuacao: ${result.sistemas_pontuacao.length}`)
  console.log(`- regras_pontuacao: ${result.regras_pontuacao.length}`)
  console.log(`- rodadas: ${result.rodadas.length}`)
  console.log(`- pontuacoes_rodada: ${result.pontuacoes_rodada.length}`)
  console.log(`- podios: ${result.podios.length}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
