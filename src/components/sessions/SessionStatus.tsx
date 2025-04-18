
import { Badge } from "@/components/ui/badge";
import { Session } from "@/types/session-types";

interface SessionStatusProps {
  label: string;
  count: number;
  status?: Session["status"];
  active?: boolean;
  onClick?: () => void;
}

export function SessionStatus({ 
  label, 
  count, 
  status, 
  active = false, 
  onClick 
}: SessionStatusProps) {
  const getStatusColor = (status?: string) => {
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
        return active ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge 
      className={`${getStatusColor(status)} cursor-pointer hover:opacity-80`}
      onClick={onClick}
    >
      {label} ({count})
    </Badge>
  );
}
