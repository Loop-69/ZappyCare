import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Provider } from "@/types";
import { toast } from "sonner";
import { CheckboxMultiSelect } from "@/components/providers/CheckboxMultiSelect"; // Import CheckboxMultiSelect
import { STATES } from "@/lib/constants"; // Import STATES

const providerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"), // Added phone validation
  status: z.string().min(1, "Status is required"),
  states_authorized: z.array(z.string()).min(1, "Select at least one state"), // Added states_authorized validation
});

type ProviderFormValues = z.infer<typeof providerSchema>;

interface EditProviderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  onProviderUpdated: () => void;
}

export function EditProviderDialog({ isOpen, onClose, provider, onProviderUpdated }: EditProviderDialogProps) {
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: "",
      specialty: "",
      email: "",
      phone: "", // Added phone default value
      status: "",
      states_authorized: [], // Added states_authorized default value
    },
  });

  useEffect(() => {
    if (provider) {
      form.reset({
        name: provider.name,
        specialty: provider.specialty,
        email: provider.email,
        phone: provider.phone || "", // Added phone reset
        status: provider.status,
        states_authorized: provider.states_authorized || [], // Added states_authorized reset
      });
    }
  }, [provider, form]);

  const onSubmit = async (data: ProviderFormValues) => {
    if (!provider) return;

    try {
      const { error } = await supabase
        .from('providers')
        .update({
          name: data.name,
          specialty: data.specialty,
          email: data.email,
          phone: data.phone, // Added phone to update
          status: data.status,
          states_authorized: data.states_authorized, // Added states_authorized to update
        })
        .eq('id', provider.id);

      if (error) {
        console.error('Error updating provider:', error);
        toast.error(`Failed to update provider: ${error.message}`);
      } else {
        toast.success("Provider updated successfully");
        onProviderUpdated();
        onClose();
      }
    } catch (error: any) {
      console.error('Error updating provider:', error);
      toast.error(`Failed to update provider: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Provider</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Provider Name" {...field} />
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
                  <FormLabel>Specialty</FormLabel>
                  <FormControl>
                    <Input placeholder="Specialty" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField // Added Phone field
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
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
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField // Added States Authorized field
              control={form.control}
              name="states_authorized"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>States Authorized</FormLabel>
                  <FormControl>
                    <CheckboxMultiSelect
                      options={STATES}
                      selectedValues={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
