
import { useRef } from "react";
import { File, Upload, Download, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePatientDocuments } from "@/hooks/usePatientDocuments";
import { format } from "date-fns";

interface PatientDocumentsTabProps {
  patientId: string;
}

export default function PatientDocumentsTab({ patientId }: PatientDocumentsTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    documents, 
    isLoading, 
    uploadDocument, 
    deleteDocument,
    getFileUrl
  } = usePatientDocuments(patientId);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadDocument.mutateAsync(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = (filePath: string, fileName: string) => {
    const url = getFileUrl(filePath);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Patient Documents</h2>
        <Button onClick={handleUploadClick} disabled={uploadDocument.isPending}>
          <Upload className="h-4 w-4 mr-2" />
          {uploadDocument.isPending ? "Uploading..." : "Upload Document"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading documents...</div>
      ) : documents && documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="bg-white border rounded-md p-4 flex items-center"
            >
              <div className="mr-4">
                <File className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">{doc.file_name}</h4>
                <p className="text-sm text-muted-foreground">
                  {(doc.file_size / 1024).toFixed(1)} KB • Uploaded by {doc.uploaded_by} on {format(new Date(doc.created_at), "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownload(doc.file_path, doc.file_name)}
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteDocument.mutateAsync(doc)}
                  disabled={deleteDocument.isPending}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <File className="h-8 w-8 mx-auto text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No documents yet</h3>
          <p className="text-muted-foreground mb-4">
            There are no documents uploaded for this patient.
          </p>
          <Button onClick={handleUploadClick}>
            Upload First Document
          </Button>
        </div>
      )}
    </div>
  );
}
