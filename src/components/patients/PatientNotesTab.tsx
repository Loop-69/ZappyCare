
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteForm } from "./notes/NoteForm";
import { NoteList } from "./notes/NoteList";
import { usePatientNotes } from "@/hooks/usePatientNotes";

interface PatientNotesTabProps {
  patientId: string;
}

export default function PatientNotesTab({ patientId }: PatientNotesTabProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { notes, isLoading, addNote, editNote, deleteNote } = usePatientNotes(patientId);

  const handleAddNote = async (content: string) => {
    await addNote.mutateAsync(content);
    setIsAddingNote(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Medical Notes</h2>
        <Button onClick={() => setIsAddingNote(true)} disabled={isAddingNote}>
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      {isAddingNote && (
        <div className="bg-white border rounded-md p-4">
          <NoteForm
            onSubmit={handleAddNote}
            onCancel={() => setIsAddingNote(false)}
          />
        </div>
      )}

      <NoteList
        notes={notes || []}
        isLoading={isLoading}
        onEdit={(noteId, content) => editNote.mutateAsync({ noteId, content })}
        onDelete={(noteId) => deleteNote.mutateAsync(noteId)}
        onAddClick={() => setIsAddingNote(true)}
      />
    </div>
  );
}
