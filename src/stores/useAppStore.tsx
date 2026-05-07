import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export type Status = 'Ativo' | 'Inativo'
export type Sexo = 'M' | 'F'
export type TipoSistema = 'Geral' | 'Vitorias'

export interface Liga {
  id: string
  nome: string
  categoria: string
  temporada: string
  total_rodadas: number
  status: Status
  descricao: string
  observacoes: string
}
export interface Atleta {
  id: string
  nome_completo: string
  telefone: string
  sexo: Sexo
  categoria_principal: string
  status: Status
  observacoes: string
  avatar_url?: string
}
export interface AtletaLiga {
  id: string
  atleta_id: string
  liga_id: string
}
export interface SistemaPontuacao {
  id: string
  nome: string
  tipo: TipoSistema
  ativo: boolean
}
export interface RegraPontuacao {
  id: string
  sistema_id: string
  chave: string
  valor_pontos: number
}

export type RodadaStatus =
  | 'Draft'
  | 'In Progress'
  | 'Partially Finalized'
  | 'Round Finalized'
  | 'Published'

export interface Rodada {
  id: string
  liga_id: string
  numero: string
  data: string
  hora: string
  local: string
  sistema_id: string
  status: RodadaStatus
  observacoes: string
  snapshot_regras?: RegraPontuacao[]
}

export interface Grupo {
  id: string
  rodada_id: string
  nome: string
  finalizado: boolean
}

export type GrupoAtletaStatus = 'Active' | 'Withdrawn' | 'Substituted'

export interface GrupoAtleta {
  id: string
  grupo_id: string
  atleta_id: string
  status: GrupoAtletaStatus
  substituido_por_id?: string
  motivo_substituicao?: string
}

export interface Partida {
  id: string
  grupo_id: string
  atleta1_id: string
  atleta2_id: string
  score1: number
  atleta3_id: string
  atleta4_id: string
  score2: number
}

export interface Podio {
  id: string
  rodada_id: string
  tipo: 'Principal' | 'Consolacao'
  posicao: 1 | 2 | 3
  atleta1_id: string
  atleta2_id?: string
}

export interface PontuacaoRodada {
  id: string
  rodada_id: string
  atleta_id: string
  pontos_grupo: number
  pontos_vitorias: number
  bonus_5x0: number
  pontos_podio_principal: number
  pontos_podio_consolacao: number
  total: number
}

export interface RankingSnapshotItem {
  posicao: number
  atleta_id: string
  nome: string
  avatar?: string
  categoria: string
  total: number
  podios: number
  bonus_5x0: number
  media: string
  rodadas: Record<string, number>
}

export interface Publicacao {
  id: string
  data_publicacao: string
  liga_id: string
  liga_nome: string
  temporada: string
  ranking: RankingSnapshotItem[]
}

interface AppState {
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  ligas: Liga[]
  addLiga: (l: Omit<Liga, 'id'>) => Promise<void>
  updateLiga: (id: string, l: Partial<Liga>) => Promise<void>
  atletas: Atleta[]
  addAtleta: (a: Omit<Atleta, 'id'>, l: string[]) => Promise<void>
  updateAtleta: (id: string, a: Partial<Atleta>, l?: string[]) => Promise<void>
  atletaLigas: AtletaLiga[]
  getAtletaLigas: (id: string) => Liga[]
  sistemas: SistemaPontuacao[]
  addSistema: (
    s: Omit<SistemaPontuacao, 'id'>,
    r: Omit<RegraPontuacao, 'id' | 'sistema_id'>[],
  ) => Promise<void>
  updateSistema: (id: string, s: Partial<SistemaPontuacao>) => Promise<void>
  updateRegrasSistema: (
    sistema_id: string,
    r: Omit<RegraPontuacao, 'id' | 'sistema_id'>[],
  ) => Promise<void>
  regras: RegraPontuacao[]
  rodadas: Rodada[]
  addRodada: (r: Omit<Rodada, 'id'>) => Promise<void>
  updateRodada: (id: string, r: Partial<Rodada>) => Promise<void>
  deleteRodada: (id: string) => Promise<void>
  grupos: Grupo[]
  addGrupo: (g: Omit<Grupo, 'id'>) => Promise<void>
  updateGrupo: (id: string, g: Partial<Grupo>) => Promise<void>
  deleteGrupo: (id: string) => Promise<void>
  grupoAtletas: GrupoAtleta[]
  addGrupoAtleta: (ga: Omit<GrupoAtleta, 'id'>) => Promise<void>
  updateGrupoAtleta: (id: string, ga: Partial<GrupoAtleta>) => Promise<void>
  deleteGrupoAtleta: (id: string) => Promise<void>
  partidas: Partida[]
  substituirAtletaNoGrupo: (gaId: string, subId: string, motivo: string) => Promise<void>
  addPartida: (p: Omit<Partida, 'id'>) => Promise<void>
  updatePartida: (id: string, p: Partial<Partida>) => Promise<void>
  deletePartida: (id: string) => Promise<void>
  podios: Podio[]
  salvarPodiosRodada: (rodadaId: string, p: Podio[]) => Promise<void>
  pontuacoes: PontuacaoRodada[]
  finalizarRodada: (rodadaId: string) => Promise<void>
  publicacoes: Publicacao[]
  publicarRanking: (
    ligaId: string,
    ligaNome: string,
    temporada: string,
    ranking: RankingSnapshotItem[],
  ) => Promise<void>
  deletePublicacao: (id: string) => Promise<void>
}

const AppContext = createContext<AppState | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const isAuthenticated = !!user

  const [ligas, setLigas] = useState<Liga[]>([])
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [atletaLigas, setAtletaLigas] = useState<AtletaLiga[]>([])
  const [sistemas, setSistemas] = useState<SistemaPontuacao[]>([])
  const [regras, setRegras] = useState<RegraPontuacao[]>([])
  const [rodadas, setRodadas] = useState<Rodada[]>([])
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [grupoAtletas, setGrupoAtletas] = useState<GrupoAtleta[]>([])
  const [partidas, setPartidas] = useState<Partida[]>([])
  const [podios, setPodios] = useState<Podio[]>([])
  const [pontuacoes, setPontuacoes] = useState<PontuacaoRodada[]>([])
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([])

  useEffect(() => {
    const loadData = async () => {
      const [
        { data: ligasData },
        { data: atletasData },
        { data: atletaLigasData },
        { data: sistemasData },
        { data: regrasData },
        { data: rodadasData },
        { data: gruposData },
        { data: grupoAtletasData },
        { data: partidasData },
        { data: podiosData },
        { data: pontuacoesData },
        { data: publicacoesData },
      ] = await Promise.all([
        supabase.from('ligas').select('*').order('created_at', { ascending: false }),
        supabase.from('atletas').select('*').order('created_at', { ascending: false }),
        supabase.from('atleta_ligas').select('*'),
        supabase.from('sistemas_pontuacao').select('*'),
        supabase.from('regras_pontuacao').select('*'),
        supabase.from('rodadas').select('*'),
        supabase.from('grupos').select('*'),
        supabase.from('grupo_atletas').select('*'),
        supabase.from('partidas').select('*'),
        supabase.from('podios').select('*'),
        supabase.from('pontuacoes_rodada').select('*'),
        supabase.from('publicacoes').select('*').order('data_publicacao', { ascending: false }),
      ])

      if (ligasData) setLigas(ligasData as Liga[])
      if (atletasData) setAtletas(atletasData as Atleta[])
      if (atletaLigasData) setAtletaLigas(atletaLigasData as AtletaLiga[])
      if (sistemasData) setSistemas(sistemasData as SistemaPontuacao[])
      if (regrasData) setRegras(regrasData as RegraPontuacao[])
      if (rodadasData) setRodadas(rodadasData as Rodada[])
      if (gruposData) setGrupos(gruposData as Grupo[])
      if (grupoAtletasData) setGrupoAtletas(grupoAtletasData as GrupoAtleta[])
      if (partidasData) setPartidas(partidasData as Partida[])
      if (podiosData) setPodios(podiosData as Podio[])
      if (pontuacoesData) setPontuacoes(pontuacoesData as PontuacaoRodada[])
      if (publicacoesData) setPublicacoes(publicacoesData as Publicacao[])
    }

    loadData()
  }, [user])

  const login = async () => {
    await supabase.auth.signInWithPassword({
      email: 'ferricontabilidade@uol.com.br',
      password: 'Skip@Password123',
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const addLiga = async (liga: Omit<Liga, 'id'>) => {
    const { data } = await supabase.from('ligas').insert([liga]).select().single()
    if (data) setLigas((prev) => [data as Liga, ...prev])
  }

  const updateLiga = async (id: string, liga: Partial<Liga>) => {
    const { data } = await supabase.from('ligas').update(liga).eq('id', id).select().single()
    if (data) setLigas((prev) => prev.map((l) => (l.id === id ? (data as Liga) : l)))
  }

  const addAtleta = async (atleta: Omit<Atleta, 'id'>, ligas_ids: string[]) => {
    const avatar_url =
      atleta.avatar_url ||
      `https://img.usecurling.com/ppl/thumbnail?gender=${atleta.sexo === 'M' ? 'male' : 'female'}&seed=${Math.random()}`
    const { data: newAtleta } = await supabase
      .from('atletas')
      .insert([{ ...atleta, avatar_url }])
      .select()
      .single()

    if (newAtleta) {
      setAtletas((prev) => [newAtleta as Atleta, ...prev])
      if (ligas_ids.length > 0) {
        const { data: novasLigas } = await supabase
          .from('atleta_ligas')
          .insert(ligas_ids.map((l) => ({ atleta_id: newAtleta.id, liga_id: l })))
          .select()
        if (novasLigas) setAtletaLigas((prev) => [...(novasLigas as AtletaLiga[]), ...prev])
      }
    }
  }

  const updateAtleta = async (id: string, atleta: Partial<Atleta>, ligas_ids?: string[]) => {
    const { data } = await supabase.from('atletas').update(atleta).eq('id', id).select().single()
    if (data) setAtletas((prev) => prev.map((a) => (a.id === id ? (data as Atleta) : a)))

    if (ligas_ids) {
      await supabase.from('atleta_ligas').delete().eq('atleta_id', id)
      if (ligas_ids.length > 0) {
        const { data: novasLigas } = await supabase
          .from('atleta_ligas')
          .insert(ligas_ids.map((l) => ({ atleta_id: id, liga_id: l })))
          .select()
        if (novasLigas) {
          setAtletaLigas((prev) => [
            ...prev.filter((al) => al.atleta_id !== id),
            ...(novasLigas as AtletaLiga[]),
          ])
        }
      } else {
        setAtletaLigas((prev) => prev.filter((al) => al.atleta_id !== id))
      }
    }
  }

  const getAtletaLigas = (atletaId: string) => {
    const ids = atletaLigas.filter((al) => al.atleta_id === atletaId).map((al) => al.liga_id)
    return ligas.filter((l) => ids.includes(l.id))
  }

  const addSistema = async (
    sistema: Omit<SistemaPontuacao, 'id'>,
    novasRegras: Omit<RegraPontuacao, 'id' | 'sistema_id'>[],
  ) => {
    const { data: sData } = await supabase
      .from('sistemas_pontuacao')
      .insert([sistema])
      .select()
      .single()
    if (sData) {
      setSistemas((prev) => [...prev, sData as SistemaPontuacao])
      const regrasToInsert = novasRegras.map((r) => ({ ...r, sistema_id: sData.id }))
      if (regrasToInsert.length > 0) {
        const { data: rData } = await supabase
          .from('regras_pontuacao')
          .insert(regrasToInsert)
          .select()
        if (rData) setRegras((prev) => [...prev, ...(rData as RegraPontuacao[])])
      }
    }
  }

  const updateSistema = async (id: string, sistema: Partial<SistemaPontuacao>) => {
    const { data } = await supabase
      .from('sistemas_pontuacao')
      .update(sistema)
      .eq('id', id)
      .select()
      .single()
    if (data) setSistemas((prev) => prev.map((s) => (s.id === id ? (data as SistemaPontuacao) : s)))
  }

  const updateRegrasSistema = async (
    sistema_id: string,
    novasRegras: Omit<RegraPontuacao, 'id' | 'sistema_id'>[],
  ) => {
    await supabase.from('regras_pontuacao').delete().eq('sistema_id', sistema_id)
    const regrasToInsert = novasRegras.map((r) => ({ ...r, sistema_id }))
    if (regrasToInsert.length > 0) {
      const { data: rData } = await supabase
        .from('regras_pontuacao')
        .insert(regrasToInsert)
        .select()
      if (rData) {
        setRegras((prev) => [
          ...prev.filter((r) => r.sistema_id !== sistema_id),
          ...(rData as RegraPontuacao[]),
        ])
      }
    } else {
      setRegras((prev) => prev.filter((r) => r.sistema_id !== sistema_id))
    }
  }

  const addRodada = async (r: Omit<Rodada, 'id'>) => {
    const { data } = await supabase.from('rodadas').insert([r]).select().single()
    if (data) setRodadas((prev) => [data as Rodada, ...prev])
  }
  const updateRodada = async (id: string, r: Partial<Rodada>) => {
    const { data } = await supabase.from('rodadas').update(r).eq('id', id).select().single()
    if (data) setRodadas((prev) => prev.map((item) => (item.id === id ? (data as Rodada) : item)))
  }
  const deleteRodada = async (id: string) => {
    await supabase.from('rodadas').delete().eq('id', id)
    setRodadas((prev) => prev.filter((item) => item.id !== id))
  }

  const addGrupo = async (g: Omit<Grupo, 'id'>) => {
    const { data } = await supabase.from('grupos').insert([g]).select().single()
    if (data) setGrupos((prev) => [...prev, data as Grupo])
  }
  const updateGrupo = async (id: string, g: Partial<Grupo>) => {
    const { data } = await supabase.from('grupos').update(g).eq('id', id).select().single()
    if (data) setGrupos((prev) => prev.map((item) => (item.id === id ? (data as Grupo) : item)))
  }
  const deleteGrupo = async (id: string) => {
    await supabase.from('grupos').delete().eq('id', id)
    setGrupos((prev) => prev.filter((item) => item.id !== id))
  }

  const addGrupoAtleta = async (ga: Omit<GrupoAtleta, 'id'>) => {
    const { data } = await supabase.from('grupo_atletas').insert([ga]).select().single()
    if (data) setGrupoAtletas((prev) => [...prev, data as GrupoAtleta])
  }
  const updateGrupoAtleta = async (id: string, ga: Partial<GrupoAtleta>) => {
    const { data } = await supabase.from('grupo_atletas').update(ga).eq('id', id).select().single()
    if (data)
      setGrupoAtletas((prev) => prev.map((item) => (item.id === id ? (data as GrupoAtleta) : item)))
  }
  const deleteGrupoAtleta = async (id: string) => {
    await supabase.from('grupo_atletas').delete().eq('id', id)
    setGrupoAtletas((prev) => prev.filter((item) => item.id !== id))
  }

  const substituirAtletaNoGrupo = async (gaId: string, subId: string, motivo: string) => {
    const ga = grupoAtletas.find((g) => g.id === gaId)
    if (!ga) return

    const { data: updatedGa } = await supabase
      .from('grupo_atletas')
      .update({
        status: 'Substituted',
        substituido_por_id: subId,
        motivo_substituicao: motivo,
      })
      .eq('id', gaId)
      .select()
      .single()

    if (updatedGa) {
      setGrupoAtletas((prev) =>
        prev.map((item) => (item.id === gaId ? (updatedGa as GrupoAtleta) : item)),
      )
    }

    const { data: newGa } = await supabase
      .from('grupo_atletas')
      .insert([
        {
          grupo_id: ga.grupo_id,
          atleta_id: subId,
          status: 'Active',
        },
      ])
      .select()
      .single()

    if (newGa) {
      setGrupoAtletas((prev) => [...prev, newGa as GrupoAtleta])
    }

    const partidasGrupo = partidas.filter((p) => p.grupo_id === ga.grupo_id)
    for (const p of partidasGrupo) {
      let needsUpdate = false
      const updateData: Partial<Partida> = {}

      if (p.atleta1_id === ga.atleta_id) {
        updateData.atleta1_id = subId
        needsUpdate = true
      }
      if (p.atleta2_id === ga.atleta_id) {
        updateData.atleta2_id = subId
        needsUpdate = true
      }
      if (p.atleta3_id === ga.atleta_id) {
        updateData.atleta3_id = subId
        needsUpdate = true
      }
      if (p.atleta4_id === ga.atleta_id) {
        updateData.atleta4_id = subId
        needsUpdate = true
      }

      if (needsUpdate) {
        const { data: updatedP } = await supabase
          .from('partidas')
          .update(updateData)
          .eq('id', p.id)
          .select()
          .single()
        if (updatedP) {
          setPartidas((prev) =>
            prev.map((item) => (item.id === p.id ? (updatedP as Partida) : item)),
          )
        }
      }
    }
  }

  const addPartida = async (p: Omit<Partida, 'id'>) => {
    const { data } = await supabase.from('partidas').insert([p]).select().single()
    if (data) setPartidas((prev) => [...prev, data as Partida])
  }
  const updatePartida = async (id: string, p: Partial<Partida>) => {
    const { data } = await supabase.from('partidas').update(p).eq('id', id).select().single()
    if (data) setPartidas((prev) => prev.map((item) => (item.id === id ? (data as Partida) : item)))
  }
  const deletePartida = async (id: string) => {
    await supabase.from('partidas').delete().eq('id', id)
    setPartidas((prev) => prev.filter((item) => item.id !== id))
  }

  const salvarPodiosRodada = async (rodadaId: string, novos: Podio[]) => {
    await supabase.from('podios').delete().eq('rodada_id', rodadaId)
    if (novos.length > 0) {
      const { data } = await supabase
        .from('podios')
        .insert(novos.map((p) => ({ ...p, rodada_id: rodadaId })))
        .select()
      if (data) {
        setPodios((prev) => [...prev.filter((p) => p.rodada_id !== rodadaId), ...(data as Podio[])])
      }
    } else {
      setPodios((prev) => prev.filter((p) => p.rodada_id !== rodadaId))
    }
  }

  const finalizarRodada = async (rodadaId: string) => {
    const rodada = rodadas.find((r) => r.id === rodadaId)
    if (!rodada) return
    const currentRegras = regras.filter((reg) => reg.sistema_id === rodada.sistema_id)

    const { data: updatedRodada } = await supabase
      .from('rodadas')
      .update({
        status: 'Round Finalized',
        snapshot_regras: currentRegras,
      })
      .eq('id', rodadaId)
      .select()
      .single()

    if (updatedRodada) {
      setRodadas((prev) => prev.map((r) => (r.id === rodadaId ? (updatedRodada as Rodada) : r)))
    }

    await supabase.from('pontuacoes_rodada').delete().eq('rodada_id', rodadaId)

    const sis = sistemas.find((s) => s.id === rodada.sistema_id)
    const snapshot = currentRegras.length
      ? currentRegras
      : regras.filter((reg) => reg.sistema_id === rodada.sistema_id)
    const getRule = (key: string) => snapshot.find((r) => r.chave === key)?.valor_pontos || 0

    const newPts: Omit<PontuacaoRodada, 'id'>[] = []
    const atletasMap = new Map<string, Omit<PontuacaoRodada, 'id'>>()
    const statsMap = new Map<string, { wins: number; saldo: number }>()

    const initAtleta = (id: string) => {
      if (!id) return null
      if (!atletasMap.has(id)) {
        atletasMap.set(id, {
          rodada_id: rodadaId,
          atleta_id: id,
          pontos_grupo: 0,
          pontos_vitorias: 0,
          bonus_5x0: 0,
          pontos_podio_principal: 0,
          pontos_podio_consolacao: 0,
          total: 0,
        })
      }
      return atletasMap.get(id)!
    }

    const rGroups = grupos.filter((g) => g.rodada_id === rodadaId).map((g) => g.id)
    const initStats = (id: string) => {
      if (!id) return null
      if (!statsMap.has(id)) statsMap.set(id, { wins: 0, saldo: 0 })
      return statsMap.get(id)!
    }

    const rMatches = partidas.filter((p) => rGroups.includes(p.grupo_id))

    rMatches.forEach((p) => {
      ;[p.atleta1_id, p.atleta2_id, p.atleta3_id, p.atleta4_id].forEach((id) => initAtleta(id))

      const p1 = initStats(p.atleta1_id)
      const p2 = initStats(p.atleta2_id)
      const p3 = initStats(p.atleta3_id)
      const p4 = initStats(p.atleta4_id)

      const v1 = p.score1 > p.score2
      const v2 = p.score2 > p.score1
      const is5x0_1 = p.score1 === 5 && p.score2 === 0
      const is5x0_2 = p.score2 === 5 && p.score1 === 0

      const updateStats = (
        st: { wins: number; saldo: number } | null,
        isWin: boolean,
        ptsWon: number,
        ptsLost: number,
      ) => {
        if (!st) return
        if (isWin) st.wins += 1
        st.saldo += ptsWon - ptsLost
      }

      updateStats(p1, v1, p.score1, p.score2)
      updateStats(p2, v1, p.score1, p.score2)
      updateStats(p3, v2, p.score2, p.score1)
      updateStats(p4, v2, p.score2, p.score1)

      const applyPts = (
        aId: string | null,
        isWin: boolean,
        sW: number,
        sL: number,
        is5x0: boolean,
      ) => {
        const a = initAtleta(aId || '')
        if (!a) return
        if (sis?.tipo === 'Geral') {
          if (isWin) a.pontos_vitorias! += getRule('vitoria')
          if (is5x0) a.bonus_5x0! += getRule('bonus_5x0')
        } else {
          if (isWin) {
            a.pontos_vitorias! += getRule(`vitoria_${sW}x${sL}`)
            if (is5x0) a.bonus_5x0! += getRule('bonus_5x0')
          } else {
            a.pontos_vitorias! += getRule(`derrota_${sW}x${sL}`)
          }
        }
      }

      applyPts(p.atleta1_id, v1, p.score1, p.score2, is5x0_1)
      applyPts(p.atleta2_id, v1, p.score1, p.score2, is5x0_1)
      applyPts(p.atleta3_id, v2, p.score2, p.score1, is5x0_2)
      applyPts(p.atleta4_id, v2, p.score2, p.score1, is5x0_2)
    })

    if (sis?.tipo === 'Geral') {
      const rankedAthletes = Array.from(statsMap.entries())
        .sort((a, b) => b[1].wins - a[1].wins || b[1].saldo - a[1].saldo)
        .map((e) => e[0])

      rankedAthletes.forEach((aId, idx) => {
        const a = initAtleta(aId)
        if (a) {
          const pos = idx + 1
          a.pontos_grupo = getRule(`pos_${pos}`) || 0
        }
      })
    }

    const rPodios = podios.filter((p) => p.rodada_id === rodadaId)
    rPodios.forEach((p) => {
      const ruleKey = `podio_${p.tipo.toLowerCase()}_${p.posicao}`
      const pts = getRule(ruleKey)

      const applyPodio = (aId: string | undefined) => {
        const a = initAtleta(aId || '')
        if (!a) return
        if (p.tipo === 'Principal') a.pontos_podio_principal! += pts
        else a.pontos_podio_consolacao! += pts
      }
      applyPodio(p.atleta1_id)
      applyPodio(p.atleta2_id)
    })

    atletasMap.forEach((v) => {
      v.total =
        (v.pontos_grupo || 0) +
        (v.pontos_vitorias || 0) +
        (v.bonus_5x0 || 0) +
        (v.pontos_podio_principal || 0) +
        (v.pontos_podio_consolacao || 0)
      newPts.push(v)
    })

    if (newPts.length > 0) {
      const { data: insertedPts } = await supabase.from('pontuacoes_rodada').insert(newPts).select()
      if (insertedPts) {
        setPontuacoes((prev) => {
          const filtered = prev.filter((p) => p.rodada_id !== rodadaId)
          return [...filtered, ...(insertedPts as PontuacaoRodada[])]
        })
      }
    }
  }

  const publicarRanking = async (
    ligaId: string,
    ligaNome: string,
    temporada: string,
    ranking: RankingSnapshotItem[],
  ) => {
    const novaPub = {
      liga_id: ligaId,
      liga_nome: ligaNome,
      temporada,
      ranking,
    }
    const { data } = await supabase.from('publicacoes').insert([novaPub]).select().single()
    if (data) setPublicacoes((prev) => [data as Publicacao, ...prev])
  }

  const deletePublicacao = async (id: string) => {
    await supabase.from('publicacoes').delete().eq('id', id)
    setPublicacoes((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        ligas,
        addLiga,
        updateLiga,
        atletas,
        addAtleta,
        updateAtleta,
        atletaLigas,
        getAtletaLigas,
        sistemas,
        addSistema,
        updateSistema,
        updateRegrasSistema,
        regras,
        rodadas,
        addRodada,
        updateRodada,
        deleteRodada,
        grupos,
        addGrupo,
        updateGrupo,
        deleteGrupo,
        grupoAtletas,
        addGrupoAtleta,
        updateGrupoAtleta,
        deleteGrupoAtleta,
        substituirAtletaNoGrupo,
        partidas,
        addPartida,
        updatePartida,
        deletePartida,
        podios,
        salvarPodiosRodada,
        pontuacoes,
        finalizarRodada,
        publicacoes,
        publicarRanking,
        deletePublicacao,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
