import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { phone, message } = await req.json()

    if (!phone || !message) {
      return new Response(JSON.stringify({ error: 'Missing phone or message' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: config, error: configError } = await supabaseClient
      .from('configuracoes_whatsapp')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (configError || !config) {
      return new Response(
        JSON.stringify({
          error: 'Configuração do WhatsApp não encontrada. Configure o WAHA primeiro.',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const { api_url, api_token, session_name } = config

    if (!api_url) {
      return new Response(
        JSON.stringify({ error: 'URL da API é obrigatória nas configurações.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    let formattedPhone = phone.replace(/\D/g, '')
    if (formattedPhone.length < 10) {
      return new Response(JSON.stringify({ error: 'Formato de telefone inválido.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!formattedPhone.startsWith('55') && formattedPhone.length <= 11) {
      formattedPhone = `55${formattedPhone}`
    }

    const wahaEndpoint = `${api_url.replace(/\/$/, '')}/api/sendText`
    const payload = {
      chatId: `${formattedPhone}@c.us`,
      text: message,
      session: session_name || 'default',
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    if (api_token) {
      headers['X-Api-Key'] = api_token
    }

    const wahaRes = await fetch(wahaEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!wahaRes.ok) {
      const errorText = await wahaRes.text()
      const errorMessage = errorText || wahaRes.statusText || 'Erro desconhecido'
      console.error('WAHA API Error:', wahaRes.status, errorMessage)
      return new Response(
        JSON.stringify({
          error: `WAHA API Error ${wahaRes.status}: ${errorMessage}`,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const result = await wahaRes.json()

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
