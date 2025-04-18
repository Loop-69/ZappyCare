
export interface Session {
  id: string;
  patient_id: string;
  provider_id?: string | null;
  scheduled_date: string;
  session_type: "video" | "phone" | "in-person";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  duration_minutes: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  patient?: {
    first_name: string;
    last_name: string;
    email?: string;
  };
}
