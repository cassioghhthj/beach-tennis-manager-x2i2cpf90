import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Users, Star, Activity } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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

export default function Dashboard() {
  const { ligas, atletas, sistemas } = useAppStore()

  const stats = [
    {
      title: 'Total de Ligas Ativas',
      value: ligas.filter((l) => l.status === 'Ativo').length,
      icon: Trophy,
      color: 'text-primary',
    },
    { title: 'Atletas Cadastrados', value: atletas.length, icon: Users, color: 'text-secondary' },
    {
      title: 'Sistemas de Pontuação',
      value: sistemas.length,
      icon: Star,
      color: 'text-orange-500',
    },
    {
      title: 'Atletas Ativos',
      value: atletas.filter((a) => a.status === 'Ativo').length,
      icon: Activity,
      color: 'text-success',
    },
  ]

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {}
    atletas.forEach(
      (a) => (counts[a.categoria_principal] = (counts[a.categoria_principal] || 0) + 1),
    )
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [atletas])

  const chartConfig = { count: { label: 'Atletas', color: 'hsl(var(--primary))' } }

  return (
    <div className="space-y-8">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/50">
          <CardHeader>
            <CardTitle className="font-heading">Atletas por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/50">
          <CardHeader>
            <CardTitle className="font-heading">Últimas Ligas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ligas.slice(0, 5).map((liga) => (
                  <TableRow key={liga.id}>
                    <TableCell className="font-medium">{liga.nome}</TableCell>
                    <TableCell>
                      <Badge
                        variant={liga.status === 'Ativo' ? 'success' : 'secondary'}
                        className="text-[10px]"
                      >
                        {liga.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
