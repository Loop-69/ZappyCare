import { useState } from "react";
import { useDrop } from "react-dnd";
import { FormField } from "@/pages/FormBuilder";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldPreview } from "./FormFieldPreview";
import { FormHeaderEditor } from "./FormHeaderEditor";
import { Button } from "@/components/ui/button"; // Import Button component
import { Plus } from "lucide-react"; // Import Plus icon

interface FormBuilderCanvasProps {
  formData: {
    title: string;
    description: string;
    fields: FormField[];
  };
  onFormDataChange: (key: string, value: string) => void;
  onFieldsChange: (fields: FormField[]) => void;
}

interface DroppedItem {
  type: string;
  label: string;
  defaultProps?: any; // TODO: Define a more specific type for defaultProps
}

export function FormBuilderCanvas({
  formData,
  onFormDataChange,
  onFieldsChange,
}: FormBuilderCanvasProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FORM_FIELD",
    drop: (item: DroppedItem, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      
      // Create new field from the dropped item
      const newField: FormField = {
        id: uuidv4(),
        type: item.type,
        label: `New ${item.label}`,
        placeholder: item.defaultProps?.placeholder || "",
        required: false,
        options: item.defaultProps?.options || [],
        defaultValue: item.defaultProps?.defaultValue,
        width: "full" as "full" | "half", // Type assertion to ensure it matches FormField
      };
      
      onFieldsChange([...formData.fields, newField]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }));

  const handleFieldUpdate = (updatedField: FormField) => {
    const updatedFields = formData.fields.map((field) =>
      field.id === updatedField.id ? updatedField : field
    );
    onFieldsChange(updatedFields);
  };

  const handleFieldDelete = (fieldId: string) => {
    const updatedFields = formData.fields.filter(
      (field) => field.id !== fieldId
    );
    onFieldsChange(updatedFields);
  };

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const draggedField = formData.fields[dragIndex];
    const updatedFields = [...formData.fields];
    updatedFields.splice(dragIndex, 1);
    updatedFields.splice(hoverIndex, 0, draggedField);
    onFieldsChange(updatedFields);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-8 min-h-[500px]">
      {/* Form Header Editor */}
      <FormHeaderEditor 
        title={formData.title}
        description={formData.description}
        onTitleChange={(value) => onFormDataChange("title", value)}
        onDescriptionChange={(value) => onFormDataChange("description", value)}
      />
      
      {/* Pages and Fields Area */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-medium">Page 1</h3>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Fields Drop Area */}
        <div 
          ref={drop}
          className={`min-h-[300px] p-4 border-2 border-dashed rounded-lg ${
            isOver ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-300"
          }`}
        >
          {formData.fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-56 text-center text-gray-400">
              <p className="mb-2">Drag form elements here</p>
              <p className="text-sm">or click elements from the sidebar</p>
            </div>
          ) : (
            <div className="space-y-6">
              {formData.fields.map((field, index) => (
                <FormFieldPreview
                  key={field.id}
                  field={field}
                  index={index}
                  onUpdate={handleFieldUpdate}
                  onDelete={handleFieldDelete}
                  moveField={moveField}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
