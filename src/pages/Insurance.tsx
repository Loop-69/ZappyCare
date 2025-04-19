import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { InsuranceColumns } from "@/components/insurance/InsuranceColumns";
import { AddInsuranceDialog } from "@/components/insurance/AddInsuranceDialog";
import PageLayout from "@/components/layout/PageLayout";
import { toast } from "@/components/ui/sonner";
import { InsuranceRecord } from "@/types/insurance-types";
import { EditInsuranceDialog } from "@/components/insurance/EditInsuranceDialog"; // Import EditInsuranceDialog
import { InsuranceActions } from "@/components/insurance/InsuranceActions"; // Import InsuranceActions

export default function Insurance() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for edit dialog
  const [selectedRecord, setSelectedRecord] = useState<InsuranceRecord | null>(null); // State for selected record

  const {
    data: insuranceRecords = [],
    isLoading,
    refetch
  } = useQuery<InsuranceRecord[]>({
    queryKey: ['insurance_records'],
    queryFn: async () => {
      try {
        // Fetch insurance records and join with patients
        const { data, error } = await supabase
          .from('insurance_records')
          .select('*, patients(id, first_name, last_name, email)')
          .order('created_at', { ascending: false });

        if (error) {
          toast.error("Failed to fetch insurance records");
          console.error("Error fetching insurance records:", error);
          return [];
        }

          // Process data to ensure patients property conforms to InsuranceRecord type
          const processedData: InsuranceRecord[] = data.map(record => {
            const patient = record.patients;
            let patientData: { id: string; first_name: string; last_name: string; email: string | null; } | null = null;

            if (
              patient &&
              typeof patient === 'object' &&
              patient !== null &&
              'id' in patient &&
              'first_name' in patient &&
              'last_name' in patient
            ) {
              // Use type assertion here as a workaround for persistent TS error
              const assertedPatient = patient as { id: string; first_name: string; last_name: string; email: string | null; };
              patientData = assertedPatient;
            }

            return {
              ...record,
              patients: patientData
            };
          });

        return processedData;
      } catch (error) {
        console.error("Error in insurance records query:", error);
        toast.error("An error occurred while fetching insurance records");
        return [];
      }
    }
  });

  const handleAddDialogClose = () => setIsAddDialogOpen(false);
  const handleEditDialogClose = () => { // Handler for closing edit dialog
    setIsEditDialogOpen(false);
    setSelectedRecord(null); // Clear selected record
  };

  const handleAddSuccess = () => {
    refetch();
    handleAddDialogClose();
    toast.success("Insurance record added successfully");
  };

  const handleEditSuccess = () => { // Handler for successful edit
    refetch();
    handleEditDialogClose();
    toast.success("Insurance record updated successfully");
  };

  const handleViewDetails = (record: InsuranceRecord) => { // Handler for "View Details"
    setSelectedRecord(record);
    setIsEditDialogOpen(true);
  };

  // Pass handleViewDetails to InsuranceColumns
  const columns = InsuranceColumns.map(column => {
    if (column.id === 'actions') {
      return {
        ...column,
        cell: ({ row }) => <InsuranceActions record={row.original} onViewDetails={handleViewDetails} />,
      };
    }
    return column;
  });


  return (
    <PageLayout
      title="Insurance Records"
      description="Manage and track insurance information"
      action={{
        label: "Add Insurance Record",
        onClick: () => setIsAddDialogOpen(true)
      }}
      isLoading={isLoading}
    >
      <DataTable
        columns={columns} // Use modified columns
        data={insuranceRecords}
        filterKey="insurance_provider"
        searchPlaceholder="Search insurance records..."
        noDataMessage="No insurance records found"
      />

      <AddInsuranceDialog
        open={isAddDialogOpen}
        onClose={handleAddDialogClose}
        onSuccess={handleAddSuccess}
      />

      {selectedRecord && ( // Render edit dialog only when a record is selected
        <EditInsuranceDialog
          open={isEditDialogOpen}
          onClose={handleEditDialogClose}
          onSuccess={handleEditSuccess}
          record={selectedRecord}
        />
      )}
    </PageLayout>
  );
}
