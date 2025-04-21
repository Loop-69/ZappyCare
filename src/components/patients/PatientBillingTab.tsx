
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CreditCard, Plus, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/types";

interface PatientBillingTabProps {
  patientId: string;
}

export default function PatientBillingTab({ patientId }: PatientBillingTabProps) {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["patient-invoices", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("patient_id", patientId)
        .order("issue_date", { ascending: false });
        
      if (error) throw error;
      // Cast data to Invoice[] type since we know the shape matches
      return data as unknown as Invoice[];
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Invoices & Payments</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading billing information...</div>
      ) : invoices && invoices.length > 0 ? (
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <div 
              key={invoice.id} 
              className="bg-white border rounded-md p-4 flex justify-between items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    Invoice #{invoice.invoice_id}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Issued: {format(new Date(invoice.issue_date), "MMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Due: {format(new Date(invoice.due_date), "MMM d, yyyy")}
                </p>
              </div>
              <div className="text-right space-y-2">
                <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                <Badge className={getStatusColor(invoice.status)}>
                  {getStatusIcon(invoice.status)} 
                  <span className="ml-1">
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </Badge>
                <div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <CreditCard className="h-8 w-8 mx-auto text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No invoices yet</h3>
          <p className="text-muted-foreground mb-4">
            This patient doesn't have any invoices or billing history.
          </p>
          <Button>
            Create First Invoice
          </Button>
        </div>
      )}
    </div>
  );
}
