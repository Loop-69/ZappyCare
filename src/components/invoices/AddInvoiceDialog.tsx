
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import * as z from "zod";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, 
  FormLabel, FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Patient, Invoice, InvoiceItem } from "@/types";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { PatientSelect } from "@/components/patients/PatientSelect";
import { DatabaseSelect } from "@/components/ui/database-select";

const invoiceSchema = z.object({
  patient_id: z.string().min(1, "Patient is required"),
  email: z.string().email("Please enter a valid email address"),
  due_date: z.date({
    required_error: "Due date is required",
  }),
  items: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      unit_price: z.coerce.number().min(0, "Price must be a positive number"),
    })
  ).min(1, "At least one item is required"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface AddInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddInvoiceDialog({ open, onClose, onSuccess }: AddInvoiceDialogProps) {
  const [items, setItems] = useState<{ description: string; quantity: number; unit_price: number }[]>([{ description: "", quantity: 1, unit_price: 0 }]);
  const [total, setTotal] = useState(0);
  
  // Fetch products for line items
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return data;
    }
  });
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      email: "",
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      items: [{ description: "", quantity: 1, unit_price: 0 }],
    },
  });

  // Fetch patients for the dropdown
  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase.from('patients').select('*');
      if (error) throw error;
      return data as unknown as Patient[];
    }
  });

  // Update total and form items when items change
  const updateItems = (newItems: { description: string; quantity: number; unit_price: number }[]) => {
    setItems(newItems);
    form.setValue('items', newItems);
    
    const newTotal = newItems.reduce(
      (sum, item) => sum + item.quantity * item.unit_price, 
      0
    );
    setTotal(newTotal);
  };

  const addItem = () => {
    const newItems = [...items, { description: "", quantity: 1, unit_price: 0 }];
    updateItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return; // Keep at least one item
    const newItems = items.filter((_, i) => i !== index);
    updateItems(newItems);
  };

  const updateItemField = (index: number, field: keyof typeof items[0], value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateItems(newItems);
  };

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient?.email) {
      form.setValue('email', patient.email);
    }
  };

  const onSubmit = async (data: InvoiceFormValues) => {
    console.log("Attempting to create invoice with data:", data); // Log the data being submitted
    try {
      const selectedPatient = patients.find(p => p.id === data.patient_id);
      console.log("Selected patient:", selectedPatient); // Log selected patient

      // Generate invoice ID (INV-XXX)
      const { count, error: countError } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Supabase count error:', countError); // Log Supabase count error
        throw countError;
      }
      console.log("Invoice count:", count); // Log invoice count

      const invoiceNumber = (count || 0) + 1;
      const invoice_id = `INV-${invoiceNumber.toString().padStart(3, '0')}`;
      console.log("Generated invoice ID:", invoice_id); // Log generated invoice ID

      // Calculate total amount
      const amount = data.items.reduce(
        (sum, item) => sum + (item.quantity * item.unit_price),
        0
      );
      console.log("Calculated total amount:", amount); // Log calculated amount

      // Prepare items with total field
      const itemsWithTotal = data.items.map(item => ({
        ...item,
        total: item.quantity * item.unit_price
      }));
      console.log("Items with total:", itemsWithTotal); // Log items with total

      // Insert the invoice
      const { data: insertedInvoice, error: insertError } = await supabase.from('invoices').insert({
        patient_id: data.patient_id,
        issue_date: new Date().toISOString(),
        due_date: data.due_date.toISOString(),
        amount: amount,
        amount_paid: 0,
        status: 'Pending',
        invoice_id: invoice_id,
        email: data.email,
        patient_name: `${selectedPatient?.first_name} ${selectedPatient?.last_name}`,
        items: itemsWithTotal,
      }).select(); // Select the inserted data to check for errors

      if (insertError) {
        console.error('Supabase insertion error:', insertError); // Log Supabase insertion error
        throw insertError;
      }
      console.log("Supabase insertion result:", insertedInvoice); // Log insertion result

      console.log("Invoice created successfully"); // Log success
      toast.success("Invoice created successfully");
      onSuccess();
      onClose();
    } catch (error: Error | unknown) {
      console.error('Error creating invoice:', error);
      toast.error(`Failed to create invoice: ${error.message}`); // Include error message in toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <PatientSelect
                    value={field.value}
                    onChange={field.onChange}
                    onPatientSelect={(patient) => {
                      if (patient.email) {
                        form.setValue('email', patient.email);
                      }
                    }}
                    label="Customer"
                    placeholder="Select a customer"
                    required
                  />
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="customer@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="font-medium mb-2">Line Items</h3>
              
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-end gap-2 mb-2">
                    <div className="flex-1">
                      <DatabaseSelect
                        table="products"
                        valueField="id"
                        displayField="name"
                        value={item.product_id || ""}
                        onChange={(value) => {
                          const product = products.find(p => p.id === value);
                          if (product) {
                            updateItemField(index, "description", product.name);
                            updateItemField(index, "unit_price", product.price || 0);
                            updateItemField(index, "product_id", value);
                          }
                        }}
                        placeholder="Select a product"
                        queryKey="products-select"
                      />
                    </div>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItemField(index, "quantity", parseInt(e.target.value) || 1)}
                      className="w-20"
                      min={1}
                    />
                    <Input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => updateItemField(index, "unit_price", parseFloat(e.target.value) || 0)}
                      className="w-24"
                      step="0.01"
                      min={0}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addItem}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>Total: ${total.toFixed(2)}</div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create Invoice</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
