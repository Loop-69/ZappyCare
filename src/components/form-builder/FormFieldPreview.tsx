
import { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FormField } from "@/pages/FormBuilder";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  MoreVertical,
  GripVertical,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormFieldSettings } from "./FormFieldSettings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FormFieldPreviewProps {
  field: FormField;
  index: number;
  onUpdate: (field: FormField) => void;
  onDelete: (id: string) => void;
  moveField: (dragIndex: number, hoverIndex: number) => void;
}

export function FormFieldPreview({
  field,
  index,
  onUpdate,
  onDelete,
  moveField,
}: FormFieldPreviewProps) {
  const [showSettings, setShowSettings] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Drag functionality
  const [{ isDragging }, drag, preview] = useDrag({
    type: "FIELD_CARD",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop functionality
  const [, drop] = useDrop({
    accept: "FIELD_CARD",
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine mouse position
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when cursor has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Perform the reordering
      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Apply refs
  drag(drop(ref));

  const renderFieldPreview = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "phone":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
              placeholder={field.placeholder}
              disabled
            />
          </div>
        );
      case "textarea":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
              placeholder={field.placeholder}
              rows={3}
              disabled
            />
          </div>
        );
      case "select":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select className="w-full px-3 py-2 border rounded-md bg-gray-50" disabled>
              <option value="">{field.placeholder || "Select an option"}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 border rounded"
              disabled
              defaultChecked={field.defaultValue as boolean}
            />
            <label className="ml-2 text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-1">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4"
                    disabled
                    name={`radio-${field.id}`}
                  />
                  <label className="ml-2 text-sm">{option.label}</label>
                </div>
              ))}
            </div>
          </div>
        );
      case "date":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
              disabled
            />
          </div>
        );
      case "file":
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  disabled
                />
              </label>
            </div>
          </div>
        );
      default:
        return <div>Unsupported field type</div>;
    }
  };

  return (
    <div
      ref={preview}
      className={`${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <Card>
        <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
          <div
            ref={ref}
            className="flex items-center gap-2 cursor-move text-gray-500"
          >
            <GripVertical size={16} />
            <span className="text-sm font-medium">{field.label}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={16} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowSettings(!showSettings)}>
                  Edit Properties
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-500" 
                  onClick={() => onDelete(field.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {renderFieldPreview()}
        </CardContent>
        {showSettings && (
          <CardFooter className="flex flex-col p-0 border-t">
            <FormFieldSettings
              field={field}
              onUpdate={onUpdate}
              onClose={() => setShowSettings(false)}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
