import { useState, useMemo } from 'react'
import useAppStore, { Grupo, Rodada } from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Save } from 'lucide-react'

export default function GrupoPartidasList({
  grupo,
  isFinalizado,
}: {
  grupo: Grupo
  rodada: Rodada
  isFinalizado: boolean
}) {
  const { partidas, addPartida, deletePartida, grupoAtletas, atletas } = useAppStore()

  const [a1, setA1] = useState('')
  const [a2, setA2] = useState('')
  const [s1, setS1] = useState('')
  const [s2, setS2] = useState('')
  const [a3, setA3] = useState('')
  const [a4, setA4] = useState('')

  const grupoAtletasList = useMemo(() => {
    const ids = grupoAtletas
      .filter((ga) => ga.grupo_id === grupo.id && ga.status === 'Active')
      .map((ga) => ga.atleta_id)
    return atletas.filter((a) => ids.includes(a.id))
  }, [grupoAtletas, grupo.id, atletas])

  const grupoPartidas = useMemo(
    () => partidas.filter((p) => p.grupo_id === grupo.id),
    [partidas, grupo.id],
  )

  const handleAdd = () => {
    if (!a1 || !a2 || !a3 || !a4 || !s1 || !s2) return
    const ids = [a1, a2, a3, a4]
    if (new Set(ids).size !== 4) {
      alert('Selecione 4 atletas diferentes.')
      return
    }
    addPartida({
      grupo_id: grupo.id,
      atleta1_id: a1,
      atleta2_id: a2,
      score1: parseInt(s1),
      atleta3_id: a3,
      atleta4_id: a4,
      score2: parseInt(s2),
    })
    setA1('')
    setA2('')
    setA3('')
    setA4('')
    setS1('')
    setS2('')
  }

  const getAtletaName = (id: string) => {
    const nome = atletas.find((a) => a.id === id)?.nome_completo
    if (!nome) return 'Unknown'
    return nome
  }

  const AtletaSelect = ({ value, onChange, placeholder }: any) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-10 text-sm bg-background">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {grupoAtletasList.map((a) => (
          <SelectItem key={a.id} value={a.id}>
            {a.nome_completo}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Partidas</h3>
      {!isFinalizado && (
        <div className="bg-muted/30 p-4 rounded-xl border border-muted-foreground/20 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 flex flex-col gap-3 w-full">
              <AtletaSelect value={a1} onChange={setA1} placeholder="Dupla 1 - Atleta A" />
              <AtletaSelect value={a2} onChange={setA2} placeholder="Dupla 1 - Atleta B" />
            </div>

            <div className="flex flex-col items-center justify-center gap-2 bg-background p-3 rounded-xl shadow-inner border w-full md:w-auto">
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={s1}
                  onChange={(e) => setS1(e.target.value)}
                  className="w-16 h-12 text-center text-2xl font-black bg-muted/50 border-muted-foreground/20"
                  placeholder="0"
                  min="0"
                />
                <span className="text-muted-foreground font-black text-xl">X</span>
                <Input
                  type="number"
                  value={s2}
                  onChange={(e) => setS2(e.target.value)}
                  className="w-16 h-12 text-center text-2xl font-black bg-muted/50 border-muted-foreground/20"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3 w-full">
              <AtletaSelect value={a3} onChange={setA3} placeholder="Dupla 2 - Atleta A" />
              <AtletaSelect value={a4} onChange={setA4} placeholder="Dupla 2 - Atleta B" />
            </div>

            <Button
              size="lg"
              className="h-[104px] w-[104px] shrink-0 hidden md:flex flex-col gap-2 rounded-xl shadow-md transition-all hover:scale-105"
              onClick={handleAdd}
              title="Salvar Partida"
              disabled={!a1 || !a2 || !a3 || !a4 || !s1 || !s2}
            >
              <Save className="h-6 w-6" />
              <span>Salvar</span>
            </Button>
          </div>
          <Button
            size="lg"
            className="w-full md:hidden rounded-xl shadow-md"
            onClick={handleAdd}
            disabled={!a1 || !a2 || !a3 || !a4 || !s1 || !s2}
          >
            <Save className="mr-2 h-5 w-5" /> Salvar Partida
          </Button>
        </div>
      )}
      <div className="space-y-3">
        {grupoPartidas.map((p) => (
          <div
            key={p.id}
            className="flex flex-col sm:flex-row items-center justify-between text-sm bg-background border p-4 rounded-xl shadow-sm gap-4"
          >
            <div className="flex-1 text-center sm:text-right font-medium w-full sm:w-auto">
              <div className="truncate text-base">{getAtletaName(p.atleta1_id)}</div>
              <div className="truncate text-base text-muted-foreground">
                {getAtletaName(p.atleta2_id)}
              </div>
            </div>

            <div className="px-6 py-3 font-black text-2xl bg-muted/50 border rounded-xl whitespace-nowrap shrink-0 flex items-center justify-center min-w-[140px] shadow-inner">
              {p.score1} <span className="text-muted-foreground/40 mx-4 text-xl">x</span> {p.score2}
            </div>

            <div className="flex-1 text-center sm:text-left font-medium w-full sm:w-auto">
              <div className="truncate text-base">{getAtletaName(p.atleta3_id)}</div>
              <div className="truncate text-base text-muted-foreground">
                {getAtletaName(p.atleta4_id)}
              </div>
            </div>

            {!isFinalizado && (
              <div className="w-full sm:w-auto flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-destructive hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
                  onClick={() => deletePartida(p.id)}
                >
                  <Trash2 className="h-4 w-4 sm:mr-2" />
                  <span className="sm:hidden ml-2">Excluir</span>
                  <span className="hidden sm:inline">Excluir</span>
                </Button>
              </div>
            )}
          </div>
        ))}
        {grupoPartidas.length === 0 && (
          <div className="text-center p-8 border-2 border-dashed rounded-xl bg-muted/5">
            <p className="text-sm text-muted-foreground font-medium">
              Nenhuma partida registrada neste grupo.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
