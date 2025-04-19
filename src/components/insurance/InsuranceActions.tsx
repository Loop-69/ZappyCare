
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { InsuranceRecord } from "@/types/insurance-types";

interface InsuranceActionsProps {
  record: InsuranceRecord;
  onViewDetails: (record: InsuranceRecord) => void;
}

export const InsuranceActions = ({ record, onViewDetails }: InsuranceActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('insurance_records')
        .delete()
        .eq('id', record.id);

      if (error) throw error;

      toast.success("Insurance Record Deleted");
      // Assuming a successful delete should also trigger a refetch in the parent component
      // You might need to add an onSuccess prop to InsuranceActions if this is the case
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Error deleting record: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => e.preventDefault()}
          onClick={() => onViewDetails(record)} // Call onViewDetails
        >
          <Edit className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-destructive"
          onSelect={(e) => e.preventDefault()}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
