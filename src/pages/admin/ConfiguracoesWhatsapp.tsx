import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { getWhatsappConfig, saveWhatsappConfig } from '@/services/whatsapp'
import { Loader2, MessageSquare, Save } from 'lucide-react'

const formSchema = z.object({
  api_url: z.string().url('URL inválida').or(z.literal('')),
  api_token: z.string().optional(),
  session_name: z.string().min(1, 'Nome da sessão é obrigatório'),
  mensagem_template: z.string().min(1, 'Template é obrigatório'),
})

export default function ConfiguracoesWhatsapp() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      api_url: '',
      api_token: '',
      session_name: 'default',
      mensagem_template:
        'Olá {nome_atleta}, seu resultado da rodada saiu! Você conquistou {pontuacao} pontos.',
    },
  })

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getWhatsappConfig()
        if (config) {
          form.reset({
            api_url: config.api_url || '',
            api_token: config.api_token || '',
            session_name: config.session_name || 'default',
            mensagem_template: config.mensagem_template || '',
          })
        }
      } catch (error) {
        console.error(error)
        toast({ title: 'Erro ao carregar configurações', variant: 'destructive' })
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [form, toast])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSaving(true)
    try {
      await saveWhatsappConfig(values)
      toast({ title: 'Configurações salvas com sucesso!', variant: 'success' })
    } catch (error) {
      console.error(error)
      toast({ title: 'Erro ao salvar configurações', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">WhatsApp WAHA</h2>
        <p className="text-muted-foreground">
          Configure a integração com a API do WAHA para disparos de mensagens.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> Configuração da API
          </CardTitle>
          <CardDescription>
            Insira os dados do seu servidor WAHA para habilitar os disparos pelo sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="api_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da API (WAHA)</FormLabel>
                      <FormControl>
                        <Input placeholder="http://seu-ip:3000" {...field} />
                      </FormControl>
                      <FormDescription>Ex: http://192.168.1.100:3000</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="api_token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token de Acesso (opcional)</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Seu token secreto" {...field} />
                      </FormControl>
                      <FormDescription>Caso sua API exija autenticação</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="session_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Sessão (Session)</FormLabel>
                      <FormControl>
                        <Input placeholder="default" {...field} />
                      </FormControl>
                      <FormDescription>Nome da sessão configurada no WAHA</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mensagem_template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template da Mensagem</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Olá {nome_atleta}, seu resultado da rodada saiu! Você conquistou {pontuacao} pontos."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Variáveis disponíveis: {'{nome_atleta}'}, {'{pontuacao}'}, {'{rodada}'},{' '}
                      {'{liga}'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Configurações
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
