
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { ServiceColumns } from "@/components/services/ServiceColumns";
import { AddServiceDialog } from "@/components/services/AddServiceDialog";
import PageLayout from "@/components/layout/PageLayout";
import { ServiceWithRelations } from "@/types/service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Services() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const queryClient = useQueryClient();
  
  const { 
    data: services = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform data to ensure it matches the ServiceWithRelations type
      const servicesWithRelations: ServiceWithRelations[] = data.map(service => ({
        ...service,
        // Ensure status is strictly 'Active' or 'Inactive'
        status: service.status === 'Active' ? 'Active' : 'Inactive',
        // Ensure requires_consultation is boolean
        requires_consultation: Boolean(service.requires_consultation),
        products: [],
        plans: []
      }));
      
      return servicesWithRelations;
    }
  });

  // Filter services based on active tab
  const filteredServices = services.filter(service => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return service.status === "Active";
    if (activeTab === "inactive") return service.status === "Inactive";
    return true;
  });

  const handleAddServiceSuccess = () => {
    // Close the dialog
    setIsDialogOpen(false);
    // Refetch services data
    queryClient.invalidateQueries({
      queryKey: ['services'],
    });
  };

  return (
    <PageLayout
      title="Services"
      description="Manage healthcare services offered to patients"
      action={{
        label: "Add Service",
        onClick: () => setIsDialogOpen(true),
        icon: <PlusCircle className="h-4 w-4" />
      }}
    >
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Services</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <DataTable 
          columns={ServiceColumns} 
          data={filteredServices} 
          filterKey="name" 
          searchPlaceholder="Search services..."
          noDataMessage="No services found. Create your first service!"
        />
      </div>

      <AddServiceDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleAddServiceSuccess}
      />
    </PageLayout>
  );
}
