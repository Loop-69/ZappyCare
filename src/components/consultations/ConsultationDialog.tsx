
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ConsultationForm } from "./ConsultationForm";

interface ConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
import { Consultation } from "@/types/consultation-types";

interface ConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  consultation?: Consultation;
  isEditing?: boolean;
}

export const ConsultationDialog = ({
  open,
  onOpenChange,
  onSuccess,
  consultation,
  isEditing,
}: ConsultationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold">{isEditing ? "Edit Consultation" : consultation ? "View Consultation" : "New Consultation"}</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
          <ConsultationForm onOpenChange={onOpenChange} onSuccess={onSuccess} consultation={consultation} isEditing={isEditing} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
