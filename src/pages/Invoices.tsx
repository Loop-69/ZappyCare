
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { InvoiceColumns } from "@/components/invoices/InvoiceColumns";
import { AddInvoiceDialog } from "@/components/invoices/AddInvoiceDialog";
import PageLayout from "@/components/layout/PageLayout";
import { Invoice } from "@/types";

export default function Invoices() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { 
    data: invoices = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase.from('invoices').select('*');
        
      if (error) throw error;
      
      // Using type assertion here to resolve the type mismatch
      return data as unknown as Invoice[];
    }
  });

  function getRowClassName(invoice: Invoice) {
    if (invoice.status === "Overdue") {
      return "bg-red-50";
    }
    return "";
  }

  return (
    <PageLayout
      title="Invoices"
      description="Manage patient invoices and payments"
      action={{
        label: "Create Invoice",
        onClick: () => setIsDialogOpen(true)
      }}
    >
      <DataTable 
        columns={InvoiceColumns} 
        data={invoices} 
        filterKey="invoice_id" 
        searchPlaceholder="Search invoices..."
        rowClassName={getRowClassName}
      />

      <AddInvoiceDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={refetch}
      />
    </PageLayout>
  );
}
