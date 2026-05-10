import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Camera, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Liga } from '@/stores/useAppStore'
import { getInitials } from '@/lib/utils'

const formSchema = z.object({
  nome_completo: z.string().min(3, 'Mínimo 3 caracteres'),
  telefone: z.string().min(8, 'Telefone inválido'),
  sexo: z.enum(['M', 'F']),
  categoria_principal: z.string().min(1, 'Obrigatório'),
  status: z.enum(['Ativo', 'Inativo']),
  observacoes: z.string().optional().default(''),
  ligas_ids: z.array(z.string()).default([]),
  avatar_url: z.string().optional().nullable(),
})

interface AtletaFormProps {
  initialData?: any
  onSubmit: (data: z.infer<typeof formSchema>) => void
  onCancel: () => void
  ligas: Liga[]
}

export function AtletaForm({ initialData, onSubmit, onCancel, ligas }: AtletaFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome_completo: '',
      telefone: '',
      sexo: 'M',
      categoria_principal: '',
      status: 'Ativo',
      observacoes: '',
      ligas_ids: [],
      avatar_url: null,
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes('image/')) {
      toast.error('Por favor, selecione uma imagem.')
      return
    }

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath)

      form.setValue('avatar_url', publicUrlData.publicUrl)
      toast.success('Foto carregada com sucesso!')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao fazer upload da imagem.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-4 pb-4">
          <Avatar className="h-20 w-20 border shadow-sm">
            <AvatarImage src={form.watch('avatar_url') || ''} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {form.watch('nome_completo') ? (
                getInitials(form.watch('nome_completo'))
              ) : (
                <Camera className="h-6 w-6" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <FormLabel>Foto do Atleta</FormLabel>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fazendo upload...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" /> Alterar foto
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Recomendado: Imagem quadrada, máx 2MB.</p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="nome_completo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(00) 00000-0000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sexo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoria_principal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria Principal</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Ligas Vinculadas</FormLabel>
          <div className="grid grid-cols-1 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto bg-muted/10">
            {ligas.filter((l) => l.status === 'Ativo').length === 0 && (
              <span className="text-sm text-muted-foreground">Nenhuma liga ativa disponível.</span>
            )}
            {ligas
              .filter((l) => l.status === 'Ativo')
              .map((liga) => (
                <label
                  key={liga.id}
                  className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    value={liga.id}
                    {...form.register('ligas_ids')}
                    className="rounded border-input text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="font-medium text-foreground/80">{liga.nome}</span>
                </label>
              ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Atleta</Button>
        </div>
      </form>
    </Form>
  )
}
