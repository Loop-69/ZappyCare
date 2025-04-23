
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

import { ConsultationFormValues } from "../ConsultationForm";

interface AssessmentNotesProps {
  form: UseFormReturn<ConsultationFormValues>;
  isEditing?: boolean;
}

export const AssessmentNotes = ({ form, isEditing }: AssessmentNotesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Provider Assessment</h3>
      
      <FormField
        control={form.control}
        name="assessment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assessment Notes</FormLabel>
            <FormControl>
              <textarea 
                {...field}
                className="min-h-[150px] w-full border rounded-md p-2"
                placeholder="Enter clinical assessment notes"
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
