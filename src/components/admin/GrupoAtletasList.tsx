import { useState, useMemo } from 'react'
import useAppStore, { Grupo, Rodada } from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, RefreshCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function GrupoAtletasList({
  grupo,
  rodada,
  isFinalizado,
}: {
  grupo: Grupo
  rodada: Rodada
  isFinalizado: boolean
}) {
  const { atletas, atletaLigas, grupoAtletas, addGrupoAtleta, updateGrupoAtleta } = useAppStore()

  const [selectedAtleta, setSelectedAtleta] = useState('')
  const [subDialogOpen, setSubDialogOpen] = useState(false)
  const [subGaId, setSubGaId] = useState('')
  const [substitutoId, setSubstitutoId] = useState('')
  const [motivo, setMotivo] = useState('')

  const availableAtletas = useMemo(() => {
    const ligaAtletasIds = atletaLigas
      .filter((al) => al.liga_id === rodada.liga_id)
      .map((al) => al.atleta_id)
    const currentAtletasIds = grupoAtletas
      .filter((ga) => ga.grupo_id === grupo.id)
      .map((ga) => ga.atleta_id)
    return atletas.filter((a) => ligaAtletasIds.includes(a.id) && !currentAtletasIds.includes(a.id))
  }, [atletas, atletaLigas, rodada.liga_id, grupoAtletas, grupo.id])

  const currentAtletas = useMemo(() => {
    return grupoAtletas
      .filter((ga) => ga.grupo_id === grupo.id)
      .map((ga) => {
        const atleta = atletas.find((a) => a.id === ga.atleta_id)
        return { ...ga, atleta }
      })
  }, [grupoAtletas, grupo.id, atletas])

  const handleAdd = () => {
    if (!selectedAtleta) return
    addGrupoAtleta({ grupo_id: grupo.id, atleta_id: selectedAtleta, status: 'Active' })
    setSelectedAtleta('')
  }

  const openSubDialog = (gaId: string) => {
    setSubGaId(gaId)
    setSubDialogOpen(true)
  }

  const handleSubstituir = () => {
    if (!substitutoId || !motivo) return
    updateGrupoAtleta(subGaId, {
      status: 'Substituted',
      substituido_por_id: substitutoId,
      motivo_substituicao: motivo,
    })
    addGrupoAtleta({ grupo_id: grupo.id, atleta_id: substitutoId, status: 'Active' })
    setSubDialogOpen(false)
    setSubstitutoId('')
    setMotivo('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Atletas do Grupo</h3>
        {!isFinalizado && (
          <div className="flex items-center space-x-2">
            <Select value={selectedAtleta} onValueChange={setSelectedAtleta}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Selecionar Atleta" />
              </SelectTrigger>
              <SelectContent>
                {availableAtletas.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.nome_completo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" className="h-8" onClick={handleAdd} disabled={!selectedAtleta}>
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {currentAtletas.map((ga) => (
          <div
            key={ga.id}
            className={`flex items-center justify-between border p-2 rounded-md text-sm ${ga.status !== 'Active' ? 'bg-muted/30 opacity-60' : 'bg-background'}`}
          >
            <div className="flex items-center space-x-2">
              <span className={ga.status !== 'Active' ? 'line-through' : ''}>
                {ga.atleta?.nome_completo}
              </span>
              {ga.status !== 'Active' && (
                <Badge variant="secondary" className="text-[10px]">
                  {ga.status}
                </Badge>
              )}
            </div>
            {!isFinalizado && ga.status === 'Active' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground"
                onClick={() => openSubDialog(ga.id)}
              >
                <RefreshCcw className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
        {currentAtletas.length === 0 && (
          <p className="text-xs text-muted-foreground italic">Nenhum atleta adicionado.</p>
        )}
      </div>

      <Dialog open={subDialogOpen} onOpenChange={setSubDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Substituir Atleta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Atleta Substituto</Label>
              <Select value={substitutoId} onValueChange={setSubstitutoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o substituto" />
                </SelectTrigger>
                <SelectContent>
                  {availableAtletas.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.nome_completo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Motivo</Label>
              <Input
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ex: Lesão, Atraso..."
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setSubDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubstituir} disabled={!substitutoId || !motivo}>
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
