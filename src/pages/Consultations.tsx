
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/layout/PageLayout";
import { DataTable } from "@/components/ui/data-table";
import { consultationColumns } from "@/components/consultations/ConsultationColumns";
import AddConsultationDialog from "@/components/consultations/AddConsultationDialog";
import { toast } from "@/components/ui/sonner";

const Consultations = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: consultations = [], isLoading, refetch } = useQuery({
    queryKey: ["consultations"],
    queryFn: async () => {
      try {
        // Modified query to not join with patients table since the foreign key relationship isn't set up properly
        const { data, error } = await supabase
          .from("consultations")
          .select("*")
          .order("date_submitted", { ascending: false });
        
        if (error) {
          toast.error("Failed to fetch consultations");
          console.error("Error fetching consultations:", error);
          return [];
        }
        
        // Fetch patient details separately
        if (data && data.length > 0) {
          const patientIds = [...new Set(data.map(item => item.patient_id))];
          const { data: patientsData } = await supabase
            .from("patients")
            .select("id, first_name, last_name, email")
            .in("id", patientIds);
          
          // Map patient data to consultations
          return data.map(consultation => ({
            ...consultation,
            patients: patientsData?.find(patient => patient.id === consultation.patient_id)
          }));
        }
        
        return data || [];
      } catch (error) {
        console.error("Error in consultations query:", error);
        toast.error("An error occurred while fetching consultations");
        return [];
      }
    },
  });

  const handleAddSuccess = () => {
    refetch();
    setIsAddDialogOpen(false);
    toast.success("Consultation added successfully");
  };

  return (
    <PageLayout
      title="Consultations"
      action={{
        label: "Add Consultation",
        onClick: () => setIsAddDialogOpen(true),
        icon: <Plus />,
      }}
      isLoading={isLoading}
    >
      <DataTable
        columns={consultationColumns}
        data={consultations}
        filterKey="service"
        searchPlaceholder="Search consultations..."
        noDataMessage="No consultations found"
      />
      
      <AddConsultationDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />
    </PageLayout>
  );
};

export default Consultations;
