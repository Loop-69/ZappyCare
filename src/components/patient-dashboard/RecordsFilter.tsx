
import React from "react";
import { Calendar, FileText, Pill, FlaskConical, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, active, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors",
        active 
          ? "bg-primary text-primary-foreground"
          : "bg-muted/50 text-muted-foreground hover:bg-muted"
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

interface RecordsFilterProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function RecordsFilter({ activeFilter, setActiveFilter }: RecordsFilterProps) {
  const filters = [
    { id: "all", label: "All Records", icon: null },
    { id: "appointment", label: "Appointments", icon: <Calendar className="h-4 w-4" /> },
    { id: "lab", label: "Lab Results", icon: <FlaskConical className="h-4 w-4" /> },
    { id: "medication", label: "Medications", icon: <Pill className="h-4 w-4" /> },
    { id: "form", label: "Forms", icon: <FileText className="h-4 w-4" /> },
    { id: "note", label: "Notes", icon: <Sparkles className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <FilterButton
          key={filter.id}
          label={filter.label}
          active={activeFilter === filter.id}
          onClick={() => setActiveFilter(filter.id)}
          icon={filter.icon}
        />
      ))}
    </div>
  );
}
