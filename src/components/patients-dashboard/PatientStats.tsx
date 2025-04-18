
import { Users, Activity, CalendarDays, FileText } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { usePatientStats } from "@/hooks/usePatientStats";

export const PatientStats = () => {
  const { data: stats, isLoading } = usePatientStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard 
        icon={Users}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        label="Total Patients"
        value={isLoading ? "-" : stats?.totalPatients}
      />
      <StatsCard 
        icon={Activity}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        label="Active Patients (30d)"
        value={isLoading ? "-" : stats?.activePatients}
      />
      <StatsCard 
        icon={CalendarDays}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
        label="Upcoming Sessions"
        value={isLoading ? "-" : stats?.upcomingSessions}
      />
      <StatsCard 
        icon={FileText}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
        label="Recent Forms"
        value={isLoading ? "-" : stats?.recentForms}
      />
    </div>
  );
};
