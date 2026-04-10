import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trophy, Users, Star, Activity, Medal, Target, Flame } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Dashboard() {
  const { ligas, atletas, sistemas, rodadas, pontuacoes } = useAppStore()

  const stats = [
    {
      title: 'Total de Ligas Ativas',
      value: ligas.filter((l) => l.status === 'Ativo').length,
      icon: Trophy,
      color: 'text-primary',
    },
    { title: 'Atletas Cadastrados', value: atletas.length, icon: Users, color: 'text-blue-500' },
    {
      title: 'Rodadas Finalizadas',
      value: rodadas.filter((r) => r.status === 'Round Finalized').length,
      icon: Star,
      color: 'text-orange-500',
    },
    {
      title: 'Total de Pontuações',
      value: pontuacoes.length,
      icon: Activity,
      color: 'text-green-500',
    },
  ]

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    atletas.forEach(
      (a) => (counts[a.categoria_principal] = (counts[a.categoria_principal] || 0) + 1),
    )
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [atletas])

  const chartConfig = { count: { label: 'Atletas', color: 'hsl(var(--primary))' } }
  const evolutionConfig = { pontos: { label: 'Pontos Distribuídos', color: 'hsl(var(--chart-2))' } }

  const highlights = useMemo(() => {
    const map = new Map<string, { id: string; nome: string; avatar: string; pts: number }>()
    pontuacoes.forEach((p) => {
      if (!map.has(p.atleta_id)) {
        const a = atletas.find((x) => x.id === p.atleta_id)
        map.set(p.atleta_id, {
          id: p.atleta_id,
          nome: a?.nome_completo || 'Desconhecido',
          avatar: a?.avatar_url || '',
          pts: 0,
        })
      }
      map.get(p.atleta_id)!.pts += p.total
    })
    const sorted = Array.from(map.values()).sort((a, b) => b.pts - a.pts)
    return {
      topScorer: sorted[0],
      top10: sorted.slice(0, 5),
    }
  }, [pontuacoes, atletas])

  const evolutionData = useMemo(() => {
    return rodadas
      .filter((r) => r.status === 'Round Finalized')
      .map((r) => {
        const rPts = pontuacoes.filter((p) => p.rodada_id === r.id)
        const total = rPts.reduce((acc, p) => acc + p.total, 0)
        return { name: r.numero, pontos: total }
      })
  }, [rodadas, pontuacoes])

  return (
    <div className="space-y-8 pb-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-yellow-500" />
              Atleta Destaque (Geral)
            </CardTitle>
            <CardDescription>Maior pontuador acumulado do sistema.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center pt-4">
            {highlights.topScorer ? (
              <>
                <div className="relative mb-4">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-75 blur"></div>
                  <Avatar className="h-24 w-24 border-4 border-background relative">
                    <AvatarImage src={highlights.topScorer.avatar} />
                    <AvatarFallback className="text-2xl">
                      {highlights.topScorer.nome.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-2xl font-bold">{highlights.topScorer.nome}</h3>
                <Badge variant="secondary" className="mt-2 text-lg px-4 py-1">
                  {highlights.topScorer.pts} pontos
                </Badge>
              </>
            ) : (
              <span className="text-muted-foreground">Sem dados suficientes</span>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="font-heading">Evolução de Pontuação</CardTitle>
            <CardDescription>Total de pontos distribuídos por rodada finalizada.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer config={evolutionConfig} className="h-[250px] w-full">
              <LineChart data={evolutionData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="pontos"
                  stroke="var(--color-pontos)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/50">
          <CardHeader>
            <CardTitle className="font-heading">Atletas por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={categoryData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/50 flex flex-col">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Top 5 Atletas (Global)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {highlights.top10.map((atleta, index) => (
                <div key={atleta.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-muted-foreground w-4">{index + 1}º</span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={atleta.avatar} />
                      <AvatarFallback>{atleta.nome.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm truncate max-w-[120px]">
                      {atleta.nome}
                    </span>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {atleta.pts} pts
                  </Badge>
                </div>
              ))}
              {highlights.top10.length === 0 && (
                <div className="text-center text-muted-foreground py-4">Nenhum dado</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
