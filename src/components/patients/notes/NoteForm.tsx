
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NoteFormProps {
  initialContent?: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function NoteForm({ 
  initialContent = "", 
  onSubmit, 
  onCancel,
  submitLabel = "Save Note" 
}: NoteFormProps) {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = async () => {
    await onSubmit(content);
  };

  return (
    <div className="space-y-4">
      <Textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter a medical note..."
        className="min-h-[100px]"
      />
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="h-4 w-4 mr-2" />
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
