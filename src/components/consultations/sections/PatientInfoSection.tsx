
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PatientInfoSectionProps {
  hpi: string;
  pmh: string;
  contraIndications: string;
  onHpiChange: (value: string) => void;
  onPmhChange: (value: string) => void;
  onContraIndicationsChange: (value: string) => void;
}

export const PatientInfoSection = ({
  hpi,
  pmh,
  contraIndications,
  onHpiChange,
  onPmhChange,
  onContraIndicationsChange,
}: PatientInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label>HPI</Label>
        <Textarea
          value={hpi}
          onChange={(e) => onHpiChange(e.target.value)}
          className="mt-2 h-32"
          placeholder="Enter HPI details..."
        />
      </div>
      
      <div>
        <Label>PMH</Label>
        <Textarea
          value={pmh}
          onChange={(e) => onPmhChange(e.target.value)}
          className="mt-2 h-32"
          placeholder="Enter PMH details..."
        />
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label>Contra-indications</Label>
          <span className="text-sm text-red-500 font-medium">Important</span>
        </div>
        <Textarea
          value={contraIndications}
          onChange={(e) => onContraIndicationsChange(e.target.value)}
          className="mt-2"
          placeholder="Enter any contra-indications..."
        />
      </div>
    </div>
  );
};
