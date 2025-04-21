
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

import { BaseModal } from "@/components/modals/BaseModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CheckboxMultiSelect } from "@/components/providers/CheckboxMultiSelect";
import { STATES } from "@/lib/constants";
import { Provider } from "@/types";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  specialty: z.string().min(2, { message: "Specialty is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  status: z.enum(["Active", "Inactive"]),
  states_authorized: z
    .array(z.string())
    .min(1, { message: "Select at least one state" }),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  name: "",
  specialty: "",
  email: "",
  phone: "",
  status: "Active",
  states_authorized: [],
};

interface AddProviderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Added onSuccess prop
}

export const AddProviderDialog = ({ isOpen, onClose }: AddProviderDialogProps) => {
  const queryClient = useQueryClient();
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Set up the mutation for adding a new provider
  const addProviderMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Here's where the type error was occurring
      // All fields are now guaranteed to be non-optional due to our Zod schema
      const { data, error } = await supabase
        .from("providers")
        .insert({
          name: values.name,
          specialty: values.specialty,
          email: values.email,
          phone: values.phone,
          status: values.status,
          states_authorized: values.states_authorized
        })
        .select("*")
        .single();

      if (error) throw error;
      return data as Provider;
    },
    onSuccess: () => {
      // Invalidate and refetch the providers query
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast({
        title: "Provider added",
        description: "Provider has been added successfully",
      });
      onClose();
      form.reset(defaultValues);
    },
    onError: (error) => {
      console.error("Error adding provider:", error);
      toast({
        title: "Error",
        description: "Failed to add provider",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: FormValues) => {
    addProviderMutation.mutate(values);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Provider"
      primaryAction={{
        label: "Add Provider",
        onClick: form.handleSubmit(handleSubmit),
        loading: addProviderMutation.isPending,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: onClose,
      }}
    >
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="provider-name">Name</FormLabel>
                <FormControl>
                  <Input 
                    id="provider-name"
                    placeholder="Dr. Jane Smith" 
                    aria-describedby="provider-name-error"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="provider-specialty">Specialty</FormLabel>
                <FormControl>
                  <Input 
                    id="provider-specialty"
                    placeholder="Cardiology" 
                    aria-describedby="provider-specialty-error"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="provider-email">Email</FormLabel>
                <FormControl>
                  <Input 
                    id="provider-email"
                    placeholder="doctor@example.com" 
                    aria-describedby="provider-email-error"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="provider-phone">Phone</FormLabel>
                <FormControl>
                  <Input 
                    id="provider-phone"
                    placeholder="(555) 123-4567" 
                    aria-describedby="provider-phone-error"
                    {...field} 
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
              <FormItem>
                <FormLabel htmlFor="provider-status">Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger id="provider-status" aria-describedby="provider-status-error">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage id="provider-status-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="states_authorized"
            render={({ field }) => (
              <FormItem>
                <FormLabel id="states-authorized-label">States Authorized</FormLabel>
                <FormControl>
                  <CheckboxMultiSelect
                    options={STATES}
                    selectedValues={field.value}
                    onChange={field.onChange}
                    aria-labelledby="states-authorized-label"
                    aria-describedby="states-authorized-error"
                  />
                </FormControl>
                <FormMessage id="states-authorized-error" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </BaseModal>
  );
};
