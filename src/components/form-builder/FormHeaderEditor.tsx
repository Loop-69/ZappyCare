
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormHeaderEditorProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function FormHeaderEditor({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: FormHeaderEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Input
          className="text-2xl font-bold border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter form title"
        />
      </div>
      <div>
        <Textarea
          className="resize-none border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter form description"
        />
      </div>
    </div>
  );
}
