
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, ChevronDown } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { DataTable } from "@/components/ui/data-table";
import { SessionColumns } from "@/components/sessions/SessionColumns";
import AddSessionDialog from "@/components/sessions/AddSessionDialog";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@/types/session-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function isValidSessionType(sessionType: string): sessionType is Session["session_type"] {
  return ["video", "phone", "in-person"].includes(sessionType);
}

function isValidSessionStatus(status: string): status is Session["status"] {
  return ["scheduled", "completed", "cancelled", "no-show"].includes(status);
}

const Sessions = () => {
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Session["status"] | "all" | "needs-attention">("all");

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

  const activeSessionsCount = sessions.filter(session => session.status === "scheduled").length;

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchTerm === "" ||
                          session.patient?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          session.patient?.last_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" ||
                          (statusFilter === "needs-attention" && session.status === "scheduled") || // Assuming "Needs Attention" means scheduled
                          (statusFilter === session.status);

    return matchesSearch && matchesStatus;
  });


  return (
    <PageLayout
      title="Sessions"
      isLoading={isLoading}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Sessions</h2>
          <span className="text-muted-foreground text-sm">{activeSessionsCount} active sessions</span>
        </div>
        <Button onClick={() => setIsAddSessionOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu onOpenChange={(open) => !open && setStatusFilter("all")}> {/* Reset filter on close if no selection */}
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {statusFilter === "all" ? "Needs Attention" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("needs-attention")}>Needs Attention</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("scheduled")}>Scheduled</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>Cancelled</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("no-show")}>No Show</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem> {/* Added "All Statuses" option */}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline">More Filters</Button>
      </div>


      {queryError ? (
        <div className="p-8 text-center">
          <p className="text-red-500">Error loading sessions: {queryError.message}</p>
        </div>
      ) : (
        <DataTable
          columns={SessionColumns}
          data={filteredSessions}
          noDataMessage="No sessions found matching your criteria."
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
