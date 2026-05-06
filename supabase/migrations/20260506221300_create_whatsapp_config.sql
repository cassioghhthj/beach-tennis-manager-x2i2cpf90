CREATE TABLE IF NOT EXISTS public.configuracoes_whatsapp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  api_url TEXT NOT NULL DEFAULT '',
  api_token TEXT NOT NULL DEFAULT '',
  session_name TEXT NOT NULL DEFAULT 'default',
  mensagem_template TEXT NOT NULL DEFAULT 'Olá {nome_atleta}, seu resultado da rodada saiu! Você conquistou {pontuacao} pontos.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.configuracoes_whatsapp ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_auth_all" ON public.configuracoes_whatsapp;
CREATE POLICY "allow_auth_all" ON public.configuracoes_whatsapp
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
