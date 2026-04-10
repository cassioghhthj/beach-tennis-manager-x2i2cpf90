import { useState } from 'react'
import useAppStore, { Grupo, Rodada } from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, Unlock } from 'lucide-react'
import GrupoAtletasList from './GrupoAtletasList'
import GrupoPartidasList from './GrupoPartidasList'
import GrupoClassificacao from './GrupoClassificacao'

export default function GrupoCard({ grupo, rodada }: { grupo: Grupo; rodada: Rodada }) {
  const { updateGrupo } = useAppStore()

  const isFinalizado = grupo.finalizado

  const handleFinalize = () => {
    updateGrupo(grupo.id, { finalizado: true })
  }

  const handleReopen = () => {
    if (confirm('Tem certeza que deseja reabrir o grupo? Os resultados finais podem mudar.')) {
      updateGrupo(grupo.id, { finalizado: false })
    }
  }

  return (
    <Card
      className={`border-border/50 transition-colors ${isFinalizado ? 'border-green-500/50 bg-green-500/5' : ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-xl font-heading">{grupo.nome}</CardTitle>
          {isFinalizado && <Badge className="bg-green-500 text-white">Finalizado</Badge>}
        </div>
        <div>
          {!isFinalizado ? (
            <Button
              variant="default"
              size="sm"
              onClick={handleFinalize}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Lock className="mr-2 h-4 w-4" /> Finalizar Grupo
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleReopen}>
              <Unlock className="mr-2 h-4 w-4" /> Reabrir Grupo
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b">
          <div className="p-4">
            <GrupoAtletasList grupo={grupo} rodada={rodada} isFinalizado={isFinalizado} />
          </div>
          <div className="p-4">
            <GrupoPartidasList grupo={grupo} rodada={rodada} isFinalizado={isFinalizado} />
          </div>
        </div>
        <div className="p-4 bg-muted/20">
          <GrupoClassificacao grupo={grupo} />
        </div>
      </CardContent>
    </Card>
  )
}
