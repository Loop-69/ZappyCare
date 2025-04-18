
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ServiceWithRelations } from "@/types/service";
import { BaseModal } from "../modals/BaseModal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
  requires_consultation: z.boolean().default(false),
});

interface EditServiceDialogProps {
  service: ServiceWithRelations;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditServiceDialog = ({
  service,
  isOpen,
  onClose,
  onSuccess,
}: EditServiceDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service.name,
      description: service.description || "",
      status: service.status,
      requires_consultation: service.requires_consultation,
    },
  });

  const handleClose = () => {
    // Reset form when dialog closes
    form.reset({
      name: service.name,
      description: service.description || "",
      status: service.status,
      requires_consultation: service.requires_consultation,
    });
    onClose();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("services")
        .update({
          name: values.name,
          description: values.description,
          status: values.status,
          requires_consultation: values.requires_consultation,
          updated_at: new Date().toISOString(),
        })
        .eq("id", service.id);

      if (error) throw error;

      toast({
        title: "Service updated",
        description: "The service has been successfully updated.",
      });
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        variant: "destructive",
        title: "Failed to update service",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Service"
      primaryAction={{
        label: "Save Changes",
        onClick: form.handleSubmit(onSubmit),
        loading: isSubmitting,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: handleClose,
      }}
    >
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter service name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter service description (optional)"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Active" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Active
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Inactive" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Inactive
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="requires_consultation"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Requires consultation
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </BaseModal>
  );
};
