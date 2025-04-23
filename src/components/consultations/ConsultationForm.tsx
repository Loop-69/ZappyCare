
import { useQuery } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PatientInfo } from "./form-sections/PatientInfo";
import { ServiceSelection } from "./form-sections/ServiceSelection";
import { AssessmentNotes } from "./form-sections/AssessmentNotes";

interface ConsultationFormProps {
import { Consultation } from "@/types/consultation-types";

interface ConsultationFormProps {
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  consultation?: Consultation;
  isEditing?: boolean;
}

const consultationFormSchema = z.object({
  patient_id: z.string().uuid({ message: "Please select a patient" }).optional(),
  email: z.string().email({ message: "Please enter a valid email" }).optional(),
  service: z.string().min(1, { message: "Please select a service" }).optional(),
  treatment_approach: z.string().optional(),
  preferred_medication: z.string().optional(),
  preferred_plan: z.string().optional(),
  assessment: z.string().optional(),
  hpi: z.string().optional(),
  pmh: z.string().optional(),
  contra_indications: z.string().optional(),
  message: z.string().optional(),
  form_completed: z.boolean().default(false).optional(),
});

type ConsultationFormValues = z.infer<typeof consultationFormSchema>;
export type { ConsultationFormValues };

export const ConsultationForm = ({ onOpenChange, onSuccess, consultation, isEditing }: ConsultationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: consultation
      ? {
          ...consultation,
          patient_id: consultation.patient_id,
          email: consultation.email,
          service: consultation.service,
          form_completed: consultation.form_completed ?? false,
        }
      : {
          service: "weight-management",
          treatment_approach: "maintenance",
          preferred_medication: "",
          preferred_plan: "",
          assessment: "",
          hpi: "",
          pmh: "",
          contra_indications: "",
          message: "",
          form_completed: false,
        },
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients-for-consultation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, first_name, last_name, email, date_of_birth")
        .order("last_name", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const handlePatientSelect = (patientId: string) => {
    const selectedPatient = patients.find(patient => patient.id === patientId);
    if (selectedPatient) {
      form.setValue("email", selectedPatient.email || "");
    }
  };

  const handleSaveNote = async () => {
    const values = form.getValues();
    try {
      if (values.patient_id && values.assessment) {
        const { error } = await supabase
          .from("patient_notes")
          .insert({
            patient_id: values.patient_id,
            content: values.assessment,
            created_by: "Dr. Provider"
          });
          
        if (error) throw error;
        toast.success("Note saved successfully");
      } else {
        toast.error("Patient and assessment note are required");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  const disableFormFields = (isDisabled: boolean) => {
    for (const key in form.getValues()) {
      form.getFieldState(key as keyof ConsultationFormValues).isTouched = isDisabled;
    }
  };

  const onSubmit = async (values: ConsultationFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting consultation with values:", values);
      
      // Insert consultation without trying to link to a non-existent foreign key relationship
      const { error, data } = await supabase
        .from("consultations")
        .insert({
          patient_id: values.patient_id,
          service: values.service,
          email: values.email,
          preferred_medication: values.preferred_medication || null,
          preferred_plan: values.preferred_plan || null,
          form_completed: values.form_completed,
          status: 'Pending'
        })
        .select();
      
      if (error) {
        console.error("Error creating consultation:", error);
        throw error;
      }
      
      if (values.assessment) {
        await supabase
          .from("patient_notes")
          .insert({
            patient_id: values.patient_id,
            content: values.assessment,
            created_by: "Dr. Provider"
          });
      }
      
      toast.success("Consultation created successfully");
      form.reset();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating consultation:", error);
      toast.error("Failed to create consultation");
    } finally {
      setIsSubmitting(false);
    }
import { useEffect } from "react";

  };

  useEffect(() => {
    disableFormFields(!isEditing);
  }, [isEditing]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <PatientInfo 
          form={form}
          patients={patients}
          onPatientSelect={handlePatientSelect}
          isEditing={isEditing}
        />

        <ServiceSelection form={form} isEditing={isEditing} />

        <AssessmentNotes form={form} isEditing={isEditing} />
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveNote}
            variant="outline"
            className="bg-green-600 text-white hover:bg-green-700"
            disabled={isSubmitting || !isEditing}
          >
            <Save className="mr-2 h-4 w-4" /> 
            Save Note
          </Button>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90" 
            disabled={isSubmitting || !isEditing}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
