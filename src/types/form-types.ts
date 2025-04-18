
export interface PendingForm {
  id: string;
  title: string;
  patient: {
    first_name: string;
    last_name: string;
  };
  due: string;
  urgent: boolean;
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string | null;
  status: string;
  fields: any[];
  created_at: string | null;
  updated_at: string | null;
  submission_count: number;
}
