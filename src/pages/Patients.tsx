import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/layout/PageLayout";
import { DataTable } from "@/components/ui/data-table";
import { getPatientColumns, PatientData } from "@/components/patients/PatientColumns"; // Import PatientData type
import AddPatientDialog from "@/components/patients/AddPatientDialog";
import { EditPatientDialog } from "@/components/patients/EditPatientDialog"; // Import EditPatientDialog
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react"; // Import Search icon
import { Input } from "@/components/ui/input"; // Import Input component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { Button } from "@/components/ui/button"; // Import Button component

const Patients = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for edit modal
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null); // State for selected patient
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  const handleEditClick = (patient: PatientData) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
  };

  const columns = getPatientColumns(navigate, handleEditClick); // Pass handleEditClick to getPatientColumns

  const { data: patients = [], isLoading, refetch } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select(`
            id,
            first_name,
            last_name,
            date_of_birth,
            gender,
            email,
            phone,
            address,
            insurance_provider,
            insurance_policy_number,
            created_at,
            status,
            doctor_id,
            blood_type,
            medical_conditions,
            allergies,
            updated_at
          `)
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

  const filterPatients = (patients: PatientData[], term: string, status: string) => {
    return patients.filter(patient => {
      const matchesSearch = term === "" || 
                            patient.first_name.toLowerCase().includes(term.toLowerCase()) ||
                            patient.last_name.toLowerCase().includes(term.toLowerCase()) ||
                            patient.email?.toLowerCase().includes(term.toLowerCase()) ||
                            patient.phone?.includes(term);
      const matchesStatus = status === "" || status === "all" || patient.status === status;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredPatients = filterPatients(patients, searchTerm, statusFilter);

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
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem> {/* Changed value from "" to "all" */}
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              {/* Add other status filter options here */}
            </SelectContent>
          </Select>

          {/* Placeholder for Name filter - functionality not implemented yet */}
          <Select disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost">Advanced Filters</Button>
        </div>

        {/* Patient Table */}
        <DataTable
          columns={columns}
          data={filteredPatients}
          noDataMessage="No patients found"
        />
      </div>
      
      <AddPatientDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Patient Dialog */}
      {selectedPatient && (
        <EditPatientDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={refetch} // Refetch patients after successful edit
          patient={selectedPatient}
        />
      )}
    </PageLayout>
  );
};

export default Patients;
