
export interface Consultation {
  id: string;
  created_at: string;
  status: string;
  service: string;
  email: string;
  preferred_medication?: string;
  preferred_plan?: string;
  form_completed: boolean;
  date_submitted: string;
  patient_id: string;
  patients?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}
