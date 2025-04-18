
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
  const [selectedStates, setSelectedStates] = useState<string[]>(form.getValues("states_served") || []);

  // Initialize form values when component mounts
  useEffect(() => {
    const currentStates = form.getValues("states_served");
    if (currentStates) {
      setSelectedStates(currentStates);
    }
  }, [form]);

  const handleStateChange = (values: string[]) => {
    setSelectedStates(values);
    form.setValue("states_served", values, { shouldValidate: true });
    console.log("Selected states updated:", values);
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
                selectedValues={selectedStates}
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
