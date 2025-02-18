export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_analyses: {
        Row: {
          competitive_position_score: number | null
          created_at: string
          financial_viability_score: number | null
          id: string
          market_potential_score: number | null
          recommendations: string | null
          risk_score: number | null
          scalability_score: number | null
          startup_id: string | null
          status: Database["public"]["Enums"]["analysis_status"] | null
          summary: string | null
          updated_at: string
        }
        Insert: {
          competitive_position_score?: number | null
          created_at?: string
          financial_viability_score?: number | null
          id?: string
          market_potential_score?: number | null
          recommendations?: string | null
          risk_score?: number | null
          scalability_score?: number | null
          startup_id?: string | null
          status?: Database["public"]["Enums"]["analysis_status"] | null
          summary?: string | null
          updated_at?: string
        }
        Update: {
          competitive_position_score?: number | null
          created_at?: string
          financial_viability_score?: number | null
          id?: string
          market_potential_score?: number | null
          recommendations?: string | null
          risk_score?: number | null
          scalability_score?: number | null
          startup_id?: string | null
          status?: Database["public"]["Enums"]["analysis_status"] | null
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_analyses_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          file_url: string
          id: string
          startup_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          startup_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          startup_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      startup_details: {
        Row: {
          business_model: string | null
          competitive_advantage: string | null
          created_at: string
          id: string
          ip_patents: string | null
          market_size: string | null
          problem_statement: string | null
          product_stage: string | null
          revenue_model: string | null
          solution: string | null
          startup_id: string | null
          target_market: string | null
          tech_stack: string | null
          updated_at: string
        }
        Insert: {
          business_model?: string | null
          competitive_advantage?: string | null
          created_at?: string
          id?: string
          ip_patents?: string | null
          market_size?: string | null
          problem_statement?: string | null
          product_stage?: string | null
          revenue_model?: string | null
          solution?: string | null
          startup_id?: string | null
          target_market?: string | null
          tech_stack?: string | null
          updated_at?: string
        }
        Update: {
          business_model?: string | null
          competitive_advantage?: string | null
          created_at?: string
          id?: string
          ip_patents?: string | null
          market_size?: string | null
          problem_statement?: string | null
          product_stage?: string | null
          revenue_model?: string | null
          solution?: string | null
          startup_id?: string | null
          target_market?: string | null
          tech_stack?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "startup_details_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: true
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_financials: {
        Row: {
          burn_rate: number | null
          created_at: string
          current_revenue: number | null
          funding_raised: number | null
          id: string
          runway_months: number | null
          startup_id: string | null
          updated_at: string
          valuation: number | null
        }
        Insert: {
          burn_rate?: number | null
          created_at?: string
          current_revenue?: number | null
          funding_raised?: number | null
          id?: string
          runway_months?: number | null
          startup_id?: string | null
          updated_at?: string
          valuation?: number | null
        }
        Update: {
          burn_rate?: number | null
          created_at?: string
          current_revenue?: number | null
          funding_raised?: number | null
          id?: string
          runway_months?: number | null
          startup_id?: string | null
          updated_at?: string
          valuation?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "startup_financials_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: true
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startups: {
        Row: {
          created_at: string
          created_by: string | null
          employee_count: number
          founding_year: number
          id: string
          industry: Database["public"]["Enums"]["industry_type"]
          location: string
          name: string
          status: Database["public"]["Enums"]["startup_status"] | null
          submission_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          employee_count: number
          founding_year: number
          id?: string
          industry: Database["public"]["Enums"]["industry_type"]
          location: string
          name: string
          status?: Database["public"]["Enums"]["startup_status"] | null
          submission_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          employee_count?: number
          founding_year?: number
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"]
          location?: string
          name?: string
          status?: Database["public"]["Enums"]["startup_status"] | null
          submission_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "startups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          experience: string | null
          id: string
          linkedin_url: string | null
          name: string
          role: string
          startup_id: string | null
        }
        Insert: {
          created_at?: string
          experience?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          role: string
          startup_id?: string | null
        }
        Update: {
          created_at?: string
          experience?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          role?: string
          startup_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_submission_url: {
        Args: {
          startup_id: string
        }
        Returns: string
      }
    }
    Enums: {
      analysis_status: "pending" | "processing" | "completed" | "failed"
      industry_type:
        | "fintech"
        | "healthtech"
        | "ecommerce"
        | "saas"
        | "ai_ml"
        | "cleantech"
        | "edtech"
        | "enterprise"
        | "consumer"
        | "other"
      startup_status:
        | "draft"
        | "submitted"
        | "in_review"
        | "approved"
        | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
