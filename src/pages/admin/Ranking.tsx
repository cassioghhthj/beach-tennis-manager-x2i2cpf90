import { useMemo, useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { getInitials } from '@/lib/utils'

const R_COLS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12']

export default function Ranking() {
  const { ligas, rodadas, pontuacoes, atletas, publicarRanking } = useAppStore()

  const [ligaId, setLigaId] = useState<string>('')
  const [search, setSearch] = useState('')
  const [selectedAtletaId, setSelectedAtletaId] = useState<string | null>(null)

  const rankingData = useMemo(() => {
    if (!ligaId) return []
    const rLigas = rodadas.filter((r) => r.liga_id === ligaId)
    const rIds = rLigas.map((r) => r.id)
    const pLiga = pontuacoes.filter((p) => rIds.includes(p.rodada_id))

    const map = new Map<string, any>()
    pLiga.forEach((p) => {
      if (!map.has(p.atleta_id)) {
        const a = atletas.find((x) => x.id === p.atleta_id)
        map.set(p.atleta_id, {
          atleta_id: p.atleta_id,
          nome: a?.nome_completo || 'Desconhecido',
          avatar: a?.avatar_url,
          categoria: a?.categoria_principal,
          total: 0,
          rodadas: {} as Record<string, number>,
          jogadas: 0,
        })
      }
      const st = map.get(p.atleta_id)
      const rObj = rLigas.find((r) => r.id === p.rodada_id)
      if (rObj) {
        const numMatch = rObj.numero.match(/\d+/)
        const key = numMatch ? `R${parseInt(numMatch[0], 10)}` : `R${rObj.numero}`
        st.rodadas[key] = p.total
      }
      st.total += p.total
      st.jogadas += 1
    })

    let results = Array.from(map.values()).sort((a, b) => b.total - a.total)
    if (search) {
      results = results.filter((r) => r.nome.toLowerCase().includes(search.toLowerCase()))
    }
    return results
  }, [ligaId, rodadas, pontuacoes, atletas, search])

  const selectedData = useMemo(
    () => rankingData.find((r) => r.atleta_id === selectedAtletaId),
    [rankingData, selectedAtletaId],
  )

  const handlePublish = () => {
    if (!ligaId) return
    const liga = ligas.find((l) => l.id === ligaId)
    if (!liga) return

    const snapshot = rankingData.map((r, i) => ({
      posicao: i + 1,
      atleta_id: r.atleta_id,
      nome: r.nome,
      avatar: r.avatar,
      categoria: r.categoria,
      total: r.total,
      media: r.jogadas > 0 ? (r.total / r.jogadas).toFixed(1) : '0.0',
      rodadas: r.rodadas,
    }))

    publicarRanking(liga.id, liga.nome, liga.temporada, snapshot)
    toast.success('Ranking publicado!', {
      description: 'Os dados já estão visíveis no portal público.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ranking Interno</h2>
          <p className="text-muted-foreground">
            Acompanhe a performance acumulada e gerencie a publicação.
          </p>
        </div>
        {ligaId && rankingData.length > 0 && (
          <Button onClick={handlePublish} className="w-full sm:w-auto gap-2">
            <Globe className="h-4 w-4" />
            Publicar no Portal
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6 flex flex-col sm:flex-row gap-4">
          <Select value={ligaId} onValueChange={setLigaId}>
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue placeholder="Selecione a Liga / Categoria" />
            </SelectTrigger>
            <SelectContent>
              {ligas.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.nome} ({l.temporada})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar atleta..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {ligaId ? (
        <div className="border rounded-md overflow-x-auto bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">Pos</TableHead>
                <TableHead className="min-w-[200px]">Atleta</TableHead>
                {R_COLS.map((r) => (
                  <TableHead key={r} className="text-center w-14">
                    {r}
                  </TableHead>
                ))}
                <TableHead className="text-center font-bold text-primary">Total</TableHead>
                <TableHead className="text-center">Média</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankingData.map((row, idx) => {
                const media = row.jogadas > 0 ? (row.total / row.jogadas).toFixed(1) : '0.0'
                return (
                  <TableRow
                    key={row.atleta_id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setSelectedAtletaId(row.atleta_id)}
                  >
                    <TableCell className="text-center font-medium">
                      {idx === 0 ? (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 px-1.5">
                          {idx + 1}
                        </Badge>
                      ) : idx === 1 ? (
                        <Badge className="bg-slate-300 text-slate-800 hover:bg-slate-400 px-1.5">
                          {idx + 1}
                        </Badge>
                      ) : idx === 2 ? (
                        <Badge className="bg-amber-600 hover:bg-amber-700 px-1.5">{idx + 1}</Badge>
                      ) : idx < 8 ? (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20 px-1.5"
                        >
                          {idx + 1}
                        </Badge>
                      ) : (
                        idx + 1
                      )}
                    </TableCell>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={row.avatar} className="object-cover" />
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                          {getInitials(row.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{row.nome}</span>
                    </TableCell>
                    {R_COLS.map((r) => (
                      <TableCell key={r} className="text-center text-muted-foreground text-sm">
                        {row.rodadas[r] ?? '-'}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-black text-primary text-base">
                      {row.total}
                    </TableCell>
                    <TableCell className="text-center text-sm">{media}</TableCell>
                  </TableRow>
                )
              })}
              {rankingData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={16} className="h-24 text-center text-muted-foreground">
                    Nenhum dado encontrado para os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-12 text-center text-muted-foreground border-dashed border rounded-xl bg-muted/5">
          Selecione uma liga para visualizar o ranking.
        </div>
      )}

      <Sheet open={!!selectedAtletaId} onOpenChange={(v) => !v && setSelectedAtletaId(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle>Histórico do Atleta</SheetTitle>
            <SheetDescription>Performance acumulada na temporada.</SheetDescription>
          </SheetHeader>
          {selectedData && (
            <div className="py-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border shadow-sm">
                  <AvatarImage src={selectedData.avatar} className="object-cover" />
                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                    {getInitials(selectedData.nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedData.nome}</h3>
                  <p className="text-sm text-muted-foreground">
                    Categoria {selectedData.categoria}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-sm text-muted-foreground mb-1">Total de Pontos</span>
                    <span className="text-3xl font-black text-primary">{selectedData.total}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-sm text-muted-foreground mb-1">Média / Rodada</span>
                    <span className="text-3xl font-black">
                      {selectedData.jogadas > 0
                        ? (selectedData.total / selectedData.jogadas).toFixed(1)
                        : '0.0'}
                    </span>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Histórico por Rodada</h4>
                <div className="space-y-2">
                  {R_COLS.map((r) => {
                    const pts = selectedData.rodadas[r]
                    if (pts === undefined) return null
                    return (
                      <div
                        key={r}
                        className="flex justify-between items-center p-3 border rounded-md"
                      >
                        <span className="font-medium text-sm">Rodada {r.replace('R', '')}</span>
                        <Badge
                          variant="secondary"
                          className="font-bold text-base bg-primary/10 text-primary"
                        >
                          {pts} pts
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
