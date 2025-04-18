
import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteForm } from "./NoteForm";

interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface NoteItemProps {
  note: Note;
  onEdit: (noteId: string, content: string) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
}

export function NoteItem({ note, onEdit, onDelete }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = async (content: string) => {
    await onEdit(note.id, content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white border rounded-md p-4">
        <NoteForm
          initialContent={note.content}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
          submitLabel="Save"
        />
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-md p-4">
      <p className="whitespace-pre-wrap">{note.content}</p>
      <div className="mt-2 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <span>{note.created_by}</span>
          <span> • </span>
          <span>{format(new Date(note.created_at), "MMM d, yyyy")}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(note.id)}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
