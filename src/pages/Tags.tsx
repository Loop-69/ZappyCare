
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { TagColumns } from "@/components/tags/TagColumns";
import PageLayout from "@/components/layout/PageLayout";
import { PlusCircle } from "lucide-react";
import { Tag } from "@/types/tag";
import { TagDialog } from "@/components/tags/TagDialog";
import { toast } from "sonner";

export default function Tags() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { 
    data: tags = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        toast.error(`Error fetching tags: ${error.message}`);
        throw error;
      }
      
      return data as Tag[];
    }
  });

  return (
    <PageLayout
      title="Tags"
      description="Manage and organize tags for your application"
      action={{
        label: "Add Tag",
        onClick: () => setIsDialogOpen(true),
        icon: <PlusCircle className="h-4 w-4" />
      }}
    >
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <DataTable 
          columns={TagColumns} 
          data={tags} 
          filterKey="name" 
          searchPlaceholder="Search tags..."
          noDataMessage="No tags found. Create your first tag!"
        />
      </div>
      
      <TagDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => refetch()}
      />
    </PageLayout>
  );
}
