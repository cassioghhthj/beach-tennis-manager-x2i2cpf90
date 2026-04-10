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
import { Trash2 } from 'lucide-react'

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

  const getAtletaName = (id: string) =>
    atletas.find((a) => a.id === id)?.nome_completo.split(' ')[0] || 'Unknown'

  const AtletaSelect = ({ value, onChange }: any) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[100px] h-8 text-xs px-2">
        <SelectValue placeholder="Atleta" />
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
        <div className="bg-muted/50 p-2 rounded-md space-y-2 border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <AtletaSelect value={a1} onChange={setA1} />
              <AtletaSelect value={a2} onChange={setA2} />
            </div>
            <Input
              type="number"
              value={s1}
              onChange={(e) => setS1(e.target.value)}
              className="w-12 h-8 text-center"
            />
            <span className="text-xs font-bold text-muted-foreground">X</span>
            <Input
              type="number"
              value={s2}
              onChange={(e) => setS2(e.target.value)}
              className="w-12 h-8 text-center"
            />
            <div className="flex flex-col gap-1">
              <AtletaSelect value={a3} onChange={setA3} />
              <AtletaSelect value={a4} onChange={setA4} />
            </div>
          </div>
          <Button size="sm" className="w-full h-8" onClick={handleAdd}>
            Registrar Partida
          </Button>
        </div>
      )}
      <div className="space-y-2">
        {grupoPartidas.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between text-sm bg-background border p-2 rounded-md"
          >
            <div className="flex-1 text-right">
              {getAtletaName(p.atleta1_id)} / {getAtletaName(p.atleta2_id)}
            </div>
            <div className="px-4 font-bold">
              {p.score1} x {p.score2}
            </div>
            <div className="flex-1 text-left">
              {getAtletaName(p.atleta3_id)} / {getAtletaName(p.atleta4_id)}
            </div>
            {!isFinalizado && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-2 text-destructive"
                onClick={() => deletePartida(p.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
        {grupoPartidas.length === 0 && (
          <p className="text-xs text-muted-foreground italic">Nenhuma partida registrada.</p>
        )}
      </div>
    </div>
  )
}
