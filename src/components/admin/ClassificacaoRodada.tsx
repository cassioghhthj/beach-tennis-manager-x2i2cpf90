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
import { Calculator } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function ClassificacaoRodada({ rodada }: { rodada: Rodada }) {
  const { pontuacoes, atletas, grupos, grupoAtletas, finalizarRodada } = useAppStore()

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
        total: (p?.total || 0) + (p?.pontos_presenca || 0),
        hasScore: !!p,
      }
    })

    return combined.sort(
      (a, b) => b.total - a.total || a.atleta.nome_completo.localeCompare(b.atleta.nome_completo),
    )
  }, [pontuacoes, atletasDaRodada, rodada.id])

  const handleRecalcular = async () => {
    await finalizarRodada(rodada.id)
    toast.success('Pontuação da rodada recalculada com sucesso!')
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
        <Button variant="outline" onClick={handleRecalcular}>
          <Calculator className="mr-2 h-4 w-4" />
          Recalcular Pontos
        </Button>
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
                  <TableHead className="text-center">Pts Grupo</TableHead>
                  <TableHead className="text-center">Pts Vitórias</TableHead>
                  <TableHead className="text-center">Bônus 5x0</TableHead>
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
