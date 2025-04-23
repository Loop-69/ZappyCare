
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { ConsultationFormValues } from "../ConsultationForm";

interface ServiceSelectionProps {
  form: UseFormReturn<ConsultationFormValues>;
  isEditing?: boolean;
}

export const ServiceSelection = ({ form, isEditing }: ServiceSelectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Service & Medication</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-management">Weight Management Program</SelectItem>
                    <SelectItem value="mental-health">Mental Health</SelectItem>
                    <SelectItem value="chronic-care">Chronic Care</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="treatment_approach"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment Approach</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select approach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                    <SelectItem value="conservative">Conservative</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <FormField
          control={form.control}
          name="preferred_medication"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Medication</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter preferred medication"
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="preferred_plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Plan</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter preferred treatment plan"
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Message for Pharmacy/Provider</FormLabel>
            <FormControl>
              <textarea 
                {...field}
                className="min-h-[100px] w-full border rounded-md p-2"
                placeholder="Enter any additional instructions or notes"
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
