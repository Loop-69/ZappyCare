
export interface Provider {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  status: string;
  states_authorized: string[];
}

export interface Pharmacy {
  id: string;
  name: string;
  type: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  states_served: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}
