
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { TaskColumns } from "@/components/tasks/TaskColumns";
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog";
import PageLayout from "@/components/layout/PageLayout";
import { Task } from "@/types";

export default function Tasks() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { 
    data: tasks = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      // First fetch tasks without the join to ensure we get the basic task data
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (taskError) throw taskError;
      
      // For each task, try to fetch patient info separately if patient_id exists
      const tasksWithPatients = await Promise.all(taskData.map(async (task) => {
        if (!task.patient_id) {
          return { ...task, patients: null };
        }
        
        // Fetch patient info
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('first_name, last_name')
          .eq('id', task.patient_id)
          .single();
          
        if (patientError || !patientData) {
          return { ...task, patients: null };
        }
        
        return {
          ...task,
          patients: patientData
        };
      }));
      
      return tasksWithPatients as Task[];
    }
  });

  function getRowClassName(task: Task) {
    if (task.status === "Todo" && task.priority === "High") {
      return "bg-red-50";
    }
    return "";
  }

  return (
    <PageLayout
      title="Tasks"
      description="Manage and track tasks"
      action={{
        label: "Create Task",
        onClick: () => setIsDialogOpen(true)
      }}
    >
      <DataTable 
        columns={TaskColumns} 
        data={tasks} 
        filterKey="title" 
        searchPlaceholder="Search tasks..."
        rowClassName={getRowClassName}
      />

      <AddTaskDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={refetch}
      />
    </PageLayout>
  );
}
