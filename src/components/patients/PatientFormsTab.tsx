
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { FormInput, Plus, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssignFormDialog } from "@/components/forms/AssignFormDialog";
import { useState } from "react";

interface PatientFormsTabProps {
  patientId: string;
}

interface FormSubmission {
  id: string;
  form_template_id: string;
  status: string;
  created_at: string;
  form_template?: {
    title: string;
  };
}

export default function PatientFormsTab({ patientId }: PatientFormsTabProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  const { data: forms, isLoading, refetch } = useQuery({
    queryKey: ["patient-forms", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("form_submissions")
        .select(`*, form_template:form_templates(title)`)
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data as FormSubmission[];
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Forms</h2>
        <Button onClick={() => setIsAssignDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Assign Form
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading forms...</div>
      ) : forms && forms.length > 0 ? (
        <div className="space-y-2">
          {forms.map((form) => (
            <div 
              key={form.id} 
              className="bg-white border rounded-md p-4 flex justify-between items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FormInput className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {form.form_template?.title || "Unknown Form"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Submitted on {format(new Date(form.created_at), "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(form.status)}>
                  {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                </Badge>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <FormInput className="h-8 w-8 mx-auto text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No forms yet</h3>
          <p className="text-muted-foreground mb-4">
            This patient hasn't completed any forms.
          </p>
          <Button onClick={() => setIsAssignDialogOpen(true)}>
            Assign First Form
          </Button>
        </div>
      )}

      <AssignFormDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        patientId={patientId}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}
