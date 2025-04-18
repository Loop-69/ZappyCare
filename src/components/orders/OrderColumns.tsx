
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

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "order_date",
    header: "Order Date",
    cell: ({ row }) => format(new Date(row.getValue("order_date")), "PP"),
  },
  {
    accessorKey: "total_amount",
    header: "Total Amount",
    cell: ({ row }) => `$${parseFloat(String(row.getValue("total_amount"))).toFixed(2)}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge 
          variant={
            status === "delivered" ? "default" :
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      
      return <OrderActions order={order} />;
    },
  },
];

interface OrderActionsProps {
  order: Order;
}

function OrderActions({ order }: OrderActionsProps) {
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
            disabled={order.status === "cancelled" || order.status === "delivered"}
            className={order.status === "cancelled" || order.status === "delivered" ? "text-muted-foreground" : "text-red-500"}
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
                    order.status === "delivered" ? "default" :
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
