
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FormsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function FormsHeader({ 
  searchQuery, 
  onSearchChange, 
  selectedType, 
  onTypeChange 
}: FormsHeaderProps) {
  const formTypes = ["All Forms", "Consultation", "Weight Management", "Insurance Verification"];

  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Input
            type="text"
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="border-b">
        <div className="flex gap-6">
          {formTypes.map(type => (
            <button
              key={type}
              className={`px-4 py-2 border-b-2 ${
                selectedType === type 
                  ? "border-primary text-primary" 
                  : "border-transparent hover:border-gray-200"
              }`}
              onClick={() => onTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
