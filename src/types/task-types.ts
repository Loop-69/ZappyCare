
export interface Task {
  id: string;
  title: string;
  status: string;
  priority: "High" | "Medium" | "Low";
  due_date?: string | null;
  reminder_date?: string | null;
  notes?: string | null;
  patient_id?: string | null;
  assignee_id?: string | null;
  duration?: number | null;
  created_at: string;
  updated_at: string;
  // Make patients optional and handle the case where it might not exist
  patients?: {
    first_name: string;
    last_name: string;
  } | null;
}
