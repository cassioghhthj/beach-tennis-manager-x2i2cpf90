// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      atleta_ligas: {
        Row: {
          atleta_id: string | null
          id: string
          liga_id: string | null
        }
        Insert: {
          atleta_id?: string | null
          id?: string
          liga_id?: string | null
        }
        Update: {
          atleta_id?: string | null
          id?: string
          liga_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'atleta_ligas_atleta_id_fkey'
            columns: ['atleta_id']
            isOneToOne: false
            referencedRelation: 'atletas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'atleta_ligas_liga_id_fkey'
            columns: ['liga_id']
            isOneToOne: false
            referencedRelation: 'ligas'
            referencedColumns: ['id']
          },
        ]
      }
      atletas: {
        Row: {
          avatar_url: string | null
          categoria_principal: string
          created_at: string
          id: string
          nome_completo: string
          observacoes: string | null
          sexo: string
          status: string
          telefone: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          categoria_principal: string
          created_at?: string
          id?: string
          nome_completo: string
          observacoes?: string | null
          sexo: string
          status?: string
          telefone?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          categoria_principal?: string
          created_at?: string
          id?: string
          nome_completo?: string
          observacoes?: string | null
          sexo?: string
          status?: string
          telefone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      configuracoes_whatsapp: {
        Row: {
          api_token: string
          api_url: string
          created_at: string
          id: string
          mensagem_template: string
          session_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_token?: string
          api_url?: string
          created_at?: string
          id?: string
          mensagem_template?: string
          session_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_token?: string
          api_url?: string
          created_at?: string
          id?: string
          mensagem_template?: string
          session_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      grupo_atletas: {
        Row: {
          atleta_id: string | null
          grupo_id: string | null
          id: string
          motivo_substituicao: string | null
          status: string
          substituido_por_id: string | null
        }
        Insert: {
          atleta_id?: string | null
          grupo_id?: string | null
          id?: string
          motivo_substituicao?: string | null
          status?: string
          substituido_por_id?: string | null
        }
        Update: {
          atleta_id?: string | null
          grupo_id?: string | null
          id?: string
          motivo_substituicao?: string | null
          status?: string
          substituido_por_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'grupo_atletas_atleta_id_fkey'
            columns: ['atleta_id']
            isOneToOne: false
            referencedRelation: 'atletas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'grupo_atletas_grupo_id_fkey'
            columns: ['grupo_id']
            isOneToOne: false
            referencedRelation: 'grupos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'grupo_atletas_substituido_por_id_fkey'
            columns: ['substituido_por_id']
            isOneToOne: false
            referencedRelation: 'atletas'
            referencedColumns: ['id']
          },
        ]
      }
      grupos: {
        Row: {
          finalizado: boolean
          id: string
          nome: string
          rodada_id: string | null
        }
        Insert: {
          finalizado?: boolean
          id?: string
          nome: string
          rodada_id?: string | null
        }
        Update: {
          finalizado?: boolean
          id?: string
          nome?: string
          rodada_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'grupos_rodada_id_fkey'
            columns: ['rodada_id']
            isOneToOne: false
            referencedRelation: 'rodadas'
            referencedColumns: ['id']
          },
        ]
      }
      ligas: {
        Row: {
          categoria: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
          observacoes: string | null
          status: string
          temporada: string
          total_rodadas: number
          user_id: string | null
        }
        Insert: {
          categoria: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          status?: string
          temporada: string
          total_rodadas?: number
          user_id?: string | null
        }
        Update: {
          categoria?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          status?: string
          temporada?: string
          total_rodadas?: number
          user_id?: string | null
        }
        Relationships: []
      }
      partidas: {
        Row: {
          atleta1_id: string | null
          atleta2_id: string | null
          atleta3_id: string | null
          atleta4_id: string | null
          grupo_id: string | null
          id: string
          score1: number
          score2: number
        }
        Insert: {
          atleta1_id?: string | null
          atleta2_id?: string | null
          atleta3_id?: string | null
          atleta4_id?: string | null
          grupo_id?: string | null
          id?: string
          score1?: number
          score2?: number
        }
        Update: {
          atleta1_id?: string | null
          atleta2_id?: string | null
          atleta3_id?: string | null
          atleta4_id?: string | null
          grupo_id?: string | null
          id?: string
          score1?: number
          score2?: number
        }
        Relationships: [
          {
            foreignKeyName: 'partidas_atleta1_id_fkey'
            columns: ['atleta1_id']
            isOneToOne: false
            referencedRelation: 'atletas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'partidas_atleta2_id_fkey'
            columns: ['atleta2_id']
            isOneToOne: false
            referencedRelation: 'atletas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'partidas_atleta3_id_fkey'
            columns: ['atleta3_id']
            isOneToOne: false
            referencedRelation: 'atletas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'partidas_atleta4_id_fkey'
            columns: ['atleta4_id']
            isOneToOne: false
            referencedRelation: 'atletas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'partidas_grupo_id_fkey'
            columns: ['grupo_id']
            isOneToOne: false
            referencedRelation: 'grupos'
            referencedColumns: ['id']
          },
        ]
      }
      podios: {
        Row: {
          atleta1_id: string | null
          atleta2_id: string | null
          id: string
          posicao: number
          rodada_id: string | null
          tipo: string
        }
        Insert: {
          atleta1_id?: string | null
          atleta2_id?: string | null
          id?: string
          posicao: number
          rodada_id?: string | null
          tipo: string
        }
        Update: {
          atleta1_id?: string | null
          atleta2_id?: string | null
          id?: string
          posicao?: number
          rodada_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: 'podios_atleta1_id_fkey'
            columns: ['atleta1_id']
            isOneToOne: false
            referencedRelation: 'atletas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'podios_atleta2_id_fkey'
            columns: ['atleta2_id']
            isOneToOne: false
            referencedRelation: 'atletas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'podios_rodada_id_fkey'
            columns: ['rodada_id']
            isOneToOne: false
            referencedRelation: 'rodadas'
            referencedColumns: ['id']
          },
        ]
      }
      pontuacoes_rodada: {
        Row: {
          atleta_id: string | null
          bonus_5x0: number
          derrotas: number
          games_contra: number
          games_pro: number
          id: string
          observacao_manuais: string | null
          pontos_grupo: number
          pontos_manuais: number
          pontos_podio_consolacao: number
          pontos_podio_principal: number
          pontos_presenca: number
          pontos_vitorias: number
          rodada_id: string | null
          saldo_games: number
          total: number
          vitorias: number
        }
        Insert: {
          atleta_id?: string | null
          bonus_5x0?: number
          derrotas?: number
          games_contra?: number
          games_pro?: number
          id?: string
          observacao_manuais?: string | null
          pontos_grupo?: number
          pontos_manuais?: number
          pontos_podio_consolacao?: number
          pontos_podio_principal?: number
          pontos_presenca?: number
          pontos_vitorias?: number
          rodada_id?: string | null
          saldo_games?: number
          total?: number
          vitorias?: number
        }
        Update: {
          atleta_id?: string | null
          bonus_5x0?: number
          derrotas?: number
          games_contra?: number
          games_pro?: number
          id?: string
          observacao_manuais?: string | null
          pontos_grupo?: number
          pontos_manuais?: number
          pontos_podio_consolacao?: number
          pontos_podio_principal?: number
          pontos_presenca?: number
          pontos_vitorias?: number
          rodada_id?: string | null
          saldo_games?: number
          total?: number
          vitorias?: number
        }
        Relationships: [
          {
            foreignKeyName: 'pontuacoes_rodada_atleta_id_fkey'
            columns: ['atleta_id']
            isOneToOne: false
            referencedRelation: 'atletas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pontuacoes_rodada_rodada_id_fkey'
            columns: ['rodada_id']
            isOneToOne: false
            referencedRelation: 'rodadas'
            referencedColumns: ['id']
          },
        ]
      }
      publicacoes: {
        Row: {
          data_publicacao: string
          id: string
          liga_id: string | null
          liga_nome: string
          ranking: Json
          temporada: string
          user_id: string | null
        }
        Insert: {
          data_publicacao?: string
          id?: string
          liga_id?: string | null
          liga_nome: string
          ranking: Json
          temporada: string
          user_id?: string | null
        }
        Update: {
          data_publicacao?: string
          id?: string
          liga_id?: string | null
          liga_nome?: string
          ranking?: Json
          temporada?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'publicacoes_liga_id_fkey'
            columns: ['liga_id']
            isOneToOne: false
            referencedRelation: 'ligas'
            referencedColumns: ['id']
          },
        ]
      }
      regras_pontuacao: {
        Row: {
          chave: string
          id: string
          sistema_id: string | null
          valor_pontos: number
        }
        Insert: {
          chave: string
          id?: string
          sistema_id?: string | null
          valor_pontos: number
        }
        Update: {
          chave?: string
          id?: string
          sistema_id?: string | null
          valor_pontos?: number
        }
        Relationships: [
          {
            foreignKeyName: 'regras_pontuacao_sistema_id_fkey'
            columns: ['sistema_id']
            isOneToOne: false
            referencedRelation: 'sistemas_pontuacao'
            referencedColumns: ['id']
          },
        ]
      }
      rodadas: {
        Row: {
          data: string
          hora: string
          id: string
          liga_id: string | null
          local: string
          numero: string
          observacoes: string | null
          sistema_id: string | null
          snapshot_regras: Json | null
          status: string
        }
        Insert: {
          data: string
          hora: string
          id?: string
          liga_id?: string | null
          local: string
          numero: string
          observacoes?: string | null
          sistema_id?: string | null
          snapshot_regras?: Json | null
          status?: string
        }
        Update: {
          data?: string
          hora?: string
          id?: string
          liga_id?: string | null
          local?: string
          numero?: string
          observacoes?: string | null
          sistema_id?: string | null
          snapshot_regras?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'rodadas_liga_id_fkey'
            columns: ['liga_id']
            isOneToOne: false
            referencedRelation: 'ligas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rodadas_sistema_id_fkey'
            columns: ['sistema_id']
            isOneToOne: false
            referencedRelation: 'sistemas_pontuacao'
            referencedColumns: ['id']
          },
        ]
      }
      sistemas_pontuacao: {
        Row: {
          ativo: boolean
          id: string
          nome: string
          tipo: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          id?: string
          nome: string
          tipo: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          id?: string
          nome?: string
          tipo?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      processar_presenca_rodada: {
        Args: { p_rodada_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: atleta_ligas
//   id: uuid (not null, default: gen_random_uuid())
//   atleta_id: uuid (nullable)
//   liga_id: uuid (nullable)
// Table: atletas
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable, default: auth.uid())
//   nome_completo: text (not null)
//   telefone: text (nullable)
//   sexo: text (not null)
//   categoria_principal: text (not null)
//   status: text (not null, default: 'Ativo'::text)
//   observacoes: text (nullable)
//   avatar_url: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: configuracoes_whatsapp
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   api_url: text (not null, default: ''::text)
//   api_token: text (not null, default: ''::text)
//   session_name: text (not null, default: 'default'::text)
//   mensagem_template: text (not null, default: 'Olá {nome_atleta}, seu resultado da rodada saiu! Você conquistou {pontuacao} pontos.'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: grupo_atletas
//   id: uuid (not null, default: gen_random_uuid())
//   grupo_id: uuid (nullable)
//   atleta_id: uuid (nullable)
//   status: text (not null, default: 'Active'::text)
//   substituido_por_id: uuid (nullable)
//   motivo_substituicao: text (nullable)
// Table: grupos
//   id: uuid (not null, default: gen_random_uuid())
//   rodada_id: uuid (nullable)
//   nome: text (not null)
//   finalizado: boolean (not null, default: false)
// Table: ligas
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable, default: auth.uid())
//   nome: text (not null)
//   categoria: text (not null)
//   temporada: text (not null)
//   total_rodadas: integer (not null, default: 12)
//   status: text (not null, default: 'Ativo'::text)
//   descricao: text (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: partidas
//   id: uuid (not null, default: gen_random_uuid())
//   grupo_id: uuid (nullable)
//   atleta1_id: uuid (nullable)
//   atleta2_id: uuid (nullable)
//   score1: integer (not null, default: 0)
//   atleta3_id: uuid (nullable)
//   atleta4_id: uuid (nullable)
//   score2: integer (not null, default: 0)
// Table: podios
//   id: uuid (not null, default: gen_random_uuid())
//   rodada_id: uuid (nullable)
//   tipo: text (not null)
//   posicao: integer (not null)
//   atleta1_id: uuid (nullable)
//   atleta2_id: uuid (nullable)
// Table: pontuacoes_rodada
//   id: uuid (not null, default: gen_random_uuid())
//   rodada_id: uuid (nullable)
//   atleta_id: uuid (nullable)
//   pontos_grupo: integer (not null, default: 0)
//   pontos_vitorias: integer (not null, default: 0)
//   bonus_5x0: integer (not null, default: 0)
//   pontos_podio_principal: integer (not null, default: 0)
//   pontos_podio_consolacao: integer (not null, default: 0)
//   total: integer (not null, default: 0)
//   pontos_manuais: integer (not null, default: 0)
//   observacao_manuais: text (nullable)
//   pontos_presenca: integer (not null, default: 0)
//   vitorias: integer (not null, default: 0)
//   derrotas: integer (not null, default: 0)
//   games_pro: integer (not null, default: 0)
//   games_contra: integer (not null, default: 0)
//   saldo_games: integer (not null, default: 0)
// Table: publicacoes
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable, default: auth.uid())
//   data_publicacao: timestamp with time zone (not null, default: now())
//   liga_id: uuid (nullable)
//   liga_nome: text (not null)
//   temporada: text (not null)
//   ranking: jsonb (not null)
// Table: regras_pontuacao
//   id: uuid (not null, default: gen_random_uuid())
//   sistema_id: uuid (nullable)
//   chave: text (not null)
//   valor_pontos: integer (not null)
// Table: rodadas
//   id: uuid (not null, default: gen_random_uuid())
//   liga_id: uuid (nullable)
//   numero: text (not null)
//   data: text (not null)
//   hora: text (not null)
//   local: text (not null)
//   sistema_id: uuid (nullable)
//   status: text (not null, default: 'Draft'::text)
//   observacoes: text (nullable)
//   snapshot_regras: jsonb (nullable)
// Table: sistemas_pontuacao
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable, default: auth.uid())
//   nome: text (not null)
//   tipo: text (not null)
//   ativo: boolean (not null, default: true)

// --- CONSTRAINTS ---
// Table: atleta_ligas
//   FOREIGN KEY atleta_ligas_atleta_id_fkey: FOREIGN KEY (atleta_id) REFERENCES atletas(id) ON DELETE CASCADE
//   UNIQUE atleta_ligas_atleta_id_liga_id_key: UNIQUE (atleta_id, liga_id)
//   FOREIGN KEY atleta_ligas_liga_id_fkey: FOREIGN KEY (liga_id) REFERENCES ligas(id) ON DELETE CASCADE
//   PRIMARY KEY atleta_ligas_pkey: PRIMARY KEY (id)
// Table: atletas
//   PRIMARY KEY atletas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY atletas_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: configuracoes_whatsapp
//   PRIMARY KEY configuracoes_whatsapp_pkey: PRIMARY KEY (id)
//   FOREIGN KEY configuracoes_whatsapp_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE configuracoes_whatsapp_user_id_key: UNIQUE (user_id)
// Table: grupo_atletas
//   FOREIGN KEY grupo_atletas_atleta_id_fkey: FOREIGN KEY (atleta_id) REFERENCES atletas(id) ON DELETE CASCADE
//   FOREIGN KEY grupo_atletas_grupo_id_fkey: FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
//   PRIMARY KEY grupo_atletas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY grupo_atletas_substituido_por_id_fkey: FOREIGN KEY (substituido_por_id) REFERENCES atletas(id)
// Table: grupos
//   PRIMARY KEY grupos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY grupos_rodada_id_fkey: FOREIGN KEY (rodada_id) REFERENCES rodadas(id) ON DELETE CASCADE
// Table: ligas
//   PRIMARY KEY ligas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY ligas_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: partidas
//   FOREIGN KEY partidas_atleta1_id_fkey: FOREIGN KEY (atleta1_id) REFERENCES atletas(id)
//   FOREIGN KEY partidas_atleta2_id_fkey: FOREIGN KEY (atleta2_id) REFERENCES atletas(id)
//   FOREIGN KEY partidas_atleta3_id_fkey: FOREIGN KEY (atleta3_id) REFERENCES atletas(id)
//   FOREIGN KEY partidas_atleta4_id_fkey: FOREIGN KEY (atleta4_id) REFERENCES atletas(id)
//   FOREIGN KEY partidas_grupo_id_fkey: FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
//   PRIMARY KEY partidas_pkey: PRIMARY KEY (id)
// Table: podios
//   FOREIGN KEY podios_atleta1_id_fkey: FOREIGN KEY (atleta1_id) REFERENCES atletas(id)
//   FOREIGN KEY podios_atleta2_id_fkey: FOREIGN KEY (atleta2_id) REFERENCES atletas(id)
//   PRIMARY KEY podios_pkey: PRIMARY KEY (id)
//   FOREIGN KEY podios_rodada_id_fkey: FOREIGN KEY (rodada_id) REFERENCES rodadas(id) ON DELETE CASCADE
// Table: pontuacoes_rodada
//   FOREIGN KEY pontuacoes_rodada_atleta_id_fkey: FOREIGN KEY (atleta_id) REFERENCES atletas(id) ON DELETE CASCADE
//   PRIMARY KEY pontuacoes_rodada_pkey: PRIMARY KEY (id)
//   UNIQUE pontuacoes_rodada_rodada_id_atleta_id_key: UNIQUE (rodada_id, atleta_id)
//   FOREIGN KEY pontuacoes_rodada_rodada_id_fkey: FOREIGN KEY (rodada_id) REFERENCES rodadas(id) ON DELETE CASCADE
// Table: publicacoes
//   FOREIGN KEY publicacoes_liga_id_fkey: FOREIGN KEY (liga_id) REFERENCES ligas(id) ON DELETE CASCADE
//   PRIMARY KEY publicacoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY publicacoes_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: regras_pontuacao
//   PRIMARY KEY regras_pontuacao_pkey: PRIMARY KEY (id)
//   FOREIGN KEY regras_pontuacao_sistema_id_fkey: FOREIGN KEY (sistema_id) REFERENCES sistemas_pontuacao(id) ON DELETE CASCADE
// Table: rodadas
//   FOREIGN KEY rodadas_liga_id_fkey: FOREIGN KEY (liga_id) REFERENCES ligas(id) ON DELETE CASCADE
//   PRIMARY KEY rodadas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY rodadas_sistema_id_fkey: FOREIGN KEY (sistema_id) REFERENCES sistemas_pontuacao(id)
// Table: sistemas_pontuacao
//   PRIMARY KEY sistemas_pontuacao_pkey: PRIMARY KEY (id)
//   FOREIGN KEY sistemas_pontuacao_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: atleta_ligas
//   Policy "allow_anon_read" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: atletas
//   Policy "allow_anon_read" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: configuracoes_whatsapp
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
//     WITH CHECK: (user_id = auth.uid())
// Table: grupo_atletas
//   Policy "allow_anon_read" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: grupos
//   Policy "allow_anon_read" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: ligas
//   Policy "allow_anon_read" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: partidas
//   Policy "allow_anon_read" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: podios
//   Policy "allow_anon_read" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: pontuacoes_rodada
//   Policy "allow_anon_read" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: publicacoes
//   Policy "allow_anon_read" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: regras_pontuacao
//   Policy "allow_anon_read" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: rodadas
//   Policy "allow_anon_read" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: sistemas_pontuacao
//   Policy "allow_anon_read" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "allow_auth_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- DATABASE FUNCTIONS ---
// FUNCTION calcular_total_pontuacoes()
//   CREATE OR REPLACE FUNCTION public.calcular_total_pontuacoes()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     NEW.total := COALESCE(NEW.pontos_grupo, 0) +
//                  COALESCE(NEW.pontos_vitorias, 0) +
//                  COALESCE(NEW.bonus_5x0, 0) +
//                  COALESCE(NEW.pontos_podio_principal, 0) +
//                  COALESCE(NEW.pontos_podio_consolacao, 0) +
//                  COALESCE(NEW.pontos_presenca, 0) +
//                  COALESCE(NEW.pontos_manuais, 0);
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION processar_presenca_rodada(uuid)
//   CREATE OR REPLACE FUNCTION public.processar_presenca_rodada(p_rodada_id uuid)
//    RETURNS void
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_sistema_id uuid;
//     v_snapshot jsonb;
//     v_pontos_presenca integer := 0;
//     v_atleta record;
//     v_vitorias integer;
//     v_derrotas integer;
//     v_games_pro integer;
//     v_games_contra integer;
//     v_saldo_games integer;
//   BEGIN
//     -- Obter o sistema e o snapshot da rodada
//     SELECT sistema_id, snapshot_regras INTO v_sistema_id, v_snapshot
//     FROM public.rodadas
//     WHERE id = p_rodada_id;
//
//     -- 1. Tentar extrair do snapshot
//     IF v_snapshot IS NOT NULL THEN
//       IF jsonb_typeof(v_snapshot) = 'array' THEN
//         BEGIN
//           SELECT (value->>'valor_pontos')::integer INTO v_pontos_presenca
//           FROM jsonb_array_elements(v_snapshot)
//           WHERE value->>'chave' = 'pontos_presenca' OR value->>'chave' = 'presenca'
//           LIMIT 1;
//         EXCEPTION WHEN OTHERS THEN
//           v_pontos_presenca := 0;
//         END;
//       ELSIF jsonb_typeof(v_snapshot) = 'object' THEN
//         IF v_snapshot ? 'regras' AND jsonb_typeof(v_snapshot->'regras') = 'array' THEN
//           BEGIN
//             SELECT (value->>'valor_pontos')::integer INTO v_pontos_presenca
//             FROM jsonb_array_elements(v_snapshot->'regras')
//             WHERE value->>'chave' = 'pontos_presenca' OR value->>'chave' = 'presenca'
//             LIMIT 1;
//           EXCEPTION WHEN OTHERS THEN
//             v_pontos_presenca := 0;
//           END;
//         ELSE
//           BEGIN
//             v_pontos_presenca := COALESCE((v_snapshot->>'pontos_presenca')::integer, (v_snapshot->>'presenca')::integer, 0);
//           EXCEPTION WHEN OTHERS THEN
//             v_pontos_presenca := 0;
//           END;
//         END IF;
//       END IF;
//     END IF;
//
//     -- 2. Fallback
//     IF (v_pontos_presenca IS NULL OR v_pontos_presenca = 0) AND v_sistema_id IS NOT NULL THEN
//       SELECT valor_pontos INTO v_pontos_presenca
//       FROM public.regras_pontuacao
//       WHERE sistema_id = v_sistema_id AND (chave = 'pontos_presenca' OR chave = 'presenca')
//       ORDER BY chave = 'pontos_presenca' DESC
//       LIMIT 1;
//     END IF;
//
//     IF v_pontos_presenca IS NULL THEN
//       v_pontos_presenca := 0;
//     END IF;
//
//     FOR v_atleta IN (
//       SELECT DISTINCT atleta_id
//       FROM (
//         SELECT ga.atleta_id
//         FROM public.grupo_atletas ga
//         JOIN public.grupos g ON ga.grupo_id = g.id
//         WHERE g.rodada_id = p_rodada_id AND ga.atleta_id IS NOT NULL
//         UNION
//         SELECT atleta_id
//         FROM public.pontuacoes_rodada
//         WHERE rodada_id = p_rodada_id AND atleta_id IS NOT NULL
//       ) all_athletes
//     ) LOOP
//
//       -- Calcular estatísticas
//       SELECT
//         COALESCE(SUM(CASE WHEN is_team1 AND score1 > score2 THEN 1 WHEN NOT is_team1 AND score2 > score1 THEN 1 ELSE 0 END), 0),
//         COALESCE(SUM(CASE WHEN is_team1 AND score1 < score2 THEN 1 WHEN NOT is_team1 AND score2 < score1 THEN 1 ELSE 0 END), 0),
//         COALESCE(SUM(CASE WHEN is_team1 THEN score1 ELSE score2 END), 0),
//         COALESCE(SUM(CASE WHEN is_team1 THEN score2 ELSE score1 END), 0)
//       INTO v_vitorias, v_derrotas, v_games_pro, v_games_contra
//       FROM (
//         SELECT p.score1, p.score2,
//                (p.atleta1_id = v_atleta.atleta_id OR p.atleta2_id = v_atleta.atleta_id) as is_team1
//         FROM public.partidas p
//         JOIN public.grupos g ON p.grupo_id = g.id
//         WHERE g.rodada_id = p_rodada_id
//           AND (p.atleta1_id = v_atleta.atleta_id OR p.atleta2_id = v_atleta.atleta_id OR p.atleta3_id = v_atleta.atleta_id OR p.atleta4_id = v_atleta.atleta_id)
//       ) as stats;
//
//       v_saldo_games := v_games_pro - v_games_contra;
//
//       INSERT INTO public.pontuacoes_rodada (
//         rodada_id, atleta_id, pontos_grupo, pontos_vitorias, bonus_5x0,
//         pontos_podio_principal, pontos_podio_consolacao, pontos_manuais, observacao_manuais,
//         pontos_presenca, vitorias, derrotas, games_pro, games_contra, saldo_games
//       ) VALUES (
//         p_rodada_id, v_atleta.atleta_id, 0, 0, 0,
//         0, 0, 0, NULL,
//         v_pontos_presenca, v_vitorias, v_derrotas, v_games_pro, v_games_contra, v_saldo_games
//       )
//       ON CONFLICT (rodada_id, atleta_id) DO UPDATE SET
//         pontos_presenca = EXCLUDED.pontos_presenca,
//         vitorias = EXCLUDED.vitorias,
//         derrotas = EXCLUDED.derrotas,
//         games_pro = EXCLUDED.games_pro,
//         games_contra = EXCLUDED.games_contra,
//         saldo_games = EXCLUDED.saldo_games
//         -- Do not update pontos_manuais, observacao_manuais, pontos_podio_principal, pontos_podio_consolacao!
//         ;
//
//     END LOOP;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: pontuacoes_rodada
//   trg_calcular_total_pontuacoes: CREATE TRIGGER trg_calcular_total_pontuacoes BEFORE INSERT OR UPDATE ON public.pontuacoes_rodada FOR EACH ROW EXECUTE FUNCTION calcular_total_pontuacoes()

// --- INDEXES ---
// Table: atleta_ligas
//   CREATE UNIQUE INDEX atleta_ligas_atleta_id_liga_id_key ON public.atleta_ligas USING btree (atleta_id, liga_id)
// Table: configuracoes_whatsapp
//   CREATE UNIQUE INDEX configuracoes_whatsapp_user_id_key ON public.configuracoes_whatsapp USING btree (user_id)
// Table: pontuacoes_rodada
//   CREATE UNIQUE INDEX pontuacoes_rodada_rodada_id_atleta_id_key ON public.pontuacoes_rodada USING btree (rodada_id, atleta_id)
