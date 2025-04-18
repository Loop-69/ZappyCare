
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Edit, Calendar, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientInfo } from "@/components/patients/PatientInfo";
import { PatientMedicalInfo } from "@/components/patients/PatientMedicalInfo";
import { PatientSubscription } from "@/components/patients/PatientSubscription";
import { PatientSessionsTab } from "@/components/patients/PatientSessionsTab";
import { PatientOrdersTab } from "@/components/patients/PatientOrdersTab";
import { PatientNotesTab } from "@/components/patients/PatientNotesTab";
import { PatientDocumentsTab } from "@/components/patients/PatientDocumentsTab";
import { PatientFormsTab } from "@/components/patients/PatientFormsTab";
import { PatientBillingTab } from "@/components/patients/PatientBillingTab";
import { EditPatientDialog } from "@/components/patients/EditPatientDialog";
import { Patient } from "@/types";

export default function PatientDetails() {
  const { id } = useParams();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const { 
    data: patientData, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Initialize addressData with default values
      let addressData = {
        city: '',
        state: '',
        zip_code: ''
      };
      
      // Handle the address field which may contain city, state, and zip_code
      if (data.address) {
        try {
          if (typeof data.address === 'string') {
            // Parse the string to an object
            const parsedAddress = JSON.parse(data.address);
            // Extract the relevant fields if they exist
            if (parsedAddress.city) addressData.city = parsedAddress.city;
            if (parsedAddress.state) addressData.state = parsedAddress.state;
            if (parsedAddress.zip_code) addressData.zip_code = parsedAddress.zip_code;
          } else if (typeof data.address === 'object') {
            // Extract the relevant fields if they exist from the object
            const addressObj = data.address as Record<string, any>;
            if (addressObj.city) addressData.city = addressObj.city;
            if (addressObj.state) addressData.state = addressObj.state;
            if (addressObj.zip_code) addressData.zip_code = addressObj.zip_code;
          }
        } catch (e) {
          console.error("Error parsing address data:", e);
        }
      }
      
      // Map database fields to our Patient interface
      const patient: Patient = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address,
        city: addressData.city,
        state: addressData.state,
        zip_code: addressData.zip_code,
        insurance_provider: data.insurance_provider || '',
        insurance_policy_number: data.insurance_policy_number || '',
        status: data.status || 'Active',
        doctor_id: data.doctor_id,
        blood_type: data.blood_type,
        medical_conditions: data.medical_conditions || [],
        allergies: data.allergies || [],
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      
      return patient;
    },
  });

  if (isLoading) return null;

  // Handle case if patient isn't found
  if (!patientData) {
    return (
      <PageLayout title="Patient Not Found" description="The requested patient could not be found.">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold mb-4">Patient Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The patient you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/patients">Back to Patients</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={patientData?.first_name + " " + patientData?.last_name}
      description={`Added ${format(new Date(patientData?.created_at), "MMM d, yyyy")}`}
    >
      <div className="space-y-6">
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <Link to={`/patient-dashboard/${patientData.id}`}>
              <Eye className="w-4 h-4 mr-2" />
              Patient View
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Patient Info</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <PatientInfo patient={patientData} />
              <PatientMedicalInfo patient={patientData} />
            </div>
            <PatientSubscription patient={patientData} />
          </TabsContent>
          
          <TabsContent value="sessions">
            <PatientSessionsTab patientId={patientData.id} />
          </TabsContent>
          
          <TabsContent value="orders">
            <PatientOrdersTab patientId={patientData.id} />
          </TabsContent>
          
          <TabsContent value="notes">
            <PatientNotesTab patientId={patientData.id} />
          </TabsContent>
          
          <TabsContent value="documents">
            <PatientDocumentsTab patientId={patientData.id} />
          </TabsContent>
          
          <TabsContent value="forms">
            <PatientFormsTab patientId={patientData.id} />
          </TabsContent>
          
          <TabsContent value="billing">
            <PatientBillingTab patientId={patientData.id} />
          </TabsContent>
        </Tabs>
      </div>

      <EditPatientDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={refetch}
        patient={patientData}
      />
    </PageLayout>
  );
}
