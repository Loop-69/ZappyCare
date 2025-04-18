
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ConsultationFormValues } from "@/hooks/useConsultationForm";

interface PatientSelectionProps {
  form: UseFormReturn<ConsultationFormValues>;
  patients: any[];
  onPatientSelect: (patientId: string) => void;
  isSubmitting: boolean;
}

export const PatientSelection = ({
  form,
  patients,
  onPatientSelect,
  isSubmitting,
}: PatientSelectionProps) => {
  return (
    <FormField
      control={form.control}
      name="patient_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Patient</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onPatientSelect(value);
              }}
              value={field.value}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
