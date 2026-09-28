import { supabase } from '@/lib/supabase/client'

export interface WhatsappConfig {
  id?: string
  user_id?: string
  api_url: string
  api_token: string
  session_name: string
  mensagem_template: string
}

export const getWhatsappConfig = async () => {
  const { data, error } = await (supabase as any)
    .from('configuracoes_whatsapp')
    .select('*')
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching whatsapp config:', error)
    return null
  }
  return data as WhatsappConfig | null
}

export const saveWhatsappConfig = async (config: Partial<WhatsappConfig>) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('User not found')

  const { data: existing } = await (supabase as any)
    .from('configuracoes_whatsapp')
    .select('id')
    .single()

  if (existing) {
    const { error } = await (supabase as any)
      .from('configuracoes_whatsapp')
      .update({ ...config, updated_at: new Date().toISOString() })
      .eq('id', (existing as any).id)
    if (error) throw error
  } else {
    const { error } = await (supabase as any)
      .from('configuracoes_whatsapp')
      .insert({ ...config, user_id: user.id })
    if (error) throw error
  }
}

export const processarTemplateWhatsApp = (
  template: string,
  dados: Record<string, string | number>,
) => {
  let mensagem = template
  Object.keys(dados).forEach((key) => {
    const val = dados[key]
    const safeValue = val !== null && val !== undefined ? String(val) : '0'
    const regex = new RegExp(`\\{\\s*${key}\\s*\\}`, 'g')
    mensagem = mensagem.replace(regex, safeValue)
  })
  return mensagem
}

export const sendWhatsappMessage = async (phone: string, message: string) => {
  const { data, error } = await supabase.functions.invoke('send-whatsapp', {
    body: { phone, message },
  })
  if (error) {
    let message = error.message
    const response = (error as any).context
    if (response instanceof Response) {
      const errorBody = await response
        .clone()
        .json()
        .catch(() => null)
      message = errorBody?.error || message
    }
    throw new Error(message)
  }
  if (data.error) throw new Error(data.error)
  return data
}
