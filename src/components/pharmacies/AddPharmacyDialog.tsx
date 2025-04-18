
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

import { BaseModal } from "@/components/modals/BaseModal";
import { Form } from "@/components/ui/form";
import { Pharmacy } from "@/types";
import { Separator } from "@/components/ui/separator";

// Import the form field components
import { PharmacyBasicInfoFields } from "./PharmacyBasicInfoFields";
import { PharmacyContactFields } from "./PharmacyContactFields";
import { PharmacyLocationFields } from "./PharmacyLocationFields";
import { PharmacyStatusField } from "./PharmacyStatusField";

// Define the complete form schema by combining the schemas
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  type: z.string().min(1, { message: "Type is required" }),
  contact_name: z.string().min(2, { message: "Contact name is required" }),
  contact_email: z.string().email({ message: "Please enter a valid email address" }),
  contact_phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  active: z.boolean().default(true),
  states_served: z
    .array(z.string())
    .min(1, { message: "Select at least one state" }),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  name: "",
  type: "retail",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  active: true,
  states_served: [],
};

interface AddPharmacyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPharmacyDialog = ({ isOpen, onClose }: AddPharmacyDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen, form]);

  // Set up the mutation for adding a new pharmacy
  const addPharmacyMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log("Submitting form with values:", values);
      const { data, error } = await supabase
        .from("pharmacies")
        .insert({
          name: values.name,
          type: values.type,
          contact_name: values.contact_name,
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
          active: values.active,
          states_served: values.states_served
        })
        .select("*")
        .single();

      if (error) throw error;
      return data as Pharmacy;
    },
    onSuccess: () => {
      // Invalidate and refetch the pharmacies query
      queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
      toast({
        title: "Pharmacy added",
        description: "Pharmacy has been added successfully",
      });
      onClose();
      form.reset(defaultValues);
    },
    onError: (error) => {
      console.error("Error adding pharmacy:", error);
      toast({
        title: "Error",
        description: "Failed to add pharmacy",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
    addPharmacyMutation.mutate(values);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Pharmacy"
      primaryAction={{
        label: "Add Pharmacy",
        onClick: form.handleSubmit(handleSubmit),
        loading: addPharmacyMutation.isPending,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: onClose,
      }}
      showCloseButton={false}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <div>
            <h3 className="text-md font-medium mb-2">Basic Information</h3>
            <PharmacyBasicInfoFields form={form} />
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-md font-medium mb-2">Contact Information</h3>
            <PharmacyContactFields form={form} />
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-md font-medium mb-2">Service Area</h3>
            <PharmacyLocationFields form={form} />
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-md font-medium mb-2">Status</h3>
            <PharmacyStatusField form={form} />
          </div>
        </form>
      </Form>
    </BaseModal>
  );
};
