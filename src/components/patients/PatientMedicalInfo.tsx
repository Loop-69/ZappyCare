
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Patient } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PatientMedicalInfoProps {
  patient: Patient;
}

export function PatientMedicalInfo({ patient }: PatientMedicalInfoProps) {
  // Fetch provider name if doctor_id exists
  const { data: doctorData } = useQuery({
    queryKey: ["doctor", patient.doctor_id],
    queryFn: async () => {
      if (!patient.doctor_id) return null;
      
      const { data, error } = await supabase
        .from("providers")
        .select("name")
        .eq("id", patient.doctor_id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!patient.doctor_id,
  });

  // Fetch medical conditions from patient if available
  const medicalConditions = patient.medical_conditions && Array.isArray(patient.medical_conditions)
    ? patient.medical_conditions.join(", ")
    : "None";

  // Fetch allergies from patient if available
  const allergies = patient.allergies && Array.isArray(patient.allergies)
    ? patient.allergies.join(", ")
    : "None";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Assigned Doctor</p>
          <p>{doctorData ? doctorData.name : (patient.doctor_id || "Not assigned")}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Medical Conditions</p>
          <p>{medicalConditions || "None reported"}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Allergies</p>
          <p>{allergies || "None reported"}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Blood Type</p>
          <p>{patient.blood_type || "Not recorded"}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Medical Notes</p>
          <p>{"No notes available"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
