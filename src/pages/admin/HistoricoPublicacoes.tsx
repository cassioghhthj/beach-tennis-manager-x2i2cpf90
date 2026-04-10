import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { History, Eye, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import useAppStore, { Publicacao } from '@/stores/useAppStore'

export default function HistoricoPublicacoes() {
  const { publicacoes, deletePublicacao } = useAppStore()
  const [selectedPub, setSelectedPub] = useState<Publicacao | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Histórico de Publicações</h2>
        <p className="text-muted-foreground">
          Gerencie e visualize as versões dos rankings que foram enviadas para o portal público.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" /> Registro de Publicações
          </CardTitle>
          <CardDescription>
            Toda vez que um ranking é publicado, um snapshot é criado aqui.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data / Hora</TableHead>
                <TableHead>Liga / Categoria</TableHead>
                <TableHead>Temporada</TableHead>
                <TableHead className="text-center">Atletas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publicacoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhuma publicação encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                publicacoes.map((pub) => (
                  <TableRow key={pub.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {format(new Date(pub.data_publicacao), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {pub.liga_nome}
                      </Badge>
                    </TableCell>
                    <TableCell>{pub.temporada}</TableCell>
                    <TableCell className="text-center">{pub.ranking.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPub(pub)}
                          className="h-8 px-2"
                        >
                          <Eye className="h-4 w-4 mr-1" /> Ver
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePublicacao(pub.id)}
                          className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedPub} onOpenChange={(open) => !open && setSelectedPub(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Snapshot da Publicação</DialogTitle>
            <DialogDescription>
              Dados exatos enviados ao portal em{' '}
              {selectedPub &&
                format(new Date(selectedPub.data_publicacao), "dd/MM/yyyy 'às' HH:mm")}
            </DialogDescription>
          </DialogHeader>

          {selectedPub && (
            <ScrollArea className="max-h-[60vh] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 sticky top-0 z-10">
                    <TableHead className="w-16 text-center">Pos</TableHead>
                    <TableHead>Atleta</TableHead>
                    <TableHead className="text-center">Total Pts</TableHead>
                    <TableHead className="text-center">Média</TableHead>
                    <TableHead className="text-center">Pódios</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPub.ranking.map((row) => (
                    <TableRow key={row.atleta_id}>
                      <TableCell className="text-center font-bold">{row.posicao}º</TableCell>
                      <TableCell>{row.nome}</TableCell>
                      <TableCell className="text-center font-medium text-primary">
                        {row.total}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {row.media}
                      </TableCell>
                      <TableCell className="text-center">{row.podios}</TableCell>
                    </TableRow>
                  ))}
                  {selectedPub.ranking.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Ranking vazio neste snapshot.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
