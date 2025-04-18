
import React from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  Users,
  CalendarClock,
  ShoppingCart,
  MessagesSquare,
} from "lucide-react";

interface DashboardStatsProps {
  patientsCount: number | null;
  todaySessions: any[] | null;
  pendingOrders: number | null;
  newConsultations: any[] | null;
  isLoading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  patientsCount,
  todaySessions,
  pendingOrders,
  newConsultations,
  isLoading
}) => {
  // Build stats data with real data
  const stats = [
    {
      title: "Total Patients",
      value: isLoading ? "-" : patientsCount,
      trend: { value: "12%", positive: true },
      icon: <Users size={24} />,
    },
    {
      title: "Today's Sessions",
      value: isLoading ? "-" : (todaySessions?.length || 0),
      subtitle: (todaySessions?.length || 0) === 0 ? "No sessions today" : 
        (todaySessions?.length || 0) === 1 ? "1 session today" : `${todaySessions?.length} sessions today`,
      icon: <CalendarClock size={24} />,
    },
    {
      title: "Pending Orders",
      value: isLoading ? "-" : pendingOrders || 0,
      subtitle: (pendingOrders || 0) === 0 ? "No pending orders" : 
        (pendingOrders || 0) === 1 ? "1 order pending" : `${pendingOrders} orders pending`,
      icon: <ShoppingCart size={24} />,
    },
    {
      title: "New Consultations",
      value: isLoading ? "-" : (newConsultations?.length || 0),
      subtitle: (newConsultations?.length || 0) === 0 ? "No new consultations" : 
        (newConsultations?.length || 0) === 1 ? "1 needs review" : `${newConsultations?.length} need review`,
      icon: <MessagesSquare size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};
