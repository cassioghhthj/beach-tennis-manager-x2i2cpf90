CREATE TABLE IF NOT EXISTS public.ligas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  temporada TEXT NOT NULL,
  total_rodadas INTEGER NOT NULL DEFAULT 12,
  status TEXT NOT NULL DEFAULT 'Ativo',
  descricao TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.atletas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  nome_completo TEXT NOT NULL,
  telefone TEXT,
  sexo TEXT NOT NULL,
  categoria_principal TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo',
  observacoes TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.atleta_ligas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  atleta_id UUID REFERENCES public.atletas(id) ON DELETE CASCADE,
  liga_id UUID REFERENCES public.ligas(id) ON DELETE CASCADE,
  UNIQUE(atleta_id, liga_id)
);

CREATE TABLE IF NOT EXISTS public.sistemas_pontuacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.regras_pontuacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sistema_id UUID REFERENCES public.sistemas_pontuacao(id) ON DELETE CASCADE,
  chave TEXT NOT NULL,
  valor_pontos INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.rodadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  liga_id UUID REFERENCES public.ligas(id) ON DELETE CASCADE,
  numero TEXT NOT NULL,
  data TEXT NOT NULL,
  hora TEXT NOT NULL,
  local TEXT NOT NULL,
  sistema_id UUID REFERENCES public.sistemas_pontuacao(id),
  status TEXT NOT NULL DEFAULT 'Draft',
  observacoes TEXT,
  snapshot_regras JSONB
);

CREATE TABLE IF NOT EXISTS public.grupos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rodada_id UUID REFERENCES public.rodadas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  finalizado BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.grupo_atletas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grupo_id UUID REFERENCES public.grupos(id) ON DELETE CASCADE,
  atleta_id UUID REFERENCES public.atletas(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Active',
  substituido_por_id UUID REFERENCES public.atletas(id),
  motivo_substituicao TEXT
);

CREATE TABLE IF NOT EXISTS public.partidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grupo_id UUID REFERENCES public.grupos(id) ON DELETE CASCADE,
  atleta1_id UUID REFERENCES public.atletas(id),
  atleta2_id UUID REFERENCES public.atletas(id),
  score1 INTEGER NOT NULL DEFAULT 0,
  atleta3_id UUID REFERENCES public.atletas(id),
  atleta4_id UUID REFERENCES public.atletas(id),
  score2 INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.podios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rodada_id UUID REFERENCES public.rodadas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  posicao INTEGER NOT NULL,
  atleta1_id UUID REFERENCES public.atletas(id),
  atleta2_id UUID REFERENCES public.atletas(id)
);

CREATE TABLE IF NOT EXISTS public.pontuacoes_rodada (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rodada_id UUID REFERENCES public.rodadas(id) ON DELETE CASCADE,
  atleta_id UUID REFERENCES public.atletas(id) ON DELETE CASCADE,
  pontos_grupo INTEGER NOT NULL DEFAULT 0,
  pontos_vitorias INTEGER NOT NULL DEFAULT 0,
  bonus_5x0 INTEGER NOT NULL DEFAULT 0,
  pontos_podio_principal INTEGER NOT NULL DEFAULT 0,
  pontos_podio_consolacao INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.publicacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  data_publicacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  liga_id UUID REFERENCES public.ligas(id) ON DELETE CASCADE,
  liga_nome TEXT NOT NULL,
  temporada TEXT NOT NULL,
  ranking JSONB NOT NULL
);

-- RLS Setup
ALTER TABLE public.ligas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atletas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atleta_ligas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sistemas_pontuacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_pontuacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rodadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupo_atletas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pontuacoes_rodada ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publicacoes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "allow_auth_all" ON public.ligas;
  CREATE POLICY "allow_auth_all" ON public.ligas FOR ALL TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "allow_anon_read" ON public.ligas;
  CREATE POLICY "allow_anon_read" ON public.ligas FOR SELECT TO anon USING (true);
  
  DROP POLICY IF EXISTS "allow_auth_all" ON public.atletas;
  CREATE POLICY "allow_auth_all" ON public.atletas FOR ALL TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "allow_anon_read" ON public.atletas;
  CREATE POLICY "allow_anon_read" ON public.atletas FOR SELECT TO anon USING (true);

  DROP POLICY IF EXISTS "allow_auth_all" ON public.atleta_ligas;
  CREATE POLICY "allow_auth_all" ON public.atleta_ligas FOR ALL TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "allow_anon_read" ON public.atleta_ligas;
  CREATE POLICY "allow_anon_read" ON public.atleta_ligas FOR SELECT TO anon USING (true);

  DROP POLICY IF EXISTS "allow_auth_all" ON public.sistemas_pontuacao;
  CREATE POLICY "allow_auth_all" ON public.sistemas_pontuacao FOR ALL TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "allow_anon_read" ON public.sistemas_pontuacao;
  CREATE POLICY "allow_anon_read" ON public.sistemas_pontuacao FOR SELECT TO anon USING (true);

  DROP POLICY IF EXISTS "allow_auth_all" ON public.regras_pontuacao;
  CREATE POLICY "allow_auth_all" ON public.regras_pontuacao FOR ALL TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "allow_anon_read" ON public.regras_pontuacao;
  CREATE POLICY "allow_anon_read" ON public.regras_pontuacao FOR SELECT TO anon USING (true);

  DROP POLICY IF EXISTS "allow_auth_all" ON public.rodadas;
  CREATE POLICY "allow_auth_all" ON public.rodadas FOR ALL TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "allow_anon_read" ON public.rodadas;
  CREATE POLICY "allow_anon_read" ON public.rodadas FOR SELECT TO anon USING (true);

  DROP POLICY IF EXISTS "allow_auth_all" ON public.grupos;
  CREATE POLICY "allow_auth_all" ON public.grupos FOR ALL TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "allow_anon_read" ON public.grupos;
  CREATE POLICY "allow_anon_read" ON public.grupos FOR SELECT TO anon USING (true);

  DROP POLICY IF EXISTS "allow_auth_all" ON public.grupo_atletas;
  CREATE POLICY "allow_auth_all" ON public.grupo_atletas FOR ALL TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "allow_anon_read" ON public.grupo_atletas;
  CREATE POLICY "allow_anon_read" ON public.grupo_atletas FOR SELECT TO anon USING (true);

  DROP POLICY IF EXISTS "allow_auth_all" ON public.partidas;
  CREATE POLICY "allow_auth_all" ON public.partidas FOR ALL TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "allow_anon_read" ON public.partidas;
  CREATE POLICY "allow_anon_read" ON public.partidas FOR SELECT TO anon USING (true);

  DROP POLICY IF EXISTS "allow_auth_all" ON public.podios;
  CREATE POLICY "allow_auth_all" ON public.podios FOR ALL TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "allow_anon_read" ON public.podios;
  CREATE POLICY "allow_anon_read" ON public.podios FOR SELECT TO anon USING (true);

  DROP POLICY IF EXISTS "allow_auth_all" ON public.pontuacoes_rodada;
  CREATE POLICY "allow_auth_all" ON public.pontuacoes_rodada FOR ALL TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "allow_anon_read" ON public.pontuacoes_rodada;
  CREATE POLICY "allow_anon_read" ON public.pontuacoes_rodada FOR SELECT TO anon USING (true);

  DROP POLICY IF EXISTS "allow_auth_all" ON public.publicacoes;
  CREATE POLICY "allow_auth_all" ON public.publicacoes FOR ALL TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "allow_anon_read" ON public.publicacoes;
  CREATE POLICY "allow_anon_read" ON public.publicacoes FOR SELECT TO anon USING (true);

END $$;

-- Seed Data
DO $$
DECLARE
  admin_id UUID;
  s1_id UUID;
  s2_id UUID;
  liga_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ferricontabilidade@uol.com.br') THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      admin_id, '00000000-0000-0000-0000-000000000000', 'ferricontabilidade@uol.com.br',
      crypt('Skip@Password123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO admin_id FROM auth.users WHERE email = 'ferricontabilidade@uol.com.br';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.ligas WHERE nome = 'Liga Smash Categoria D') THEN
    liga_id := gen_random_uuid();
    INSERT INTO public.ligas (id, user_id, nome, categoria, temporada, total_rodadas, status, descricao, observacoes)
    VALUES (liga_id, admin_id, 'Liga Smash Categoria D', 'D', '2023', 12, 'Ativo', 'Liga amadora', '');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.sistemas_pontuacao WHERE nome = 'Sistema Geral Pro') THEN
    s1_id := gen_random_uuid();
    INSERT INTO public.sistemas_pontuacao (id, user_id, nome, tipo, ativo)
    VALUES (s1_id, admin_id, 'Sistema Geral Pro', 'Geral', true);

    INSERT INTO public.regras_pontuacao (sistema_id, chave, valor_pontos) VALUES
    (s1_id, 'pos_1', 180), (s1_id, 'pos_2', 170), (s1_id, 'pos_3', 160),
    (s1_id, 'pos_4', 150), (s1_id, 'pos_5', 140), (s1_id, 'pos_6', 130),
    (s1_id, 'pos_7', 120), (s1_id, 'pos_8', 110), (s1_id, 'pos_9', 100),
    (s1_id, 'pos_10', 90), (s1_id, 'pos_11', 80), (s1_id, 'pos_12', 70),
    (s1_id, 'pos_13', 60), (s1_id, 'pos_14', 50), (s1_id, 'pos_15', 40),
    (s1_id, 'bonus_5x0', 5), (s1_id, 'podio_principal_1', 50),
    (s1_id, 'podio_principal_2', 40), (s1_id, 'podio_principal_3', 30),
    (s1_id, 'podio_consolacao_1', 30), (s1_id, 'podio_consolacao_2', 20),
    (s1_id, 'podio_consolacao_3', 10);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.sistemas_pontuacao WHERE nome = 'Sistema Vitórias') THEN
    s2_id := gen_random_uuid();
    INSERT INTO public.sistemas_pontuacao (id, user_id, nome, tipo, ativo)
    VALUES (s2_id, admin_id, 'Sistema Vitórias', 'Vitorias', true);

    INSERT INTO public.regras_pontuacao (sistema_id, chave, valor_pontos) VALUES
    (s2_id, 'vitoria_5x0', 100), (s2_id, 'vitoria_4x1', 80), (s2_id, 'vitoria_3x2', 60),
    (s2_id, 'derrota_2x3', 40), (s2_id, 'derrota_1x4', 30), (s2_id, 'derrota_0x5', 20),
    (s2_id, 'bonus_5x0', 5);
  END IF;

END $$;
