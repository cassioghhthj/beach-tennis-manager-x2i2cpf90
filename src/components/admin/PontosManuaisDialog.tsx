import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit3, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import useAppStore, { Grupo, Rodada } from '@/stores/useAppStore'
import { useToast } from '@/hooks/use-toast'

export default function PontosManuaisDialog({
  grupo,
  rodada,
  isFinalizado,
}: {
  grupo: Grupo
  rodada: Rodada
  isFinalizado: boolean
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pontuacoes, setPontuacoes] = useState<
    Record<string, { pontos: string | number; observacao: string }>
  >({})

  const { grupoAtletas, atletas } = useAppStore()
  const { toast } = useToast()

  const ativos = grupoAtletas.filter((ga) => ga.grupo_id === grupo.id && ga.status === 'Active')

  useEffect(() => {
    if (open) {
      loadPontuacoes()
    }
  }, [open, grupo.id, rodada.id])

  const loadPontuacoes = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pontuacoes_rodada')
        .select('atleta_id, pontos_manuais, observacao_manuais')
        .eq('rodada_id', rodada.id)
        .in('atleta_id', ativos.map((a) => a.atleta_id).filter(Boolean) as string[])

      if (error) throw error

      const newPontuacoes: Record<string, { pontos: string | number; observacao: string }> = {}
      ativos.forEach((ga) => {
        if (!ga.atleta_id) return
        const p = data?.find((d) => d.atleta_id === ga.atleta_id)
        newPontuacoes[ga.atleta_id] = {
          pontos: p?.pontos_manuais || 0,
          observacao: p?.observacao_manuais || '',
        }
      })
      setPontuacoes(newPontuacoes)
    } catch (err: any) {
      console.error(err)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os pontos manuais.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const ga of ativos) {
        if (!ga.atleta_id) continue

        const pontuacao = pontuacoes[ga.atleta_id]
        if (!pontuacao) continue

        const pts = pontuacao.pontos === '' ? 0 : parseInt(pontuacao.pontos as string, 10) || 0

        const { data: existing } = await supabase
          .from('pontuacoes_rodada')
          .select('id, pontos_manuais, observacao_manuais')
          .eq('rodada_id', rodada.id)
          .eq('atleta_id', ga.atleta_id)
          .single()

        if (existing) {
          if (
            existing.pontos_manuais !== pts ||
            existing.observacao_manuais !== pontuacao.observacao
          ) {
            const { error } = await supabase
              .from('pontuacoes_rodada')
              .update({
                pontos_manuais: pts,
                observacao_manuais: pontuacao.observacao,
              })
              .eq('id', existing.id)
            if (error) throw error
          }
        } else {
          if (pts === 0 && !pontuacao.observacao) continue

          const { error } = await supabase.from('pontuacoes_rodada').insert({
            rodada_id: rodada.id,
            atleta_id: ga.atleta_id,
            pontos_manuais: pts,
            observacao_manuais: pontuacao.observacao,
            pontos_presenca: 0,
            total: pts,
          })
          if (error) throw error
        }
      }

      await supabase.rpc('processar_presenca_rodada', { p_rodada_id: rodada.id })

      const { data: fresh } = await supabase
        .from('pontuacoes_rodada')
        .select('*')
        .eq('rodada_id', rodada.id)
      if (fresh && (useAppStore as any).setState) {
        ;(useAppStore as any).setState((state: any) => ({
          pontuacoes: [...state.pontuacoes.filter((p: any) => p.rodada_id !== rodada.id), ...fresh],
        }))
      }

      toast({ title: 'Sucesso', description: 'Pontos manuais salvos com sucesso.' })
      setOpen(false)
      window.dispatchEvent(new Event('refresh-classificacao'))
    } catch (err: any) {
      console.error(err)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: err.message || 'Erro ao salvar pontos.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !saving && setOpen(val)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isFinalizado}>
          <Edit3 className="mr-2 h-4 w-4" /> Pontos Manuais
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pontos Manuais - {grupo.nome}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : ativos.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum atleta no grupo.</p>
          ) : (
            ativos.map((ga) => {
              const atleta = atletas.find((a) => a.id === ga.atleta_id)
              return (
                <div
                  key={ga.id}
                  className="grid grid-cols-12 gap-4 items-center p-3 border rounded-lg bg-card"
                >
                  <div className="col-span-12 font-medium">
                    {atleta?.nome_completo || 'Desconhecido'}
                  </div>
                  <div className="col-span-4">
                    <Label className="text-xs text-muted-foreground mb-1 block">Pontos</Label>
                    <Input
                      type="number"
                      value={pontuacoes[ga.atleta_id!]?.pontos ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setPontuacoes((prev) => ({
                          ...prev,
                          [ga.atleta_id!]: {
                            ...prev[ga.atleta_id!],
                            pontos: val === '' ? val : parseInt(val) || 0,
                          },
                        }))
                      }}
                      disabled={saving}
                    />
                  </div>
                  <div className="col-span-8">
                    <Label className="text-xs text-muted-foreground mb-1 block">Observação</Label>
                    <Input
                      value={pontuacoes[ga.atleta_id!]?.observacao || ''}
                      onChange={(e) =>
                        setPontuacoes((prev) => ({
                          ...prev,
                          [ga.atleta_id!]: { ...prev[ga.atleta_id!], observacao: e.target.value },
                        }))
                      }
                      placeholder="Motivo..."
                      disabled={saving}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || loading || ativos.length === 0}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              'Salvar Pontos'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
