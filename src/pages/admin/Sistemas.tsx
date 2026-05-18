import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Star, Copy, Pencil } from 'lucide-react'
import useAppStore, { SistemaPontuacao } from '@/stores/useAppStore'
import { toast } from 'sonner'

const defaultGeralKeys = {
  pos_1: 180,
  pos_2: 170,
  pos_3: 160,
  pos_4: 150,
  pos_5: 140,
  pos_6: 130,
  pos_7: 120,
  pos_8: 110,
  pos_9: 100,
  pos_10: 90,
  pos_11: 80,
  pos_12: 70,
  pos_13: 60,
  pos_14: 50,
  pos_15: 40,
  pos_16: 30,
  pos_17: 20,
  pos_18: 10,
  pos_19: 5,
  pos_20: 0,
  bonus_5x0: 5,
  pontos_presenca: 0,
  podio_principal_1: 50,
  podio_principal_2: 40,
  podio_principal_3: 30,
  podio_consolacao_1: 30,
  podio_consolacao_2: 20,
  podio_consolacao_3: 10,
}

const defaultVitoriasKeys = {
  vitoria_5x0: 100,
  vitoria_4x1: 80,
  vitoria_3x2: 60,
  derrota_2x3: 40,
  derrota_1x4: 30,
  derrota_0x5: 20,
  bonus_5x0: 5,
  pontos_presenca: 0,
  podio_principal_1: 50,
  podio_principal_2: 40,
  podio_principal_3: 30,
  podio_consolacao_1: 30,
  podio_consolacao_2: 20,
  podio_consolacao_3: 10,
}

export default function Sistemas() {
  const { sistemas, regras, addSistema, updateSistema, updateRegrasSistema } = useAppStore()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [nomeSistema, setNomeSistema] = useState('')

  const handleDuplicate = (id: string) => {
    const sis = sistemas.find((s) => s.id === id)
    if (!sis) return
    const sisRegras = regras.filter((r) => r.sistema_id === id)

    addSistema(
      {
        nome: `${sis.nome} (Cópia)`,
        tipo: sis.tipo,
        ativo: false,
      },
      sisRegras.map((r) => ({ chave: r.chave, valor_pontos: r.valor_pontos })),
    )
    toast.success('Sistema duplicado com sucesso!')
  }

  const handleEdit = (sistema: SistemaPontuacao) => {
    const sisRegras = regras.filter((r) => r.sistema_id === sistema.id)
    const defaults = sistema.tipo === 'Geral' ? defaultGeralKeys : defaultVitoriasKeys

    const data: Record<string, any> = {}

    Object.entries(defaults).forEach(([k, v]) => {
      data[k] = v
    })

    sisRegras.forEach((r) => {
      data[r.chave] = r.valor_pontos
    })

    setNomeSistema(sistema.nome)
    setFormData(data)
    setEditingId(sistema.id)
  }

  const handleNewSistema = () => {
    addSistema(
      {
        nome: 'Novo Sistema',
        tipo: 'Geral',
        ativo: false,
      },
      Object.entries(defaultGeralKeys).map(([chave, valor_pontos]) => ({
        chave,
        valor_pontos,
      })),
    )
    toast.success('Novo sistema criado com sucesso!')
  }

  const handleChange = (chave: string, valor: string) => {
    setFormData((prev) => ({ ...prev, [chave]: valor }))
  }

  const handleSave = () => {
    if (!editingId) return

    updateSistema(editingId, { nome: nomeSistema })

    const novasRegras = Object.entries(formData).map(([chave, valor]) => ({
      chave,
      valor_pontos: Number(valor) || 0,
    }))

    updateRegrasSistema(editingId, novasRegras)
    toast.success('Sistema atualizado com sucesso!')
    setEditingId(null)
  }

  const editingSistema = sistemas.find((s) => s.id === editingId)
  const isGeral = editingSistema?.tipo === 'Geral'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold tracking-tight">Sistemas de Pontuação</h2>
          <p className="text-muted-foreground">Gerencie templates de pontuação para suas ligas.</p>
        </div>
        <Button onClick={handleNewSistema}>
          <Star className="mr-2 h-4 w-4" /> Novo Sistema
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sistemas.map((sistema) => (
          <Card
            key={sistema.id}
            className="relative overflow-hidden border-border/50 hover:shadow-md transition-shadow"
          >
            <div
              className={`absolute top-0 left-0 w-1 h-full ${sistema.ativo ? 'bg-success' : 'bg-muted'}`}
            ></div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{sistema.nome}</CardTitle>
                  <CardDescription className="mt-1">
                    Tipo: <span className="font-medium text-foreground">{sistema.tipo}</span>
                  </CardDescription>
                </div>
                <Badge variant={sistema.ativo ? 'success' : 'secondary'}>
                  {sistema.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <div className="font-medium mb-2 text-muted-foreground">Regras Principais</div>
                <ul className="space-y-1">
                  {regras
                    .filter((r) => r.sistema_id === sistema.id)
                    .slice(0, 3)
                    .map((r) => (
                      <li key={r.id} className="flex justify-between">
                        <span className="capitalize">{r.chave.replace(/_/g, ' ')}</span>
                        <span className="font-bold text-primary">{r.valor_pontos} pts</span>
                      </li>
                    ))}
                  {regras.filter((r) => r.sistema_id === sistema.id).length > 3 && (
                    <li className="text-xs text-muted-foreground pt-1">+ outras regras</li>
                  )}
                  {regras.filter((r) => r.sistema_id === sistema.id).length === 0 && (
                    <li className="text-xs text-muted-foreground">Nenhuma regra configurada.</li>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleDuplicate(sistema.id)}
              >
                <Copy className="mr-2 h-4 w-4" /> Duplicar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => handleEdit(sistema)}
              >
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b shrink-0">
            <DialogTitle>Editar Sistema: {editingSistema?.nome}</DialogTitle>
            <DialogDescription>Modifique as regras de pontuação abaixo.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 w-full overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
            <div className="space-y-6 py-4 px-6">
              <div className="space-y-2">
                <Label>Nome do Sistema</Label>
                <Input
                  value={nomeSistema}
                  onChange={(e) => setNomeSistema(e.target.value)}
                  placeholder="Nome do Sistema"
                />
              </div>

              {isGeral ? (
                <div className="space-y-4">
                  <h4 className="font-semibold border-b pb-2">Pontuação por Posição (Ranking)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={`pos_${i + 1}`} className="space-y-1">
                        <Label className="text-xs">{i + 1}º Lugar</Label>
                        <Input
                          type="number"
                          value={formData[`pos_${i + 1}`] ?? ''}
                          onChange={(e) => handleChange(`pos_${i + 1}`, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-semibold border-b pb-2">Pontos por Placar (Vitórias)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { k: 'vitoria_5x0', l: 'Vitória de 5x0' },
                      { k: 'vitoria_4x1', l: 'Vitória de 4x1' },
                      { k: 'vitoria_3x2', l: 'Vitória de 3x2' },
                      { k: 'derrota_2x3', l: 'Derrota de 2x3' },
                      { k: 'derrota_1x4', l: 'Derrota de 1x4' },
                      { k: 'derrota_0x5', l: 'Derrota de 0x5' },
                    ].map(({ k, l }) => (
                      <div key={k} className="space-y-1">
                        <Label className="text-xs">{l}</Label>
                        <Input
                          type="number"
                          value={formData[k] ?? ''}
                          onChange={(e) => handleChange(k, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-semibold border-b pb-2">Podio Principal</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[1, 2, 3].map((pos) => (
                    <div key={`pp_${pos}`} className="space-y-1">
                      <Label className="text-xs">{pos} Lugar</Label>
                      <Input
                        type="number"
                        value={formData[`podio_principal_${pos}`] ?? ''}
                        onChange={(e) => handleChange(`podio_principal_${pos}`, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold border-b pb-2">Podio Consolação</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[1, 2, 3].map((pos) => (
                    <div key={`pc_${pos}`} className="space-y-1">
                      <Label className="text-xs">{pos} Lugar</Label>
                      <Input
                        type="number"
                        value={formData[`podio_consolacao_${pos}`] ?? ''}
                        onChange={(e) => handleChange(`podio_consolacao_${pos}`, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold border-b pb-2">Bônus Adicionais</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Pontos Bônus (5x0)</Label>
                    <Input
                      type="number"
                      value={formData['bonus_5x0'] ?? ''}
                      onChange={(e) => handleChange('bonus_5x0', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Presença no Grupo</Label>
                    <Input
                      type="number"
                      value={formData['pontos_presenca'] ?? ''}
                      onChange={(e) => handleChange('pontos_presenca', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-4 border-t shrink-0 bg-background z-10">
            <Button variant="outline" onClick={() => setEditingId(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
