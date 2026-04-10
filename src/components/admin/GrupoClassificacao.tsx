import { useMemo } from 'react'
import useAppStore, { Grupo } from '@/stores/useAppStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function GrupoClassificacao({ grupo }: { grupo: Grupo }) {
  const { partidas, grupoAtletas, atletas } = useAppStore()

  const standings = useMemo(() => {
    const stats: Record<string, any> = {}

    const ativos = grupoAtletas.filter((ga) => ga.grupo_id === grupo.id && ga.status === 'Active')
    ativos.forEach((ga) => {
      stats[ga.atleta_id] = {
        atleta_id: ga.atleta_id,
        nome: atletas.find((a) => a.id === ga.atleta_id)?.nome_completo || 'Unknown',
        wins: 0,
        losses: 0,
        gamesPro: 0,
        gamesAgainst: 0,
        headToHeadWins: {},
      }
    })

    const grupoPartidas = partidas.filter((p) => p.grupo_id === grupo.id)

    grupoPartidas.forEach((p) => {
      const isP1Win = p.score1 > p.score2
      const isP2Win = p.score2 > p.score1

      const updateAtleta = (id: string, win: boolean, gp: number, ga: number, oppIds: string[]) => {
        if (!stats[id]) return
        if (win) stats[id].wins += 1
        else if (isP1Win || isP2Win) stats[id].losses += 1
        stats[id].gamesPro += gp
        stats[id].gamesAgainst += ga

        if (win) {
          oppIds.forEach((oppId) => {
            if (stats[id].headToHeadWins[oppId] === undefined) stats[id].headToHeadWins[oppId] = 0
            stats[id].headToHeadWins[oppId] += 1
          })
        }
      }

      updateAtleta(p.atleta1_id, isP1Win, p.score1, p.score2, [p.atleta3_id, p.atleta4_id])
      updateAtleta(p.atleta2_id, isP1Win, p.score1, p.score2, [p.atleta3_id, p.atleta4_id])
      updateAtleta(p.atleta3_id, isP2Win, p.score2, p.score1, [p.atleta1_id, p.atleta2_id])
      updateAtleta(p.atleta4_id, isP2Win, p.score2, p.score1, [p.atleta1_id, p.atleta2_id])
    })

    const results = Object.values(stats).map((s) => {
      s.balance = s.gamesPro - s.gamesAgainst
      const totalGames = s.gamesPro + s.gamesAgainst
      s.efficiency = totalGames > 0 ? Math.round((s.gamesPro / totalGames) * 100) : 0
      s.points = s.wins * 3
      return s
    })

    results.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      const aH2H = a.headToHeadWins[b.atleta_id] || 0
      const bH2H = b.headToHeadWins[a.atleta_id] || 0
      if (aH2H !== bH2H) return bH2H - aH2H
      if (b.balance !== a.balance) return b.balance - a.balance
      return b.gamesPro - a.gamesPro
    })

    return results
  }, [partidas, grupoAtletas, atletas, grupo.id])

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Classificação ao Vivo</h3>
      <div className="bg-background rounded-md border overflow-hidden">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 text-center">Pos</TableHead>
              <TableHead>Atleta</TableHead>
              <TableHead className="text-center">Pts</TableHead>
              <TableHead className="text-center">V</TableHead>
              <TableHead className="text-center">D</TableHead>
              <TableHead className="text-center">GP</TableHead>
              <TableHead className="text-center">GC</TableHead>
              <TableHead className="text-center">SG</TableHead>
              <TableHead className="text-center">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((s, i) => (
              <TableRow key={s.atleta_id}>
                <TableCell className="text-center font-medium">{i + 1}º</TableCell>
                <TableCell className="font-medium truncate max-w-[120px]">{s.nome}</TableCell>
                <TableCell className="text-center font-bold text-primary">{s.points}</TableCell>
                <TableCell className="text-center">{s.wins}</TableCell>
                <TableCell className="text-center">{s.losses}</TableCell>
                <TableCell className="text-center">{s.gamesPro}</TableCell>
                <TableCell className="text-center">{s.gamesAgainst}</TableCell>
                <TableCell className="text-center font-medium">
                  <span
                    className={
                      s.balance > 0 ? 'text-green-600' : s.balance < 0 ? 'text-destructive' : ''
                    }
                  >
                    {s.balance > 0 ? `+${s.balance}` : s.balance}
                  </span>
                </TableCell>
                <TableCell className="text-center">{s.efficiency}%</TableCell>
              </TableRow>
            ))}
            {standings.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground h-12">
                  Adicione atletas e partidas para ver a classificação.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
