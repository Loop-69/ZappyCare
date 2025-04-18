import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { TaskActions } from "./TaskActions";
import { Checkbox } from "@/components/ui/checkbox";

// Helper function to format dates
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return format(new Date(dateString), "MM/dd/yyyy");
};

// Helper function to render status badges with appropriate colors
const StatusBadge = ({ status }: { status: Task["status"] }) => {
  const statusColors = {
    "Todo": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "In Progress": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "Done": "bg-green-100 text-green-800 hover:bg-green-200"
  };
  
  return (
    <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"} variant="outline">
      {status}
    </Badge>
  );
};

// Helper function to render priority badges with appropriate colors
const PriorityBadge = ({ priority }: { priority: Task["priority"] }) => {
  const priorityColors = {
    "Low": "bg-gray-100 text-gray-800 hover:bg-gray-200",
    "Medium": "bg-green-100 text-green-800 hover:bg-green-200",
    "High": "bg-red-100 text-red-800 hover:bg-red-200"
  };
  
  return (
    <Badge className={priorityColors[priority] || "bg-gray-100 text-gray-800"} variant="outline">
      {priority}
    </Badge>
  );
};

export const TaskColumns: ColumnDef<Task>[] = [
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
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "patient_id",
    header: "Patient",
    cell: ({ row }) => {
      const patient = row.original.patients;
      return patient ? `${patient.first_name} ${patient.last_name}` : "None";
    },
  },
  {
    accessorKey: "assignee_id",
    header: "Assignee",
    cell: ({ row }) => row.original.assignee_id || "Unassigned",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => formatDate(row.original.due_date),
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => formatDate(row.original.updated_at),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <TaskActions task={row.original} />,
  },
];
