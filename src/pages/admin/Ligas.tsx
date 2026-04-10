import { useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Edit, Plus, Search } from 'lucide-react'
import useAppStore, { Liga } from '@/stores/useAppStore'
import { LigaForm } from '@/components/LigaForm'
import { toast } from 'sonner'

export default function Ligas() {
  const { ligas, addLiga, updateLiga } = useAppStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLiga, setEditingLiga] = useState<Liga | null>(null)

  const filteredLigas = ligas.filter((l) => {
    const matchSearch = l.nome.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'Todos' || l.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleOpenNew = () => {
    setEditingLiga(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (liga: Liga) => {
    setEditingLiga(liga)
    setIsFormOpen(true)
  }

  const handleSubmit = (data: any) => {
    if (editingLiga) {
      updateLiga(editingLiga.id, data)
      toast.success('Liga atualizada com sucesso!')
    } else {
      addLiga(data)
      toast.success('Liga criada com sucesso!')
    }
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar liga..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os Status</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleOpenNew} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Nova Liga
        </Button>
      </div>

      <Card className="overflow-hidden border-border/50">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Temporada</TableHead>
              <TableHead className="text-center">Rodadas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLigas.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma liga encontrada.
                </TableCell>
              </TableRow>
            )}
            {filteredLigas.map((liga) => (
              <TableRow key={liga.id} className="transition-colors hover:bg-muted/30">
                <TableCell className="font-semibold text-foreground/90">{liga.nome}</TableCell>
                <TableCell>{liga.categoria}</TableCell>
                <TableCell>{liga.temporada}</TableCell>
                <TableCell className="text-center">{liga.total_rodadas}</TableCell>
                <TableCell>
                  <Badge variant={liga.status === 'Ativo' ? 'success' : 'secondary'}>
                    {liga.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(liga)}>
                    <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="font-heading">
              {editingLiga ? 'Editar Liga' : 'Nova Liga'}
            </SheetTitle>
          </SheetHeader>
          <LigaForm
            initialData={editingLiga}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
