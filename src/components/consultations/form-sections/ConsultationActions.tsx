
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConsultationActionsProps {
  onCancel: () => void;
  onSaveNote: () => void;
  isSubmitting: boolean;
}

export const ConsultationActions = ({
  onCancel,
  onSaveNote,
  isSubmitting,
}: ConsultationActionsProps) => {
  return (
    <div className="flex justify-end gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={onSaveNote}
        variant="outline"
        className="bg-green-600 text-white hover:bg-green-700"
        disabled={isSubmitting}
      >
        Save Note
      </Button>
      <Button 
        type="submit" 
        className="bg-primary hover:bg-primary/90" 
        disabled={isSubmitting}
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
  );
};
