
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: number | string;
}

export const StatsCard = ({
  icon: Icon,
  iconBgColor,
  iconColor,
  label,
  value
}: StatsCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </Card>
  );
};
