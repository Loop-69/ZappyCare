
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/layout/PageLayout";
import { PatientMedicalRecords } from "@/components/patient-dashboard/PatientMedicalRecords";
import { Eye } from "lucide-react";

const PatientDashboard = () => {
  const { id } = useParams();

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient-dashboard", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading patient data...</div>;

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <PageLayout
      title="Medical Records"
      description="Your health story"
      className="bg-gray-50"
    >
      <PatientMedicalRecords patientId={patient.id} />
    </PageLayout>
  );
};

export default PatientDashboard;
