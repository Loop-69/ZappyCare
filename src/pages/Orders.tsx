
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types";
import PageLayout from "@/components/layout/PageLayout";
import { DataTable } from "@/components/ui/data-table";
import { orderColumns } from "@/components/orders/OrderColumns";
import { AddOrderDialog } from "@/components/orders/AddOrderDialog";
import { toast } from "@/components/ui/use-toast";

const Orders = () => {
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*');
      
      if (error) throw error;
      // Cast the data to Order[] since we're adapting it to our frontend type
      return data as unknown as Order[];
    }
  });

  useEffect(() => {
    // Listen for the custom event to refetch orders
    const handleRefetchOrders = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    window.addEventListener('refetch-orders', handleRefetchOrders);
    
    return () => {
      window.removeEventListener('refetch-orders', handleRefetchOrders);
    };
  }, [queryClient]);

  const handleOrderSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    toast({
      title: "Order Created",
      description: "Order has been successfully added to the system.",
    });
  };

  return (
    <PageLayout 
      title="Orders" 
      isLoading={isLoading}
      action={{
        label: "Add Order",
        onClick: () => setIsAddOrderDialogOpen(true)
      }}
    >
      {orders && (
        <DataTable 
          columns={orderColumns} 
          data={orders} 
          filterKey="status"
          searchPlaceholder="Search orders..."
        />
      )}

      <AddOrderDialog 
        open={isAddOrderDialogOpen} 
        onOpenChange={setIsAddOrderDialogOpen}
        onSuccess={handleOrderSuccess}
      />
    </PageLayout>
  );
};

export default Orders;
