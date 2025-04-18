
import { format } from "date-fns";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Session } from "@/types/session-types";

interface SessionsListProps {
  sessions: Session[];
  isLoading: boolean;
  emptyMessage?: string;
}

export const SessionsList = ({ 
  sessions = [], 
  isLoading, 
  emptyMessage = "No sessions scheduled for today" 
}: SessionsListProps) => {
  const formatSessionTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (e) {
      return "Invalid time";
    }
  };

  const getSessionTypeIcon = (sessionType: string) => {
    // This could be expanded to show different icons based on session type
    return <CalendarClock className="h-4 w-4 mr-2" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Today's Sessions</CardTitle>
          <Button variant="link" size="sm" asChild>
            <Link to="/sessions">View All</Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Today's Sessions</CardTitle>
        <Button variant="link" size="sm" asChild>
          <Link to="/sessions">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {sessions && sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CalendarClock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {session.patient ? `${session.patient.first_name} ${session.patient.last_name}` : "Unknown Patient"}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {getSessionTypeIcon(session.session_type)}
                      <span>{formatSessionTime(session.scheduled_date)}</span>
                      <span className="mx-1">•</span>
                      <span className="capitalize">{session.session_type}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/sessions/${session.id}`}>Join</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted/30 p-4 rounded-full mb-4">
              <CalendarClock className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
