
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { PatientStats } from "@/components/patients-dashboard/PatientStats";

const PatientsDashboard = () => {
  return (
    <PageLayout title="Patients Dashboard" description="Patient statistics and metrics">
      <PatientStats />
    </PageLayout>
  );
};

export default PatientsDashboard;
