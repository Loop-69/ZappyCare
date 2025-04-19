
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronsUpDown } from "lucide-react";
import { Provider } from "@/types";

interface ProviderColumnsProps {
  onEdit: (provider: Provider) => void;
  onDelete: (providerId: string) => void; // Assuming delete uses ID
}

export const ProviderColumns = ({ onEdit, onDelete }: ProviderColumnsProps): ColumnDef<Provider>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Provider Name
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "specialty",
      header: "Specialty",
      cell: ({ row }) => (
        <Badge variant="secondary"> {/* Assuming secondary variant for specialty badge */}
          {row.getValue("specialty")}
        </Badge>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => {
        const provider = row.original;
        return (
          <div>
            <div>{provider.email}</div>
            <div>{provider.phone}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "states_authorized",
      header: "States Authorized",
      cell: ({ row }) => {
        const states = row.original.states_authorized;
        return (
          <div className="flex flex-wrap gap-1">
            {states?.map(state => (
              <Badge key={state} variant="secondary"> {/* Assuming secondary variant for state badges */}
                {state}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.getValue("status") === "Active" ? "default" : "secondary" // Using default for green and secondary for grey
          }
        >
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const provider = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(provider)} // Call onEdit function
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(provider.id)} // Call onDelete function
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
};
