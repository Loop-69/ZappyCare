import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, ExternalLink, Pencil, Trash2, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Define the consultation status badge variants
const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <Badge className="bg-green-500">Completed</Badge>;
    case "in progress":
      return <Badge className="bg-blue-500">In Progress</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">Pending</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const consultationColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="text-xs font-mono">{row.original.id.substring(0, 8)}...</span>,
  },
  {
    accessorKey: "patients",
    header: "Patient",
    cell: ({ row }) => {
      const patient = row.original.patients;
      return (
        <div className="flex flex-col">
          <span>{patient?.first_name} {patient?.last_name}</span>
          <span className="text-xs text-gray-500">{patient?.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "date_submitted",
    header: "Date Submitted",
    cell: ({ row }) => {
      const date = new Date(row.original.date_submitted);
      return <span>{format(date, "MMM dd, yyyy")}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    accessorKey: "form_completed",
    header: "Form Status",
    cell: ({ row }) => (
      <Badge 
        variant={row.original.form_completed ? "default" : "outline"}
        className={row.original.form_completed ? "bg-green-500" : ""}
      >
        {row.original.form_completed ? "Completed" : "Incomplete"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => {/* TODO: implement view */}} title="View">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => {/* TODO: implement edit */}} title="Edit">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => {/* TODO: implement delete */}} title="Delete">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
  },
];
