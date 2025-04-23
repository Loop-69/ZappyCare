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
      consultations: {
        Row: {
          created_at: string
          date_submitted: string
          draft_date: string | null
          email: string
          form_completed: boolean
          id: string
          patient_id: string
          preferred_medication: string | null
          preferred_plan: string | null
          provider_id: string | null
          service: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_submitted?: string
          draft_date?: string | null
          email: string
          form_completed?: boolean
          id?: string
          patient_id: string
          preferred_medication?: string | null
          preferred_plan?: string | null
          provider_id?: string | null
          service: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_submitted?: string
          draft_date?: string | null
          email?: string
          form_completed?: boolean
          id?: string
          patient_id?: string
          preferred_medication?: string | null
          preferred_plan?: string | null
          provider_id?: string | null
          service?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      discounts: {
        Row: {
          code: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          requirement: string | null
          start_date: string
          status: string
          type: string
          updated_at: string
          usage_count: number
          usage_limit_per_user: number | null
          usage_limit_total: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          requirement?: string | null
          start_date: string
          status?: string
          type: string
          updated_at?: string
          usage_count?: number
          usage_limit_per_user?: number | null
          usage_limit_total?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          requirement?: string | null
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
          usage_count?: number
          usage_limit_per_user?: number | null
          usage_limit_total?: number | null
          value?: number
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          created_at: string | null
          form_template_id: string | null
          id: string
          patient_id: string | null
          responses: Json
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          form_template_id?: string | null
          id?: string
          patient_id?: string | null
          responses?: Json
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          form_template_id?: string | null
          id?: string
          patient_id?: string | null
          responses?: Json
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "form_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      form_templates: {
        Row: {
          created_at: string | null
          description: string | null
          fields: Json
          id: string
          status: string
          submission_count: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fields?: Json
          id?: string
          status?: string
          submission_count?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fields?: Json
          id?: string
          status?: string
          submission_count?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      insurance_records: {
        Row: {
          coverage_details: string | null
          created_at: string
          group_number: string | null
          id: string
          insurance_provider: string
          notes: string | null
          patient_id: string | null
          policy_number: string | null
          prior_authorization_required: boolean | null
          prior_authorization_status: string | null
          provider_type: string
          updated_at: string
          verification_status: string
        }
        Insert: {
          coverage_details?: string | null
          created_at?: string
          group_number?: string | null
          id?: string
          insurance_provider: string
          notes?: string | null
          patient_id?: string | null
          policy_number?: string | null
          prior_authorization_required?: boolean | null
          prior_authorization_status?: string | null
          provider_type: string
          updated_at?: string
          verification_status?: string
        }
        Update: {
          coverage_details?: string | null
          created_at?: string
          group_number?: string | null
          id?: string
          insurance_provider?: string
          notes?: string | null
          patient_id?: string | null
          policy_number?: string | null
          prior_authorization_required?: boolean | null
          prior_authorization_status?: string | null
          provider_type?: string
          updated_at?: string
          verification_status?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          amount_paid: number
          created_at: string
          due_date: string
          email: string
          id: string
          invoice_id: string
          issue_date: string
          items: Json | null
          patient_id: string
          patient_name: string
          payment_method_id: string | null
          refunded_amount: number | null
          status: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          amount_paid?: number
          created_at?: string
          due_date: string
          email: string
          id?: string
          invoice_id: string
          issue_date?: string
          items?: Json | null
          patient_id: string
          patient_name: string
          payment_method_id?: string | null
          refunded_amount?: number | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          amount_paid?: number
          created_at?: string
          due_date?: string
          email?: string
          id?: string
          invoice_id?: string
          issue_date?: string
          items?: Json | null
          patient_id?: string
          patient_name?: string
          payment_method_id?: string | null
          refunded_amount?: number | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "billing_transactions"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          medication_name: string
          order_id: string
          quantity: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          medication_name: string
          order_id: string
          quantity?: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          medication_name?: string
          order_id?: string
          quantity?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_date: string
          patient_id: string
          payment_method: string | null
          pharmacy_id: string | null
          session_id: string | null
          shipping_address: Json | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_date?: string
          patient_id: string
          payment_method?: string | null
          pharmacy_id?: string | null
          session_id?: string | null
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_date?: string
          patient_id?: string
          payment_method?: string | null
          pharmacy_id?: string | null
          session_id?: string | null
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_documents: {
        Row: {
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          patient_id: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          patient_id: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          patient_id?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_notes: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          patient_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          patient_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          patient_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: Json | null
          allergies: string[] | null
          blood_type: string | null
          created_at: string
          date_of_birth: string | null
          doctor_id: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          id: string
          insurance_policy_number: string | null
          insurance_provider: string | null
          last_name: string
          medical_conditions: string[] | null
          phone: string | null
          primary_language: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          allergies?: string[] | null
          blood_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          doctor_id?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_name: string
          medical_conditions?: string[] | null
          phone?: string | null
          primary_language?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          allergies?: string[] | null
          blood_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          doctor_id?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_name?: string
          medical_conditions?: string[] | null
          phone?: string | null
          primary_language?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pharmacies: {
        Row: {
          active: boolean
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
          states_served: string[]
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
          states_served?: string[]
          type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          states_served?: string[]
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      plan_product_doses: {
        Row: {
          plan_id: string
          product_dose_id: string
        }
        Insert: {
          plan_id: string
          product_dose_id: string
        }
        Update: {
          plan_id?: string
          product_dose_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_product_doses_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_product_doses_product_dose_id_fkey"
            columns: ["product_dose_id"]
            isOneToOne: false
            referencedRelation: "product_doses"
            referencedColumns: ["id"]
          },
        ]
      }
      product_doses: {
        Row: {
          allow_one_time_purchase: boolean | null
          created_at: string | null
          description: string | null
          dose: string
          id: string
          product_id: string | null
          stripe_price_id_subscription: string | null
          updated_at: string | null
        }
        Insert: {
          allow_one_time_purchase?: boolean | null
          created_at?: string | null
          description?: string | null
          dose: string
          id?: string
          product_id?: string | null
          stripe_price_id_subscription?: string | null
          updated_at?: string | null
        }
        Update: {
          allow_one_time_purchase?: boolean | null
          created_at?: string | null
          description?: string | null
          dose?: string
          id?: string
          product_id?: string | null
          stripe_price_id_subscription?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_doses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_services: {
        Row: {
          product_id: string
          service_name: string
        }
        Insert: {
          product_id: string
          service_name: string
        }
        Update: {
          product_id?: string
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_services_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          fulfillment_source: string | null
          id: string
          interaction_warnings: string | null
          name: string
          one_time_price: number | null
          requires_prescription: boolean | null
          status: string | null
          stock_status: string | null
          stripe_price_id_one_time: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          fulfillment_source?: string | null
          id?: string
          interaction_warnings?: string | null
          name: string
          one_time_price?: number | null
          requires_prescription?: boolean | null
          status?: string | null
          stock_status?: string | null
          stripe_price_id_one_time?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          fulfillment_source?: string | null
          id?: string
          interaction_warnings?: string | null
          name?: string
          one_time_price?: number | null
          requires_prescription?: boolean | null
          status?: string | null
          stock_status?: string | null
          stripe_price_id_one_time?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          specialty: string
          states_authorized: string[]
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          specialty: string
          states_authorized?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          specialty?: string
          states_authorized?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_plans: {
        Row: {
          plan_id: string
          service_id: string
        }
        Insert: {
          plan_id: string
          service_id: string
        }
        Update: {
          plan_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_plans_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_plans_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_products: {
        Row: {
          product_id: string
          service_id: string
        }
        Insert: {
          product_id: string
          service_id: string
        }
        Update: {
          product_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_products_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          requires_consultation: boolean | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          requires_consultation?: boolean | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          requires_consultation?: boolean | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          notes: string | null
          patient_id: string
          provider_id: string | null
          scheduled_date: string
          session_type: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          patient_id: string
          provider_id?: string | null
          scheduled_date: string
          session_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          patient_id?: string
          provider_id?: string | null
          scheduled_date?: string
          session_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          active: boolean | null
          additional_benefits: string | null
          billing_frequency: string | null
          category: string | null
          created_at: string | null
          delivery_frequency: string | null
          description: string | null
          discount: number | null
          id: string
          name: string
          popularity: string | null
          price: number
          requires_consultation: boolean | null
          stripe_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          additional_benefits?: string | null
          billing_frequency?: string | null
          category?: string | null
          created_at?: string | null
          delivery_frequency?: string | null
          description?: string | null
          discount?: number | null
          id?: string
          name: string
          popularity?: string | null
          price: number
          requires_consultation?: boolean | null
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          additional_benefits?: string | null
          billing_frequency?: string | null
          category?: string | null
          created_at?: string | null
          delivery_frequency?: string | null
          description?: string | null
          discount?: number | null
          id?: string
          name?: string
          popularity?: string | null
          price?: number
          requires_consultation?: boolean | null
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          due_date: string | null
          duration: number | null
          id: string
          notes: string | null
          patient_id: string | null
          priority: string
          reminder_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          due_date?: string | null
          duration?: number | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          priority?: string
          reminder_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          due_date?: string | null
          duration?: number | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          priority?: string
          reminder_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_staff: boolean
          sender_name: string
          ticket_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_staff?: boolean
          sender_name: string
          ticket_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_staff?: boolean
          sender_name?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          id: string
          last_message_at: string
          priority: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by: string
          id?: string
          last_message_at?: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          id?: string
          last_message_at?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      billing_transactions: {
        Row: {
          id: string
          patient_id: string
          subscription_id: string | null
          amount: number
          currency: string
          status: string
          created_at: string
          invoice_id: string | null
          description: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          patient_id: string
          subscription_id?: string | null
          amount: number
          currency?: string
          status?: string
          created_at?: string
          invoice_id?: string | null
          description?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          patient_id?: string
          subscription_id?: string | null
          amount?: number
          currency?: string
          status?: string
          created_at?: string
          invoice_id?: string | null
          description?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_transactions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          }
        ]
      }
      payment_methods: {
        Row: {
          id: string
          patient_id: string
          type: string
          is_default: boolean
          details: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          type: string
          is_default?: boolean
          details?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          type?: string
          is_default?: boolean
          details?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
