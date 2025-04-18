
import React, { createContext, useContext, ReactNode } from "react";
import { 
  Type, 
  FormInput, 
  ListFilter, 
  CheckSquare, 
  Circle, 
  Calendar, 
  FileText,
  Phone,
  Mail,
  AlignJustify,
  Hash
} from "lucide-react";

export interface FormFieldDefinition {
  type: string;
  icon: React.ReactNode;
  label: string;
  defaultProps?: Record<string, any>;
}

interface FormFieldsContextType {
  availableFields: FormFieldDefinition[];
}

const FormFieldsContext = createContext<FormFieldsContextType | undefined>(undefined);

export function useFormFields() {
  const context = useContext(FormFieldsContext);
  if (!context) {
    throw new Error("useFormFields must be used within a FormFieldsProvider");
  }
  return context;
}

export function FormFieldsProvider({ children }: { children: ReactNode }) {
  const availableFields: FormFieldDefinition[] = [
    {
      type: "text",
      icon: <Type size={18} />,
      label: "Text Input",
      defaultProps: {
        placeholder: "Enter text...",
      },
    },
    {
      type: "textarea",
      icon: <AlignJustify size={18} />,
      label: "Text Area",
      defaultProps: {
        placeholder: "Enter long text...",
      },
    },
    {
      type: "email",
      icon: <Mail size={18} />,
      label: "Email",
      defaultProps: {
        placeholder: "email@example.com",
      },
    },
    {
      type: "number",
      icon: <Hash size={18} />,
      label: "Number",
      defaultProps: {
        placeholder: "0",
      },
    },
    {
      type: "phone",
      icon: <Phone size={18} />,
      label: "Phone",
      defaultProps: {
        placeholder: "(123) 456-7890",
      },
    },
    {
      type: "select",
      icon: <ListFilter size={18} />,
      label: "Dropdown",
      defaultProps: {
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      },
    },
    {
      type: "checkbox",
      icon: <CheckSquare size={18} />,
      label: "Checkbox",
      defaultProps: {
        defaultValue: false,
      },
    },
    {
      type: "radio",
      icon: <Circle size={18} />,
      label: "Radio Group",
      defaultProps: {
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      },
    },
    {
      type: "date",
      icon: <Calendar size={18} />,
      label: "Date",
    },
    {
      type: "file",
      icon: <FileText size={18} />,
      label: "File Upload",
    },
  ];

  return (
    <FormFieldsContext.Provider value={{ availableFields }}>
      {children}
    </FormFieldsContext.Provider>
  );
}
