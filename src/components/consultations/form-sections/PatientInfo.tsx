
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface PatientInfoProps {
  form: UseFormReturn<any>;
  patients: any[];
  onPatientSelect: (patientId: string) => void;
}

export const PatientInfo = ({
  form,
  patients,
  onPatientSelect,
}: PatientInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Patient Information</h3>
      
      <FormField
        control={form.control}
        name="patient_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Patient</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onPatientSelect(value);
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} {patient.date_of_birth ? 
                        `(${format(new Date(patient.date_of_birth), 'MM/dd/yyyy')})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <FormField
          control={form.control}
          name="hpi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>History of Present Illness</FormLabel>
              <FormControl>
                <textarea 
                  {...field}
                  className="min-h-[100px] w-full border rounded-md p-2"
                  placeholder="Enter history of present illness"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pmh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Past Medical History</FormLabel>
              <FormControl>
                <textarea 
                  {...field}
                  className="min-h-[100px] w-full border rounded-md p-2"
                  placeholder="Enter past medical history"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contra_indications"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Contraindications</FormLabel>
              <FormControl>
                <textarea 
                  {...field}
                  className="min-h-[80px] w-full border rounded-md p-2"
                  placeholder="Enter any contraindications"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
