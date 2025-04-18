
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Define the form schema for basic info
const basicInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  type: z.string().min(1, { message: "Type is required" }),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

interface PharmacyBasicInfoFieldsProps {
  form: UseFormReturn<any>;
}

export const PharmacyBasicInfoFields = ({ form }: PharmacyBasicInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pharmacy Name *</FormLabel>
            <FormControl>
              <Input placeholder="Enter pharmacy name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pharmacy Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select pharmacy type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="compounding">Compounding</SelectItem>
                <SelectItem value="specialty">Specialty</SelectItem>
                <SelectItem value="mail_order">Mail Order</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
