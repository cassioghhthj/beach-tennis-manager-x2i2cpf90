import React, { createContext, useContext, useState, ReactNode } from 'react'

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

const generateId = () => Math.random().toString(36).substring(2, 11)

const initialLigas: Liga[] = [
  {
    id: '1',
    nome: 'Liga Smash Categoria D',
    categoria: 'D',
    temporada: '2023',
    total_rodadas: 12,
    status: 'Ativo',
    descricao: 'Liga amadora',
    observacoes: '',
  },
]

const initialAtletas: Atleta[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `a${i + 1}`,
  nome_completo: `Atleta ${i + 1}`,
  telefone: '(11) 99999-9999',
  sexo: i % 2 === 0 ? 'M' : 'F',
  categoria_principal: 'D',
  status: 'Ativo',
  observacoes: '',
  avatar_url: `https://img.usecurling.com/ppl/thumbnail?gender=${i % 2 === 0 ? 'male' : 'female'}&seed=${i}`,
}))

const initialAtletaLigas: AtletaLiga[] = initialAtletas.map((a) => ({
  id: generateId(),
  atleta_id: a.id,
  liga_id: '1',
}))

const initialSistemas: SistemaPontuacao[] = [
  { id: 's1', nome: 'Sistema Geral Pro', tipo: 'Geral', ativo: true },
  { id: 's2', nome: 'Sistema Vitórias', tipo: 'Vitorias', ativo: true },
]

const initialRegras: RegraPontuacao[] = [
  { id: 'r1', sistema_id: 's1', chave: 'pos_1', valor_pontos: 180 },
  { id: 'r1_2', sistema_id: 's1', chave: 'pos_2', valor_pontos: 170 },
  { id: 'r1_3', sistema_id: 's1', chave: 'pos_3', valor_pontos: 160 },
  { id: 'r1_4', sistema_id: 's1', chave: 'pos_4', valor_pontos: 150 },
  { id: 'r1_5', sistema_id: 's1', chave: 'pos_5', valor_pontos: 140 },
  { id: 'r1_6', sistema_id: 's1', chave: 'pos_6', valor_pontos: 130 },
  { id: 'r1_7', sistema_id: 's1', chave: 'pos_7', valor_pontos: 120 },
  { id: 'r1_8', sistema_id: 's1', chave: 'pos_8', valor_pontos: 110 },
  { id: 'r1_9', sistema_id: 's1', chave: 'pos_9', valor_pontos: 100 },
  { id: 'r1_10', sistema_id: 's1', chave: 'pos_10', valor_pontos: 90 },
  { id: 'r1_11', sistema_id: 's1', chave: 'pos_11', valor_pontos: 80 },
  { id: 'r1_12', sistema_id: 's1', chave: 'pos_12', valor_pontos: 70 },
  { id: 'r1_13', sistema_id: 's1', chave: 'pos_13', valor_pontos: 60 },
  { id: 'r1_14', sistema_id: 's1', chave: 'pos_14', valor_pontos: 50 },
  { id: 'r1_15', sistema_id: 's1', chave: 'pos_15', valor_pontos: 40 },
  { id: 'r1_16', sistema_id: 's1', chave: 'pos_16', valor_pontos: 30 },
  { id: 'r1_17', sistema_id: 's1', chave: 'pos_17', valor_pontos: 20 },
  { id: 'r1_18', sistema_id: 's1', chave: 'pos_18', valor_pontos: 10 },
  { id: 'r1_19', sistema_id: 's1', chave: 'pos_19', valor_pontos: 5 },
  { id: 'r1_20', sistema_id: 's1', chave: 'pos_20', valor_pontos: 0 },
  { id: 'r2', sistema_id: 's1', chave: 'bonus_5x0', valor_pontos: 5 },
  { id: 'r3', sistema_id: 's1', chave: 'podio_principal_1', valor_pontos: 50 },
  { id: 'r4', sistema_id: 's1', chave: 'podio_principal_2', valor_pontos: 40 },
  { id: 'r5', sistema_id: 's1', chave: 'podio_principal_3', valor_pontos: 30 },
  { id: 'r6', sistema_id: 's1', chave: 'podio_consolacao_1', valor_pontos: 30 },
  { id: 'r7', sistema_id: 's1', chave: 'podio_consolacao_2', valor_pontos: 20 },
  { id: 'r8', sistema_id: 's1', chave: 'podio_consolacao_3', valor_pontos: 10 },
  { id: 'r9', sistema_id: 's2', chave: 'vitoria_5x0', valor_pontos: 100 },
  { id: 'r10', sistema_id: 's2', chave: 'vitoria_4x1', valor_pontos: 80 },
  { id: 'r11', sistema_id: 's2', chave: 'vitoria_3x2', valor_pontos: 60 },
  { id: 'r12', sistema_id: 's2', chave: 'derrota_2x3', valor_pontos: 40 },
  { id: 'r13', sistema_id: 's2', chave: 'derrota_1x4', valor_pontos: 30 },
  { id: 'r14', sistema_id: 's2', chave: 'derrota_0x5', valor_pontos: 20 },
  { id: 'r15', sistema_id: 's2', chave: 'bonus_5x0', valor_pontos: 5 },
  { id: 'r16', sistema_id: 's2', chave: 'podio_principal_1', valor_pontos: 50 },
  { id: 'r17', sistema_id: 's2', chave: 'podio_principal_2', valor_pontos: 40 },
  { id: 'r18', sistema_id: 's2', chave: 'podio_principal_3', valor_pontos: 30 },
  { id: 'r19', sistema_id: 's2', chave: 'podio_consolacao_1', valor_pontos: 30 },
  { id: 'r20', sistema_id: 's2', chave: 'podio_consolacao_2', valor_pontos: 20 },
  { id: 'r21', sistema_id: 's2', chave: 'podio_consolacao_3', valor_pontos: 10 },
]

const initialRodadas: Rodada[] = [
  {
    id: 'r1',
    liga_id: '1',
    numero: 'R1',
    data: '2023-10-15',
    hora: '08:00',
    local: 'Arena Beach',
    sistema_id: 's1',
    status: 'Round Finalized',
    observacoes: '',
  },
]

const initialGrupos: Grupo[] = [{ id: 'g1', rodada_id: 'r1', nome: 'Grupo A', finalizado: true }]

const initialGrupoAtletas: GrupoAtleta[] = [
  { id: 'ga1', grupo_id: 'g1', atleta_id: 'a1', status: 'Active' },
  { id: 'ga2', grupo_id: 'g1', atleta_id: 'a2', status: 'Active' },
  { id: 'ga3', grupo_id: 'g1', atleta_id: 'a3', status: 'Active' },
  { id: 'ga4', grupo_id: 'g1', atleta_id: 'a4', status: 'Active' },
]

const initialPartidas: Partida[] = [
  {
    id: 'p1',
    grupo_id: 'g1',
    atleta1_id: 'a1',
    atleta2_id: 'a2',
    score1: 5,
    atleta3_id: 'a3',
    atleta4_id: 'a4',
    score2: 0,
  },
]

const initialPontuacoes: PontuacaoRodada[] = [
  {
    id: 'pt1',
    rodada_id: 'r1',
    atleta_id: 'a1',
    pontos_grupo: 0,
    pontos_vitorias: 10,
    bonus_5x0: 5,
    pontos_podio_principal: 50,
    pontos_podio_consolacao: 0,
    total: 65,
  },
  {
    id: 'pt2',
    rodada_id: 'r1',
    atleta_id: 'a2',
    pontos_grupo: 0,
    pontos_vitorias: 10,
    bonus_5x0: 5,
    pontos_podio_principal: 30,
    pontos_podio_consolacao: 0,
    total: 45,
  },
  {
    id: 'pt3',
    rodada_id: 'r1',
    atleta_id: 'a3',
    pontos_grupo: 0,
    pontos_vitorias: 0,
    bonus_5x0: 0,
    pontos_podio_principal: 20,
    pontos_podio_consolacao: 0,
    total: 20,
  },
]

const initialPublicacoes: Publicacao[] = [
  {
    id: 'pub1',
    data_publicacao: new Date().toISOString(),
    liga_id: '1',
    liga_nome: 'Liga Smash Categoria D',
    temporada: '2023',
    ranking: initialAtletas.slice(0, 10).map((a, i) => ({
      posicao: i + 1,
      atleta_id: a.id,
      nome: a.nome_completo,
      avatar: a.avatar_url,
      categoria: a.categoria_principal,
      total: 150 - i * 12,
      podios: i < 3 ? 1 : 0,
      bonus_5x0: i % 2 === 0 ? 1 : 0,
      media: (15 - i * 1.2).toFixed(1),
      rodadas: { R1: 150 - i * 12 },
    })),
  },
]

interface AppState {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  ligas: Liga[]
  addLiga: (l: Omit<Liga, 'id'>) => void
  updateLiga: (id: string, l: Partial<Liga>) => void
  atletas: Atleta[]
  addAtleta: (a: Omit<Atleta, 'id'>, l: string[]) => void
  updateAtleta: (id: string, a: Partial<Atleta>, l?: string[]) => void
  atletaLigas: AtletaLiga[]
  getAtletaLigas: (id: string) => Liga[]
  sistemas: SistemaPontuacao[]
  addSistema: (
    s: Omit<SistemaPontuacao, 'id'>,
    r: Omit<RegraPontuacao, 'id' | 'sistema_id'>[],
  ) => void
  updateSistema: (id: string, s: Partial<SistemaPontuacao>) => void
  updateRegrasSistema: (sistema_id: string, r: Omit<RegraPontuacao, 'id' | 'sistema_id'>[]) => void
  regras: RegraPontuacao[]
  rodadas: Rodada[]
  addRodada: (r: Omit<Rodada, 'id'>) => void
  updateRodada: (id: string, r: Partial<Rodada>) => void
  deleteRodada: (id: string) => void
  grupos: Grupo[]
  addGrupo: (g: Omit<Grupo, 'id'>) => void
  updateGrupo: (id: string, g: Partial<Grupo>) => void
  deleteGrupo: (id: string) => void
  grupoAtletas: GrupoAtleta[]
  addGrupoAtleta: (ga: Omit<GrupoAtleta, 'id'>) => void
  updateGrupoAtleta: (id: string, ga: Partial<GrupoAtleta>) => void
  deleteGrupoAtleta: (id: string) => void
  partidas: Partida[]
  addPartida: (p: Omit<Partida, 'id'>) => void
  updatePartida: (id: string, p: Partial<Partida>) => void
  deletePartida: (id: string) => void
  podios: Podio[]
  salvarPodiosRodada: (rodadaId: string, p: Podio[]) => void
  pontuacoes: PontuacaoRodada[]
  finalizarRodada: (rodadaId: string) => void
  publicacoes: Publicacao[]
  publicarRanking: (
    ligaId: string,
    ligaNome: string,
    temporada: string,
    ranking: RankingSnapshotItem[],
  ) => void
  deletePublicacao: (id: string) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ligas, setLigas] = useState<Liga[]>(initialLigas)
  const [atletas, setAtletas] = useState<Atleta[]>(initialAtletas)
  const [atletaLigas, setAtletaLigas] = useState<AtletaLiga[]>(initialAtletaLigas)
  const [sistemas, setSistemas] = useState<SistemaPontuacao[]>(initialSistemas)
  const [regras, setRegras] = useState<RegraPontuacao[]>(initialRegras)
  const [rodadas, setRodadas] = useState<Rodada[]>(initialRodadas)
  const [grupos, setGrupos] = useState<Grupo[]>(initialGrupos)
  const [grupoAtletas, setGrupoAtletas] = useState<GrupoAtleta[]>(initialGrupoAtletas)
  const [partidas, setPartidas] = useState<Partida[]>(initialPartidas)
  const [podios, setPodios] = useState<Podio[]>([])
  const [pontuacoes, setPontuacoes] = useState<PontuacaoRodada[]>(initialPontuacoes)
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>(initialPublicacoes)

  const login = () => setIsAuthenticated(true)
  const logout = () => setIsAuthenticated(false)

  const addLiga = (liga: Omit<Liga, 'id'>) =>
    setLigas((prev) => [{ ...liga, id: generateId() }, ...prev])
  const updateLiga = (id: string, liga: Partial<Liga>) =>
    setLigas((prev) => prev.map((l) => (l.id === id ? { ...l, ...liga } : l)))

  const addAtleta = (atleta: Omit<Atleta, 'id'>, ligas_ids: string[]) => {
    const newAtleta = {
      ...atleta,
      id: generateId(),
      avatar_url: `https://img.usecurling.com/ppl/thumbnail?gender=${atleta.sexo === 'M' ? 'male' : 'female'}&seed=${Math.random()}`,
    }
    setAtletas((prev) => [newAtleta, ...prev])
    setAtletaLigas((prev) => [
      ...ligas_ids.map((l) => ({ id: generateId(), atleta_id: newAtleta.id, liga_id: l })),
      ...prev,
    ])
  }

  const updateAtleta = (id: string, atleta: Partial<Atleta>, ligas_ids?: string[]) => {
    setAtletas((prev) => prev.map((a) => (a.id === id ? { ...a, ...atleta } : a)))
    if (ligas_ids) {
      setAtletaLigas((prev) => [
        ...prev.filter((al) => al.atleta_id !== id),
        ...ligas_ids.map((l) => ({ id: generateId(), atleta_id: id, liga_id: l })),
      ])
    }
  }

  const getAtletaLigas = (atletaId: string) => {
    const ids = atletaLigas.filter((al) => al.atleta_id === atletaId).map((al) => al.liga_id)
    return ligas.filter((l) => ids.includes(l.id))
  }

  const addSistema = (
    sistema: Omit<SistemaPontuacao, 'id'>,
    novasRegras: Omit<RegraPontuacao, 'id' | 'sistema_id'>[],
  ) => {
    const sisId = generateId()
    setSistemas((prev) => [...prev, { ...sistema, id: sisId }])
    setRegras((prev) => [
      ...prev,
      ...novasRegras.map((r) => ({ ...r, id: generateId(), sistema_id: sisId })),
    ])
  }

  const updateSistema = (id: string, sistema: Partial<SistemaPontuacao>) => {
    setSistemas((prev) => prev.map((s) => (s.id === id ? { ...s, ...sistema } : s)))
  }

  const updateRegrasSistema = (
    sistema_id: string,
    novasRegras: Omit<RegraPontuacao, 'id' | 'sistema_id'>[],
  ) => {
    setRegras((prev) => {
      const filtered = prev.filter((r) => r.sistema_id !== sistema_id)
      const mapped = novasRegras.map((r) => ({ ...r, id: generateId(), sistema_id }))
      return [...filtered, ...mapped]
    })
  }

  const addRodada = (r: Omit<Rodada, 'id'>) =>
    setRodadas((prev) => [{ ...r, id: generateId() }, ...prev])
  const updateRodada = (id: string, r: Partial<Rodada>) =>
    setRodadas((prev) => prev.map((item) => (item.id === id ? { ...item, ...r } : item)))
  const deleteRodada = (id: string) => setRodadas((prev) => prev.filter((item) => item.id !== id))

  const addGrupo = (g: Omit<Grupo, 'id'>) =>
    setGrupos((prev) => [...prev, { ...g, id: generateId() }])
  const updateGrupo = (id: string, g: Partial<Grupo>) =>
    setGrupos((prev) => prev.map((item) => (item.id === id ? { ...item, ...g } : item)))
  const deleteGrupo = (id: string) => setGrupos((prev) => prev.filter((item) => item.id !== id))

  const addGrupoAtleta = (ga: Omit<GrupoAtleta, 'id'>) =>
    setGrupoAtletas((prev) => [...prev, { ...ga, id: generateId() }])
  const updateGrupoAtleta = (id: string, ga: Partial<GrupoAtleta>) =>
    setGrupoAtletas((prev) => prev.map((item) => (item.id === id ? { ...item, ...ga } : item)))
  const deleteGrupoAtleta = (id: string) =>
    setGrupoAtletas((prev) => prev.filter((item) => item.id !== id))

  const addPartida = (p: Omit<Partida, 'id'>) =>
    setPartidas((prev) => [...prev, { ...p, id: generateId() }])
  const updatePartida = (id: string, p: Partial<Partida>) =>
    setPartidas((prev) => prev.map((item) => (item.id === id ? { ...item, ...p } : item)))
  const deletePartida = (id: string) => setPartidas((prev) => prev.filter((item) => item.id !== id))

  const salvarPodiosRodada = (rodadaId: string, novos: Podio[]) => {
    setPodios((prev) => [...prev.filter((p) => p.rodada_id !== rodadaId), ...novos])
  }

  const finalizarRodada = (rodadaId: string) => {
    let currentRegras: RegraPontuacao[] = []
    setRodadas((prev) =>
      prev.map((r) => {
        if (r.id === rodadaId) {
          currentRegras = regras.filter((reg) => reg.sistema_id === r.sistema_id)
          return { ...r, status: 'Round Finalized', snapshot_regras: currentRegras }
        }
        return r
      }),
    )

    setTimeout(() => {
      setPontuacoes((prev) => {
        const filtered = prev.filter((p) => p.rodada_id !== rodadaId)
        const rodada = rodadas.find((r) => r.id === rodadaId)
        if (!rodada) return filtered
        const sis = sistemas.find((s) => s.id === rodada.sistema_id)
        const snapshot = currentRegras.length
          ? currentRegras
          : regras.filter((reg) => reg.sistema_id === rodada.sistema_id)
        const getRule = (key: string) => snapshot.find((r) => r.chave === key)?.valor_pontos || 0

        const newPts: PontuacaoRodada[] = []
        const atletasMap = new Map<string, Partial<PontuacaoRodada>>()
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
          newPts.push({ ...v, id: generateId() } as PontuacaoRodada)
        })

        return [...filtered, ...newPts]
      })
    }, 0)
  }

  const publicarRanking = (
    ligaId: string,
    ligaNome: string,
    temporada: string,
    ranking: RankingSnapshotItem[],
  ) => {
    const novaPub: Publicacao = {
      id: generateId(),
      data_publicacao: new Date().toISOString(),
      liga_id: ligaId,
      liga_nome: ligaNome,
      temporada,
      ranking,
    }
    setPublicacoes((prev) => [novaPub, ...prev])
  }

  const deletePublicacao = (id: string) => {
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
