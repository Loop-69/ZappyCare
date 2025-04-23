
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CheckboxMultiSelect } from "@/components/providers/CheckboxMultiSelect";
import { STATES } from "@/lib/constants";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";

// Define the form schema for location information
const locationInfoSchema = z.object({
  states_served: z
    .array(z.string())
    .min(1, { message: "Select at least one state" }),
});

export type LocationInfoFormValues = z.infer<typeof locationInfoSchema>;

interface PharmacyLocationFieldsProps {
  form: UseFormReturn<any>;
}

export const PharmacyLocationFields = ({ form }: PharmacyLocationFieldsProps) => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  // Synchronize form state with local state
  useEffect(() => {
    const initialStates = form.getValues("states_served");
    if (initialStates && initialStates.length > 0) {
      setSelectedStates(initialStates);
    }
  }, [form]);

  const handleStateChange = (values: string[]) => {
    setSelectedStates(values);
    form.setValue("states_served", values, { shouldValidate: true });
    form.trigger("states_served");
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="states_served"
        render={({ field }) => (
          <FormItem>
            <FormLabel>States Served</FormLabel>
            <FormControl>
              <CheckboxMultiSelect
                options={STATES}
                selectedValues={field.value} // Use field.value instead of local state
                onChange={handleStateChange}
                placeholder="Select states..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
