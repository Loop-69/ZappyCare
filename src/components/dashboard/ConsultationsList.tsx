
import { format } from "date-fns";
import { MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Consultation = {
  id: string;
  created_at: string;
  status: string;
  patients?: {
    first_name: string;
    last_name: string;
  };
};

interface ConsultationsListProps {
  consultations: Consultation[];
  isLoading: boolean;
}

export const ConsultationsList = ({ consultations = [], isLoading }: ConsultationsListProps) => {
  const formatSubmitDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MM/dd/yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-600";
      case "Needs Info":
        return "bg-yellow-100 text-yellow-600";
      case "Completed":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getInitials = (firstName?: string, lastName?: string): string => {
    if (!firstName && !lastName) return "?";
    return `${firstName ? firstName.charAt(0) : ''}${lastName ? lastName.charAt(0) : ''}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Initial Consultations</CardTitle>
          <Button variant="link" size="sm" asChild>
            <Link to="/consultations">View All</Link>
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
        <CardTitle>Initial Consultations</CardTitle>
        <Button variant="link" size="sm" asChild>
          <Link to="/consultations">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {consultations && consultations.length > 0 ? (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {getInitials(consultation.patients?.first_name, consultation.patients?.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {consultation.patients ? 
                        `${consultation.patients.first_name} ${consultation.patients.last_name}` : 
                        "Unknown Patient"
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {formatSubmitDate(consultation.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(consultation.status)}`}
                  >
                    {consultation.status}
                  </span>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/consultations/${consultation.id}`}>Review</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessagesSquare className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No consultations pending review</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
