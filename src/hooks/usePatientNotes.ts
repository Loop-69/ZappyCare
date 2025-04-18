
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function usePatientNotes(patientId: string) {
  const queryClient = useQueryClient();
  
  const { data: notes, isLoading } = useQuery({
    queryKey: ["patient-notes", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_notes")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load notes");
        throw error;
      }
      
      return data;
    },
  });

  const addNote = useMutation({
    mutationFn: async (content: string) => {
      if (!content.trim()) {
        throw new Error("Note cannot be empty");
      }
      
      const { error } = await supabase
        .from("patient_notes")
        .insert({
          patient_id: patientId,
          content: content.trim(),
          created_by: "Dr. Smith" // In a real app, this would be the logged-in user's name
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Note added successfully");
      queryClient.invalidateQueries({ queryKey: ["patient-notes", patientId] });
    },
    onError: () => {
      toast.error("Failed to save note");
    }
  });

  const editNote = useMutation({
    mutationFn: async ({ noteId, content }: { noteId: string; content: string }) => {
      if (!content.trim()) {
        throw new Error("Note cannot be empty");
      }
      
      const { error } = await supabase
        .from("patient_notes")
        .update({ content: content.trim() })
        .eq("id", noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Note updated successfully");
      queryClient.invalidateQueries({ queryKey: ["patient-notes", patientId] });
    },
    onError: () => {
      toast.error("Failed to update note");
    }
  });

  const deleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from("patient_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Note deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["patient-notes", patientId] });
    },
    onError: () => {
      toast.error("Failed to delete note");
    }
  });

  return {
    notes,
    isLoading,
    addNote,
    editNote,
    deleteNote,
  };
}
