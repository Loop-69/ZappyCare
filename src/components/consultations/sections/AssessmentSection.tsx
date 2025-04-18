
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AssessmentSectionProps {
  assessment: string;
  onAssessmentChange: (value: string) => void;
}

export const AssessmentSection = ({ assessment, onAssessmentChange }: AssessmentSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="space-y-4 rounded-md bg-green-50 p-6">
      <div className="flex items-center justify-between">
        <Label className="text-green-800">Assessment & Plan</Label>
        <span className="text-sm text-green-600">Clinical Notes</span>
      </div>
      
      <div className="flex items-start gap-4">
        <Textarea
          value={assessment}
          onChange={(e) => onAssessmentChange(e.target.value)}
          className={`flex-1 bg-white ${expanded ? 'min-h-[200px]' : ''}`}
          placeholder="Enter assessment and plan..."
        />
        <Button 
          variant="default" 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Collapse" : "Expand"}
        </Button>
      </div>
    </div>
  );
};
