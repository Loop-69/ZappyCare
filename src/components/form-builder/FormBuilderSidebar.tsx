
import { useFormFields } from "./FormFieldsProvider";
import { useDrag } from "react-dnd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export function FormBuilderSidebar() {
  const { availableFields } = useFormFields();

  return (
    <div className="bg-white border rounded-lg shadow-sm h-full flex flex-col">
      <Tabs defaultValue="pages-fields" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="pages-fields">Pages & Fields</TabsTrigger>
          <TabsTrigger value="conditionals-logic">Conditionals & Logic</TabsTrigger>
        </TabsList>
        <TabsContent value="pages-fields" className="p-4">
          <Tabs defaultValue="basic-fields" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="basic-fields">Basic Fields</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="basic-fields" className="p-4">
              <ScrollArea className="h-[calc(100vh-250px)]"> {/* Adjust height as needed */}
                <div className="grid grid-cols-2 gap-4">
                  {availableFields.map((field) => (
                    <DraggableFormField 
                      key={field.type} 
                      field={field} 
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="templates" className="p-4">
              {/* Placeholder for Templates */}
              <div className="text-center text-muted-foreground">
                Templates coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="conditionals-logic" className="p-4">
          {/* Placeholder for Conditionals & Logic */}
          <div className="text-center text-muted-foreground">
            Conditionals & Logic coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DraggableFormField({ field }: { field: FormField }) {
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
      className={`flex flex-col items-center justify-center gap-1 p-4 border rounded-md cursor-move hover:bg-gray-50 transition-colors ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="text-gray-500">{field.icon}</div>
      <span className="text-sm text-center">{field.label}</span>
    </div>
  );
}
