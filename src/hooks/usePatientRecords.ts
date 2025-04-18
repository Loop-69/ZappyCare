
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePatientRecords(patientId: string) {
  // Fetch sessions (appointments)
  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ["patient-sessions-dashboard", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("patient_id", patientId)
        .order("scheduled_date", { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch forms
  const { data: forms, isLoading: isLoadingForms } = useQuery({
    queryKey: ["patient-forms", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("form_submissions")
        .select("*, form_templates(*)")
        .eq("patient_id", patientId);
        
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch medications
  const { data: medications, isLoading: isLoadingMedications } = useQuery({
    queryKey: ["patient-medications", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("patient_id", patientId);
        
      if (error) throw error;
      
      // Extract medication items from orders
      const medicationItems: any[] = [];
      data?.forEach(order => {
        if (order.order_items && Array.isArray(order.order_items)) {
          order.order_items.forEach((item: any) => {
            medicationItems.push({
              ...item,
              order_date: order.order_date,
              status: order.status
            });
          });
        }
      });
      
      return medicationItems;
    },
  });

  // Fetch notes
  const { data: notes, isLoading: isLoadingNotes } = useQuery({
    queryKey: ["patient-notes-dashboard", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_notes")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
  });

  // Mock lab results (as in original)
  const labResults = [
    { id: "1", name: "Complete Blood Count", date: "2025-04-10", status: "completed" },
    { id: "2", name: "Lipid Panel", date: "2025-03-15", status: "completed" },
    { id: "3", name: "Metabolic Panel", date: "2025-03-01", status: "completed" },
    { id: "4", name: "Thyroid Function", date: "2025-02-20", status: "completed" },
  ];

  const isLoading = isLoadingSessions || isLoadingForms || isLoadingMedications || isLoadingNotes;

  return {
    sessions,
    forms,
    medications,
    notes,
    labResults,
    isLoading
  };
}
