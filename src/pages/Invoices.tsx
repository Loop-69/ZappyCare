
import { useState } from "react";
import { ViewInvoiceDialog } from "@/components/invoices/ViewInvoiceDialog";
import { EditInvoiceDialog } from "@/components/invoices/EditInvoiceDialog";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { getInvoiceColumns } from "@/components/invoices/InvoiceColumns";
import { AddInvoiceDialog } from "@/components/invoices/AddInvoiceDialog";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { Invoice } from "@/types";

export default function Invoices() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  const { toast } = useToast();
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

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditDialogOpen(true);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedInvoice) return;
    
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', selectedInvoice.id);
    
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "Invoice deleted successfully",
    });
    refetch();
  };

  return (
    <PageLayout
      title="Invoices"
      description="Manage patient invoices and payments"
      action={{
        label: "Create Invoice",
        onClick: () => setIsAddDialogOpen(true)
      }}
    >
      <DataTable 
        columns={getInvoiceColumns({
          onView: handleViewInvoice,
          onEdit: handleEditInvoice,
          onDelete: handleDeleteInvoice,
        })} 
        data={invoices} 
        filterKey="invoice_id" 
        searchPlaceholder="Search invoices..."
        rowClassName={getRowClassName}
      />

      <AddInvoiceDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={refetch}
      />

      {selectedInvoice && (
        <>
          <ViewInvoiceDialog
            open={isViewDialogOpen}
            onClose={() => setIsViewDialogOpen(false)}
            invoice={selectedInvoice}
          />

          <EditInvoiceDialog
            open={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSuccess={refetch}
            invoice={selectedInvoice}
          />

          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
            title="Delete Invoice"
            description={`Are you sure you want to delete invoice ${selectedInvoice.invoice_id}? This action cannot be undone.`}
          />
        </>
      )}
    </PageLayout>
  );
}
