
import { useState } from "react";
import { Plus } from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import { AddPharmacyDialog } from "@/components/pharmacies/AddPharmacyDialog";
import { PharmacyTable } from "@/components/pharmacies/PharmacyTable";
import { PharmacyFilters } from "@/components/pharmacies/PharmacyFilters";
import { usePharmacies } from "@/hooks/usePharmacies";

const Pharmacies = () => {
  const [isAddPharmacyDialogOpen, setIsAddPharmacyDialogOpen] = useState(false);
  const { 
    pharmacies, 
    isLoading, 
    searchQuery, 
    setSearchQuery, 
    typeFilter, 
    setTypeFilter 
  } = usePharmacies();

  const handleOpenAddDialog = () => {
    setIsAddPharmacyDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddPharmacyDialogOpen(false);
  };

  return (
    <PageLayout
      title="Pharmacy Management"
      action={{
        label: "Add Pharmacy",
        onClick: handleOpenAddDialog,
        icon: <Plus className="h-4 w-4" />,
      }}
      isLoading={isLoading}
      filters={
        <PharmacyFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />
      }
    >
      <PharmacyTable 
        pharmacies={pharmacies || []} 
        isLoading={isLoading} 
      />
      
      <AddPharmacyDialog
        isOpen={isAddPharmacyDialogOpen}
        onClose={handleCloseAddDialog}
      />
    </PageLayout>
  );
};

export default Pharmacies;
