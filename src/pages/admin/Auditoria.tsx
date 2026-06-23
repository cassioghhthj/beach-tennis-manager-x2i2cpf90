import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Search, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function Auditoria() {
  const { ligas, rodadas, atletas } = useAppStore()
  const [selectedLigaId, setSelectedLigaId] = useState<string>('')
  const [selectedRodadaId, setSelectedRodadaId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const activeLigas = useMemo(() => ligas.filter((l) => l.status === 'Ativo'), [ligas])
  const rodadasLiga = useMemo(
    () =>
      rodadas
        .filter((r) => r.liga_id === selectedLigaId)
        .sort((a, b) => Number(a.numero) - Number(b.numero)),
    [rodadas, selectedLigaId],
  )

  const fetchAuditoria = async (force = false) => {
    if (!selectedRodadaId) {
      setData([])
      return
    }

    setIsLoading(true)
    try {
      const { data: pontuacoes, error } = await supabase
        .from('pontuacoes_rodada')
        .select('*')
        .eq('rodada_id', selectedRodadaId)

      if (error) throw error

      if (pontuacoes) {
        const enriched = pontuacoes
          .map((p) => {
            const atleta = atletas.find((a) => a.id === p.atleta_id)
            return {
              ...p,
              atleta_nome: atleta?.nome_completo || 'Atleta Desconhecido',
            }
          })
          .sort((a, b) => b.total - a.total || a.atleta_nome.localeCompare(b.atleta_nome))

        setData(enriched)
      }
    } catch (err) {
      console.error('Erro ao buscar auditoria:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAuditoria()
  }, [selectedRodadaId])

  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    return data.filter((d) => d.atleta_nome.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [data, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auditoria de Pontuações</h1>
          <p className="text-muted-foreground">
            Consulte os pontos consolidados no banco de dados para cada rodada.
          </p>
        </div>
        <Button
          onClick={() => fetchAuditoria(true)}
          disabled={isLoading || !selectedRodadaId}
          variant="outline"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/3">
            <Select
              value={selectedLigaId}
              onValueChange={(val) => {
                setSelectedLigaId(val)
                setSelectedRodadaId('')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma liga" />
              </SelectTrigger>
              <SelectContent>
                {activeLigas.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-1/3">
            <Select
              value={selectedRodadaId}
              onValueChange={setSelectedRodadaId}
              disabled={!selectedLigaId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma rodada" />
              </SelectTrigger>
              <SelectContent>
                {rodadasLiga.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    Rodada {r.numero}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-1/3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar atleta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              disabled={!selectedRodadaId}
            />
          </div>
        </CardContent>
      </Card>

      {!selectedRodadaId ? (
        <Card className="border-dashed bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Search className="h-8 w-8 mb-4 opacity-50" />
            <p>Selecione uma liga e uma rodada para visualizar os dados consolidados.</p>
          </CardContent>
        </Card>
      ) : isLoading && data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Sincronizando com o banco de dados...</p>
          </CardContent>
        </Card>
      ) : data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <p>Nenhuma pontuação consolidada encontrada para esta rodada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <div className="hidden md:grid grid-cols-8 gap-4 px-4 py-2 font-semibold text-sm text-muted-foreground bg-muted/50 rounded-t-xl border-b">
            <div className="col-span-2">Atleta</div>
            <div className="text-center">Vitorias</div>
            <div className="text-center">Grupo</div>
            <div className="text-center">Pódio</div>
            <div className="text-center">Presença</div>
            <div className="text-center">Manuais</div>
            <div className="text-center text-primary font-bold">Total</div>
          </div>

          {filteredData.map((p) => (
            <Card key={p.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="grid md:grid-cols-8 gap-4 p-4 items-center">
                <div className="col-span-2 font-medium">{p.atleta_nome}</div>

                <div className="flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-muted-foreground text-sm">Vitórias:</span>
                  <Badge variant="outline" className="font-mono">
                    {p.pontos_vitorias}
                  </Badge>
                </div>

                <div className="flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-muted-foreground text-sm">Grupo:</span>
                  <Badge variant="outline" className="font-mono">
                    {p.pontos_grupo}
                  </Badge>
                </div>

                <div className="flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-muted-foreground text-sm">Pódio:</span>
                  <Badge variant="outline" className="font-mono">
                    {(p.pontos_podio_principal || 0) + (p.pontos_podio_consolacao || 0)}
                  </Badge>
                </div>

                <div className="flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-muted-foreground text-sm">Presença:</span>
                  <Badge variant="outline" className="font-mono">
                    {p.pontos_presenca || 0}
                  </Badge>
                </div>

                <div className="flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-muted-foreground text-sm">Manuais:</span>
                  <Badge
                    variant={p.pontos_manuais !== 0 ? 'default' : 'outline'}
                    className="font-mono"
                  >
                    {p.pontos_manuais}
                  </Badge>
                </div>

                <div className="flex justify-between md:justify-center items-center pt-2 md:pt-0 mt-2 md:mt-0 border-t md:border-0">
                  <span className="md:hidden font-bold text-sm">Total:</span>
                  <span className="font-black text-lg text-primary">{p.total}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
