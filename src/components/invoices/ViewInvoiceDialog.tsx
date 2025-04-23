import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Invoice } from "@/types";

interface ViewInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice;
}

export function ViewInvoiceDialog({ open, onClose, invoice }: ViewInvoiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Invoice ID</h4>
              <p>{invoice.invoice_id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <p>{invoice.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Patient</h4>
              <p>{invoice.patient_name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
              <p>{invoice.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Issue Date</h4>
              <p>{format(new Date(invoice.issue_date), "PPP")}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Due Date</h4>
              <p>{format(new Date(invoice.due_date), "PPP")}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Items</h4>
            <div className="border rounded-lg divide-y">
              {invoice.items?.map((item, index) => (
                <div key={index} className="p-4 grid grid-cols-4 gap-4">
                  <div>{item.description}</div>
                  <div className="text-right">{item.quantity}</div>
                  <div className="text-right">${item.unit_price.toFixed(2)}</div>
                  <div className="text-right font-medium">
                    ${(item.quantity * item.unit_price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-lg font-medium">
              Total: ${invoice.amount.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              Paid: ${invoice.amount_paid.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
