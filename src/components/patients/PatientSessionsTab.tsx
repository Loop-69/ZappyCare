import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar, Video, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Session } from "@/types/session-types";
import AddSessionDialog from "@/components/sessions/AddSessionDialog";

interface PatientSessionsTabProps {
  patientId: string;
}

export function PatientSessionsTab({ patientId }: PatientSessionsTabProps) {
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);

  const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ["patient-sessions", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("patient_id", patientId)
        .order("scheduled_date", { ascending: false });
        
      if (error) throw error;
      return data;
    },
  });

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "phone":
        return <Phone className="h-4 w-4 text-green-500" />;
      case "in-person":
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no-show":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Sessions</h2>

      {isLoading ? (
        <div className="text-center py-8">Loading sessions...</div>
      ) : sessions && sessions.length > 0 ? (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className="bg-white border rounded-md p-4 flex justify-between items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {format(new Date(session.scheduled_date), "PPP")}
                  </span>
                  <span className="text-muted-foreground">
                    {format(new Date(session.scheduled_date), "p")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getSessionTypeIcon(session.session_type)}
                  <span className="capitalize">{session.session_type} Session</span>
                  <span className="text-muted-foreground">
                    ({session.duration_minutes} min)
                  </span>
                </div>
                {session.notes && (
                  <p className="text-sm text-muted-foreground">
                    {session.notes}
                  </p>
                )}
              </div>
              <Badge className={getStatusColor(session.status)}>
                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No sessions scheduled</h3>
          <p className="text-muted-foreground mb-4">
            This patient doesn't have any sessions yet.
          </p>
        </div>
      )}

      <AddSessionDialog
        open={isAddSessionOpen}
        onOpenChange={setIsAddSessionOpen}
      />
    </div>
  );
}
