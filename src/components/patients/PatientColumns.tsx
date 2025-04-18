
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

type PatientData = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  status: string;
  created_at: string;
};

export const patientColumns: ColumnDef<PatientData>[] = [
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string | null;
      return phone || "—";
    },
  },
  {
    accessorKey: "date_of_birth",
    header: "Date of Birth",
    cell: ({ row }) => {
      const dob = row.getValue("date_of_birth") as string | null;
      return dob ? format(new Date(dob), "MMM d, yyyy") : "—";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      let color: "default" | "secondary" | "destructive" | "outline" = "default";
      switch (status) {
        case "Active":
          color = "default";
          break;
        case "Inactive":
          color = "secondary";
          break;
        case "Pending":
          color = "outline";
          break;
        default:
          color = "default";
      }
      
      return <Badge variant={color}>{status}</Badge>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Registration Date",
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string | null;
      if (!createdAt) return "—";
      
      try {
        const date = new Date(createdAt);
        // Check if the date is valid
        if (isNaN(date.getTime())) {
          return "Invalid date";
        }
        return format(date, "MMM d, yyyy");
      } catch (error) {
        console.error("Error formatting date:", error, createdAt);
        return "Invalid date";
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/patients/${patient.id}`} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit Patient
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete Patient
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
