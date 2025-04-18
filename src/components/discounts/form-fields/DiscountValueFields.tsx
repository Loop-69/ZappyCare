
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { DiscountFormData } from "../EditDiscountDialog";

interface DiscountValueFieldsProps {
  form: UseFormReturn<DiscountFormData>;
}

export const DiscountValueFields = ({ form }: DiscountValueFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
      
      <FormField
        control={form.control}
        name="value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {form.watch('type') === 'Percentage' ? 'Discount Percentage' : 'Discount Amount'}
            </FormLabel>
            <FormControl>
              <Input 
                type="number"
                placeholder={form.watch('type') === 'Percentage' ? 'e.g. 10' : 'e.g. 25'}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
