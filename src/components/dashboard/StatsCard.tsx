
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  className,
  trend,
}: StatsCardProps) => {
  return (
    <div className={cn("p-6 bg-white rounded-lg shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.positive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.positive ? "↑" : "↓"} {trend.value}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">from last month</span>
            </div>
          )}
        </div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
    </div>
  );
};
