
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, MoreVertical, Pencil, Trash2, Copy, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { FormSubmissionsView } from "./FormSubmissionsView";

interface FormTemplate {
  id: string;
  title: string;
  description: string | null;
  status: string;
  fields: any[];
  created_at: string | null;
  updated_at: string | null;
  submission_count: number;
}

interface FormListProps {
  forms: FormTemplate[];
}

export function FormList({ forms }: FormListProps) {
  const navigate = useNavigate();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const handleEditForm = (formId: string) => {
    navigate(`/forms/builder/${formId}`);
  };

  const handleDuplicateForm = (form: FormTemplate) => {
    toast.info("Duplicate form functionality coming soon");
  };

  const handleDeleteForm = (formId: string) => {
    toast.info("Delete form functionality coming soon");
  };

  const handleViewSubmissions = (formId: string) => {
    setSelectedFormId(formId);
  };

  if (!forms.length) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No forms</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new form.</p>
        <div className="mt-6">
          <Button onClick={() => navigate("/forms/builder")}>Create new form</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Form</TableHead>
              <TableHead>Fields</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{form.title}</div>
                      {form.description && (
                        <div className="text-sm text-gray-500 truncate max-w-[300px]">
                          {form.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{form.fields?.length || 0} fields</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    form.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {form.status === 'active' ? 'Active' : form.status}
                  </span>
                </TableCell>
                <TableCell>{form.submission_count || 0}</TableCell>
                <TableCell>
                  {form.updated_at 
                    ? formatDistanceToNow(new Date(form.updated_at), { addSuffix: true }) 
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditForm(form.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewSubmissions(form.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View submissions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateForm(form)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500" 
                        onClick={() => handleDeleteForm(form.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedFormId && (
        <FormSubmissionsView
          formId={selectedFormId}
          isOpen={!!selectedFormId}
          onClose={() => setSelectedFormId(null)}
        />
      )}
    </>
  );
}
