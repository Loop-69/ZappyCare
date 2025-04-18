
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Define the form schema for status
const statusSchema = z.object({
  active: z.boolean().default(true),
});

export type StatusFormValues = z.infer<typeof statusSchema>;

interface PharmacyStatusFieldProps {
  form: UseFormReturn<any>;
}

export const PharmacyStatusField = ({ form }: PharmacyStatusFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="active"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>Active</FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};
