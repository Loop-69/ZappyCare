
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

// Define the exact type from the database schema
type PatientDocument = Tables<'patient_documents'>;

export function usePatientDocuments(patientId: string) {
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ["patient-documents", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_documents")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load documents");
        throw error;
      }

      return data as PatientDocument[];
    },
  });

  const uploadDocument = useMutation({
    mutationFn: async (file: File) => {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${patientId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("patient_documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: dbError } = await supabase
        .from("patient_documents")
        .insert({
          patient_id: patientId,
          file_path: filePath,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: "Dr. Smith" // In a real app, this would be the logged-in user
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["patient-documents", patientId] });
    },
    onError: () => {
      toast.error("Failed to upload document");
    }
  });

  const deleteDocument = useMutation({
    mutationFn: async (document: PatientDocument) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("patient_documents")
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("patient_documents")
        .delete()
        .eq("id", document.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      toast.success("Document deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["patient-documents", patientId] });
    },
    onError: () => {
      toast.error("Failed to delete document");
    }
  });

  const getFileUrl = (filePath: string) => {
    return supabase.storage
      .from("patient_documents")
      .getPublicUrl(filePath).data.publicUrl;
  };

  return {
    documents,
    isLoading,
    uploadDocument,
    deleteDocument,
    getFileUrl
  };
}
