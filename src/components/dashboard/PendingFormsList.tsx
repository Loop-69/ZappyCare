
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type PendingForm = {
  id: string;
  title: string;
  patient: {
    first_name: string;
    last_name: string;
  };
  due: string;
  urgent: boolean;
};

interface PendingFormsListProps {
  forms: PendingForm[];
  isLoading: boolean;
}

export const PendingFormsList = ({ forms = [], isLoading }: PendingFormsListProps) => {
  const handleSendReminder = (formId: string, patientName: string) => {
    // In a real implementation, this would call an API to send a reminder
    toast.success(`Reminder sent to ${patientName}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Pending Forms</CardTitle>
          <Button variant="link" size="sm">
            Send Reminders
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Pending Forms</CardTitle>
        <Button 
          variant="link" 
          size="sm"
          onClick={() => {
            if (forms.length > 0) {
              toast.success("Reminders sent to all patients");
            } else {
              toast.info("No pending forms to send reminders for");
            }
          }}
        >
          Send Reminders
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {forms && forms.length > 0 ? (
          <div className="space-y-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center ${
                      form.urgent ? "bg-red-100" : "bg-yellow-100"
                    }`}
                  >
                    <FileText
                      className={`h-5 w-5 ${
                        form.urgent ? "text-red-600" : "text-yellow-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{form.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {`${form.patient.first_name} ${form.patient.last_name}`} - Due {form.due}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleSendReminder(form.id, `${form.patient.first_name} ${form.patient.last_name}`)}
                >
                  Remind
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No pending forms</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
