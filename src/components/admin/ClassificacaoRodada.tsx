import { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useAppStore, { Rodada } from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Calculator, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { useState } from 'react'
import {
  getWhatsappConfig,
  sendWhatsappMessage,
  processarTemplateWhatsApp,
} from '@/services/whatsapp'

export default function ClassificacaoRodada({ rodada }: { rodada: Rodada }) {
  const { pontuacoes, atletas, grupos, grupoAtletas, finalizarRodada, partidas, ligas } =
    useAppStore()
  const [sendingWhatsapp, setSendingWhatsapp] = useState(false)

  const atletasDaRodada = useMemo(() => {
    const rGroups = grupos.filter((g) => g.rodada_id === rodada.id).map((g) => g.id)
    const gAtletas = grupoAtletas
      .filter((ga) => rGroups.includes(ga.grupo_id))
      .map((ga) => ga.atleta_id)
    return Array.from(new Set(gAtletas))
      .map((id) => atletas.find((a) => a.id === id))
      .filter(Boolean) as typeof atletas
  }, [rodada.id, grupos, grupoAtletas, atletas])

  const ranking = useMemo(() => {
    const rPontuacoes = pontuacoes.filter((p) => p.rodada_id === rodada.id)

    const combined = atletasDaRodada.map((atleta) => {
      const p = rPontuacoes.find((pt) => pt.atleta_id === atleta.id)
      return {
        atleta,
        pontos_grupo: p?.pontos_grupo || 0,
        pontos_vitorias: p?.pontos_vitorias || 0,
        bonus_5x0: p?.bonus_5x0 || 0,
        pontos_presenca: p?.pontos_presenca || 0,
        pontos_podio: (p?.pontos_podio_principal || 0) + (p?.pontos_podio_consolacao || 0),
        pontos_manuais: p?.pontos_manuais || 0,
        total: p?.total || 0,
        hasScore: !!p,
        raw_p: p,
      }
    })

    return combined.sort(
      (a, b) => b.total - a.total || a.atleta.nome_completo.localeCompare(b.atleta.nome_completo),
    )
  }, [pontuacoes, atletasDaRodada, rodada.id])

  const handleRecalcular = async () => {
    await finalizarRodada(rodada.id)
    await (supabase.rpc as any)('processar_presenca_rodada', { p_rodada_id: rodada.id })
    toast.success('Pontuação da rodada recalculada com sucesso!')
    setTimeout(() => window.location.reload(), 1500)
  }

  const handleNotificarAtletas = async () => {
    const confirm = window.confirm(
      'Deseja enviar o resultado via WhatsApp para todos os atletas desta rodada com telefone cadastrado?',
    )
    if (!confirm) return

    setSendingWhatsapp(true)
    try {
      const config = await getWhatsappConfig()
      if (!config) {
        toast.error('Configuração do WhatsApp não encontrada. Configure o WAHA primeiro.')
        setSendingWhatsapp(false)
        return
      }

      const liga = ligas?.find((l) => l.id === rodada.liga_id)
      const nomeLiga = liga ? liga.nome : 'Liga Beach Tennis'
      const nomeRodada = rodada.numero
      const rGroups = grupos.filter((g) => g.rodada_id === rodada.id).map((g) => g.id)

      let sentCount = 0
      let errorCount = 0

      for (const item of ranking) {
        const telefone = item.atleta.telefone
        if (!telefone) continue

        const atletaPartidas = (partidas || []).filter(
          (p) =>
            p.grupo_id &&
            rGroups.includes(p.grupo_id) &&
            (p.atleta1_id === item.atleta.id ||
              p.atleta2_id === item.atleta.id ||
              p.atleta3_id === item.atleta.id ||
              p.atleta4_id === item.atleta.id),
        )

        let vitorias = 0
        let derrotas = 0
        let games_pro = 0
        let games_contra = 0

        atletaPartidas.forEach((p) => {
          const isTime1 = p.atleta1_id === item.atleta.id || p.atleta2_id === item.atleta.id
          const isTime2 = p.atleta3_id === item.atleta.id || p.atleta4_id === item.atleta.id

          if (isTime1 || isTime2) {
            const scoreTeam = isTime1 ? p.score1 : p.score2
            const scoreOpp = isTime1 ? p.score2 : p.score1

            if (scoreTeam > scoreOpp) vitorias++
            else if (scoreTeam < scoreOpp) derrotas++

            games_pro += scoreTeam
            games_contra += scoreOpp
          }
        })

        const pRaw = item.raw_p as any
        const dbVitorias = pRaw?.vitorias ?? vitorias
        const dbDerrotas = pRaw?.derrotas ?? derrotas
        const dbGP = pRaw?.games_pro ?? games_pro
        const dbGC = pRaw?.games_contra ?? games_contra
        const dbSG = pRaw?.saldo_games ?? games_pro - games_contra

        const dados = {
          nome_atleta: item.atleta.nome_completo,
          rodada: nomeRodada,
          liga: nomeLiga,
          vitorias: dbVitorias,
          derrotas: dbDerrotas,
          games_pro: dbGP,
          games_contra: dbGC,
          saldo_games: dbSG,
          pontos_presenca: item.pontos_presenca,
          pontos_grupo: item.pontos_grupo,
          pontos_vitorias: item.pontos_vitorias,
          bonus_5x0: item.bonus_5x0,
          pontos_podio: item.pontos_podio,
          pontuacao: item.total,
          mensagem_otimista:
            item.total > 0
              ? 'Excelente desempenho!'
              : 'Bora treinar mais que na próxima você amassa!',
        }

        let safeTemplate = config.mensagem_template || ''

        // Ajuste retroativo para templates que ainda usavam as variáveis antigas
        if (
          safeTemplate.includes('Presença no Grupo: {pontos_grupo}') &&
          !safeTemplate.includes('{pontos_presenca}')
        ) {
          safeTemplate = safeTemplate.replace(
            'Presença no Grupo: {pontos_grupo}',
            'Presença na Rodada: {pontos_presenca}',
          )
        }

        // Se o template ainda tem a palavra Desempenho em Quadra mas sem a variável correta, força uma limpeza
        if (
          safeTemplate.includes('Desempenho em Quadra') &&
          !safeTemplate.includes('{pontos_grupo}') &&
          !safeTemplate.includes('{games_pro}')
        ) {
          safeTemplate = safeTemplate.replace(
            'Desempenho em Quadra',
            'Desempenho em Quadra (GP): {games_pro}',
          )
        }

        const mensagem = processarTemplateWhatsApp(safeTemplate, dados)

        try {
          await sendWhatsappMessage(telefone, mensagem)
          sentCount++
        } catch (err) {
          console.error('Erro ao enviar para', item.atleta.nome_completo, err)
          errorCount++
        }
      }

      toast.success(`Notificações enviadas! Sucesso: ${sentCount}, Falhas: ${errorCount}`)
    } catch (error: any) {
      toast.error('Erro geral ao enviar WhatsApp', { description: error.message })
    } finally {
      setSendingWhatsapp(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Ranking da Rodada</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Pontuação consolidada dos atletas nesta rodada.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleRecalcular}>
            <Calculator className="mr-2 h-4 w-4" />
            Recalcular Pontos
          </Button>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleNotificarAtletas}
            disabled={sendingWhatsapp || ranking.length === 0}
          >
            {sendingWhatsapp ? (
              <span className="flex items-center">
                <Send className="mr-2 h-4 w-4 animate-pulse" /> Enviando...
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="mr-2 h-4 w-4" /> Notificar WhatsApp
              </span>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {ranking.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum atleta encontrado nesta rodada.
          </div>
        ) : (
          <div className="bg-background rounded-md border overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">Pos</TableHead>
                  <TableHead>Atleta</TableHead>
                  <TableHead className="text-center" title="Games Pró Realizados">
                    GP
                  </TableHead>
                  <TableHead className="text-center" title="Pontos do Grupo (Regra)">
                    Pts Grupo
                  </TableHead>
                  <TableHead className="text-center">Pts Vitórias</TableHead>
                  <TableHead className="text-center">Bônus (Zerado)</TableHead>
                  <TableHead className="text-center">Presença</TableHead>
                  <TableHead className="text-center">Pódios</TableHead>
                  <TableHead className="text-center">Manual</TableHead>
                  <TableHead className="text-center font-bold text-primary">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking.map((item, i) => (
                  <TableRow key={item.atleta.id}>
                    <TableCell className="text-center font-medium">{i + 1}º</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.atleta.nome_completo}</div>
                      {!item.hasScore && (
                        <Badge variant="secondary" className="text-[10px] mt-1">
                          Sem cálculo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {(item.raw_p as any)?.games_pro ?? 0}
                    </TableCell>
                    <TableCell className="text-center">{item.pontos_grupo}</TableCell>
                    <TableCell className="text-center">{item.pontos_vitorias}</TableCell>
                    <TableCell className="text-center">{item.bonus_5x0}</TableCell>
                    <TableCell className="text-center">{item.pontos_presenca}</TableCell>
                    <TableCell className="text-center">{item.pontos_podio}</TableCell>
                    <TableCell className="text-center">
                      <span className={item.pontos_manuais !== 0 ? 'font-bold text-primary' : ''}>
                        {item.pontos_manuais > 0 ? `+${item.pontos_manuais}` : item.pontos_manuais}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary text-base">
                      {item.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
