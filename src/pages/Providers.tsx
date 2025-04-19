
import { useState, useMemo } from "react"; // Import useMemo
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { ProviderColumns } from "@/components/providers/ProviderColumns";
import { AddProviderDialog } from "@/components/providers/AddProviderDialog";
import { EditProviderDialog } from "@/components/providers/EditProviderDialog";
import PageLayout from "@/components/layout/PageLayout";
import { Provider } from "@/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input"; // Import Input
import {
  DropdownMenu, // Import DropdownMenu components
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter } from "lucide-react"; // Import ChevronDown and Filter
import { Button } from "@/components/ui/button"; // Import Button

export default function Providers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties"); // State for specialty filter

  const {
    data: providers = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error(`Error fetching providers: ${error.message}`);
        throw error;
      }

      return data as Provider[];
    }
  });

  const handleEditProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProvider = (providerId: string) => {
    // TODO: Implement delete functionality with confirmation
    console.log('Delete provider with ID:', providerId);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedProvider(null);
  };

  const filteredProviders = useMemo(() => {
    if (!providers) return [];

    return providers.filter(provider => {
      const matchesSearch = searchTerm === "" ||
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.phone?.toLowerCase().includes(searchTerm.toLowerCase()); // Include phone in search

      const matchesSpecialty = selectedSpecialty === "All Specialties" || provider.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [providers, searchTerm, selectedSpecialty]);

  const specialties = useMemo(() => {
    if (!providers) return [];
    const uniqueSpecialties = new Set(providers.map(provider => provider.specialty));
    return ["All Specialties", ...Array.from(uniqueSpecialties)];
  }, [providers]);


  return (
    <PageLayout
      title="Provider Management" // Changed title to match image
      description="Manage and track medical providers"
      action={{
        label: "Add Provider",
        onClick: () => setIsAddDialogOpen(true),
        // className: "bg-purple-600 hover:bg-purple-700", // Removed className from here
      }}
    >
      <div className="flex items-center gap-4 mb-4"> {/* Container for search and filter */}
        <div className="relative w-72">
          <Input
            placeholder="Search providers..." // Changed placeholder to match image
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> {/* Changed icon to Filter */}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {selectedSpecialty} <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Specialty</DropdownMenuLabel>
            {specialties.map(specialty => (
              <DropdownMenuItem key={specialty} onClick={() => setSelectedSpecialty(specialty)}>
                {specialty}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DataTable
        columns={ProviderColumns({ onEdit: handleEditProvider, onDelete: handleDeleteProvider })}
        data={filteredProviders} // Use filteredProviders
        filterKey="name" // Keep filterKey for DataTable's internal filtering if needed, but our filtering is external now
        searchPlaceholder="Search providers..." // This will be overridden by our custom search input
      />

      <AddProviderDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={refetch}
      />

      {selectedProvider && (
        <EditProviderDialog
          isOpen={isEditDialogOpen}
          onClose={handleEditDialogClose}
          provider={selectedProvider}
          onProviderUpdated={refetch}
        />
      )}
    </PageLayout>
  );
}
