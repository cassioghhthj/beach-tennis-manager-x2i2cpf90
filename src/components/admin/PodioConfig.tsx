import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Trophy, Save } from 'lucide-react'
import useAppStore, { Podio, Rodada } from '@/stores/useAppStore'
import { toast } from 'sonner'

const POSITIONS = [
  { pos: 1 as const, label: '1º Lugar', color: 'text-yellow-500' },
  { pos: 2 as const, label: '2º Lugar', color: 'text-gray-400' },
  { pos: 3 as const, label: '3º Lugar', color: 'text-amber-600' },
]

export default function PodioConfig({ rodada }: { rodada: Rodada }) {
  const { grupos, grupoAtletas, atletas, podios, salvarPodiosRodada } = useAppStore()

  const [isDuplas, setIsDuplas] = useState(false)
  const [drafts, setDrafts] = useState<Partial<Podio>[]>([])

  const atletasDaRodada = useMemo(() => {
    const rGroups = grupos.filter((g) => g.rodada_id === rodada.id).map((g) => g.id)
    const gAtletas = grupoAtletas
      .filter((ga) => rGroups.includes(ga.grupo_id))
      .map((ga) => ga.atleta_id)
    return atletas.filter((a) => gAtletas.includes(a.id))
  }, [rodada.id, grupos, grupoAtletas, atletas])

  useEffect(() => {
    const existing = podios.filter((p) => p.rodada_id === rodada.id)
    if (existing.length > 0) {
      setDrafts(existing)
      setIsDuplas(!!existing[0].atleta2_id)
    } else {
      setDrafts([])
    }
  }, [podios, rodada.id])

  const updateDraft = (
    tipo: 'Principal' | 'Consolacao',
    posicao: 1 | 2 | 3,
    field: 'atleta1_id' | 'atleta2_id',
    val: string,
  ) => {
    setDrafts((prev) => {
      const existing = prev.find((p) => p.tipo === tipo && p.posicao === posicao)
      const without = prev.filter((p) => !(p.tipo === tipo && p.posicao === posicao))
      const novo = existing || { rodada_id: rodada.id, tipo, posicao }
      return [...without, { ...novo, [field]: val }]
    })
  }

  const getDraft = (tipo: string, pos: number) =>
    drafts.find((d) => d.tipo === tipo && d.posicao === pos)

  const handleSave = () => {
    const valid = drafts.filter((d) => d.atleta1_id && (!isDuplas || d.atleta2_id)) as Podio[]
    salvarPodiosRodada(
      rodada.id,
      valid.map((v) => ({ ...v, id: v.id || Math.random().toString(36).substring(2, 9) })),
    )
    toast.success('Pódios salvos com sucesso!')
  }

  const renderSelect = (
    tipo: 'Principal' | 'Consolacao',
    pos: 1 | 2 | 3,
    field: 'atleta1_id' | 'atleta2_id',
    placeholder: string,
  ) => (
    <Select
      value={getDraft(tipo, pos)?.[field] || ''}
      onValueChange={(v) => updateDraft(tipo, pos, field, v)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {atletasDaRodada.map((a) => (
          <SelectItem key={a.id} value={a.id}>
            {a.nome_completo}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  const renderCard = (tipo: 'Principal' | 'Consolacao', title: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {POSITIONS.map(({ pos, label, color }) => (
          <div key={`${tipo}-${pos}`} className="space-y-2">
            <Label className={`font-semibold ${color}`}>{label}</Label>
            <div className="flex gap-2 flex-col sm:flex-row">
              {renderSelect(tipo, pos, 'atleta1_id', isDuplas ? 'Atleta 1' : 'Selecione o Atleta')}
              {isDuplas && renderSelect(tipo, pos, 'atleta2_id', 'Atleta 2')}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-center space-x-2">
          <Switch
            id="duplas"
            checked={isDuplas}
            onCheckedChange={setIsDuplas}
            disabled={rodada.status === 'Published'}
          />
          <Label htmlFor="duplas" className="font-medium">
            Formato em Duplas
          </Label>
        </div>
        <Button onClick={handleSave} disabled={rodada.status === 'Published'}>
          <Save className="mr-2 h-4 w-4" /> Salvar Pódios
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderCard('Principal', 'Pódio Principal')}
        {renderCard('Consolacao', 'Pódio Consolação')}
      </div>
    </div>
  )
}
