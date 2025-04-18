import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Percent, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Discount } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import PageLayout from "@/components/layout/PageLayout";
import { AddDiscountDialog } from "@/components/discounts/AddDiscountDialog";
import DiscountColumns from "@/components/discounts/DiscountColumns";
import { Button } from "@/components/ui/button";

const Discounts = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { 
    data: discounts, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["discounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Discount[];
    }
  });

  useEffect(() => {
    const handleDiscountUpdated = () => {
      refetch();
    };

    window.addEventListener('discount-updated', handleDiscountUpdated);
    return () => {
      window.removeEventListener('discount-updated', handleDiscountUpdated);
    };
  }, [refetch]);

  return (
    <>
      <PageLayout 
        title="Discounts" 
        action={{
          label: "New Discount",
          onClick: () => setIsAddDialogOpen(true),
          icon: <Plus size={16} />,
        }}
      >
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              Loading discounts...
            </div>
          ) : discounts && discounts.length > 0 ? (
            <DataTable 
              columns={DiscountColumns} 
              data={discounts}
              filterKey="name"
              searchPlaceholder="Search discounts..."
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Percent size={48} className="text-muted-foreground" />
              <div className="text-xl font-semibold text-muted-foreground">
                No discounts found
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                Create a Discount
              </Button>
            </div>
          )}
        </div>
      </PageLayout>

      <AddDiscountDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onDiscountAdded={refetch}
      />
    </>
  );
};

export default Discounts;
