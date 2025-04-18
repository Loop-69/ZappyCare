
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { EditTaskDialog } from "./EditTaskDialog";

interface TaskActionsProps {
  task: Task;
}

export function TaskActions({ task }: TaskActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      // Use "tasks" table that now exists
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id);

      if (error) throw error;

      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete the task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" onClick={() => setIsEditDialogOpen(true)}>
          <Edit className="h-4 w-4 text-blue-600" />
          <span className="sr-only">Edit</span>
          <span className="ml-2 text-blue-600">Edit</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
          <Trash2 className="h-4 w-4 text-red-600" />
          <span className="sr-only">Delete</span>
          <span className="ml-2 text-red-600">Delete</span>
        </Button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task "{task.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditTaskDialog 
        task={task} 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }}
      />
    </>
  );
}
