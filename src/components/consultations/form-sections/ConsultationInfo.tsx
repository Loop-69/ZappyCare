
import { UseFormReturn } from "react-hook-form";
import { ConsultationFormValues } from "@/hooks/useConsultationForm";
import { PatientInfoSection } from "../sections/PatientInfoSection";
import { ServiceMedicationSection } from "../sections/ServiceMedicationSection";
import { MessageSection } from "../sections/MessageSection";
import { AssessmentSection } from "../sections/AssessmentSection";

interface ConsultationInfoProps {
  form: UseFormReturn<ConsultationFormValues>;
}

export const ConsultationInfo = ({ form }: ConsultationInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium">Patient Information</h3>
          <span className="text-sm text-blue-600">Patient-reported</span>
        </div>
        <PatientInfoSection
          hpi={form.watch("hpi") || ""}
          pmh={form.watch("pmh") || ""}
          contraIndications={form.watch("contra_indications") || ""}
          onHpiChange={(value) => form.setValue("hpi", value)}
          onPmhChange={(value) => form.setValue("pmh", value)}
          onContraIndicationsChange={(value) => form.setValue("contra_indications", value)}
        />
      </div>
      
      <div className="space-y-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium">Service & Medication Order</h3>
          <span className="text-sm text-purple-600">Provider only</span>
        </div>
        <ServiceMedicationSection
          serviceType={form.watch("service")}
          treatmentApproach={form.watch("treatment_approach") || ""}
          preferredMedication={form.watch("preferred_medication") || ""}
          preferredPlan={form.watch("preferred_plan") || ""}
          onServiceTypeChange={(value) => form.setValue("service", value)}
          onTreatmentApproachChange={(value) => form.setValue("treatment_approach", value)}
          onPreferredMedicationChange={(value) => form.setValue("preferred_medication", value)}
          onPreferredPlanChange={(value) => form.setValue("preferred_plan", value)}
        />
        
        <MessageSection
          message={form.watch("message") || ""}
          onMessageChange={(value) => form.setValue("message", value)}
        />
        
        <AssessmentSection
          assessment={form.watch("assessment") || ""}
          onAssessmentChange={(value) => form.setValue("assessment", value)}
        />
      </div>
    </div>
  );
};
