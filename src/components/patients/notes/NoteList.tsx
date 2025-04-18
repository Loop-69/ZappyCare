
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteItem } from "./NoteItem";

interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  onEdit: (noteId: string, content: string) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
  onAddClick: () => void;
}

export function NoteList({ 
  notes, 
  isLoading, 
  onEdit, 
  onDelete,
  onAddClick 
}: NoteListProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading notes...</div>;
  }

  if (!notes?.length) {
    return (
      <div className="text-center py-12 border rounded-md bg-gray-50">
        <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">No notes yet</h3>
        <p className="text-muted-foreground mb-4">
          There are no medical notes for this patient yet.
        </p>
        <Button onClick={onAddClick}>
          Add First Note
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
