
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { InsuranceColumns } from "@/components/insurance/InsuranceColumns";
import PageLayout from "@/components/layout/PageLayout";
import { toast } from "@/components/ui/sonner";
import { InsuranceRecordDialog } from "@/components/insurance/InsuranceRecordDialog";

export default function Insurance() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: insuranceRecords = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['insurance_records'],
    queryFn: async () => {
      try {
        // Fetch insurance records without joining with patients
        const { data, error } = await supabase
          .from('insurance_records')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          toast.error("Failed to fetch insurance records");
          console.error("Error fetching insurance records:", error);
          return [];
        }

        // If we have records, fetch the related patient data separately
        if (data && data.length > 0) {
          const patientIds = [...new Set(data.filter(record => record.patient_id).map(record => record.patient_id))];

          if (patientIds.length > 0) {
            const { data: patientsData, error: patientsError } = await supabase
              .from("patients")
              .select("id, first_name, last_name, email")
              .in("id", patientIds);

            if (patientsError) {
              console.error("Error fetching patients:", patientsError);
            }

            // Combine insurance records with patient data
            return data.map(record => ({
              ...record,
              patients: patientsData?.find(patient => patient.id === record.patient_id) || null
            }));
          }
        }

        return data || [];
      } catch (error) {
        console.error("Error in insurance records query:", error);
        toast.error("An error occurred while fetching insurance records");
        return [];
      }
    }
  });

  const handleDialogClose = () => setIsDialogOpen(false);

  const handleSuccess = () => {
    refetch();
    handleDialogClose();
    toast.success("Insurance record added successfully");
  };

  return (
    <PageLayout
      title="Insurance Records"
      description="Manage and track insurance information"
      action={{
        label: "Add Insurance Record",
        onClick: () => setIsDialogOpen(true)
      }}
      isLoading={isLoading}
    >
      <DataTable
        columns={InsuranceColumns}
        data={insuranceRecords}
        filterKey="insurance_provider"
        searchPlaceholder="Search insurance records..."
        noDataMessage="No insurance records found"
      />

      <InsuranceRecordDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />
    </PageLayout>
  );
}
