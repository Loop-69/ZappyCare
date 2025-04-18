
import { format } from "date-fns";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types";

interface TasksListProps {
  tasks: Task[];
  isLoading: boolean;
}

export const TasksList = ({ tasks = [], isLoading }: TasksListProps) => {
  const queryClient = useQueryClient();

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    try {
      return format(new Date(dateString), "MM/dd/yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: "Done" })
        .eq("id", taskId);
      
      if (error) throw error;
      
      toast.success("Task marked as complete");
      queryClient.invalidateQueries({ queryKey: ["dashboard-tasks"] });
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete task");
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Tasks</CardTitle>
          <Button variant="link" size="sm" asChild>
            <Link to="/tasks">View All</Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Tasks</CardTitle>
        <Button variant="link" size="sm" asChild>
          <Link to="/tasks">+ Add Task</Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {tasks && tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due: {formatDueDate(task.due_date)}
                    {task.patients && (
                      <> • {task.patients.first_name} {task.patients.last_name}</>
                    )}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full h-8 w-8 p-0"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  ✓
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckSquare className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No tasks available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
