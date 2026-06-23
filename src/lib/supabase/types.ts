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

