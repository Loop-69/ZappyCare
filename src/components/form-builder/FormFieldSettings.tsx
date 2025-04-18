
import { useState } from "react";
import { FormField } from "@/pages/FormBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormFieldSettingsProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onClose: () => void;
}

export function FormFieldSettings({
  field,
  onUpdate,
  onClose,
}: FormFieldSettingsProps) {
  const [localField, setLocalField] = useState<FormField>({ ...field });

  const handleChange = (
    key: keyof FormField,
    value: string | boolean | { value: string; label: string }[]
  ) => {
    setLocalField((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddOption = () => {
    const options = [...(localField.options || [])];
    options.push({ value: `option${options.length + 1}`, label: `Option ${options.length + 1}` });
    handleChange("options", options);
  };

  const handleUpdateOption = (index: number, key: string, value: string) => {
    const options = [...(localField.options || [])];
    options[index] = {
      ...options[index],
      [key]: value,
    };
    handleChange("options", options);
  };

  const handleRemoveOption = (index: number) => {
    const options = [...(localField.options || [])];
    options.splice(index, 1);
    handleChange("options", options);
  };

  const handleSave = () => {
    onUpdate(localField);
    onClose();
  };

  return (
    <div className="p-4 space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={localField.label}
          onChange={(e) => handleChange("label", e.target.value)}
        />
      </div>

      {(localField.type === "text" ||
        localField.type === "textarea" ||
        localField.type === "email" ||
        localField.type === "number" ||
        localField.type === "phone" ||
        localField.type === "select") && (
        <div className="space-y-2">
          <Label htmlFor="placeholder">Placeholder</Label>
          <Input
            id="placeholder"
            value={localField.placeholder || ""}
            onChange={(e) => handleChange("placeholder", e.target.value)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="width">Field Width</Label>
        <Select
          value={localField.width || "full"}
          onValueChange={(value) => handleChange("width", value as "full" | "half")}
        >
          <SelectTrigger id="width">
            <SelectValue placeholder="Select width" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Width</SelectItem>
            <SelectItem value="half">Half Width</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(localField.type === "select" ||
        localField.type === "radio" ||
        localField.type === "checkbox") && (
        <div className="space-y-4">
          <Label>Options</Label>
          {(localField.options || []).map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Label"
                value={option.label}
                onChange={(e) =>
                  handleUpdateOption(index, "label", e.target.value)
                }
                className="flex-grow"
              />
              <Input
                placeholder="Value"
                value={option.value}
                onChange={(e) =>
                  handleUpdateOption(index, "value", e.target.value)
                }
                className="flex-grow"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleAddOption}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="required"
          checked={localField.required || false}
          onCheckedChange={(checked) => handleChange("required", checked)}
        />
        <Label htmlFor="required">Required Field</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
