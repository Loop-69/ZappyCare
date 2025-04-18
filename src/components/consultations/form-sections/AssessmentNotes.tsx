
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface AssessmentNotesProps {
  form: UseFormReturn<any>;
}

export const AssessmentNotes = ({ form }: AssessmentNotesProps) => {
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
