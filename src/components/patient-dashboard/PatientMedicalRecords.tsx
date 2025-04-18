
import React, { useState } from "react";
import { Clock } from "lucide-react";
import { usePatientRecords } from "@/hooks/usePatientRecords";
import { generateTimelineItems } from "@/utils/generateTimelineItems";
import { RecordsSummaryCards } from "@/components/patient-dashboard/RecordsSummaryCards";
import { RecordsFilter } from "@/components/patient-dashboard/RecordsFilter";
import { MedicalTimeline } from "@/components/patient-dashboard/MedicalTimeline";

interface PatientMedicalRecordsProps {
  patientId: string;
}

export function PatientMedicalRecords({ patientId }: PatientMedicalRecordsProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { sessions, forms, medications, notes, labResults, isLoading } = usePatientRecords(patientId);

  // Create summary data for the cards
  const summaryData = [
    { 
      title: "Appointments", 
      count: sessions?.length || 0, 
      icon: "Calendar",
      color: "border-blue-500"
    },
    { 
      title: "Forms", 
      count: forms?.length || 0, 
      icon: "FileText",
      color: "border-orange-500"
    },
    { 
      title: "Medications", 
      count: medications?.length || 0, 
      icon: "Pill",
      color: "border-red-500"
    },
    { 
      title: "Lab Results", 
      count: labResults?.length || 0, 
      icon: "FlaskConical",
      color: "border-green-500"
    }
  ];
  
  const timelineItems = generateTimelineItems({
    sessions,
    forms,
    medications,
    notes,
    labResults
  });
  
  // Filter timeline items based on active filter
  const filteredTimelineItems = activeFilter === "all" 
    ? timelineItems 
    : timelineItems.filter(item => item.type === activeFilter);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <RecordsSummaryCards summaryData={summaryData} isLoading={isLoading} />

      {/* Filter Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Filter Records</h2>
        <RecordsFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      </div>

      {/* Medical History Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center mb-6">
          <Clock className="mr-2 h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-medium">Recent Medical History</h2>
        </div>
        
        <MedicalTimeline items={filteredTimelineItems} isLoading={isLoading} />
      </div>
    </div>
  );
}
