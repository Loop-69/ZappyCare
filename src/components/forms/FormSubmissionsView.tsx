
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormSubmissionsViewProps {
  formId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FormSubmissionsView({ formId, isOpen, onClose }: FormSubmissionsViewProps) {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["form-submissions", formId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("form_submissions")
        .select(`
          *,
          form_templates (
            title
          )
        `)
        .eq("form_template_id", formId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: isOpen && !!formId,
  });

  const columns = [
    {
      accessorKey: "created_at",
      header: "Submitted At",
      cell: ({ row }) => format(new Date(row.getValue("created_at")), "PPpp"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            row.getValue("status") === "completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          )}
        >
          {row.getValue("status")}
        </span>
      ),
    },
    {
      accessorKey: "responses",
      header: "Responses",
      cell: ({ row }) => (
        <pre className="max-w-md overflow-auto text-sm">
          {JSON.stringify(row.getValue("responses"), null, 2)}
        </pre>
      ),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Form Submissions</DialogTitle>
          <DialogDescription>
            View all submissions for this form
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {isLoading ? (
            <div>Loading submissions...</div>
          ) : (
            <DataTable
              columns={columns}
              data={submissions}
              noDataMessage="No submissions found for this form"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
