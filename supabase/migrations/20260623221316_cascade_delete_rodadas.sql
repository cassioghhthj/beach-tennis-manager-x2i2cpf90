DO $$
BEGIN
  ALTER TABLE public.grupos DROP CONSTRAINT IF EXISTS grupos_rodada_id_fkey;
  ALTER TABLE public.grupos ADD CONSTRAINT grupos_rodada_id_fkey FOREIGN KEY (rodada_id) REFERENCES public.rodadas(id) ON DELETE CASCADE;

  ALTER TABLE public.podios DROP CONSTRAINT IF EXISTS podios_rodada_id_fkey;
  ALTER TABLE public.podios ADD CONSTRAINT podios_rodada_id_fkey FOREIGN KEY (rodada_id) REFERENCES public.rodadas(id) ON DELETE CASCADE;

  ALTER TABLE public.pontuacoes_rodada DROP CONSTRAINT IF EXISTS pontuacoes_rodada_rodada_id_fkey;
  ALTER TABLE public.pontuacoes_rodada ADD CONSTRAINT pontuacoes_rodada_rodada_id_fkey FOREIGN KEY (rodada_id) REFERENCES public.rodadas(id) ON DELETE CASCADE;

  ALTER TABLE public.grupo_atletas DROP CONSTRAINT IF EXISTS grupo_atletas_grupo_id_fkey;
  ALTER TABLE public.grupo_atletas ADD CONSTRAINT grupo_atletas_grupo_id_fkey FOREIGN KEY (grupo_id) REFERENCES public.grupos(id) ON DELETE CASCADE;

  ALTER TABLE public.partidas DROP CONSTRAINT IF EXISTS partidas_grupo_id_fkey;
  ALTER TABLE public.partidas ADD CONSTRAINT partidas_grupo_id_fkey FOREIGN KEY (grupo_id) REFERENCES public.grupos(id) ON DELETE CASCADE;
END $$;
