
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
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

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddPatientDialog = ({ open, onOpenChange, onSuccess }: AddPatientDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
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
      country: "United States",
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

      const { data, error } = await supabase.from("patients").insert({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email || null,
        phone: values.phone || null,
        date_of_birth: values.date_of_birth || null,
        status: values.status,
        address: address,
      }).select();
      
      if (error) {
        console.error("Error creating patient:", error);
        toast.error("Failed to add patient: " + error.message);
        throw new Error(error.message);
      }
      
      toast.success("Patient added successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Failed to add patient:", error);
      toast.error("An unexpected error occurred while adding patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10">
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient details below to create a new patient record.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-1">
            <div className="space-y-6">
              <PatientPersonalDetails form={form} />
              <PatientAddressDetails form={form} />
            </div>
            
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
                Add Patient
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;
