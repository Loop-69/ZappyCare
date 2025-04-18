import { ColumnDef } from "@tanstack/react-table";
import { Discount } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { EditDiscountDialog } from "./EditDiscountDialog";

const DiscountColumns: ColumnDef<Discount>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const discount = row.original;
      return (
        <div className="font-medium">
          {discount.name}
          {discount.status === 'Inactive' && (
            <Badge variant="outline" className="ml-2 text-muted-foreground">
              Inactive
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Discount Code",
    cell: ({ row }) => row.original.code,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const discount = row.original;
      return (
        <Badge variant={discount.type === 'Percentage' ? 'secondary' : 'outline'}>
          {discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`}
        </Badge>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const startDate = row.original.start_date;
      return startDate ? format(new Date(startDate), 'PP') : 'N/A';
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      const endDate = row.original.end_date;
      return endDate ? format(new Date(endDate), 'PP') : 'Ongoing';
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const discount = row.original;
      const [isEditOpen, setIsEditOpen] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setIsEditOpen(true)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // TODO: Implement delete functionality
                  console.log('Delete discount', discount);
                }}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <EditDiscountDialog 
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            discount={discount}
            onDiscountUpdated={() => {
              // Refetch discounts data
              const event = new CustomEvent('discount-updated');
              window.dispatchEvent(event);
            }}
          />
        </>
      );
    },
  },
];

export default DiscountColumns;
