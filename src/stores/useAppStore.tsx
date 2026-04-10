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
  {
    id: '2',
    nome: 'Liga Beach Sisters Iniciante',
    categoria: 'Iniciante',
    temporada: '2023',
    total_rodadas: 10,
    status: 'Ativo',
    descricao: 'Liga feminina',
    observacoes: '',
  },
  {
    id: '3',
    nome: 'Liga Dinossauros',
    categoria: 'C',
    temporada: '2023/2',
    total_rodadas: 12,
    status: 'Inativo',
    descricao: 'Liga veteranos',
    observacoes: '',
  },
]

const initialAtletas: Atleta[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `a${i + 1}`,
  nome_completo: `Atleta ${i + 1}`,
  telefone: '(11) 99999-9999',
  sexo: i % 2 === 0 ? 'M' : 'F',
  categoria_principal: ['Iniciante', 'D', 'C', 'B', 'A'][i % 5],
  status: i % 4 === 0 ? 'Inativo' : 'Ativo',
  observacoes: '',
  avatar_url: `https://img.usecurling.com/ppl/thumbnail?gender=${i % 2 === 0 ? 'male' : 'female'}&seed=${i}`,
}))

const initialAtletaLigas: AtletaLiga[] = initialAtletas.map((a) => ({
  id: generateId(),
  atleta_id: a.id,
  liga_id: initialLigas[Math.floor(Math.random() * initialLigas.length)].id,
}))

const initialSistemas: SistemaPontuacao[] = [
  { id: 's1', nome: 'Sistema Geral Pro', tipo: 'Geral', ativo: true },
  { id: 's2', nome: 'Sistema Vitórias Padrão', tipo: 'Vitorias', ativo: false },
]

const initialRegras: RegraPontuacao[] = [
  { id: generateId(), sistema_id: 's1', chave: '1_lugar', valor_pontos: 100 },
  { id: generateId(), sistema_id: 's1', chave: 'vitoria_5x0', valor_pontos: 10 },
  { id: generateId(), sistema_id: 's2', chave: 'vitoria_5x0', valor_pontos: 50 },
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
  regras: RegraPontuacao[]
}

const AppContext = createContext<AppState | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ligas, setLigas] = useState<Liga[]>(initialLigas)
  const [atletas, setAtletas] = useState<Atleta[]>(initialAtletas)
  const [atletaLigas, setAtletaLigas] = useState<AtletaLiga[]>(initialAtletaLigas)
  const [sistemas, setSistemas] = useState<SistemaPontuacao[]>(initialSistemas)
  const [regras, setRegras] = useState<RegraPontuacao[]>(initialRegras)

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
        regras,
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
