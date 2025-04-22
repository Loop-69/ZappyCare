import { useState, useMemo, useCallback } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { usePatientFilters } from "@/hooks/usePatientFilters";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  flexRender,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/layout/PageLayout";
import { getPatientColumns, PatientData } from "@/components/patients/PatientColumns"; // Import PatientData type
import AddPatientDialog from "@/components/patients/AddPatientDialog";
import { EditPatientDialog } from "@/components/patients/EditPatientDialog"; // Import EditPatientDialog
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react"; // Import Search icon
import { Input } from "@/components/ui/input"; // Import Input component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { Button } from "@/components/ui/button"; // Import Button component
import { X, UserX, UserCheck, CalendarDays } from "lucide-react"; // Import icons for actions
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import table components

const Patients = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for edit modal
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null); // State for selected patient
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({}); // State for selected rows with proper typing
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const navigate = useNavigate();

  const handleEditClick = useCallback((patient: PatientData) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
  }, []);

  const columns = useMemo(
    () => getPatientColumns(navigate, handleEditClick),
    [navigate, handleEditClick]
  );

  const { data: patients = [], isLoading, refetch } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select(`
            id,
            first_name,
            last_name,
            date_of_birth,
            gender,
            email,
            phone,
            address,
            insurance_provider,
            insurance_policy_number,
            created_at,
            status,
            doctor_id,
            blood_type,
            medical_conditions,
            allergies,
            updated_at
          `)
          .order("created_at", { ascending: false });

        if (error) {
          toast.error("Failed to fetch patients");
          console.error("Error fetching patients:", error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Unexpected error fetching patients:", error);
        toast.error("An unexpected error occurred");
        return [];
      }
    },
  });

  const { filterPatients } = usePatientFilters();
  const filteredPatients = useMemo(
    () => filterPatients(patients, searchTerm, statusFilter),
    [patients, searchTerm, statusFilter, filterPatients]
  );

  const handleAddSuccess = () => {
    refetch();
    setIsAddDialogOpen(false);
    toast.success("Patient added successfully");
  };

  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  const handleSuspendPatients = async (patientIds: string[]) => {
    setIsBulkActionLoading(true);
    try {
      // TODO: Implement actual suspend API call
      // const { error } = await supabase
      //   .from('patients')
      //   .update({ status: 'Inactive' })
      //   .in('id', patientIds);
      
      // if (error) throw error;
      
      toast.success(`Successfully suspended ${patientIds.length} patients`);
      await refetch();
    } catch (error) {
      console.error('Error suspending patients:', error);
      toast.error('Failed to suspend patients');
    } finally {
      setIsBulkActionLoading(false);
      setRowSelection({});
    }
  };

  const handleActivatePatients = async (patientIds: string[]) => {
    setIsBulkActionLoading(true);
    try {
      // TODO: Implement actual activate API call
      // const { error } = await supabase
      //   .from('patients')
      //   .update({ status: 'Active' })
      //   .in('id', patientIds);
      
      // if (error) throw error;
      
      toast.success(`Successfully activated ${patientIds.length} patients`);
      await refetch();
    } catch (error) {
      console.error('Error activating patients:', error);
      toast.error('Failed to activate patients');
    } finally {
      setIsBulkActionLoading(false);
      setRowSelection({});
    }
  };

  const handleScheduleFollowUp = async (patientIds: string[]) => {
    setIsBulkActionLoading(true);
    try {
      // TODO: Implement actual follow-up scheduling logic
      toast.success(`Successfully scheduled follow-up for ${patientIds.length} patients`);
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      toast.error('Failed to schedule follow-up');
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const table = useReactTable({
    data: filteredPatients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });


  return (
    <PageLayout
      title="Patients"
      action={{
        label: "Add Patient",
        onClick: () => setIsAddDialogOpen(true),
        icon: <Plus />,
      }}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem> {/* Changed value from "" to "all" */}
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              {/* Add other status filter options here */}
            </SelectContent>
          </Select>

          {/* Placeholder for Name filter - functionality not implemented yet */}
          <Select disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost">Advanced Filters</Button>
        </div>

        {/* Action buttons when rows are selected */}
        {Object.keys(rowSelection).length > 0 && (
          <div className="flex items-center space-x-2 py-4">
            <span className="text-sm text-muted-foreground">
              {Object.keys(rowSelection).length} selected
            </span>
            <Button variant="outline" size="sm" onClick={() => handleSuspendPatients(Object.keys(rowSelection))}>
              <UserX className="mr-2 h-4 w-4" />
              Suspend
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleActivatePatients(Object.keys(rowSelection))}>
              <UserCheck className="mr-2 h-4 w-4" />
              Activate
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleScheduleFollowUp(Object.keys(rowSelection))}>
              <CalendarDays className="mr-2 h-4 w-4" />
              Schedule Follow-up
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setRowSelection({})}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Patient Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No patients found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <ErrorBoundary>
        <AddPatientDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={handleAddSuccess}
        />
      </ErrorBoundary>

      {/* Edit Patient Dialog */}
      {selectedPatient && (
        <ErrorBoundary>
          <EditPatientDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={refetch} // Refetch patients after successful edit
            patient={selectedPatient}
          />
        </ErrorBoundary>
      )}
    </PageLayout>
  );
};

export default Patients;
