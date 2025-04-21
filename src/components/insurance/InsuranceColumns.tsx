import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { InsuranceActions } from "./InsuranceActions";

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return format(new Date(dateString), "MM/dd/yyyy");
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    "Pending": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "Verified": "bg-green-100 text-green-800 hover:bg-green-200",
    "Rejected": "bg-red-100 text-red-800 hover:bg-red-200"
  };
  
  return (
    <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"} variant="outline">
      {status}
    </Badge>
  );
};

export const InsuranceColumns: ColumnDef<any>[] = [
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
    id: "patient",
    header: "Patient",
    accessorFn: (row) => {
      const patient = row.patients;
      return patient ? `${patient.first_name} ${patient.last_name}` : "Unassigned";
    },
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "insurance_provider",
    header: "Insurance Provider",
  },
  {
    accessorKey: "provider_type",
    header: "Provider Type",
  },
  {
    accessorKey: "policy_number",
    header: "Policy Number",
  },
  {
    accessorKey: "verification_status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.verification_status} />,
  },
  {
    accessorKey: "prior_authorization_required",
    header: "Prior Auth",
    cell: ({ row }) => row.original.prior_authorization_required ? "Yes" : "No",
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => formatDate(row.original.updated_at),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <InsuranceActions record={row.original} iconOnly />,
  },
];
