
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { TaskColumns } from "@/components/tasks/TaskColumns";
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog";
import PageLayout from "@/components/layout/PageLayout";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, FilterIcon } from "lucide-react";

export default function Tasks() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [patientFilter, setPatientFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

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

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (globalFilter) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }

    if (patientFilter) {
      filtered = filtered.filter(task =>
        task.patients?.first_name?.toLowerCase().includes(patientFilter.toLowerCase()) ||
        task.patients?.last_name?.toLowerCase().includes(patientFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    return filtered;
  }, [tasks, globalFilter, patientFilter, statusFilter]);


  function getRowClassName(task: Task) {
    if (task.status === "Todo" && task.priority === "High") {
      return "bg-red-50";
    }
    return "";
  }

  const selectedRowCount = Object.keys(rowSelection).length;

  return (
    <PageLayout
      title="Tasks"
      description="Manage and track tasks"
      action={{
        label: "Create Task",
        onClick: () => setIsDialogOpen(true)
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search tasks..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <FilterIcon className="mr-2 h-4 w-4" />
                All Patients <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Patient</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* This should be dynamically populated with patient names */}
              <DropdownMenuCheckboxItem
                checked={patientFilter === null}
                onCheckedChange={() => setPatientFilter(null)}
              >
                All Patients
              </DropdownMenuCheckboxItem>
              {/* Example patient filter - replace with dynamic data */}
              <DropdownMenuCheckboxItem
                checked={patientFilter === 'John'}
                onCheckedChange={() => setPatientFilter('John')}
              >
                John Doe
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <FilterIcon className="mr-2 h-4 w-4" />
                All Statuses <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Dynamically populate with status options */}
              <DropdownMenuCheckboxItem
                checked={statusFilter === null}
                onCheckedChange={() => setStatusFilter(null)}
              >
                All Statuses
              </DropdownMenuCheckboxItem>
              {/* Example status filters - replace with dynamic data */}
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'Todo'}
                onCheckedChange={() => setStatusFilter('Todo')}
              >
                Todo
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'In Progress'}
                onCheckedChange={() => setStatusFilter('In Progress')}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'Done'}
                onCheckedChange={() => setStatusFilter('Done')}
              >
                Done
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">Advanced Filters</Button>
        </div>
        {selectedRowCount > 0 && (
          <div className="flex items-center space-x-2">
            <span>{selectedRowCount} selected</span>
            <Button variant="outline">Mark Complete</Button>
          </div>
        )}
      </div>
      <DataTable
        columns={TaskColumns}
        data={filteredTasks}
        rowClassName={getRowClassName}
        onRowSelectionChange={setRowSelection}
        state={{
          rowSelection,
        }}
      />

      <AddTaskDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={refetch}
      />
    </PageLayout>
  );
}
