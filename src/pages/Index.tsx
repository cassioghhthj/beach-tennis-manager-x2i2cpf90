import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Medal, Calendar, Users, Trophy } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Index() {
  const { publicacoes } = useAppStore()

  const latestPublicationsByLeague = useMemo(() => {
    if (!publicacoes) return []
    const map = new Map<string, any>()

    const sorted = [...publicacoes].sort(
      (a, b) => new Date(b.data_publicacao).getTime() - new Date(a.data_publicacao).getTime(),
    )

    for (const pub of sorted) {
      const key = pub.liga_id || pub.id
      if (!map.has(key)) {
        map.set(key, pub)
      }
    }

    return Array.from(map.values())
  }, [publicacoes])

  const [selectedLigaId, setSelectedLigaId] = useState<string | null>(null)

  useEffect(() => {
    if (
      latestPublicationsByLeague.length > 0 &&
      (!selectedLigaId ||
        !latestPublicationsByLeague.find((p) => (p.liga_id || p.id) === selectedLigaId))
    ) {
      setSelectedLigaId(latestPublicationsByLeague[0].liga_id || latestPublicationsByLeague[0].id)
    }
  }, [latestPublicationsByLeague, selectedLigaId])

  const selectedPub =
    latestPublicationsByLeague.find((p) => (p.liga_id || p.id) === selectedLigaId) || null

  const [viewMode, setViewMode] = useState<'geral' | 'rodadas'>('geral')

  const roundColumns = useMemo(() => {
    if (!selectedPub || !selectedPub.ranking) return []
    const keys = new Set<string>()
    ;(selectedPub.ranking as any[]).forEach((r) => {
      if (r.rodadas) {
        Object.keys(r.rodadas).forEach((k) => keys.add(k))
      }
    })

    return Array.from(keys).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10) || 0
      const numB = parseInt(b.replace(/\D/g, ''), 10) || 0
      return numA - numB
    })
  }, [selectedPub])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <section className="relative py-20 bg-card overflow-hidden">
          <div className="absolute inset-0 bg-secondary/90 z-0">
            <img
              src="https://i.postimg.cc/6QM0pbKR/capa-facebook-arena.png"
              alt="Capa Arena Beach Luiziana"
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tight drop-shadow-md">
              Ranking <span className="text-primary">Oficial</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium">
              Acompanhe a classificação, rodadas e resultados dos atletas da Arena Beach Luiziana.
            </p>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-primary shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Medal className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold uppercase">Ranking</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>
                  Veja a classificação atualizada de todas as categorias masculinas, femininas e
                  mistas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold uppercase">Rodadas</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>Acompanhe o calendário de jogos, resultados recentes e próximos confrontos.</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold uppercase">Atletas</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>Conheça os jogadores que fazem parte das ligas da nossa arena.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-2">Classificação Oficial</h2>
            </div>

            {latestPublicationsByLeague.length > 1 && (
              <div className="flex justify-center mb-8">
                <Select value={selectedLigaId || ''} onValueChange={setSelectedLigaId}>
                  <SelectTrigger className="w-full max-w-xs shadow-sm bg-background border-primary/20">
                    <SelectValue placeholder="Selecione a Liga" />
                  </SelectTrigger>
                  <SelectContent>
                    {latestPublicationsByLeague.map((pub) => (
                      <SelectItem key={pub.liga_id || pub.id} value={pub.liga_id || pub.id}>
                        {pub.liga_nome} - {pub.temporada}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedPub ? (
              <div className="max-w-5xl mx-auto">
                <div className="mb-6 text-center">
                  <Badge
                    variant="outline"
                    className="text-lg py-1.5 px-6 border-primary/50 text-primary shadow-sm bg-background"
                  >
                    {selectedPub.liga_nome} - {selectedPub.temporada}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-3 font-medium">
                    Atualizado em{' '}
                    {new Date(selectedPub.data_publicacao).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>

                  <div className="flex justify-center mt-6">
                    <Tabs
                      value={viewMode}
                      onValueChange={(v) => setViewMode(v as 'geral' | 'rodadas')}
                      className="w-full max-w-sm"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="geral">Ranking Geral</TabsTrigger>
                        <TabsTrigger value="rodadas">Por Rodada</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                <Card className="overflow-hidden border-border/50 shadow-md">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="w-20 text-center font-bold">Pos</TableHead>
                          <TableHead className="font-bold min-w-[200px]">Atleta</TableHead>
                          <TableHead className="text-center font-bold">Categoria</TableHead>
                          {viewMode === 'rodadas' &&
                            roundColumns.map((col) => (
                              <TableHead key={col} className="text-center font-bold">
                                {col}
                              </TableHead>
                            ))}
                          <TableHead className="text-center font-bold text-primary">
                            Pontos
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(selectedPub.ranking as any[]).map((r: any, idx: number) => (
                          <TableRow
                            key={r.atleta_id}
                            className="transition-colors hover:bg-muted/30"
                          >
                            <TableCell className="text-center font-medium">
                              {idx === 0 ? (
                                <Badge className="bg-yellow-500 hover:bg-yellow-600 px-2 py-0.5 text-sm shadow-sm">
                                  1º
                                </Badge>
                              ) : idx === 1 ? (
                                <Badge className="bg-slate-300 text-slate-800 hover:bg-slate-400 px-2 py-0.5 text-sm shadow-sm">
                                  2º
                                </Badge>
                              ) : idx === 2 ? (
                                <Badge className="bg-amber-600 hover:bg-amber-700 px-2 py-0.5 text-sm shadow-sm">
                                  3º
                                </Badge>
                              ) : idx < 8 ? (
                                <Badge
                                  variant="secondary"
                                  className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-2 py-0.5 text-sm shadow-sm"
                                >
                                  {r.posicao}º
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground font-semibold">
                                  {r.posicao}º
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="font-medium flex items-center gap-4">
                              <Avatar className="h-12 w-12 border shadow-sm ring-2 ring-background">
                                <AvatarImage src={r.avatar} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                  {getInitials(r.nome)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="truncate text-base font-bold">{r.nome}</span>
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground font-medium">
                              {r.categoria}
                            </TableCell>
                            {viewMode === 'rodadas' &&
                              roundColumns.map((col) => (
                                <TableCell
                                  key={col}
                                  className="text-center text-muted-foreground font-medium"
                                >
                                  {r.rodadas?.[col] ?? '-'}
                                </TableCell>
                              ))}
                            <TableCell className="text-center font-black text-primary text-xl">
                              {r.total}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center p-10 bg-card rounded-xl border border-dashed shadow-sm max-w-2xl mx-auto">
                <p className="text-muted-foreground text-lg mb-2">
                  Os dados de classificação estarão disponíveis assim que as primeiras rodadas forem
                  publicadas.
                </p>
                <p className="text-sm text-muted-foreground/60">
                  Aguarde os administradores lançarem os resultados.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
