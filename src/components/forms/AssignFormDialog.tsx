
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FormSelect } from "@/components/forms/FormSelect";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface AssignFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onSuccess?: () => void;
}

export function AssignFormDialog({ open, onOpenChange, patientId, onSuccess }: AssignFormDialogProps) {
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedForm) {
      toast.error("Please select a form");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("form_submissions")
        .insert({
          form_template_id: selectedForm,
          patient_id: patientId,
          status: "pending",
        });

      if (error) throw error;

      toast.success("Form assigned successfully");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning form:", error);
      toast.error("Failed to assign form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Form</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <FormSelect
            value={selectedForm}
            onValueChange={setSelectedForm}
            placeholder="Select a form to assign..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Assigning..." : "Assign Form"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
