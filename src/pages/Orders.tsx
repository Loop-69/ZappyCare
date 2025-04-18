
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types";
import PageLayout from "@/components/layout/PageLayout";
import { DataTable } from "@/components/ui/data-table";
import { pendingOrderColumns, processingOrderColumns, shippedOrderColumns } from "@/components/orders/OrderColumns";
import { AddOrderDialog } from "@/components/orders/AddOrderDialog";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const Orders = () => {
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = searchTerm === "" ||
                          order.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) || // Assuming patient_id can be used for search
                          order.medication?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  const pendingOrders = filteredOrders.filter(order => order.status === 'pending');
  const processingOrders = filteredOrders.filter(order => order.status === 'processing');
  const shippedOrders = filteredOrders.filter(order => order.status === 'shipped');


  return (
    <PageLayout
      title="Orders"
      isLoading={isLoading}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Orders</h2>
        <Button onClick={() => setIsAddOrderDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient or medication..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select onValueChange={setStatusFilter} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              {/* Add other status options as needed */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Pending Orders</h3>
          <DataTable
            columns={pendingOrderColumns}
            data={pendingOrders}
            noDataMessage="No pending orders found."
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Processing Orders</h3>
          <DataTable
            columns={processingOrderColumns}
            data={processingOrders}
            noDataMessage="No processing orders found."
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Recent Shipped Orders</h3>
          <DataTable
            columns={shippedOrderColumns}
            data={shippedOrders}
            noDataMessage="No shipped orders found."
          />
        </div>
      </div>


      <AddOrderDialog
        open={isAddOrderDialogOpen}
        onOpenChange={setIsAddOrderDialogOpen}
        onSuccess={handleOrderSuccess}
      />
    </PageLayout>
  );
};

export default Orders;
