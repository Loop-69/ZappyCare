
export interface Discount {
  id: string;
  name: string;
  code: string;
  type: string;
  value: number;
  description?: string | null;
  status: string;
  start_date: string;
  end_date?: string | null;
  requirement?: string | null;
  usage_count: number;
  usage_limit_total?: number | null;
  usage_limit_per_user?: number | null;
  created_at: string;
  updated_at: string;
}
