
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState("personal");
  
  /**
   * Extracts default form values from patient data
   * @param patient - The patient object or null
   * @returns Default form values for the patient form
   */
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

  // Reset form when dialog opens or patient changes
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(patient));
      setActiveTab("personal"); // Reset to first tab when opening
    }
  }, [open, patient, form]);

  /**
   * Handles form submission to update patient data
   * @param values - The validated form values
   */
  const handleSubmit = async (values: PatientFormValues) => {
    if (!patient) {
      toast.error("No patient selected");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create address object if address line is provided
      const address = values.address_line1 ? {
        line1: values.address_line1,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        country: values.country,
      } : null;

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out")), 15000)
      );

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
          updated_at: new Date().toISOString(),
        })
        .eq("id", patient.id)
        .then(({ data, error }) => ({ data, error }));

      const result = await Promise.race([updatePromise, timeoutPromise]);
      const { error } = result as { data: any, error: PostgrestError | null };
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Patient updated successfully");
      onSuccess();
      onOpenChange(false);
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

  /**
   * Validates the current tab and moves to the next if valid
   */
  const handleNextTab = async () => {
    const personalFields = ["first_name", "last_name", "email", "phone", "date_of_birth", "status"];
    
    // Validate only the fields in the current tab
    const result = await form.trigger(personalFields as any);
    if (result) {
      setActiveTab("address");
    }
  };

  return (
    <ErrorBoundary>
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isSubmitting) {
          onOpenChange(isOpen);
        }
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>
              Update the patient's information below.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal">Personal Details</TabsTrigger>
                  <TabsTrigger value="address">Address</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-4 pt-4">
                  <PatientPersonalDetails form={form} />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={handleNextTab}
                      disabled={isSubmitting}
                    >
                      Next
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="address" className="space-y-4 pt-4">
                  <PatientAddressDetails form={form} />
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="ml-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}
