import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Calendar, MapPin, Clock } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
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

  const [formData, setFormData] = useState({
    liga_id: '',
    numero: 'R1',
    data: '',
    hora: '',
    local: '',
    sistema_id: '',
    observacoes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addRodada({ ...formData, status: 'Draft' })
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
  }

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
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Rodada</Button>
              </div>
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
              {rodadas.map((rodada) => {
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
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/rodadas/${rodada.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> Gerenciar
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {rodadas.length === 0 && (
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
