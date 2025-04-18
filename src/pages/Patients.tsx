
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/layout/PageLayout";
import { DataTable } from "@/components/ui/data-table";
import { patientColumns } from "@/components/patients/PatientColumns";
import AddPatientDialog from "@/components/patients/AddPatientDialog";
import { toast } from "@/components/ui/sonner";

const Patients = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: patients = [], isLoading, refetch } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          toast.error("Failed to fetch patients");
          console.error("Error fetching patients:", error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error("Unexpected error fetching patients:", error);
        toast.error("An unexpected error occurred");
        return [];
      }
    },
  });

  const handleAddSuccess = () => {
    refetch();
    setIsAddDialogOpen(false);
    toast.success("Patient added successfully");
  };

  return (
    <PageLayout
      title="Patients"
      action={{
        label: "Add Patient",
        onClick: () => setIsAddDialogOpen(true),
        icon: <Plus />,
      }}
      isLoading={isLoading}
    >
      <DataTable
        columns={patientColumns}
        data={patients}
        filterKey="last_name"
        searchPlaceholder="Search patients..."
        noDataMessage="No patients found"
      />
      
      <AddPatientDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />
    </PageLayout>
  );
};

export default Patients;
