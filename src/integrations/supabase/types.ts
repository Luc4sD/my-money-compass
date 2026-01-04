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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          balance: number
          color: string | null
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          name: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          balance?: number
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          balance?: number
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      debtor_payments: {
        Row: {
          amount: number
          created_at: string
          debtor_id: string
          id: string
          installment_number: number | null
          notes: string | null
          payment_date: string
        }
        Insert: {
          amount: number
          created_at?: string
          debtor_id: string
          id?: string
          installment_number?: number | null
          notes?: string | null
          payment_date?: string
        }
        Update: {
          amount?: number
          created_at?: string
          debtor_id?: string
          id?: string
          installment_number?: number | null
          notes?: string | null
          payment_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "debtor_payments_debtor_id_fkey"
            columns: ["debtor_id"]
            isOneToOne: false
            referencedRelation: "debtors"
            referencedColumns: ["id"]
          },
        ]
      }
      debtors: {
        Row: {
          created_at: string
          description: string | null
          due_day: number | null
          id: string
          installment_amount: number | null
          is_installment: boolean
          name: string
          start_date: string
          status: string
          total_amount: number
          total_installments: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_day?: number | null
          id?: string
          installment_amount?: number | null
          is_installment?: boolean
          name: string
          start_date?: string
          status?: string
          total_amount: number
          total_installments?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          due_day?: number | null
          id?: string
          installment_amount?: number | null
          is_installment?: boolean
          name?: string
          start_date?: string
          status?: string
          total_amount?: number
          total_installments?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      debts: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          due_day: number | null
          id: string
          installment_amount: number | null
          paid_installments: number
          start_date: string
          status: string
          title: string
          total_amount: number
          total_installments: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          due_day?: number | null
          id?: string
          installment_amount?: number | null
          paid_installments?: number
          start_date?: string
          status?: string
          title: string
          total_amount: number
          total_installments?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          due_day?: number | null
          id?: string
          installment_amount?: number | null
          paid_installments?: number
          start_date?: string
          status?: string
          title?: string
          total_amount?: number
          total_installments?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      recurring_bills: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          due_day: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          due_day?: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          due_day?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          category: string
          created_at: string
          date: string
          debtor_payment_id: string | null
          description: string
          id: string
          is_recurring: boolean | null
          recurring_bill_id: string | null
          status: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          category: string
          created_at?: string
          date?: string
          debtor_payment_id?: string | null
          description: string
          id?: string
          is_recurring?: boolean | null
          recurring_bill_id?: string | null
          status?: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          category?: string
          created_at?: string
          date?: string
          debtor_payment_id?: string | null
          description?: string
          id?: string
          is_recurring?: boolean | null
          recurring_bill_id?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_debtor_payment_id_fkey"
            columns: ["debtor_payment_id"]
            isOneToOne: false
            referencedRelation: "debtor_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_recurring_bill_id_fkey"
            columns: ["recurring_bill_id"]
            isOneToOne: false
            referencedRelation: "recurring_bills"
            referencedColumns: ["id"]
          },
        ]
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
