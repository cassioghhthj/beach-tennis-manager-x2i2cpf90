ALTER TABLE public.pontuacoes_rodada ADD COLUMN IF NOT EXISTS pontos_manuais integer NOT NULL DEFAULT 0;
