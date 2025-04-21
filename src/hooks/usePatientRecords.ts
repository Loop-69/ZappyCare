

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePatientRecords(patientId: string) {
  // Fetch sessions (appointments) - limited to 10 most recent
  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ["patient-sessions-dashboard", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("patient_id", patientId)
        .order("scheduled_date", { ascending: false })
        .limit(10);
        
      if (error) {
        console.error("Error fetching sessions:", error);
        return [];
      }
      return data || [];
    },
  });

  // Fetch forms - limited to 5 most recent
  const { data: forms, isLoading: isLoadingForms } = useQuery({
    queryKey: ["patient-forms", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("form_submissions")
        .select("id, created_at, status, form_templates(title)")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false })
        .limit(5);
        
      if (error) {
        console.error("Error fetching forms:", error);
        return [];
      }
      return data || [];
    },
  });

  // Fetch notes - limited to 5 most recent
  const { data: notes, isLoading: isLoadingNotes } = useQuery({
    queryKey: ["patient-notes-dashboard", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_notes")
        .select("id, created_at, content")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false })
        .limit(5);
        
      if (error) {
        console.error("Error fetching notes:", error);
        return [];
      }
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

  const isLoading = isLoadingSessions || isLoadingForms || isLoadingNotes;

  return {
    sessions,
    forms,
    medications: [], // Return empty array for medications
    notes,
    labResults,
    isLoading
  };
}
