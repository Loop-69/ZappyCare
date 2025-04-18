
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BaseModal } from "@/components/modals/BaseModal";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const discountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(3, "Code must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["Percentage", "Fixed"]),
  value: z.coerce.number().min(0, "Value must be a positive number"),
  start_date: z.date(),
  end_date: z.date().optional(),
  usage_limit_total: z.coerce.number().optional(),
  usage_limit_per_user: z.coerce.number().optional(),
  requirement: z.string().optional(),
});

type DiscountFormData = z.infer<typeof discountSchema>;

interface AddDiscountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscountAdded?: () => void;
}

export const AddDiscountDialog = ({ 
  isOpen, 
  onClose,
  onDiscountAdded 
}: AddDiscountDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      type: "Percentage",
      start_date: new Date(),
    },
  });

  const onSubmit = async (data: DiscountFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('discounts').insert({
        name: data.name,
        code: data.code,
        description: data.description,
        type: data.type,
        value: data.value,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date?.toISOString(),
        usage_limit_total: data.usage_limit_total,
        usage_limit_per_user: data.usage_limit_per_user,
        requirement: data.requirement,
        status: 'Active', // Default to active
      });

      if (error) throw error;

      toast.success("Discount created successfully");
      onDiscountAdded?.();
      onClose();
    } catch (error) {
      console.error("Error creating discount:", error);
      toast.error("Failed to create discount");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Discount"
      primaryAction={{
        label: "Create Discount",
        onClick: form.handleSubmit(onSubmit),
        loading: isSubmitting,
      }}
      size="lg"
    >
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. New Patient Discount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. NEWPATIENT10" {...field} />
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
                  <FormLabel>Discount Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="Fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch('type') === 'Percentage' 
                      ? 'Discount Percentage' 
                      : 'Discount Amount'}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder={form.watch('type') === 'Percentage' 
                        ? 'e.g. 10' 
                        : 'e.g. 25'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {form.watch('type') === 'Percentage' 
                      ? 'Percentage off (e.g. 10%)' 
                      : 'Fixed amount off (e.g. $25)'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add more form fields for advanced discount settings */}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Optional description for this discount" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </BaseModal>
  );
};
