import { createClient } from '@supabase/supabase-js';

// Default values for local Supabase development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be provided in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type Database = {
  public: {
    Tables: {
      billing_transactions: {
        Row: {
          id: string;
          patient_id: string;
          subscription_id: string | null;
          amount: number;
          currency: string;
          status: string;
          created_at: string;
          invoice_id: string | null;
          description: string | null;
          metadata: {
            stripe_payment_id?: string;
            receipt_url?: string;
            notes?: string;
          } | null;
        };
      };
      payment_methods: {
        Row: {
          id: string;
          patient_id: string;
          type: string;
          is_default: boolean;
          details: {
            last4?: string;
            exp_month?: number;
            exp_year?: number;
            brand?: string;
            country?: string;
            [key: string]: unknown;
          };
          created_at: string;
          updated_at: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          patient_id: string;
          amount: number;
          status: string;
          created_at: string;
          payment_method_id: string | null;
          transaction_id: string | null;
        };
      };
    };
  };
};
