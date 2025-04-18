
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MessageSectionProps {
  message: string;
  onMessageChange: (value: string) => void;
}

export const MessageSection = ({ message, onMessageChange }: MessageSectionProps) => {
  const templates = [
    { label: "Continue Rx", value: "Continue medication as prescribed, diet and exercise" },
    { label: "Dose Change", value: "Your medication dosage has been adjusted" },
    { label: "Consult Approved", value: "Your consultation has been approved" },
  ];

  return (
    <div className="space-y-4 rounded-md bg-blue-50 p-6">
      <div className="flex items-center justify-between">
        <Label className="text-blue-800">Message to Patient</Label>
        <span className="text-sm text-blue-600">Communication</span>
      </div>
      
      <div>
        <div className="flex gap-2 mb-4">
          {templates.map((template) => (
            <Button
              key={template.label}
              variant="outline"
              size="sm"
              onClick={() => onMessageChange(template.value)}
              className="bg-white"
            >
              {template.label}
            </Button>
          ))}
        </div>
        
        <Textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="min-h-[150px] bg-white"
          placeholder="Dear Patient, ... [Your full message template]"
        />
      </div>
    </div>
  );
};
