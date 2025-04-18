
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const {
    patientsCount,
    todaySessions,
    pendingOrders,
    newConsultations,
    tasks,
    pendingForms,
    isLoading
  } = useDashboardData();

  return (
    <PageLayout 
      title="Provider Dashboard"
      description="Supporting your patients' health journey"
    >
      <DashboardContent 
        patientsCount={patientsCount}
        todaySessions={todaySessions}
        pendingOrders={pendingOrders}
        newConsultations={newConsultations}
        tasks={tasks}
        pendingForms={pendingForms}
        isLoading={isLoading}
      />
    </PageLayout>
  );
};

export default Dashboard;
