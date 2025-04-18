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
import { NavigateFunction } from "react-router-dom";
import { Patient } from "@/types/patient-types"; // Import the Patient type

// Use the Patient type directly for column definitions
export type PatientData = Patient;

export const getPatientColumns = (navigate: NavigateFunction, onEditClick: (patient: PatientData) => void): ColumnDef<PatientData>[] => {
  return [
    {
      accessorKey: "patient_info",
      header: "PATIENT",
      cell: ({ row }) => {
        const patient = row.original;
        const fullName = `${patient.first_name} ${patient.last_name}`;
        const email = patient.email;
        const phone = patient.phone;

        return (
          <div className="flex flex-col">
            <Link to={`/patients/${patient.id}`} className="text-blue-600 hover:underline font-medium">
              {fullName}
            </Link>
            {email && (
              <Link to={`/patients/${patient.id}`} className="text-muted-foreground text-sm hover:underline">
                {email}
              </Link>
            )}
            {phone && (
              <span className="text-muted-foreground text-sm">{phone}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "TAGS",
      cell: ({ row }) => {
        const tags = row.original.medical_conditions; // Assuming medical_conditions can be used as tags
        return tags && tags.length > 0 ? tags.join(", ") : "No Tags";
      },
    },
    {
      accessorKey: "subscription_plan",
      header: "SUBSCRIPTION PLAN",
      cell: ({ row }) => {
        // Subscription plan is not in Patient type, using a placeholder
        return "None";
      },
    },
    {
      accessorKey: "next_appointment",
      header: "NEXT APPOINTMENT",
      cell: ({ row }) => {
        // Next appointment is not in Patient type, using a placeholder
        return "None scheduled";
      },
    },
    {
      accessorKey: "doctor",
      header: "DOCTOR",
      cell: ({ row }) => {
        const doctor = row.original.doctor_id; // Assuming doctor_id is the doctor
        return doctor || "Not assigned";
      },
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => {
        const patient = row.original;

        return (
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => onEditClick(patient)}
          >
            <span className="sr-only">Edit patient</span>
            <Edit className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];
};
