
import { useFormFields } from "./FormFieldsProvider";
import { useDrag } from "react-dnd";

export function FormBuilderSidebar() {
  const { availableFields } = useFormFields();

  return (
    <div className="bg-white p-4 border rounded-lg shadow-sm">
      <h3 className="font-medium text-sm text-gray-500 uppercase mb-3">Form Elements</h3>
      <div className="space-y-2">
        {availableFields.map((field) => (
          <DraggableFormField 
            key={field.type} 
            field={field} 
          />
        ))}
      </div>
    </div>
  );
}

function DraggableFormField({ field }: { field: any }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FORM_FIELD",
    item: { ...field },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center gap-2 p-2 border rounded-md cursor-move hover:bg-gray-50 transition-colors ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="text-gray-500">{field.icon}</div>
      <span className="text-sm">{field.label}</span>
    </div>
  );
}
