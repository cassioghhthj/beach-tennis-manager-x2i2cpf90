import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import GrupoCard from '@/components/admin/GrupoCard'

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
  const { rodadas, grupos, addGrupo, updateRodada } = useAppStore()

  const rodada = useMemo(() => rodadas.find((r) => r.id === id), [rodadas, id])
  const rodadaGrupos = useMemo(() => grupos.filter((g) => g.rodada_id === id), [grupos, id])

  if (!rodada) return <div className="p-8 text-center">Rodada não encontrada</div>

  const handleAddGroup = () => {
    const nextChar = String.fromCharCode(65 + rodadaGrupos.length) // A, B, C...
    addGrupo({ rodada_id: rodada.id, nome: `Grupo ${nextChar}`, finalizado: false })
  }

  const nextStatusMap: Record<string, any> = {
    Draft: 'In Progress',
    'In Progress': 'Partially Finalized',
    'Partially Finalized': 'Round Finalized',
    'Round Finalized': 'Published',
    Published: 'Published',
  }

  const advanceStatus = () => {
    updateRodada(rodada.id, { status: nextStatusMap[rodada.status] })
  }

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
                {rodada.status}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              {rodada.data} • {rodada.local}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {rodada.status !== 'Published' && (
            <Button variant="outline" onClick={advanceStatus}>
              Avançar Status
            </Button>
          )}
          <Button
            onClick={handleAddGroup}
            disabled={rodada.status === 'Round Finalized' || rodada.status === 'Published'}
          >
            <Plus className="mr-2 h-4 w-4" /> Novo Grupo
          </Button>
        </div>
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
    </div>
  )
}
