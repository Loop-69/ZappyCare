
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ServiceWithRelations } from "@/types/service";
import { ViewServiceDialog } from "./ViewServiceDialog";
import { EditServiceDialog } from "./EditServiceDialog";
import { useQueryClient } from "@tanstack/react-query";

interface ServiceActionsProps {
  record: ServiceWithRelations;
}

export const ServiceActions = ({ record }: ServiceActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', record.id);

      if (error) throw error;

      toast({
        title: "Service Deleted",
        description: "The service has been successfully removed.",
      });
      
      // Refetch services data instead of reloading the page
      queryClient.invalidateQueries({
        queryKey: ['services'],
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error Deleting Service",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDialogClose = () => {
    setIsViewDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleServiceUpdate = () => {
    // Refetch services data
    queryClient.invalidateQueries({
      queryKey: ['services'],
    });
  };

  return (
    <>
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
            onClick={() => setIsViewDialogOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer" 
            onSelect={(e) => e.preventDefault()}
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
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

      <ViewServiceDialog 
        service={record} 
        isOpen={isViewDialogOpen} 
        onClose={handleViewDialogClose} 
      />
      
      <EditServiceDialog
        service={record}
        isOpen={isEditDialogOpen}
        onClose={handleEditDialogClose}
        onSuccess={handleServiceUpdate}
      />
    </>
  );
};
