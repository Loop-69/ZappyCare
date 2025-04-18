
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
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

interface EditPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  patient: Patient;
}

export function EditPatientDialog({ 
  open, 
  onOpenChange, 
  onSuccess, 
  patient 
}: EditPatientDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extract address fields from patient.address object if it exists
  const getAddressField = (field: string) => {
    if (!patient.address) return '';
    
    try {
      const address = typeof patient.address === 'string' 
        ? JSON.parse(patient.address)
        : patient.address;
        
      return address[field] || '';
    } catch (e) {
      console.error("Error parsing address:", e);
      return '';
    }
  };
  
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      first_name: patient.first_name || "",
      last_name: patient.last_name || "",
      email: patient.email || "",
      phone: patient.phone || "",
      date_of_birth: patient.date_of_birth ? new Date(patient.date_of_birth).toISOString().split('T')[0] : "",
      status: patient.status || "Active",
      address_line1: getAddressField('line1'),
      city: getAddressField('city'),
      state: getAddressField('state'),
      zip_code: getAddressField('zip_code'),
      country: getAddressField('country') || "United States",
    },
  });

  const handleSubmit = async (values: PatientFormValues) => {
    setIsSubmitting(true);
    
    try {
      const address = {
        line1: values.address_line1,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        country: values.country,
      };

      const { error } = await supabase
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
        .eq("id", patient.id);
      
      if (error) {
        console.error("Error updating patient:", error);
        toast.error("Failed to update patient: " + error.message);
        throw new Error(error.message);
      }
      
      toast.success("Patient updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update patient:", error);
      toast.error("An unexpected error occurred while updating patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            <PatientPersonalDetails form={form} />
            <PatientAddressDetails form={form} />
            
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
  );
}
