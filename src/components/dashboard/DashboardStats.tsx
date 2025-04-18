
import React from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  Users,
  CalendarClock,
  ShoppingCart,
  MessagesSquare,
} from "lucide-react";
import type { Session, Consultation } from "@/types";

interface DashboardStatsProps {
  patientsCount: number | null;
  todaySessions: Session[] | null;
  pendingOrders: number | null;
  newConsultations: Consultation[] | null;
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
      icon: <Users size={20} />,
      type: 'patients' as const
    },
    {
      title: "Upcoming Sessions",
      value: isLoading ? "-" : (todaySessions?.length || 0),
      subtitle: (todaySessions?.length || 0) === 0 ? "No sessions today" : 
        (todaySessions?.length || 0) === 1 ? "1 session today" : `${todaySessions?.length} sessions today`,
      icon: <CalendarClock size={20} />,
      type: 'sessions' as const
    },
    {
      title: "Pending Orders",
      value: isLoading ? "-" : pendingOrders || 0,
      subtitle: (pendingOrders || 0) === 0 ? "No pending orders" : 
        (pendingOrders || 0) === 1 ? "1 awaiting approval" : `${pendingOrders} awaiting approval`,
      icon: <ShoppingCart size={20} />,
      type: 'orders' as const
    },
    {
      title: "New Consultations",
      value: isLoading ? "-" : (newConsultations?.length || 0),
      subtitle: (newConsultations?.length || 0) === 0 ? "No new consultations" : 
        (newConsultations?.length || 0) === 1 ? "1 need review" : `${newConsultations?.length} need review`,
      icon: <MessagesSquare size={20} />,
      type: 'consultations' as const
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
