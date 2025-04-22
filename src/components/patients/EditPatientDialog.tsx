
import { useState, useEffect } from "react";
import { parsePatientAddress } from "@/utils/patientUtils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PatientPersonalDetails } from "./PatientPersonalDetails";
import { PatientAddressDetails } from "./PatientAddressDetails";
import { patientFormSchema, type PatientFormValues } from "./types";
import { Patient } from "@/types";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface EditPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  patient: Patient | null;
}

export function EditPatientDialog({ 
  open, 
  onOpenChange, 
  onSuccess, 
  patient 
}: EditPatientDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const getDefaultValues = (patient: Patient | null): PatientFormValues => {
    if (!patient) {
      return {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        status: "Active",
        address_line1: "",
        city: "",
        state: "",
        zip_code: "",
        country: "United States"
      };
    }

    return {
      first_name: patient.first_name || "",
      last_name: patient.last_name || "",
      email: patient.email || "",
      phone: patient.phone || "",
      date_of_birth: patient.date_of_birth ? new Date(patient.date_of_birth).toISOString().split('T')[0] : "",
      status: patient.status || "Active",
      address_line1: patient.address ? parsePatientAddress(patient.address, 'line1') : "",
      city: patient.address ? parsePatientAddress(patient.address, 'city') : "",
      state: patient.address ? parsePatientAddress(patient.address, 'state') : "",
      zip_code: patient.address ? parsePatientAddress(patient.address, 'zip_code') : "",
      country: patient.address ? parsePatientAddress(patient.address, 'country') || "United States" : "United States"
    };
  };

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: getDefaultValues(patient)
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(patient));
    } else {
      form.reset();
    }
  }, [open, patient, form]);
  const handleSubmit = async (values: PatientFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Validate form values before submission
      await patientFormSchema.parseAsync(values);

      const address = values.address_line1 ? {
        line1: values.address_line1,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        country: values.country,
      } : null;

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out")), 10000)
      );

      if (!patient) {
        throw new Error("No patient selected");
      }

      const updatePromise = supabase
        .from("patients")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email || null,
          phone: values.phone || null,
          date_of_birth: values.date_of_birth || null,
          status: values.status,
          address: address,
        })
        .eq("id", patient.id)
        .then(({ error }) => ({ error }));

      const result = await Promise.race([updatePromise, timeoutPromise]);
      const { error } = result as { error: PostgrestError | null };
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Patient updated successfully");
      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Failed to update patient:", error);
      if (error instanceof Error) {
        toast.error(`Failed to update patient: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred while updating patient");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ErrorBoundary>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>
              Update the patient's information below.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <fieldset disabled={isSubmitting} className="space-y-6">
                <PatientPersonalDetails form={form} />
                <PatientAddressDetails form={form} />
              </fieldset>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}
