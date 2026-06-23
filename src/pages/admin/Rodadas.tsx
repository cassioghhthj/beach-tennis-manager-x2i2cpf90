import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Calendar, MapPin, Clock, Loader2, Trash } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { supabase } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'bg-secondary text-secondary-foreground'
    case 'In Progress':
      return 'bg-blue-500 text-white'
    case 'Partially Finalized':
      return 'bg-yellow-500 text-white'
    case 'Round Finalized':
      return 'bg-green-500 text-white'
    case 'Published':
      return 'bg-purple-600 text-white font-bold border-2 border-purple-800'
    default:
      return 'bg-secondary text-secondary-foreground'
  }
}

export default function Rodadas() {
  const { rodadas, ligas, sistemas, addRodada } = useAppStore()
  const [open, setOpen] = useState(false)
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())

  const [formData, setFormData] = useState({
    liga_id: '',
    numero: 'R1',
    data: '',
    hora: '',
    local: '',
    sistema_id: '',
    observacoes: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSaving(true)
      const res = (await addRodada({ ...formData, status: 'Draft' })) as any
      if (res?.error) throw res.error

      toast.success('Rodada criada com sucesso!')
      setOpen(false)
      setFormData({
        liga_id: '',
        numero: 'R1',
        data: '',
        hora: '',
        local: '',
        sistema_id: '',
        observacoes: '',
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Erro ao criar rodada. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('rodadas').delete().eq('id', id)
      if (error) throw error

      setDeletedIds((prev) => {
        const next = new Set(prev)
        next.add(id)
        return next
      })
      toast.success('Rodada excluída com sucesso')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Erro ao excluir rodada. Tente novamente.')
    }
  }

  const visibleRodadas = rodadas.filter((r) => !deletedIds.has(r.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Rodadas</h1>
          <p className="text-muted-foreground">
            Gerencie as rodadas, grupos e partidas das competições.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Rodada
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Rodada</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Liga / Categoria</Label>
                  <Select
                    value={formData.liga_id}
                    onValueChange={(v) => setFormData({ ...formData, liga_id: v })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a liga" />
                    </SelectTrigger>
                    <SelectContent>
                      {ligas.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.nome} ({l.categoria})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Número da Rodada</Label>
                  <Input
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    placeholder="Ex: R1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horário</Label>
                  <Input
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Local</Label>
                  <Input
                    value={formData.local}
                    onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                    placeholder="Nome da arena"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sistema de Pontuação</Label>
                  <Select
                    value={formData.sistema_id}
                    onValueChange={(v) => setFormData({ ...formData, sistema_id: v })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sistema" />
                    </SelectTrigger>
                    <SelectContent>
                      {sistemas.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Informações adicionais..."
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Rodada'
                  )}
                </Button>
              </div>{' '}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Rodadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rodada</TableHead>
                <TableHead>Liga</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRodadas.map((rodada) => {
                const liga = ligas.find((l) => l.id === rodada.liga_id)
                return (
                  <TableRow key={rodada.id}>
                    <TableCell className="font-medium">{rodada.numero}</TableCell>
                    <TableCell>{liga?.nome || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" /> {rodada.data}
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" /> {rodada.hora}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center text-sm">
                        <MapPin className="mr-1 h-3 w-3 text-muted-foreground" /> {rodada.local}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(rodada.status)} variant="outline">
                        {rodada.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/rodadas/${rodada.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> Gerenciar
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta rodada? Esta ação não pode ser
                                desfeita e excluirá todos os jogos, grupos e pontuações vinculados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(rodada.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Confirmar Exclusão
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {visibleRodadas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhuma rodada cadastrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
