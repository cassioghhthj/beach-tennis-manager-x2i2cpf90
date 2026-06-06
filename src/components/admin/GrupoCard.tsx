import { useState } from 'react'
import useAppStore, { Grupo, Rodada } from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, Unlock, Trash2, Loader2 } from 'lucide-react'
import GrupoAtletasList from './GrupoAtletasList'
import PontosManuaisDialog from './PontosManuaisDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import GrupoPartidasList from './GrupoPartidasList'
import GrupoClassificacao from './GrupoClassificacao'

export default function GrupoCard({ grupo, rodada }: { grupo: Grupo; rodada: Rodada }) {
  const { updateGrupo, deleteGrupo, partidas } = useAppStore()

  const isRoundLocked = rodada.status === 'Round Finalized' || rodada.status === 'Published'
  const isFinalizado = grupo.finalizado || isRoundLocked

  const [isFinalizing, setIsFinalizing] = useState(false)
  const [showNoMatchAlert, setShowNoMatchAlert] = useState(false)
  const [isReopening, setIsReopening] = useState(false)

  const grupoPartidas = partidas.filter((p) => p.grupo_id === grupo.id)

  const finalizeGroup = async () => {
    setIsFinalizing(true)
    try {
      const res = (await updateGrupo(grupo.id, { finalizado: true })) as any
      if (res?.error) throw res.error
    } catch (error: any) {
      console.error(error)
    } finally {
      setIsFinalizing(false)
      setShowNoMatchAlert(false)
    }
  }

  const handleFinalize = () => {
    if (grupoPartidas.length === 0) {
      setShowNoMatchAlert(true)
    } else {
      finalizeGroup()
    }
  }

  const handleReopen = async () => {
    if (confirm('Tem certeza que deseja reabrir o grupo? Os resultados finais podem mudar.')) {
      setIsReopening(true)
      try {
        const res = (await updateGrupo(grupo.id, { finalizado: false })) as any
        if (res?.error) throw res.error
      } catch (error: any) {
        console.error(error)
      } finally {
        setIsReopening(false)
      }
    }
  }

  return (
    <Card
      className={`border-border/50 transition-colors ${grupo.finalizado ? 'border-green-500/50 bg-green-500/5' : ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-xl font-heading">{grupo.nome}</CardTitle>
          {grupo.finalizado && <Badge className="bg-green-500 text-white">Finalizado</Badge>}
        </div>
        <div className="flex items-center gap-2">
          {!grupo.finalizado && (
            <>
              <PontosManuaisDialog grupo={grupo} rodada={rodada} isFinalizado={isFinalizado} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={isRoundLocked || isFinalizing}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Grupo</AlertDialogTitle>
                    <AlertDialogDescription>
                      Deseja realmente excluir o grupo? Esta ação é permanente e todos os dados
                      vinculados a este grupo serão perdidos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteGrupo(grupo.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          {!grupo.finalizado ? (
            <Button
              variant="default"
              size="sm"
              onClick={handleFinalize}
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={isRoundLocked || isFinalizing}
            >
              {isFinalizing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              {isFinalizing ? 'Finalizando...' : 'Finalizar Grupo'}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReopen}
              disabled={isRoundLocked || isReopening}
            >
              {isReopening ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Unlock className="mr-2 h-4 w-4" />
              )}
              {isReopening ? 'Reabrindo...' : 'Reabrir Grupo'}
            </Button>
          )}
        </div>
      </CardHeader>

      <AlertDialog open={showNoMatchAlert} onOpenChange={setShowNoMatchAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atenção</AlertDialogTitle>
            <AlertDialogDescription>
              Este grupo possui apenas pontos manuais e não possui resultados de jogos registrados.
              Deseja finalizar mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isFinalizing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={finalizeGroup} disabled={isFinalizing}>
              {isFinalizing ? 'Finalizando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
