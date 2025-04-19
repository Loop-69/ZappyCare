import { useState, useEffect, useMemo } from "react"; // Import useMemo
import { useQuery } from "@tanstack/react-query";
import { Percent, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Discount } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import PageLayout from "@/components/layout/PageLayout";
import { AddDiscountDialog } from "@/components/discounts/AddDiscountDialog";
import DiscountColumns from "@/components/discounts/DiscountColumns";
import { Button } from "@/components/ui/button";
import { EditDiscountDialog } from "@/components/discounts/EditDiscountDialog";
import { Input } from "@/components/ui/input"; // Import Input
import {
  DropdownMenu, // Import DropdownMenu components
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react"; // Import ChevronDown
import { BaseModal } from "@/components/modals/BaseModal"; // Import BaseModal

const Discounts = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [selectedType, setSelectedType] = useState("All Types"); // State for type filter
  const [selectedStatus, setSelectedStatus] = useState("All Statuses"); // State for status filter
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete dialog
  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(null); // State for discount to delete

  const {
    data: discounts,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["discounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Discount[];
    }
  });

  useEffect(() => {
    const handleDiscountUpdated = () => {
      refetch();
    };

    window.addEventListener('discount-updated', handleDiscountUpdated);
    return () => {
      window.removeEventListener('discount-updated', handleDiscountUpdated);
    };
  }, [refetch]);

  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDiscountClick = (discount: Discount) => {
    setDiscountToDelete(discount);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteDiscount = async () => {
    if (discountToDelete) {
      const { error } = await supabase
        .from('discounts')
        .delete()
        .eq('id', discountToDelete.id);

      if (error) {
        console.error('Error deleting discount:', error);
        // TODO: Show a toast notification for error
      } else {
        refetch();
        // TODO: Show a toast notification for success
      }

      setIsDeleteDialogOpen(false);
      setDiscountToDelete(null);
    }
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedDiscount(null);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setDiscountToDelete(null);
  };

  const filteredDiscounts = useMemo(() => {
    if (!discounts) return [];

    return discounts.filter(discount => {
      const matchesSearch = searchTerm === "" ||
        discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discount.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === "All Types" || discount.type === selectedType;
      const matchesStatus = selectedStatus === "All Statuses" || discount.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [discounts, searchTerm, selectedType, selectedStatus]);

  const discountTypes = useMemo(() => {
    if (!discounts) return [];
    const types = new Set(discounts.map(discount => discount.type));
    return ["All Types", ...Array.from(types)];
  }, [discounts]);

  const discountStatuses = useMemo(() => {
    if (!discounts) return [];
    const statuses = new Set(discounts.map(discount => discount.status));
    return ["All Statuses", ...Array.from(statuses)];
  }, [discounts]);


  return (
    <>
      <PageLayout
        title="Discount Management"
        action={{
          label: "Add Discount",
          onClick: () => setIsAddDialogOpen(true),
          icon: <Plus size={16} />,
        }}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4"> {/* Container for search and filters */}
            <div className="relative w-72">
              <Input
                placeholder="Search discounts by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <ChevronDown className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> {/* Changed icon to ChevronDown */}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {selectedType} <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                {discountTypes.map(type => (
                  <DropdownMenuItem key={type} onClick={() => setSelectedType(type)}>
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {selectedStatus} <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                {discountStatuses.map(status => (
                  <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>


          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              Loading discounts...
            </div>
          ) : filteredDiscounts.length > 0 ? ( // Use filteredDiscounts
            <DataTable
              columns={DiscountColumns({ onEdit: handleEditDiscount, onDelete: handleDeleteDiscountClick })} // Pass handleDeleteDiscountClick
              data={filteredDiscounts} // Pass filteredDiscounts
              // Removed filterKey and searchPlaceholder to use external search
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Percent size={48} className="text-muted-foreground" />
              <div className="text-xl font-semibold text-muted-foreground">
                No discounts found
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                Create a Discount
              </Button>
            </div>
          )}
        </div>
      </PageLayout>

      <AddDiscountDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onDiscountAdded={refetch}
      />

      {selectedDiscount && (
        <EditDiscountDialog
          isOpen={isEditDialogOpen}
          onClose={handleEditDialogClose}
          discount={selectedDiscount}
          onDiscountUpdated={refetch}
        />
      )}

      <BaseModal // Confirmation dialog for delete
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        title="Confirm Deletion"
        primaryAction={{
          label: "Delete",
          onClick: confirmDeleteDiscount,
          disabled: !discountToDelete,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: handleDeleteDialogClose,
        }}
      >
        <p>Are you sure you want to delete the discount "{discountToDelete?.name}"?</p>
      </BaseModal>
    </>
  );
};

export default Discounts;
