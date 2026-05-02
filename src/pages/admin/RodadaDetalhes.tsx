import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Plus, Calculator } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import GrupoCard from '@/components/admin/GrupoCard'
import PodioConfig from '@/components/admin/PodioConfig'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'bg-secondary text-secondary-foreground'
    case 'In Progress':
      return 'bg-blue-500 text-white'
    case 'Partially Finalized':
      return 'bg-yellow-500 text-white'
    case 'Round Finalized':
      return 'bg-green-500 text-white'
    case 'Published':
      return 'bg-purple-600 text-white font-bold border-2 border-purple-800'
    default:
      return 'bg-secondary text-secondary-foreground'
  }
}

export default function RodadaDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rodadas, grupos, addGrupo, updateRodada, finalizarRodada } = useAppStore()
  const { toast } = useToast()

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward' | null>(
    null,
  )

  const rodada = useMemo(() => rodadas.find((r) => r.id === id), [rodadas, id])
  const rodadaGrupos = useMemo(() => grupos.filter((g) => g.rodada_id === id), [grupos, id])

  if (!rodada) return <div className="p-8 text-center">Rodada não encontrada</div>

  const handleAddGroup = () => {
    const nextChar = String.fromCharCode(65 + rodadaGrupos.length)
    addGrupo({ rodada_id: rodada.id, nome: `Grupo ${nextChar}`, finalizado: false })
  }

  const nextStatusMap: Record<string, any> = {
    Draft: 'In Progress',
    'In Progress': 'Partially Finalized',
    'Partially Finalized': 'Round Finalized',
    'Round Finalized': 'Published',
    Published: 'Published',
  }

  const prevStatusMap: Record<string, any> = {
    Published: 'Round Finalized',
    'Round Finalized': 'Partially Finalized',
    'Partially Finalized': 'In Progress',
    'In Progress': 'Draft',
    Draft: 'Draft',
  }

  const statusTranslations: Record<string, string> = {
    Draft: 'Rascunho',
    'In Progress': 'Em Andamento',
    'Partially Finalized': 'Parcialmente Finalizada',
    'Round Finalized': 'Rodada Finalizada',
    Published: 'Publicada',
  }

  const handleStatusChangeClick = (direction: 'forward' | 'backward') => {
    setTransitionDirection(direction)
    setConfirmDialogOpen(true)
  }

  const confirmStatusChange = () => {
    if (!rodada || !transitionDirection) return

    const isForward = transitionDirection === 'forward'
    const nextStatus = isForward ? nextStatusMap[rodada.status] : prevStatusMap[rodada.status]

    if (nextStatus === rodada.status) {
      setConfirmDialogOpen(false)
      return
    }

    if (isForward && nextStatus === 'Round Finalized') {
      finalizarRodada(rodada.id)
    } else {
      updateRodada(rodada.id, { status: nextStatus })
    }

    toast({
      title: 'Status atualizado',
      description: `O status da rodada foi alterado para ${statusTranslations[nextStatus] || nextStatus}.`,
    })

    setConfirmDialogOpen(false)
    setTransitionDirection(null)
  }

  const previewNextStatus =
    transitionDirection === 'forward' ? nextStatusMap[rodada.status] : prevStatusMap[rodada.status]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/rodadas')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              Rodada {rodada.numero}
              <Badge variant="outline" className={getStatusColor(rodada.status)}>
                {statusTranslations[rodada.status] || rodada.status}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              {rodada.data} • {rodada.local}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          {rodada.status !== 'Draft' && (
            <Button variant="outline" onClick={() => handleStatusChangeClick('backward')}>
              Voltar Status
            </Button>
          )}
          {rodada.status === 'Round Finalized' && (
            <Button variant="outline" onClick={() => finalizarRodada(rodada.id)}>
              <Calculator className="mr-2 h-4 w-4" /> Recalcular Pontuação
            </Button>
          )}
          {rodada.status !== 'Published' && (
            <Button onClick={() => handleStatusChangeClick('forward')}>Avançar Status</Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="grupos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grupos">Grupos da Rodada</TabsTrigger>
          <TabsTrigger value="podios">Pódios e Premiações</TabsTrigger>
        </TabsList>

        <TabsContent value="grupos" className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={handleAddGroup}
              disabled={rodada.status === 'Round Finalized' || rodada.status === 'Published'}
              variant="secondary"
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Grupo
            </Button>
          </div>
          <div className="grid gap-6">
            {rodadaGrupos.map((grupo) => (
              <GrupoCard key={grupo.id} grupo={grupo} rodada={rodada} />
            ))}
            {rodadaGrupos.length === 0 && (
              <Card className="border-dashed bg-muted/10">
                <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground text-center space-y-4">
                  <div className="rounded-full bg-muted p-4">
                    <Plus className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Nenhum grupo criado</h3>
                    <p>Crie o primeiro grupo para começar a adicionar atletas e partidas.</p>
                  </div>
                  <Button onClick={handleAddGroup}>Criar Grupo A</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="podios">
          <PodioConfig rodada={rodada} />
        </TabsContent>
      </Tabs>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Mudança de Status</DialogTitle>
            <DialogDescription>
              Deseja realmente {transitionDirection === 'forward' ? 'avançar' : 'voltar'} o status
              de{' '}
              <strong className="text-foreground">
                {statusTranslations[rodada.status] || rodada.status}
              </strong>{' '}
              para{' '}
              <strong className="text-foreground">
                {statusTranslations[previewNextStatus] || previewNextStatus}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmStatusChange}>Confirmar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
