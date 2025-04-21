import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";

interface OrderActionsProps {
  order: Order;
  iconOnly?: boolean;
}

function OrderActions({ order, iconOnly }: OrderActionsProps) {
  const navigate = useNavigate();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleViewDetails = () => {
    setIsViewOpen(true);
  };

  const handleEditOrder = () => {
    // For now, just show a toast as edit functionality would need a separate dialog/form
    toast({
      title: "Edit Order",
      description: `Editing order ${order.id.substring(0, 8)}...`,
    });
    // Future implementation could navigate to an edit page or open an edit dialog
    // navigate(`/orders/edit/${order.id}`);
  };

  const handleCancelOrder = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Order Cancelled",
        description: `Order ${order.id.substring(0, 8)}... has been cancelled successfully.`,
      });

      // Close the dialog
      setIsCancelDialogOpen(false);

      // This will cause the table to refresh
      window.dispatchEvent(new CustomEvent('refetch-orders'));
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "There was an error cancelling the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
          <DropdownMenuItem onClick={handleViewDetails}>View Details</DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditOrder}>Edit Order</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsCancelDialogOpen(true)}
            disabled={order.status === "cancelled" || order.status === "shipped"}
            className={order.status === "cancelled" || order.status === "shipped" ? "text-muted-foreground" : "text-red-500"}
          >
            Cancel Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Order Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order ID: {order.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Order Date:</div>
              <div>{format(new Date(order.order_date), "PPP")}</div>

              <div className="font-medium">Status:</div>
              <div>
                <Badge
                  variant={
                    order.status === "shipped" ? "default" :
                    order.status === "cancelled" ? "destructive" :
                    "secondary"
                  }
                >
                  {order.status}
                </Badge>
              </div>

              <div className="font-medium">Total Amount:</div>
              <div>${order.total_amount.toFixed(2)}</div>

              <div className="font-medium">Payment Method:</div>
              <div>{order.payment_method || "Not specified"}</div>

              <div className="font-medium">Notes:</div>
              <div>{order.notes || "No notes"}</div>

              {order.shipping_address && (
                <>
                  <div className="font-medium">Shipping Address:</div>
                  <div>{JSON.stringify(order.shipping_address)}</div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isProcessing}
            >
              {isProcessing ? "Cancelling..." : "Yes, Cancel Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


export const pendingOrderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "order_date",
    header: "ORDER DATE",
    cell: ({ row }) => format(new Date(row.getValue("order_date")), "PP"),
  },
  {
    accessorKey: "patient_id", // Assuming patient_id can be used to display patient name
    header: "PATIENT",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("patient_id")}
      </div>
    ),
  },
  {
    accessorKey: "medication",
    header: "MEDICATION",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("medication")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "shipped" ? "default" :
            status === "cancelled" ? "destructive" :
            "secondary"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "session_id", // Assuming session_id can be used for linked session
    header: "LINKED SESSION",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("session_id")}
      </div>
    ),
  },
  {
    accessorKey: "pharmacy_id", // Assuming pharmacy_id can be used for pharmacy name
    header: "PHARMACY",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("pharmacy_id")}
      </div>
    ),
  },
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <OrderActions order={row.original} iconOnly />,
  },
];

export const processingOrderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "order_date",
    header: "ORDER DATE",
    cell: ({ row }) => format(new Date(row.getValue("order_date")), "PP"),
  },
  {
    accessorKey: "patient_id", // Assuming patient_id can be used to display patient name
    header: "PATIENT",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("patient_id")}
      </div>
    ),
  },
  {
    accessorKey: "medication",
    header: "MEDICATION",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("medication")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "shipped" ? "default" :
            status === "cancelled" ? "destructive" :
            "secondary"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "pharmacy_id", // Assuming pharmacy_id can be used for pharmacy name
    header: "PHARMACY",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("pharmacy_id")}
      </div>
    ),
  },
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <OrderActions order={row.original} iconOnly />,
  },
];

export const shippedOrderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "order_date",
    header: "ORDER DATE",
    cell: ({ row }) => format(new Date(row.getValue("order_date")), "PP"),
  },
  {
    accessorKey: "patient_id", // Assuming patient_id can be used to display patient name
    header: "PATIENT",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("patient_id")}
      </div>
    ),
  },
  {
    accessorKey: "medication",
    header: "MEDICATION",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("medication")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "shipped" ? "default" :
            status === "cancelled" ? "destructive" :
            "secondary"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "tracking", // Assuming 'tracking' field exists in Order type
    header: "TRACKING",
    cell: ({ row }) => (
      <div className="font-medium">
        {/* Display tracking information */}
        {/* row.getValue("tracking") */}
        N/A
      </div>
    ),
  },
  {
    accessorKey: "est_delivery", // Assuming 'est_delivery' field exists in Order type
    header: "EST. DELIVERY",
    cell: ({ row }) => (
      <div className="font-medium">
        {/* Display estimated delivery date */}
        {/* row.getValue("est_delivery") */}
        N/A
      </div>
    ),
  },
  {
    accessorKey: "pharmacy_id", // Assuming pharmacy_id can be used for pharmacy name
    header: "PHARMACY",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("pharmacy_id")}
      </div>
    ),
  },
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <OrderActions order={row.original} iconOnly />,
  },
];
