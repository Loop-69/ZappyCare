import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, Clock, Video, Phone, User } from "lucide-react";
import { Session } from "@/types/session-types";
import { Badge } from "@/components/ui/badge";
import { SessionActions } from "./SessionActions";
import { Checkbox } from "@/components/ui/checkbox";

const getStatusColor = (status: Session["status"]) => {
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

const getSessionTypeIcon = (type: Session["session_type"]) => {
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

export const SessionColumns: ColumnDef<Session>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const patient = row.original.patient;
      return patient ? (
        <div>
          <p className="font-medium">{`${patient.first_name} ${patient.last_name}`}</p>
          <p className="text-sm text-muted-foreground">{patient.email}</p>
        </div>
      ) : (
        <span className="text-muted-foreground">Unknown</span>
      );
    },
  },
  {
    accessorKey: "scheduled_date",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = new Date(row.original.scheduled_date);
      return (
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p>{format(date, "PPP")}</p>
            <p className="text-sm text-muted-foreground">{format(date, "p")}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "session_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.session_type;
      return (
        <div className="flex items-center gap-1.5">
          {getSessionTypeIcon(type)}
          <span className="capitalize">{type}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "duration_minutes",
    header: "Duration",
    cell: ({ row }) => {
      const minutes = row.original.duration_minutes;
      return (
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{minutes} min</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <SessionActions session={row.original} />,
  },
];
