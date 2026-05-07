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
      <SelectTrigger className="w-full h-9 text-sm bg-background">
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
        <div className="bg-muted/30 p-3 rounded-lg border space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 flex flex-col gap-2 w-full">
              <AtletaSelect value={a1} onChange={setA1} placeholder="Atleta 1" />
              <AtletaSelect value={a2} onChange={setA2} placeholder="Atleta 2" />
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={s1}
                onChange={(e) => setS1(e.target.value)}
                className="w-16 h-10 text-center text-lg font-bold bg-background"
                placeholder="0"
              />
              <span className="text-muted-foreground font-bold">X</span>
              <Input
                type="number"
                value={s2}
                onChange={(e) => setS2(e.target.value)}
                className="w-16 h-10 text-center text-lg font-bold bg-background"
                placeholder="0"
              />
            </div>

            <div className="flex-1 flex flex-col gap-2 w-full">
              <AtletaSelect value={a3} onChange={setA3} placeholder="Atleta 3" />
              <AtletaSelect value={a4} onChange={setA4} placeholder="Atleta 4" />
            </div>

            <Button
              size="icon"
              className="h-10 w-10 shrink-0 hidden md:flex"
              onClick={handleAdd}
              title="Salvar Partida"
              disabled={!a1 || !a2 || !a3 || !a4 || !s1 || !s2}
            >
              <Save className="h-5 w-5" />
            </Button>
          </div>
          <Button
            className="w-full md:hidden"
            onClick={handleAdd}
            disabled={!a1 || !a2 || !a3 || !a4 || !s1 || !s2}
          >
            <Save className="mr-2 h-4 w-4" /> Salvar Partida
          </Button>
        </div>
      )}
      <div className="space-y-3">
        {grupoPartidas.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between text-sm bg-background border p-3 rounded-lg shadow-sm"
          >
            <div className="flex-1 text-right font-medium overflow-hidden">
              <div className="truncate">{getAtletaName(p.atleta1_id)}</div>
              <div className="truncate">{getAtletaName(p.atleta2_id)}</div>
            </div>
            <div className="px-4 py-2 mx-3 font-bold text-lg bg-muted/50 rounded-md whitespace-nowrap shrink-0">
              {p.score1} <span className="text-muted-foreground mx-1 text-sm">x</span> {p.score2}
            </div>
            <div className="flex-1 text-left font-medium overflow-hidden">
              <div className="truncate">{getAtletaName(p.atleta3_id)}</div>
              <div className="truncate">{getAtletaName(p.atleta4_id)}</div>
            </div>
            {!isFinalizado && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-2 text-destructive hover:bg-destructive/10 shrink-0"
                onClick={() => deletePartida(p.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {grupoPartidas.length === 0 && (
          <div className="text-center p-4 border border-dashed rounded-lg bg-muted/10">
            <p className="text-sm text-muted-foreground italic">Nenhuma partida registrada.</p>
          </div>
        )}
      </div>
    </div>
  )
}
