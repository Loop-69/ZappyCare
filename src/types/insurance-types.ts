export interface InsuranceRecord {
  id: string;
  patient_id: string | null;
  insurance_provider: string;
  provider_type: string;
  policy_number: string | null;
  group_number: string | null;
  verification_status: string;
  prior_authorization_required: boolean | null;
  prior_authorization_status: string | null;
  coverage_details: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relationship to patients table
  patients: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
  } | null;
}
