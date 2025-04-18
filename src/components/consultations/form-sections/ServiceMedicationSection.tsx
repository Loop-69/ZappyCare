
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ServiceMedicationSectionProps {
  serviceType: string;
  treatmentApproach: string;
  preferredMedication: string;
  preferredPlan: string;
  onServiceTypeChange: (value: string) => void;
  onTreatmentApproachChange: (value: string) => void;
  onPreferredMedicationChange: (value: string) => void;
  onPreferredPlanChange: (value: string) => void;
}

export const ServiceMedicationSection = ({
  serviceType,
  treatmentApproach,
  preferredMedication,
  preferredPlan,
  onServiceTypeChange,
  onTreatmentApproachChange,
  onPreferredMedicationChange,
  onPreferredPlanChange,
}: ServiceMedicationSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Service Type</Label>
          <Select value={serviceType} onValueChange={onServiceTypeChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight-management">Weight Management Program</SelectItem>
              <SelectItem value="mental-health">Mental Health</SelectItem>
              <SelectItem value="chronic-care">Chronic Care</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Treatment Approach</Label>
          <Select value={treatmentApproach} onValueChange={onTreatmentApproachChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select approach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="aggressive">Aggressive</SelectItem>
              <SelectItem value="conservative">Conservative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label>Preferred Medication</Label>
        <Input
          value={preferredMedication}
          onChange={(e) => onPreferredMedicationChange(e.target.value)}
          className="mt-2"
          placeholder="Enter preferred medication"
        />
      </div>

      <div>
        <Label>Preferred Plan</Label>
        <Input
          value={preferredPlan}
          onChange={(e) => onPreferredPlanChange(e.target.value)}
          className="mt-2"
          placeholder="Enter preferred treatment plan"
        />
      </div>
    </div>
  );
};
