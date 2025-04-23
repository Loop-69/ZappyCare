import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface InvoiceColumnsProps {
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export const getInvoiceColumns = ({
  onView,
  onEdit,
  onDelete,
}: InvoiceColumnsProps): ColumnDef<Invoice>[] => [
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
    accessorKey: "issue_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CREATED AT
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        {format(new Date(row.original.issue_date), "MMM dd, yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "patient_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NAME
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.original.patient_name}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          EMAIL
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: "invoice_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          INVOICE ID
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.original.invoice_id}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          STATUS
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={`${
            status === "Paid"
              ? "bg-green-100 text-green-600 hover:bg-green-100"
              : status === "Unpaid"
              ? "bg-red-100 text-red-600 hover:bg-red-100" 
              : status === "Overdue"
              ? "bg-amber-100 text-amber-600 hover:bg-amber-100"
              : "bg-blue-100 text-blue-600 hover:bg-blue-100"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          INVOICE AMOUNT ($)
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-right">${row.original.amount.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "amount_paid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          AMOUNT PAID ($)
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-right">${row.original.amount_paid.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "dueAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          DUE AMOUNT ($)
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dueAmount = row.original.amount - row.original.amount_paid;
      return <div className="text-right">${dueAmount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "refunded_amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          REFUNDED AMOUNT ($)
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-right">${(row.original.refunded_amount || 0).toFixed(2)}</div>
    ),
  },
  
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onView(row.original)} title="View Invoice">
          <Eye className="h-4 w-4 text-blue-500" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onEdit(row.original)} title="Edit Invoice">
          <Edit className="h-4 w-4 text-amber-500" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => {
            if (confirm('Are you sure you want to delete this invoice?')) {
              onDelete(row.original)
            }
          }} 
          title="Delete Invoice"
          className="hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
  },
];
