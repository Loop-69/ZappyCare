import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Patient } from "@/types";
import { Database } from "@/types/supabase-types";

type InsuranceRecord = Database['public']['Tables']['insurance_records']['Row'];

// Define the form schema with Zod
const formSchema = z.object({
  patient_id: z.string().optional(), // Optional for edit, required for add (handled in onSubmit)
  patient_name_display: z.string().optional(), // Display only
  verification_status: z.enum(["Pending", "Verified", "Rejected"]),
  coverage_details: z.string().optional(),
  provider_type: z.string().min(1, { message: "Provider Type is required" }),
  insurance_provider: z.string().min(1, { message: "Insurance Provider is required" }),
  policy_number: z.string().optional(),
  group_number: z.string().optional(),
  prior_authorization_required: z.boolean().default(false).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InsuranceRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  record?: InsuranceRecord; // Optional record for editing
}

export const InsuranceRecordDialog = ({ isOpen, onClose, onSuccess, record }: InsuranceRecordDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: record ? {
      patient_id: record.patient_id || "",
      verification_status: (record.verification_status || "Pending") as "Pending" | "Verified" | "Rejected",
      coverage_details: record.coverage_details || "",
      provider_type: record.provider_type || "",
      insurance_provider: record.insurance_provider || "",
      policy_number: record.policy_number || "",
      group_number: record.group_number || "",
      prior_authorization_required: record.prior_authorization_required || false,
      notes: record.notes || "",
    } : {
      patient_id: "",
      verification_status: "Pending",
      coverage_details: "",
      provider_type: "",
      insurance_provider: "",
      policy_number: "",
      group_number: "",
      prior_authorization_required: false,
      notes: "",
    },
  });

  // Fetch patients for the dropdown (only if adding)
  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name');

      if (error) throw error;
      return data as Patient[];
    },
    enabled: !record, // Only fetch patients if adding a new record
  });

  // Update patient_name_display when patient_id changes (only if adding)
  useEffect(() => {
    if (!record) {
      const subscription = form.watch((value, { name }) => {
        if (name === "patient_id") {
          const selectedPatient = patients.find(p => p.id === value.patient_id);
          if (selectedPatient) {
            const fullName = `${selectedPatient.first_name} ${selectedPatient.last_name}`;
            form.setValue("patient_name_display", fullName);
          } else {
            form.setValue("patient_name_display", "");
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [form, patients, record]);

  // Set up the mutation for adding a new insurance record
  const addInsuranceMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data, error } = await supabase
        .from("insurance_records")
        .insert({
          patient_id: values.patient_id!, // patient_id is required for insert
          verification_status: values.verification_status,
          coverage_details: values.coverage_details,
          provider_type: values.provider_type,
          insurance_provider: values.insurance_provider,
          policy_number: values.policy_number,
          group_number: values.group_number,
          prior_authorization_required: values.prior_authorization_required,
          notes: values.notes,
        })
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurance_records"] });
      toast.success("Insurance record added successfully");
      onClose();
      form.reset();
    },
    onError: (error: { message: string }) => {
      console.error("Error adding insurance record:", error);
      toast.error(`Failed to add insurance record: ${error.message}`);
    },
  });

  // Set up the mutation for editing an insurance record
  const editInsuranceMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { error } = await supabase
        .from("insurance_records")
        .update({
          verification_status: values.verification_status,
          coverage_details: values.coverage_details,
          provider_type: values.provider_type,
          insurance_provider: values.insurance_provider,
          policy_number: values.policy_number,
          group_number: values.group_number,
          prior_authorization_required: values.prior_authorization_required,
          notes: values.notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", record!.id); // record.id is required for update

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurance_records"] });
      toast.success("Insurance record updated successfully");
      onSuccess();
      onClose();
    },
    onError: (error: { message: string }) => {
      console.error("Error updating insurance record:", error);
      toast.error(`Failed to update insurance record: ${error.message}`);
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (record) {
      editInsuranceMutation.mutate(values);
    } else {
      // Validate patient_id for add operation
      if (!values.patient_id) {
        form.setError("patient_id", { type: "manual", message: "Patient is required" });
        return;
      }
      addInsuranceMutation.mutate(values);
    }
  };

  const isSubmitting = addInsuranceMutation.isPending || editInsuranceMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{record ? "Edit Insurance Record" : "Add Insurance Record"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-4">
            {!record && ( // Only show patient select if adding
              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="insurance-patient">Patient *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger id="insurance-patient" aria-describedby="insurance-patient-error">
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
            )}

            {!record && ( // Only show patient name display if adding
              <FormField
                control={form.control}
                name="patient_name_display"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="insurance-patient-display">Patient Name (Display Only)</FormLabel>
                    <FormControl>
                      <Input
                        id="insurance-patient-display"
                        aria-describedby="insurance-patient-display-error"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage id="insurance-patient-display-error" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="verification_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="insurance-status">Verification Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="insurance-status" aria-describedby="insurance-status-error">
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
              name="provider_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="insurance-provider-type">Provider Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="insurance-provider-type" aria-describedby="insurance-provider-type-error">
                        <SelectValue placeholder="Select Provider Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Medical Insurance">Medical Insurance</SelectItem>
                      <SelectItem value="Dental Insurance">Dental Insurance</SelectItem>
                      <SelectItem value="Vision Insurance">Vision Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage id="insurance-provider-type-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insurance_provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="insurance-provider">Insurance Provider</FormLabel>
                  <FormControl>
                    <Input
                      id="insurance-provider"
                      aria-describedby="insurance-provider-error"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="insurance-provider-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="policy_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="insurance-policy-number">Policy Number</FormLabel>
                  <FormControl>
                    <Input
                      id="insurance-policy-number"
                      aria-describedby="insurance-policy-number-error"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="insurance-policy-number-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="group_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="insurance-group-number">Group Number</FormLabel>
                  <FormControl>
                    <Input
                      id="insurance-group-number"
                      aria-describedby="insurance-group-number-error"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="insurance-group-number-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverage_details"
              render={({ field }) => (
                <FormItem className="col-span-2"> {/* Span two columns */}
                  <FormLabel htmlFor="insurance-coverage-details">Coverage Details</FormLabel>
                  <FormControl>
                    <Textarea
                      id="insurance-coverage-details"
                      aria-describedby="insurance-coverage-details-error"
                      placeholder="Enter details about coverage, co-pays, deductibles, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="insurance-coverage-details-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prior_authorization_required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-2">
                  <FormControl>
                    <Checkbox
                      id="insurance-prior-auth"
                      aria-describedby="insurance-prior-auth-error"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="insurance-prior-auth">
                      Prior Authorization Required
                    </FormLabel>
                  </div>
                  <FormMessage id="insurance-prior-auth-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="col-span-2"> {/* Span two columns */}
                  <FormLabel htmlFor="insurance-notes">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      id="insurance-notes"
                      aria-describedby="insurance-notes-error"
                      placeholder="Enter any additional notes about the verification process"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="insurance-notes-error" />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 col-span-2"> {/* Span two columns */}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? (record ? "Updating..." : "Adding...") : (record ? "Update Insurance Record" : "Add Insurance Record")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
