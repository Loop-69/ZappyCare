
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useTotalPatientsCount = () => {
  return useQuery({
    queryKey: ["total-patients"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });
};

export const useActivePatientsCount = () => {
  return useQuery({
    queryKey: ["active-patients"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count, error } = await supabase
        .from("sessions")
        .select("patient_id", { count: "exact", head: true })
        .gte('scheduled_date', thirtyDaysAgo.toISOString());
      
      if (error) throw error;
      return count || 0;
    }
  });
};

export const useUpcomingSessionsCount = () => {
  return useQuery({
    queryKey: ["upcoming-sessions"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("sessions")
        .select("*", { count: "exact", head: true })
        .gte('scheduled_date', new Date().toISOString());
      
      if (error) throw error;
      return count || 0;
    }
  });
};

export const useRecentFormsCount = () => {
  return useQuery({
    queryKey: ["recent-forms"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count, error } = await supabase
        .from("form_submissions")
        .select("*", { count: "exact", head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      if (error) throw error;
      return count || 0;
    }
  });
};
