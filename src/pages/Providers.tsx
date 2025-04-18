
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { ProviderColumns } from "@/components/providers/ProviderColumns";
import { AddProviderDialog } from "@/components/providers/AddProviderDialog";
import PageLayout from "@/components/layout/PageLayout";
import { Provider } from "@/types";
import { toast } from "@/hooks/use-toast";

export default function Providers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { 
    data: providers = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        toast({
          title: "Error fetching providers",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Provider[];
    }
  });

  return (
    <PageLayout
      title="Providers"
      description="Manage and track medical providers"
      action={{
        label: "Add Provider",
        onClick: () => setIsDialogOpen(true)
      }}
    >
      <DataTable 
        columns={ProviderColumns} 
        data={providers} 
        filterKey="name" 
        searchPlaceholder="Search providers..."
      />
      
      <AddProviderDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </PageLayout>
  );
}
