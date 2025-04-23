import { supabase } from "@/integrations/supabase/client";

export const searchDatabase = async (query: string): Promise<{
  patients: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  }[];
  orders: {
    id: string;
    patient_id: string;
    status: string;
    created_at: string;
  }[];
  consultations: {
    id: string;
    patient_id: string;
    service: string;
    notes: string;
  }[];
}> => {
  if (!query || query.length < 3) return { patients: [], orders: [], consultations: [] };

  try {
    // Search patients
    const { data: patients } = await supabase
      .from('patients')
      .select('id, first_name, last_name, email')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`);

    // Search orders
    const { data: orders } = await supabase
      .from('orders')
      .select('id, patient_id, status, created_at')
      .or(`status.ilike.%${query}%,notes.ilike.%${query}%`);

    // Search consultations
    const { data: consultations } = await supabase
      .from('consultations')
      .select('id, patient_id, service')
      .ilike('service', `%${query}%`);

    return {
      patients: patients || [],
      orders: orders || [],
      consultations: consultations || []
    };
  } catch (error) {
    console.error('Search error:', error);
    return { patients: [], orders: [], consultations: [] };
  }
};
