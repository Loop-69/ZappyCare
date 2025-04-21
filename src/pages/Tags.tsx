
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/layout/PageLayout";
import { PlusCircle, Search } from "lucide-react";
import { Tag } from "@/types/tag";
import { TagDialog } from "@/components/tags/TagDialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // Assuming Badge component exists
import { Button } from "@/components/ui/button"; // Assuming Button component exists
import { Edit, Trash2 } from "lucide-react"; // Assuming icons exist

export default function Tags() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredTags = useMemo(() => {
    if (!searchTerm) return tags;
    return tags.filter(tag =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tags, searchTerm]);

  // Placeholder for handling edit and delete actions
  const handleEditTag = (tag: Tag) => {
    console.log("Edit tag:", tag);
    // Implement edit dialog logic here
  };

  const handleDeleteTag = async (tagId: string) => {
    console.log("Delete tag:", tagId);
    // Implement delete logic here
    // Example:
    // const { error } = await supabase.from('tags').delete().eq('id', tagId);
    // if (error) {
    //   toast.error(`Error deleting tag: ${error.message}`);
    // } else {
    //   toast.success("Tag deleted successfully");
    //   refetch();
    // }
  };


  return (
    <PageLayout
      title="Tag Management" // Updated title
      description="Manage and organize tags for your application"
      action={{
        label: "Add Tag",
        onClick: () => setIsDialogOpen(true),
        icon: <PlusCircle className="h-4 w-4" />
      }}
    >
      <div className="space-y-6"> {/* Adjusted spacing */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Available Tags</h2> {/* Added heading */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Grid layout with max 3 columns */}
            {isLoading ? (
              <div>Loading tags...</div> // Loading state
            ) : filteredTags.length > 0 ? (
              filteredTags.map(tag => (
                <div key={tag.id} className="flex items-center justify-between bg-white rounded-md px-3 py-2 shadow"> {/* Container for tag and icons with justify-between */}
                  <Badge
                    variant="secondary"
                    style={{ backgroundColor: tag.color || '#e2e8f0' }} // Assuming tag has a color property
                  >
                    {tag.name}
                  </Badge>
                  <div className="flex items-center ml-auto"> {/* Container for buttons, pushed to the end */}
                    <Button variant="ghost" size="sm" className="h-auto p-1" onClick={() => handleEditTag(tag)}>
                      <Edit className="h-3 w-3 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-auto p-1 ml-1" onClick={() => handleDeleteTag(tag.id)}> {/* Added margin */}
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div>No tags found. Create your first tag!</div> // Empty state
            )}
          </div>
        </div>
      </div>

      <TagDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => refetch()}
      />
    </PageLayout>
  );
}
