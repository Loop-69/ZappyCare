
export interface Order {
  id: string;
  patient_id: string;
  order_date: string;
  medication?: string;
  status: string;
  total_amount: number;
  shipping_address?: Record<string, unknown> | string | null;
  pharmacy_id?: string | null;
  session_id?: string | null;
  payment_method?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_id: string;
  patient_id: string;
  patient_name: string;
  email: string;
  amount: number;
  amount_paid: number;
  refunded_amount?: number | null;
  status: string;
  issue_date: string;
  due_date: string;
  items?: InvoiceItem[] | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}
