
import { ConsultationDialog } from "./ConsultationDialog";

interface AddConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddConsultationDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: AddConsultationDialogProps) => {
  return (
    <ConsultationDialog
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
};

export default AddConsultationDialog;
