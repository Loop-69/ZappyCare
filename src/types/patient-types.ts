
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  address: any;
  city: string;
  state: string;
  zip_code: string;
  insurance_provider: string;
  insurance_policy_number: string;
  created_at: string;
  status?: string;
  doctor_id?: string;
  blood_type?: string;
  medical_conditions?: string[];
  allergies?: string[];
  updated_at?: string;
}
