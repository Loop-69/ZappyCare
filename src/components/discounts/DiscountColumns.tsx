import { ColumnDef } from "@tanstack/react-table";
import { Discount } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react"; 
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorBoundary } from "react-error-boundary";
import { DiscountActions } from "./DiscountActions";

interface DiscountColumnsProps {
  onEdit: (discount: Discount) => void;
  onDelete: (discount: Discount) => void;
}

const DiscountColumns = ({ onEdit, onDelete }: DiscountColumnsProps): ColumnDef<Discount>[] => {
  return [
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
      accessorKey: "name",
      header: "Discount",
      cell: ({ row }) => {
        const discount = row.original;
        return (
          <div className="font-medium">
            {discount.name}
            <div className="text-sm text-muted-foreground">
              {discount.description}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => row.original.code,
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => {
        const discount = row.original;
        return (
          <div>
            <div className="font-medium">
              {discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`}
            </div>
            <div className="text-sm text-muted-foreground">
              {discount.requirement ? `Min. purchase: $${discount.requirement}` : 'No minimum requirement'}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const discount = row.original;
        const statusVariant = discount.status === 'Active' ? 'default' : 'outline'; // Assuming 'default' is green
        return (
          <Badge variant={statusVariant}>
            {discount.status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "validity",
      header: "Validity",
      cell: ({ row }) => {
        const discount = row.original;
        const startDate = discount.start_date ? new Date(discount.start_date) : null;
        const endDate = discount.end_date ? new Date(discount.end_date) : null;
        const now = new Date();

        if (startDate && endDate) {
          if (now >= startDate && now <= endDate) {
            return format(endDate, 'PP');
          } else if (now < startDate) {
            return `Starts ${format(startDate, 'PP')}`;
          } else {
            return 'Expired';
          }
        } else if (startDate) {
          if (now >= startDate) {
            return 'Ongoing';
          } else {
            return `Starts ${format(startDate, 'PP')}`;
          }
        } else if (endDate) {
          if (now <= endDate) {
            return format(endDate, 'PP');
          } else {
            return 'Expired';
          }
        } else {
          return 'No expiration';
        }
      },
    },
    {
      accessorKey: "usage_count",
      header: "Usage",
      cell: ({ row }) => {
        const discount = row.original;
        return `${discount.usage_count ?? 0} uses`;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DiscountActions 
          discount={row.original} 
          iconOnly 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
};

export default DiscountColumns;
