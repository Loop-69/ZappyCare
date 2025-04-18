
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { PatientMedicalRecords } from "@/components/patient-dashboard/PatientMedicalRecords";
import { useParams } from "react-router-dom";

const Records = () => {
  const { id } = useParams();

  return (
    <PageLayout title="Medical Records" description="Your health story">
      <div className="space-y-6 bg-gray-50">
        <PatientMedicalRecords patientId={id || ''} />
      </div>
    </PageLayout>
  );
};

export default Records;
