import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Patient } from "@/types";

interface PatientSelectProps {
  value: string;
  onChange: (value: string) => void;
  onPatientSelect?: (patient: Patient) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function PatientSelect({
  value,
  onChange,
  onPatientSelect,
  label = "Patient",
  placeholder = "Select a patient",
  disabled = false,
  required = false,
}: PatientSelectProps) {
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["patients-select"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, first_name, last_name, email")
        .order("last_name", { ascending: true });

      if (error) throw error;
      return data as Patient[];
    },
  });

  const handleValueChange = (newValue: string) => {
    onChange(newValue);
    if (onPatientSelect) {
      const selectedPatient = patients.find((p) => p.id === newValue);
      if (selectedPatient) {
        onPatientSelect(selectedPatient);
      }
    }
  };

  return (
    <FormItem>
      {label && <FormLabel>{label}{required && " *"}</FormLabel>}
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled || isLoading}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading patients...
            </SelectItem>
          ) : patients.length > 0 ? (
            patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              No patients found
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}