import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner"; // Using sonner for toasts

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
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { Patient } from "@/types"; // Assuming Patient type exists
import { useQuery } from "@tanstack/react-query"; // Import useQuery

// Define the form schema with Zod
const formSchema = z.object({
  patient_id: z.string().min(1, { message: "Patient is required" }),
  patient_name_display: z.string().optional(), // Display only, not required for submission
  verification_status: z.enum(["Pending", "Verified", "Rejected"]),
  coverage_details: z.string().optional(),
  coverage_type: z.string().min(1, { message: "Coverage Type is required" }),
  insurance_provider: z.string().min(1, { message: "Insurance Provider is required" }),
  policy_number: z.string().optional(),
  group_number: z.string().optional(),
  prior_authorization_required: z.boolean().default(false).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  patient_id: "",
  patient_name_display: "",
  verification_status: "Pending",
  coverage_details: "",
  coverage_type: "",
  insurance_provider: "",
  policy_number: "",
  group_number: "",
  prior_authorization_required: false,
  notes: "",
};

interface AddInsuranceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddInsuranceDialog = ({ isOpen, onClose, onSuccess }: AddInsuranceDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Fetch patients for the dropdown
  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name');

      if (error) throw error;
      return data as Patient[];
    }
  });

  // Update patient_name_display when patient_id changes
  form.watch("patient_id"); // Watch for changes in patient_id

  const selectedPatient = patients.find(p => p.id === form.getValues("patient_id"));
  if (selectedPatient) {
    const fullName = `${selectedPatient.first_name} ${selectedPatient.last_name}`;
    if (form.getValues("patient_name_display") !== fullName) {
       form.setValue("patient_name_display", fullName);
    }
  } else {
     if (form.getValues("patient_name_display") !== "") {
        form.setValue("patient_name_display", "");
     }
  }


  // Set up the mutation for adding a new insurance record
  const addInsuranceMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data, error } = await supabase
        .from("insurance_records")
        .insert({
          patient_id: values.patient_id,
          verification_status: values.verification_status,
          coverage_details: values.coverage_details,
          coverage_type: values.coverage_type,
          insurance_provider: values.insurance_provider,
          policy_number: values.policy_number,
          group_number: values.group_number,
          prior_authorization_required: values.prior_authorization_required,
          notes: values.notes,
        })
        .select("*")
        .single();

      if (error) throw error;
      return data; // Assuming the inserted data is returned
    },
    onSuccess: () => {
      // Invalidate and refetch the insurance records query
      queryClient.invalidateQueries({ queryKey: ["insurance_records"] }); // Assuming query key is 'insurance_records'
      toast.success("Insurance record added successfully");
      onClose();
      form.reset(defaultValues);
    },
    onError: (error: any) => {
      console.error("Error adding insurance record:", error);
      toast.error(`Failed to add insurance record: ${error.message}`);
    },
  });

  const handleSubmit = (values: FormValues) => {
    addInsuranceMutation.mutate(values);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Insurance Record"
      primaryAction={{
        label: "Add Insurance Record",
        onClick: form.handleSubmit(handleSubmit),
        loading: addInsuranceMutation.isPending,
        className: "bg-purple-600 hover:bg-purple-700", // Purple button
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: onClose,
        variant: "outline", // Outline button
      }}
    >
      <Form {...form}>
        <form className="grid grid-cols-2 gap-4"> {/* Two-column layout */}
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient *</FormLabel> {/* Added asterisk */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Search or Select Patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="verification_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patient_name_display"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name (Display Only)</FormLabel>
                <FormControl>
                  <Input {...field} disabled /> {/* Disabled input */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverage_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coverage Details</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter details about coverage, co-pays, deductibles, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverage_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coverage Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Coverage Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     {/* Add relevant coverage type options here */}
                    <SelectItem value="Medical Insurance">Medical Insurance</SelectItem>
                    <SelectItem value="Dental Insurance">Dental Insurance</SelectItem>
                    <SelectItem value="Vision Insurance">Vision Insurance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prior_authorization_required"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-2"> {/* Span two columns */}
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Prior Authorization Required
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="insurance_provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Provider</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

           <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter any additional notes about the verification process" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="policy_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Policy Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="group_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Number</FormLabel>
                <FormControl>
                  <Input {...field} />
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
