
import React from "react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { SessionsList } from "@/components/dashboard/SessionsList";
import { TasksList } from "@/components/dashboard/TasksList";
import { ConsultationsList } from "@/components/dashboard/ConsultationsList";
import { PendingFormsList } from "@/components/dashboard/PendingFormsList";
import type { Session, Task, Consultation, PendingForm } from "@/types";

interface DashboardContentProps {
  patientsCount: number | null;
  todaySessions: Session[] | null;
  pendingOrders: number | null;
  newConsultations: Consultation[] | null;
  tasks: Task[] | null;
  pendingForms: PendingForm[] | null;
  isLoading: boolean;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  patientsCount,
  todaySessions,
  pendingOrders,
  newConsultations,
  tasks,
  pendingForms,
  isLoading
}) => {
  return (
    <>
      <DashboardStats 
        patientsCount={patientsCount}
        todaySessions={todaySessions}
        pendingOrders={pendingOrders}
        newConsultations={newConsultations}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SessionsList 
          sessions={todaySessions || []} 
          isLoading={isLoading}
        />

        <TasksList 
          tasks={tasks || []} 
          isLoading={isLoading}
        />

        <ConsultationsList 
          consultations={newConsultations || []} 
          isLoading={isLoading}
        />

        <PendingFormsList 
          forms={pendingForms || []} 
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
