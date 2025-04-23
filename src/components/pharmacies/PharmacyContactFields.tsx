
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Define the form schema for contact information
const contactInfoSchema = z.object({
  contact_name: z.string().min(2, { message: "Contact name is required" }),
  contact_email: z.string().email({ message: "Please enter a valid email address" }),
  contact_phone: z.string().min(10, { message: "Please enter a valid phone number" }),
});

export type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

interface PharmacyContactFieldsProps {
  form: UseFormReturn<any>;
}

export const PharmacyContactFields = ({ form }: PharmacyContactFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="contact_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Name</FormLabel>
            <FormControl>
              <Input placeholder="Contact person's name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email *</FormLabel>
            <FormControl>
              <Input 
                placeholder="contact@pharmacy.com" 
                {...field} 
                className={form.formState.errors.contact_email ? "border-red-500" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone</FormLabel>
            <FormControl>
              <Input placeholder="(555) 123-4567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
