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
import { Star, Copy } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { toast } from 'sonner'

export default function Sistemas() {
  const { sistemas, regras, addSistema } = useAppStore()

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold tracking-tight">Sistemas de Pontuação</h2>
          <p className="text-muted-foreground">Gerencie templates de pontuação para suas ligas.</p>
        </div>
        <Button>
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
                        <span className="capitalize">{r.chave.replace('_', ' ')}</span>
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
              <Button variant="secondary" size="sm" className="w-full">
                Editar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
