-- Helper function to fetch slice of publicacoes JSON ranking as plain text string
CREATE OR REPLACE FUNCTION public.get_export_json_slice(p_liga_nome text, p_offset int, p_limit int)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_full text;
BEGIN
  SELECT ranking::text INTO v_full
  FROM public.publicacoes
  WHERE liga_nome = p_liga_nome
  LIMIT 1;

  IF v_full IS NULL THEN
    RETURN '';
  END IF;

  RETURN substring(v_full FROM p_offset FOR p_limit);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_export_json_length(p_liga_nome text)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_len int;
BEGIN
  SELECT length(ranking::text) INTO v_len
  FROM public.publicacoes
  WHERE liga_nome = p_liga_nome
  LIMIT 1;

  RETURN COALESCE(v_len, 0);
END;
$$;
