
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarClock, Plus } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { DataTable } from "@/components/ui/data-table";
import { SessionColumns } from "@/components/sessions/SessionColumns";
import AddSessionDialog from "@/components/sessions/AddSessionDialog";
import { SessionStatus } from "@/components/sessions/SessionStatus";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@/types/session-types";

function isValidSessionType(sessionType: string): sessionType is Session["session_type"] {
  return ["video", "phone", "in-person"].includes(sessionType);
}

function isValidSessionStatus(status: string): status is Session["status"] {
  return ["scheduled", "completed", "cancelled", "no-show"].includes(status);
}

const Sessions = () => {
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { data: sessions = [], isLoading, error: queryError } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      // First, fetch the sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select("*")
        .order("scheduled_date", { ascending: false });

      if (sessionsError) throw sessionsError;

      // Process each session and fetch patient data separately
      const processedSessions = await Promise.all((sessionsData || []).map(async (session) => {
        // Fetch patient data for this session
        const { data: patientData, error: patientError } = await supabase
          .from("patients")
          .select("first_name, last_name, email")
          .eq("id", session.patient_id)
          .single();

        // Ensure session_type is valid
        const sessionType = isValidSessionType(session.session_type) 
          ? session.session_type 
          : "video";
        
        // Ensure status is valid
        const sessionStatus = isValidSessionStatus(session.status)
          ? session.status
          : "scheduled";
        
        const processedSession: Session = {
          id: session.id,
          patient_id: session.patient_id,
          provider_id: session.provider_id,
          scheduled_date: session.scheduled_date,
          session_type: sessionType,
          status: sessionStatus,
          duration_minutes: session.duration_minutes,
          notes: session.notes,
          created_at: session.created_at,
          updated_at: session.updated_at,
          // Handle patient data from the separate query
          patient: patientError ? undefined : {
            first_name: patientData?.first_name || '',
            last_name: patientData?.last_name || '',
            email: patientData?.email
          }
        };
        
        return processedSession;
      }));

      return processedSessions;
    },
  });

  const statusCounts = sessions.reduce((acc, session) => {
    acc[session.status] = (acc[session.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredSessions = activeFilter 
    ? sessions.filter(session => session.status === activeFilter)
    : sessions;

  const handleFilterClick = (status: string | null) => {
    setActiveFilter(status);
  };

  const filtersElement = (
    <div className="flex gap-2">
      <SessionStatus 
        label="All"
        count={sessions.length}
        active={activeFilter === null}
        onClick={() => handleFilterClick(null)}
      />
      {Object.entries(statusCounts).map(([status, count]) => (
        <SessionStatus 
          key={status}
          label={status.charAt(0).toUpperCase() + status.slice(1)}
          count={count} 
          status={status as Session["status"]}
          active={activeFilter === status}
          onClick={() => handleFilterClick(status)}
        />
      ))}
    </div>
  );

  return (
    <PageLayout
      title="Sessions"
      action={{
        label: "Add Session",
        onClick: () => setIsAddSessionOpen(true),
        icon: <Plus className="h-4 w-4" />,
      }}
      isLoading={isLoading}
      filters={filtersElement}
    >
      {queryError ? (
        <div className="p-8 text-center">
          <p className="text-red-500">Error loading sessions: {queryError.message}</p>
        </div>
      ) : (
        <DataTable
          columns={SessionColumns}
          data={filteredSessions}
          filterKey="patient.last_name"
          searchPlaceholder="Search by patient name..."
          noDataMessage="No sessions found"
        />
      )}
      
      <AddSessionDialog 
        open={isAddSessionOpen} 
        onOpenChange={setIsAddSessionOpen} 
      />
    </PageLayout>
  );
};

export default Sessions;
