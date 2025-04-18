
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const consultationFormSchema = z.object({
  patient_id: z.string().uuid({ message: "Please select a patient" }),
  service: z.string().min(1, { message: "Please enter a service" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  hpi: z.string().optional(),
  pmh: z.string().optional(),
  contra_indications: z.string().optional(),
  message: z.string().optional(),
  assessment: z.string().optional(),
  treatment_approach: z.string().optional(),
  preferred_medication: z.string().optional(),
  preferred_plan: z.string().optional(),
  form_completed: z.boolean().default(false),
});

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export const useConsultationForm = (onSuccess?: () => void) => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      hpi: "",
      pmh: "",
      contra_indications: "",
      message: "",
      assessment: "",
      treatment_approach: "maintenance",
      service: "weight-management",
      patient_id: "",
      email: "",
      preferred_medication: "",
      preferred_plan: "",
      form_completed: false,
    },
  });

  const handleSubmit = async (values: ConsultationFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting consultation with values:", values);
      
      const consultationData = {
        patient_id: values.patient_id,
        service: values.service,
        email: values.email,
        preferred_medication: values.preferred_medication || null,
        preferred_plan: values.preferred_plan || null,
        form_completed: values.form_completed,
        status: 'Pending'
      };

      const { error } = await supabase
        .from("consultations")
        .insert(consultationData)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating consultation:", error);
        throw error;
      }
      
      if (values.assessment) {
        await handleSaveNote(values);
      }
      
      toast.success("Consultation created successfully");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating consultation:", error);
      toast.error("Failed to create consultation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveNote = async (values: ConsultationFormValues) => {
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
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  const handlePatientSelect = (patientId: string) => {
    // Find the selected patient from patients list
    const patient = form.getValues("patient_id");
    setSelectedPatient(patient);
    
    // When a patient is selected, we also need to set their email
    const patients = form.getValues();
    if (patient) {
      // This would ideally get the patient's email from the API or local state
      const patientEmail = patients.email;
      form.setValue("email", patientEmail);
    }
  };

  return {
    form,
    selectedPatient,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
    handlePatientSelect,
    handleSaveNote: () => handleSaveNote(form.getValues()),
  };
};
