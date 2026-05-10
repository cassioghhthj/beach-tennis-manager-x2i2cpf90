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
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trophy, Save, Trash2, Plus } from 'lucide-react'
import useAppStore, { Podio, Rodada } from '@/stores/useAppStore'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

const POSITIONS = [
  { pos: 1 as const, label: '1º Lugar', color: 'text-yellow-500' },
  { pos: 2 as const, label: '2º Lugar', color: 'text-gray-400' },
  { pos: 3 as const, label: '3º Lugar', color: 'text-amber-600' },
]

export default function PodioConfig({ rodada }: { rodada: Rodada }) {
  const { grupos, grupoAtletas, atletas, podios, pontuacoes, salvarPodiosRodada } = useAppStore()

  const [isDuplas, setIsDuplas] = useState(false)
  const [drafts, setDrafts] = useState<Partial<Podio>[]>([])

  const [ajusteAtleta, setAjusteAtleta] = useState('')
  const [ajustePontos, setAjustePontos] = useState('')
  const [ajusteObs, setAjusteObs] = useState('')
  const [ajustesLoading, setAjustesLoading] = useState(false)

  const atletasDaRodada = useMemo(() => {
    const rGroups = grupos.filter((g) => g.rodada_id === rodada.id).map((g) => g.id)
    const gAtletas = grupoAtletas
      .filter((ga) => rGroups.includes(ga.grupo_id))
      .map((ga) => ga.atleta_id)
    return atletas.filter((a) => gAtletas.includes(a.id))
  }, [rodada.id, grupos, grupoAtletas, atletas])

  const ajustes = useMemo(() => {
    return pontuacoes.filter((p) => p.rodada_id === rodada.id && p.pontos_manuais !== 0)
  }, [pontuacoes, rodada.id])

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
      valid.map((v) => {
        const { id, ...rest } = v
        const isUUID =
          id &&
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)
        return isUUID ? v : (rest as any)
      }),
    )
    toast.success('Pódios salvos com sucesso!')
  }

  const handleAddAjuste = async () => {
    if (!ajusteAtleta || !ajustePontos) return
    const pts = parseInt(ajustePontos, 10)
    if (isNaN(pts)) {
      toast.error('Valor de pontos inválido')
      return
    }

    setAjustesLoading(true)
    try {
      const existing = pontuacoes.find(
        (p) => p.rodada_id === rodada.id && p.atleta_id === ajusteAtleta,
      )
      if (existing) {
        const { error } = await supabase
          .from('pontuacoes_rodada')
          .update({
            pontos_manuais: pts,
            observacao_manuais: ajusteObs,
          })
          .eq('id', existing.id)

        if (error) throw error

        ;(useAppStore as any).setState((state: any) => ({
          pontuacoes: state.pontuacoes.map((p: any) =>
            p.id === existing.id
              ? {
                  ...p,
                  pontos_manuais: pts,
                  observacao_manuais: ajusteObs,
                  total: p.total - p.pontos_manuais + pts,
                }
              : p,
          ),
        }))
      } else {
        const { data, error } = await supabase
          .from('pontuacoes_rodada')
          .insert({
            rodada_id: rodada.id,
            atleta_id: ajusteAtleta,
            pontos_manuais: pts,
            observacao_manuais: ajusteObs,
            total: pts,
          })
          .select()
          .single()

        if (error) throw error
        if (data) {
          ;(useAppStore as any).setState((state: any) => ({
            pontuacoes: [...state.pontuacoes, data],
          }))
        }
      }
      toast.success('Ajuste manual salvo!')
      setAjusteAtleta('')
      setAjustePontos('')
      setAjusteObs('')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao salvar ajuste manual.')
    } finally {
      setAjustesLoading(false)
    }
  }

  const handleRemoveAjuste = async (atletaId: string) => {
    const existing = pontuacoes.find((p) => p.rodada_id === rodada.id && p.atleta_id === atletaId)
    if (existing) {
      setAjustesLoading(true)
      try {
        const { error } = await supabase
          .from('pontuacoes_rodada')
          .update({
            pontos_manuais: 0,
            observacao_manuais: null,
          })
          .eq('id', existing.id)

        if (error) throw error

        ;(useAppStore as any).setState((state: any) => ({
          pontuacoes: state.pontuacoes.map((p: any) =>
            p.id === existing.id
              ? {
                  ...p,
                  pontos_manuais: 0,
                  observacao_manuais: null,
                  total: p.total - p.pontos_manuais,
                }
              : p,
          ),
        }))
        toast.success('Ajuste removido!')
      } catch (error) {
        toast.error('Erro ao remover ajuste.')
      } finally {
        setAjustesLoading(false)
      }
    }
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

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ajustes Manuais de Pontuação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1 w-full">
              <Label>Atleta</Label>
              <Select value={ajusteAtleta} onValueChange={setAjusteAtleta}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o atleta" />
                </SelectTrigger>
                <SelectContent>
                  {atletasDaRodada.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.nome_completo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-full sm:w-32">
              <Label>Pontos (+ ou -)</Label>
              <Input
                type="number"
                placeholder="Ex: 50"
                value={ajustePontos}
                onChange={(e) => setAjustePontos(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex-1 w-full">
              <Label>Observação (Motivo)</Label>
              <Input
                placeholder="Ex: Bônus fair play"
                value={ajusteObs}
                onChange={(e) => setAjusteObs(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAddAjuste}
              disabled={ajustesLoading || !ajusteAtleta || !ajustePontos}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar
            </Button>
          </div>

          {ajustes.length > 0 && (
            <div className="rounded-md border mt-6 overflow-x-auto">
              <Table className="min-w-[500px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Atleta</TableHead>
                    <TableHead>Observação</TableHead>
                    <TableHead className="text-right">Pontos</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ajustes.map((ajuste) => {
                    const atleta = atletas.find((a) => a.id === ajuste.atleta_id)
                    return (
                      <TableRow key={ajuste.id}>
                        <TableCell className="font-medium">{atleta?.nome_completo}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {(ajuste as any).observacao_manuais || '-'}
                        </TableCell>
                        <TableCell
                          className={`text-right font-bold ${ajuste.pontos_manuais > 0 ? 'text-primary' : 'text-destructive'}`}
                        >
                          {ajuste.pontos_manuais > 0
                            ? `+${ajuste.pontos_manuais}`
                            : ajuste.pontos_manuais}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive h-8 w-8"
                            onClick={() => handleRemoveAjuste(ajuste.atleta_id!)}
                            disabled={ajustesLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
