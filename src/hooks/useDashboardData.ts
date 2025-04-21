import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task, Session, Consultation, PendingForm } from "@/types";

// Helper functions to validate session types and statuses
const isValidSessionType = (type: string): type is Session["session_type"] => {
  return ["video", "phone", "in-person"].includes(type);
};

const isValidSessionStatus = (status: string): status is Session["status"] => {
  return ["scheduled", "completed", "cancelled", "no-show"].includes(status);
};

export const useDashboardData = () => {
  // Fetch patients count
  const { data: patientsCount, isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patients-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch upcoming sessions
  const { data: upcomingSessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ["upcoming-sessions"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // First fetch sessions
      const { data: sessions, error } = await supabase
        .from("sessions")
        .select(`
          id,
          scheduled_date,
          session_type,
          status,
          duration_minutes,
          patient_id,
          created_at,
          updated_at,
          provider_id,
          notes
        `)
        .gte("scheduled_date", today.toISOString())
        .order("scheduled_date", { ascending: true })
        .limit(5);
      
      if (error) throw error;
      if (!sessions) return [];
      
      // Then fetch related patients
      const patientIds = sessions.map(s => s.patient_id).filter(Boolean);
      const { data: patients } = await supabase
        .from("patients")
        .select("id, first_name, last_name")
        .in("id", patientIds);
      
      // Combine the data
      return sessions.map(session => ({
        ...session,
        patient: patients?.find(p => p.id === session.patient_id)
      }));
    },
  });

  // Fetch today's sessions
  const { data: todaySessions, isLoading: isLoadingTodaySessions } = useQuery({
    queryKey: ["today-sessions"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // First, fetch sessions for today
      // First fetch sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select(`
          id,
          scheduled_date,
          session_type,
          status,
          duration_minutes,
          patient_id,
          created_at,
          updated_at,
          provider_id,
          notes
        `)
        .gte("scheduled_date", today.toISOString())
        .lt("scheduled_date", tomorrow.toISOString())
        .order("scheduled_date", { ascending: true });
      
      if (sessionsError) throw sessionsError;
      if (!sessionsData) return [];
      
      // Then fetch related patients
      const patientIds = sessionsData.map(s => s.patient_id).filter(Boolean);
      const { data: patients } = await supabase
        .from("patients")
        .select("id, first_name, last_name")
        .in("id", patientIds);
      
      // Process and validate the sessions
      return sessionsData.map((session) => {
        // Validate session type
        const sessionType = isValidSessionType(session.session_type) 
          ? session.session_type 
          : "video";
        
        // Ensure status is valid
        const sessionStatus = isValidSessionStatus(session.status)
          ? session.status
          : "scheduled";
        
        return {
          ...session,
          session_type: sessionType,
          status: sessionStatus,
          duration_minutes: session.duration_minutes || 60,
          patient: patients?.find(p => p.id === session.patient_id)
        } as Session;
      });
    },
  });

  // Fetch pending orders
  const { data: pendingOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["pending-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data?.length || 0;
    },
  });

  // Fetch new consultations
  const { data: newConsultations, isLoading: isLoadingConsultations } = useQuery({
    queryKey: ["new-consultations"],
    queryFn: async () => {
      // First fetch consultations
      const { data: consultations, error } = await supabase
        .from("consultations")
        .select(`
          id,
          created_at,
          status,
          service,
          email,
          form_completed,
          date_submitted,
          patient_id
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      if (!consultations) return [];
      
      // Then fetch related patients
      const patientIds = consultations.map(c => c.patient_id).filter(Boolean);
      const { data: patients } = await supabase
        .from("patients")
        .select("id, first_name, last_name, email")
        .in("id", patientIds);
      
      // Combine the data
      return consultations.map(consultation => ({
        ...consultation,
        patients: patients?.find(p => p.id === consultation.patient_id) || {
          first_name: 'Unknown',
          last_name: 'Patient',
          email: 'unknown@example.com'
        }
      }));
    },
  });

  // Fetch tasks - Modified to fix the join issue
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["dashboard-tasks"],
    queryFn: async () => {
      // First, fetch tasks
      const { data: taskData, error: taskError } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true })
        .limit(5);
      
      if (taskError) throw taskError;
      
      if (!taskData || taskData.length === 0) {
        return [];
      }
      
      // For each task with a patient_id, fetch the patient data separately
      const tasksWithPatients = await Promise.all(
        taskData.map(async (task) => {
          if (task.patient_id) {
            // Fetch patient information for this task
            const { data: patientData } = await supabase
              .from("patients")
              .select("first_name, last_name")
              .eq("id", task.patient_id)
              .single();
            
            // If patient data is found, attach it to the task
            if (patientData) {
              return {
                ...task,
                patients: {
                  first_name: patientData.first_name,
                  last_name: patientData.last_name
                }
              };
            }
          }
          
          // Return task with default patient info if no patient is associated
          return {
            ...task,
            patients: task.patient_id ? 
              { first_name: 'Unknown', last_name: 'Patient' } : 
              undefined
          };
        })
      );
      
      return tasksWithPatients as Task[];
    },
  });

  // Fetch pending forms
  const { data: pendingForms, isLoading: isLoadingForms } = useQuery({
    queryKey: ["pending-forms"],
    queryFn: async () => {
      // For this example, I'm creating mock data as the forms might not exist in the database yet
      // In a real implementation, you would fetch this from a dedicated forms table
      return [
        {
          id: "1",
          title: "Monthly Questionnaire",
          patient: { first_name: "Jane", last_name: "Smith" },
          due: "in 2 days",
          urgent: false
        },
        {
          id: "2",
          title: "ID Verification",
          patient: { first_name: "Robert", last_name: "Johnson" },
          due: "Overdue",
          urgent: true
        }
      ] as PendingForm[];
    },
  });

  const isLoading = 
    isLoadingPatients || 
    isLoadingSessions || 
    isLoadingTodaySessions || 
    isLoadingOrders || 
    isLoadingConsultations || 
    isLoadingTasks || 
    isLoadingForms;

  return {
    patientsCount,
    upcomingSessions,
    todaySessions,
    pendingOrders,
    newConsultations,
    tasks,
    pendingForms,
    isLoading
  };
};
