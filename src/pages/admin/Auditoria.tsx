import { useState, useMemo, useEffect } from 'react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCircle2, Trophy, Calculator, Mail, Send, Smartphone, Loader2 } from 'lucide-react'
import { getWhatsappConfig, sendWhatsappMessage, WhatsappConfig } from '@/services/whatsapp'
import { useToast } from '@/hooks/use-toast'

export default function Auditoria() {
  const { ligas, rodadas, atletas, pontuacoes, partidas, grupos, grupoAtletas } = useAppStore()

  const [ligaId, setLigaId] = useState<string>('')
  const [rodadaId, setRodadaId] = useState<string>('')
  const [atletaId, setAtletaId] = useState<string>('')

  const [config, setConfig] = useState<WhatsappConfig | null>(null)
  const [sendingMap, setSendingMap] = useState<Record<string, boolean>>({})
  const [sendingAll, setSendingAll] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    getWhatsappConfig().then(setConfig)
  }, [])

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

  const atletasComPontuacao = useMemo(() => {
    return atletasDaRodada
      .map((a) => {
        const pt = pontuacoesRodada.find((p) => p.atleta_id === a.id)
        return { ...a, pontuacao: pt }
      })
      .sort((a, b) => (b.pontuacao?.total || 0) - (a.pontuacao?.total || 0))
  }, [atletasDaRodada, pontuacoesRodada])

  const handleSendIndividual = async (targetAtletaId: string) => {
    if (!config?.api_url) {
      toast({ title: 'Configure o WhatsApp primeiro!', variant: 'destructive' })
      return
    }

    const targetAtleta = atletasComPontuacao.find((a) => a.id === targetAtletaId)
    if (!targetAtleta || !targetAtleta.telefone) {
      toast({ title: 'Atleta sem telefone cadastrado', variant: 'destructive' })
      return
    }

    setSendingMap((prev) => ({ ...prev, [targetAtletaId]: true }))
    try {
      const liga = ligas.find((l) => l.id === ligaId)
      const rodada = rodadas.find((r) => r.id === rodadaId)
      let msg = config.mensagem_template || ''
      msg = msg.replace(/\{nome_atleta\}/g, targetAtleta.nome_completo)
      msg = msg.replace(/\{pontuacao\}/g, (targetAtleta.pontuacao?.total || 0).toString())
      msg = msg.replace(/\{rodada\}/g, rodada?.numero || '')
      msg = msg.replace(/\{liga\}/g, liga?.nome || '')

      await sendWhatsappMessage(targetAtleta.telefone, msg)
      toast({ title: 'Mensagem enviada!', description: `Para ${targetAtleta.nome_completo}` })
    } catch (error: any) {
      toast({ title: 'Erro ao enviar', description: error.message, variant: 'destructive' })
    } finally {
      setSendingMap((prev) => ({ ...prev, [targetAtletaId]: false }))
    }
  }

  const handleSendAll = async () => {
    if (!config?.api_url) {
      toast({ title: 'Configure o WhatsApp primeiro!', variant: 'destructive' })
      return
    }

    const validAtletas = atletasComPontuacao.filter((a) => a.telefone && a.pontuacao)
    if (validAtletas.length === 0) {
      toast({ title: 'Nenhum atleta válido com telefone', variant: 'destructive' })
      return
    }

    setSendingAll(true)
    let successCount = 0
    let errorCount = 0

    for (const a of validAtletas) {
      setSendingMap((prev) => ({ ...prev, [a.id]: true }))
      try {
        const liga = ligas.find((l) => l.id === ligaId)
        const rodada = rodadas.find((r) => r.id === rodadaId)
        let msg = config.mensagem_template || ''
        msg = msg.replace(/\{nome_atleta\}/g, a.nome_completo)
        msg = msg.replace(/\{pontuacao\}/g, (a.pontuacao?.total || 0).toString())
        msg = msg.replace(/\{rodada\}/g, rodada?.numero || '')
        msg = msg.replace(/\{liga\}/g, liga?.nome || '')

        await sendWhatsappMessage(a.telefone, msg)
        successCount++
      } catch (error) {
        errorCount++
      } finally {
        setSendingMap((prev) => ({ ...prev, [a.id]: false }))
      }
    }

    setSendingAll(false)
    toast({
      title: 'Disparo concluído',
      description: `${successCount} enviados com sucesso, ${errorCount} erros.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Auditoria de Pontuação</h2>
          <p className="text-muted-foreground">
            Inspecione o cálculo de pontos de cada atleta por rodada.
          </p>
        </div>
        <Button
          onClick={handleSendAll}
          disabled={sendingAll || !rodadaId || atletasComPontuacao.length === 0}
        >
          {sendingAll ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Enviar para todos da rodada
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
                  <SelectValue placeholder="Opcional: Filtrar Atleta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todos os atletas</SelectItem>
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

      {rodadaId && (!atletaId || atletaId === 'none') && (
        <Card className="mt-6 animate-fade-in-up">
          <CardHeader>
            <CardTitle>Atletas da Rodada</CardTitle>
            <CardDescription>
              Lista completa de participantes para disparo de mensagens ou auditoria detalhada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Atleta</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atletasComPontuacao.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell
                      className="font-medium cursor-pointer text-primary hover:underline"
                      onClick={() => setAtletaId(a.id)}
                    >
                      {a.nome_completo}
                    </TableCell>
                    <TableCell>
                      {a.telefone || (
                        <span className="text-muted-foreground text-xs">Sem número</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{a.pontuacao?.total || 0} pts</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendIndividual(a.id)}
                        disabled={sendingMap[a.id] || !a.telefone}
                        className="gap-2"
                      >
                        {sendingMap[a.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Smartphone className="h-4 w-4" />
                        )}
                        WhatsApp
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {atletasComPontuacao.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center p-8 text-muted-foreground">
                      Nenhum atleta nesta rodada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {pontuacao && atleta && atletaId !== 'none' && (
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
