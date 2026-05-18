// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
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
            foreignKeyName: "atleta_ligas_atleta_id_fkey"
            columns: ["atleta_id"]
            isOneToOne: false
            referencedRelation: "atletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atleta_ligas_liga_id_fkey"
            columns: ["liga_id"]
            isOneToOne: false
            referencedRelation: "ligas"
            referencedColumns: ["id"]
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
            foreignKeyName: "grupo_atletas_atleta_id_fkey"
            columns: ["atleta_id"]
            isOneToOne: false
            referencedRelation: "atletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupo_atletas_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupo_atletas_substituido_por_id_fkey"
            columns: ["substituido_por_id"]
            isOneToOne: false
            referencedRelation: "atletas"
            referencedColumns: ["id"]
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
            foreignKeyName: "grupos_rodada_id_fkey"
            columns: ["rodada_id"]
            isOneToOne: false
            referencedRelation: "rodadas"
            referencedColumns: ["id"]
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
            foreignKeyName: "partidas_atleta1_id_fkey"
            columns: ["atleta1_id"]
            isOneToOne: false
            referencedRelation: "atletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partidas_atleta2_id_fkey"
            columns: ["atleta2_id"]
            isOneToOne: false
            referencedRelation: "atletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partidas_atleta3_id_fkey"
            columns: ["atleta3_id"]
            isOneToOne: false
            referencedRelation: "atletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partidas_atleta4_id_fkey"
            columns: ["atleta4_id"]
            isOneToOne: false
            referencedRelation: "atletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partidas_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
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
            foreignKeyName: "podios_atleta1_id_fkey"
            columns: ["atleta1_id"]
            isOneToOne: false
            referencedRelation: "atletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "podios_atleta2_id_fkey"
            columns: ["atleta2_id"]
            isOneToOne: false
            referencedRelation: "atletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "podios_rodada_id_fkey"
            columns: ["rodada_id"]
            isOneToOne: false
            referencedRelation: "rodadas"
            referencedColumns: ["id"]
          },
        ]
      }
      pontuacoes_rodada: {
        Row: {
          atleta_id: string | null
          bonus_5x0: number
          id: string
          observacao_manuais: string | null
          pontos_grupo: number
          pontos_manuais: number
          pontos_podio_consolacao: number
          pontos_podio_principal: number
          pontos_presenca: number
          pontos_vitorias: number
          rodada_id: string | null
          total: number
        }
        Insert: {
          atleta_id?: string | null
          bonus_5x0?: number
          id?: string
          observacao_manuais?: string | null
          pontos_grupo?: number
          pontos_manuais?: number
          pontos_podio_consolacao?: number
          pontos_podio_principal?: number
          pontos_presenca?: number
          pontos_vitorias?: number
          rodada_id?: string | null
          total?: number
        }
        Update: {
          atleta_id?: string | null
          bonus_5x0?: number
          id?: string
          observacao_manuais?: string | null
          pontos_grupo?: number
          pontos_manuais?: number
          pontos_podio_consolacao?: number
          pontos_podio_principal?: number
          pontos_presenca?: number
          pontos_vitorias?: number
          rodada_id?: string | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "pontuacoes_rodada_atleta_id_fkey"
            columns: ["atleta_id"]
            isOneToOne: false
            referencedRelation: "atletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pontuacoes_rodada_rodada_id_fkey"
            columns: ["rodada_id"]
            isOneToOne: false
            referencedRelation: "rodadas"
            referencedColumns: ["id"]
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
            foreignKeyName: "publicacoes_liga_id_fkey"
            columns: ["liga_id"]
            isOneToOne: false
            referencedRelation: "ligas"
            referencedColumns: ["id"]
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
            foreignKeyName: "regras_pontuacao_sistema_id_fkey"
            columns: ["sistema_id"]
            isOneToOne: false
            referencedRelation: "sistemas_pontuacao"
            referencedColumns: ["id"]
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
            foreignKeyName: "rodadas_liga_id_fkey"
            columns: ["liga_id"]
            isOneToOne: false
            referencedRelation: "ligas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rodadas_sistema_id_fkey"
            columns: ["sistema_id"]
            isOneToOne: false
            referencedRelation: "sistemas_pontuacao"
            referencedColumns: ["id"]
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
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

// --- INDEXES ---
// Table: atleta_ligas
//   CREATE UNIQUE INDEX atleta_ligas_atleta_id_liga_id_key ON public.atleta_ligas USING btree (atleta_id, liga_id)
// Table: configuracoes_whatsapp
//   CREATE UNIQUE INDEX configuracoes_whatsapp_user_id_key ON public.configuracoes_whatsapp USING btree (user_id)

