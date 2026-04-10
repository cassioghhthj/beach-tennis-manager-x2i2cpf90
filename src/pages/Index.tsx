import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trophy, Medal, Star, Flame, CalendarDays, LogIn } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function Index() {
  const { publicacoes } = useAppStore()

  const uniqueLigas = useMemo(() => {
    const map = new Map<string, { id: string; nome: string; temporada: string }>()
    publicacoes.forEach((p) =>
      map.set(p.liga_id, { id: p.liga_id, nome: p.liga_nome, temporada: p.temporada }),
    )
    return Array.from(map.values())
  }, [publicacoes])

  const [selectedLigaId, setSelectedLigaId] = useState<string>(uniqueLigas[0]?.id || '')

  const currentPublication = useMemo(() => {
    if (!selectedLigaId) return null
    return publicacoes
      .filter((p) => p.liga_id === selectedLigaId)
      .sort(
        (a, b) => new Date(b.data_publicacao).getTime() - new Date(a.data_publicacao).getTime(),
      )[0]
  }, [selectedLigaId, publicacoes])

  const { top3, rest } = useMemo(() => {
    if (!currentPublication) return { top3: [], rest: [] }
    return {
      top3: currentPublication.ranking.slice(0, 3),
      rest: currentPublication.ranking.slice(3),
    }
  }, [currentPublication])

  const atletaDestaque = useMemo(() => {
    if (!currentPublication || currentPublication.ranking.length === 0) return null
    // Pega o cara com mais podios ou bonus como destaque, ou o lider
    return [...currentPublication.ranking].sort(
      (a, b) => b.bonus_5x0 - a.bonus_5x0 || b.podios - a.podios,
    )[0]
  }, [currentPublication])

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg leading-tight uppercase tracking-tight">
                Arena Beach
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">
                Portal Público
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link to="/login">
              <LogIn className="h-4 w-4 mr-2" />
              Acesso Restrito
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 via-background to-background pt-12 pb-8 px-4">
          <div className="container mx-auto max-w-5xl space-y-8 text-center">
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight font-heading uppercase">
                Ranking Oficial
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                Acompanhe o desempenho, as pontuações e a evolução dos atletas da Arena Beach.
              </p>
            </div>

            <div
              className="max-w-sm mx-auto animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              <Select value={selectedLigaId} onValueChange={setSelectedLigaId}>
                <SelectTrigger className="h-14 text-lg bg-card shadow-sm border-primary/20">
                  <SelectValue placeholder="Selecione a Liga / Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueLigas.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.nome} ({l.temporada})
                    </SelectItem>
                  ))}
                  {uniqueLigas.length === 0 && (
                    <SelectItem value="empty" disabled>
                      Nenhuma liga publicada
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {currentPublication ? (
          <div className="container mx-auto max-w-5xl px-4 pb-20 space-y-16 animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 py-2 rounded-full max-w-md mx-auto">
              <CalendarDays className="h-4 w-4" />
              <span>
                Última atualização:{' '}
                {format(new Date(currentPublication.data_publicacao), "dd 'de' MMMM, HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </div>

            {/* PÓDIO TOP 3 */}
            {top3.length > 0 && (
              <section className="relative pt-8">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-3xl rounded-full -z-10" />

                <h2 className="text-2xl font-bold text-center mb-10 flex items-center justify-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  Líderes da Temporada
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                </h2>

                <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 lg:gap-12 min-h-[300px]">
                  {/* 2º Lugar */}
                  {top3[1] && (
                    <div className="order-2 md:order-1 flex flex-col items-center flex-1 w-full max-w-[200px] group">
                      <div className="relative mb-4">
                        <Avatar className="h-24 w-24 border-4 border-[#C0C0C0] shadow-xl group-hover:scale-105 transition-transform duration-300">
                          <AvatarImage src={top3[1].avatar} />
                          <AvatarFallback>{top3[1].nome.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-3 -right-3 h-8 w-8 bg-[#C0C0C0] text-white rounded-full flex items-center justify-center font-bold border-2 border-background shadow-sm">
                          2
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-center truncate w-full">
                        {top3[1].nome}
                      </h3>
                      <p className="text-[#C0C0C0] font-black text-xl">{top3[1].total} pts</p>
                    </div>
                  )}

                  {/* 1º Lugar */}
                  {top3[0] && (
                    <div className="order-1 md:order-2 flex flex-col items-center flex-1 w-full max-w-[240px] mb-8 md:mb-12 group">
                      <div className="relative mb-4">
                        <div className="absolute -inset-2 bg-gradient-to-tr from-yellow-300 to-yellow-600 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                        <Avatar className="h-32 w-32 border-[5px] border-[#FFD700] shadow-2xl relative group-hover:scale-105 transition-transform duration-300">
                          <AvatarImage src={top3[0].avatar} />
                          <AvatarFallback>{top3[0].nome.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-4 -right-2 h-10 w-10 bg-[#FFD700] text-yellow-950 rounded-full flex items-center justify-center font-black text-lg border-2 border-background shadow-md">
                          1
                        </div>
                      </div>
                      <h3 className="font-black text-2xl text-center truncate w-full">
                        {top3[0].nome}
                      </h3>
                      <p className="text-[#FFD700] font-black text-3xl drop-shadow-sm">
                        {top3[0].total} pts
                      </p>
                      <Badge className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-yellow-950 px-3 py-1 font-bold">
                        LÍDER ABSOLUTO
                      </Badge>
                    </div>
                  )}

                  {/* 3º Lugar */}
                  {top3[2] && (
                    <div className="order-3 md:order-3 flex flex-col items-center flex-1 w-full max-w-[200px] group">
                      <div className="relative mb-4">
                        <Avatar className="h-24 w-24 border-4 border-[#CD7F32] shadow-xl group-hover:scale-105 transition-transform duration-300">
                          <AvatarImage src={top3[2].avatar} />
                          <AvatarFallback>{top3[2].nome.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-3 -right-3 h-8 w-8 bg-[#CD7F32] text-white rounded-full flex items-center justify-center font-bold border-2 border-background shadow-sm">
                          3
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-center truncate w-full">
                        {top3[2].nome}
                      </h3>
                      <p className="text-[#CD7F32] font-black text-xl">{top3[2].total} pts</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            <div className="grid md:grid-cols-3 gap-8">
              {/* LISTAGEM RESTANTE */}
              <Card className="md:col-span-2 border-border/50 shadow-sm overflow-hidden">
                <div className="bg-muted px-6 py-4 border-b">
                  <h3 className="font-heading font-bold text-lg">Classificação Geral</h3>
                </div>
                <div className="divide-y">
                  {rest.map((atleta) => (
                    <div
                      key={atleta.atleta_id}
                      className="flex items-center p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-10 font-bold text-muted-foreground text-lg text-center">
                        {atleta.posicao}º
                      </div>
                      <Avatar className="h-10 w-10 mx-4">
                        <AvatarImage src={atleta.avatar} />
                        <AvatarFallback>{atleta.nome.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">{atleta.nome}</p>
                        <div className="flex items-center text-xs text-muted-foreground gap-3 mt-0.5">
                          <span>Média: {atleta.media}</span>
                          {atleta.podios > 0 && (
                            <span className="flex items-center gap-1">
                              <Trophy className="h-3 w-3" /> {atleta.podios}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <span className="font-black text-xl text-primary">{atleta.total}</span>
                        <span className="text-xs text-muted-foreground block">pts</span>
                      </div>
                    </div>
                  ))}
                  {rest.length === 0 && top3.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      Nenhum atleta ranqueado ainda.
                    </div>
                  )}
                </div>
              </Card>

              {/* HIGHLIGHTS CARDS */}
              <div className="space-y-6">
                {atletaDestaque && (
                  <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4 text-primary-foreground/80 font-medium uppercase tracking-wider text-sm">
                        <Flame className="h-5 w-5" /> Atleta Destaque
                      </div>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary-foreground/30 shadow-md">
                          <AvatarImage src={atletaDestaque.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {atletaDestaque.nome.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-xl font-bold leading-tight">{atletaDestaque.nome}</h4>
                          <p className="text-sm text-primary-foreground/80 mt-1">
                            {atletaDestaque.bonus_5x0 > 0
                              ? `${atletaDestaque.bonus_5x0} bônus 5x0`
                              : `${atletaDestaque.podios} pódios`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-border/50 bg-muted/20">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="font-heading font-bold text-lg flex items-center gap-2">
                      <Medal className="h-5 w-5 text-primary" /> Sistema de Pontuação
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex justify-between border-b pb-1">
                        <span>Vitória</span> <strong className="text-foreground">10 pts</strong>
                      </li>
                      <li className="flex justify-between border-b pb-1">
                        <span>Bônus 5x0</span> <strong className="text-foreground">+5 pts</strong>
                      </li>
                      <li className="flex justify-between border-b pb-1">
                        <span>1º Lugar (Pódio)</span>{' '}
                        <strong className="text-foreground">50 pts</strong>
                      </li>
                      <li className="flex justify-between border-b pb-1">
                        <span>2º Lugar (Pódio)</span>{' '}
                        <strong className="text-foreground">30 pts</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>3º Lugar (Pódio)</span>{' '}
                        <strong className="text-foreground">20 pts</strong>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
              <Trophy className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Aguardando Resultados</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Selecione uma categoria acima para visualizar o ranking. Se estiver vazio, a
              organização ainda não publicou os resultados oficiais.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t py-8 bg-card text-center text-sm text-muted-foreground mt-auto">
        <div className="container px-4">
          <p className="font-medium text-foreground mb-2">Arena Beach Luiziana</p>
          <p>© {new Date().getFullYear()} - Sistema Oficial de Ranking</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-1 mt-4 hover:text-primary transition-colors"
          >
            <LogIn className="h-3 w-3" /> Acesso Administrativo
          </Link>
        </div>
      </footer>
    </div>
  )
}
