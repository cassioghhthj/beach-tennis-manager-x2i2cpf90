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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit, Plus, Search } from 'lucide-react'
import useAppStore, { Atleta } from '@/stores/useAppStore'
import { AtletaForm } from '@/components/AtletaForm'
import { toast } from 'sonner'
import { getInitials } from '@/lib/utils'

export default function Atletas() {
  const { atletas, getAtletaLigas, ligas, addAtleta, updateAtleta } = useAppStore()
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAtleta, setEditingAtleta] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const filteredAtletas = atletas.filter(
    (a) =>
      a.nome_completo.toLowerCase().includes(search.toLowerCase()) ||
      a.categoria_principal.toLowerCase().includes(search.toLowerCase()),
  )

  const handleOpenNew = () => {
    setEditingAtleta(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (atleta: Atleta) => {
    const vinculadas = getAtletaLigas(atleta.id).map((l) => l.id)
    setEditingAtleta({ ...atleta, ligas_ids: vinculadas })
    setIsFormOpen(true)
  }

  const handleSubmit = async (data: any) => {
    try {
      setIsSaving(true)
      const { ligas_ids, ...atletaData } = data

      if (editingAtleta) {
        const res = (await updateAtleta(editingAtleta.id, atletaData, ligas_ids)) as any
        if (res?.error) throw res.error
        toast.success('Atleta atualizado com sucesso!')
      } else {
        const res = (await addAtleta(atletaData, ligas_ids)) as any
        if (res?.error) throw res.error
        toast.success('Atleta cadastrado com sucesso!')
      }
      setIsFormOpen(false)
    } catch (error: any) {
      console.error(error)
      toast.error(
        error.message || 'Erro ao salvar atleta. Verifique sua conexão e tente novamente.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={handleOpenNew} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Novo Atleta
        </Button>
      </div>

      <Card className="overflow-hidden border-border/50">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Nome Completo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Ligas Vinculadas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAtletas.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum atleta encontrado.
                </TableCell>
              </TableRow>
            )}
            {filteredAtletas.map((atleta) => (
              <TableRow key={atleta.id} className="transition-colors hover:bg-muted/30">
                <TableCell>
                  <Avatar className="h-10 w-10 border shadow-sm">
                    <AvatarImage src={atleta.avatar_url} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {getInitials(atleta.nome_completo)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{atleta.nome_completo}</div>
                  <div className="text-xs text-muted-foreground">
                    {atleta.telefone} • {atleta.sexo}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-primary">
                  {atleta.categoria_principal}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {getAtletaLigas(atleta.id).map((l) => (
                      <Badge
                        key={l.id}
                        variant="outline"
                        className="text-[10px] font-normal border-border bg-background"
                      >
                        {l.nome}
                      </Badge>
                    ))}
                    {getAtletaLigas(atleta.id).length === 0 && (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={atleta.status === 'Ativo' ? 'success' : 'secondary'}>
                    {atleta.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(atleta)}>
                    <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="font-heading">
              {editingAtleta ? 'Editar Atleta' : 'Novo Atleta'}
            </SheetTitle>
          </SheetHeader>
          <AtletaForm
            initialData={editingAtleta}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            ligas={ligas}
            isLoading={isSaving}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
