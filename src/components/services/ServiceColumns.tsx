import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ServiceActions } from "./ServiceActions";
import { ServiceWithRelations } from "@/types/service";

export const ServiceColumns: ColumnDef<ServiceWithRelations>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Service Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[250px] truncate">
        {row.original.description || "N/A"}
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      return (
        <Badge
          variant={status === "Active" ? "default" : "secondary"}
          className={status === "Active" ? "bg-green-500" : "bg-gray-500"}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "requires_consultation",
    accessorKey: "requires_consultation",
    header: "Requires Consultation",
    cell: ({ row }) => (
      <Checkbox
        checked={row.original.requires_consultation}
        disabled
      />
    ),
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return <div>{format(date, "MMM d, yyyy")}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ServiceActions record={row.original} iconOnly />,
  },
];
