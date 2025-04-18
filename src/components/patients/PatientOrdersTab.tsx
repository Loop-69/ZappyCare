
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Package, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types";
import { AddOrderDialog } from "@/components/orders/AddOrderDialog";

interface PatientOrdersTabProps {
  patientId: string;
}

export function PatientOrdersTab({ patientId }: PatientOrdersTabProps) {
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ["patient-orders", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("patient_id", patientId)
        .order("order_date", { ascending: false });
        
      if (error) throw error;
      return data as Order[];
    },
  });

  useEffect(() => {
    // Listen for the custom event to refetch orders
    const handleRefetchOrders = () => {
      queryClient.invalidateQueries({ queryKey: ["patient-orders", patientId] });
    };

    window.addEventListener('refetch-orders', handleRefetchOrders);
    
    return () => {
      window.removeEventListener('refetch-orders', handleRefetchOrders);
    };
  }, [queryClient, patientId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleOrderSuccess = () => {
    // Invalidate and refetch patient orders query
    queryClient.invalidateQueries({
      queryKey: ["patient-orders", patientId]
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Orders</h2>
        <Button onClick={() => setIsAddOrderDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white border rounded-md p-4 flex justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Order #{order.id.substring(0, 8)}</span>
                </div>
                <p className="text-muted-foreground">
                  {format(new Date(order.order_date), "PPP")}
                </p>
                <p className="font-medium">${order.total_amount.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end">
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    // Dispatch a custom event to open the view details dialog
                    window.dispatchEvent(new CustomEvent('view-order-details', {
                      detail: { orderId: order.id }
                    }));
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <ShoppingCart className="h-8 w-8 mx-auto text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No orders yet</h3>
          <p className="text-muted-foreground mb-4">
            This patient hasn't placed any orders.
          </p>
          <Button onClick={() => setIsAddOrderDialogOpen(true)}>
            Create First Order
          </Button>
        </div>
      )}

      <AddOrderDialog 
        open={isAddOrderDialogOpen}
        onOpenChange={setIsAddOrderDialogOpen}
        onSuccess={handleOrderSuccess}
        patientId={patientId}
      />
    </div>
  );
}
