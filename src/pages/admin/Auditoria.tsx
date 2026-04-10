import { useState, useMemo } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Trophy, Calculator, Mail } from 'lucide-react'

export default function Auditoria() {
  const { ligas, rodadas, atletas, pontuacoes, partidas, grupos, grupoAtletas } = useAppStore()

  const [ligaId, setLigaId] = useState<string>('')
  const [rodadaId, setRodadaId] = useState<string>('')
  const [atletaId, setAtletaId] = useState<string>('')

  const rodadasLiga = useMemo(() => rodadas.filter((r) => r.liga_id === ligaId), [rodadas, ligaId])
  const pontuacoesRodada = useMemo(
    () => pontuacoes.filter((p) => p.rodada_id === rodadaId),
    [pontuacoes, rodadaId],
  )
  const atletasDaRodada = useMemo(() => {
    const ids = pontuacoesRodada.map((p) => p.atleta_id)
    return atletas.filter((a) => ids.includes(a.id))
  }, [pontuacoesRodada, atletas])

  const pontuacao = useMemo(
    () => pontuacoesRodada.find((p) => p.atleta_id === atletaId),
    [pontuacoesRodada, atletaId],
  )
  const atleta = useMemo(() => atletas.find((a) => a.id === atletaId), [atletas, atletaId])

  const historicoPartidas = useMemo(() => {
    if (!rodadaId || !atletaId) return []
    const rGroups = grupos.filter((g) => g.rodada_id === rodadaId).map((g) => g.id)
    return partidas.filter(
      (p) =>
        rGroups.includes(p.grupo_id) &&
        [p.atleta1_id, p.atleta2_id, p.atleta3_id, p.atleta4_id].includes(atletaId),
    )
  }, [rodadaId, atletaId, grupos, partidas])

  const historicoSubstituicao = useMemo(() => {
    if (!rodadaId || !atletaId) return []
    const rGroups = grupos.filter((g) => g.rodada_id === rodadaId).map((g) => g.id)
    return grupoAtletas.filter(
      (ga) => rGroups.includes(ga.grupo_id) && ga.atleta_id === atletaId && ga.status !== 'Active',
    )
  }, [rodadaId, atletaId, grupos, grupoAtletas])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Auditoria de Pontuação</h2>
          <p className="text-muted-foreground">
            Inspecione o cálculo de pontos de cada atleta por rodada.
          </p>
        </div>
        <Button disabled>
          <Mail className="mr-2 h-4 w-4" /> Enviar desempenho ao atleta
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Liga / Categoria</Label>
              <Select
                value={ligaId}
                onValueChange={(v) => {
                  setLigaId(v)
                  setRodadaId('')
                  setAtletaId('')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a Liga" />
                </SelectTrigger>
                <SelectContent>
                  {ligas.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.nome} ({l.categoria})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rodada</Label>
              <Select
                value={rodadaId}
                onValueChange={(v) => {
                  setRodadaId(v)
                  setAtletaId('')
                }}
                disabled={!ligaId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a Rodada" />
                </SelectTrigger>
                <SelectContent>
                  {rodadasLiga.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.numero} - {r.data}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Atleta</Label>
              <Select value={atletaId} onValueChange={setAtletaId} disabled={!rodadaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Atleta" />
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
          </div>
        </CardContent>
      </Card>

      {pontuacao && atleta && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" /> Histórico de Partidas
              </CardTitle>
              <CardDescription>
                Todas as partidas jogadas nesta rodada e os placares registrados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {historicoPartidas.map((p) => {
                  const isTeam1 = p.atleta1_id === atleta.id || p.atleta2_id === atleta.id
                  const scoreTeam = isTeam1 ? p.score1 : p.score2
                  const scoreOpp = isTeam1 ? p.score2 : p.score1
                  const isWin = scoreTeam > scoreOpp
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/20"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant={isWin ? 'success' : 'destructive'}>
                          {isWin ? 'Vitória' : 'Derrota'}
                        </Badge>
                        <span className="font-medium text-sm">
                          Placar Final: {scoreTeam} x {scoreOpp}
                        </span>
                      </div>
                      {scoreTeam === 5 && scoreOpp === 0 && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                          Bônus 5x0
                        </Badge>
                      )}
                    </div>
                  )
                })}
                {historicoPartidas.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center p-4">
                    Nenhuma partida registrada para este atleta.
                  </div>
                )}
              </div>

              {historicoSubstituicao.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2 text-sm">Anotações / Substituições</h4>
                  <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                    O atleta possui registros de substituição/retirada nesta rodada.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" /> Detalhamento de Pontos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Pontos por Vitórias/Jogos:</span>
                  <span className="font-medium">{pontuacao.pontos_vitorias} pts</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Bônus por 5x0:</span>
                  <span className="font-medium text-yellow-600">{pontuacao.bonus_5x0} pts</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Pódio Principal:</span>
                  <span className="font-medium text-primary">
                    {pontuacao.pontos_podio_principal} pts
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Pódio Consolação:</span>
                  <span className="font-medium text-primary">
                    {pontuacao.pontos_podio_consolacao} pts
                  </span>
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="font-bold">Total da Rodada</span>
                  <span className="text-2xl font-black text-primary">{pontuacao.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {ligaId && rodadaId && atletaId && !pontuacao && (
        <div className="p-12 text-center text-muted-foreground border-dashed border rounded-xl bg-muted/5">
          Este atleta não possui pontuação consolidada para esta rodada. Certifique-se de que a
          rodada foi finalizada e os pontos calculados.
        </div>
      )}
    </div>
  )
}
