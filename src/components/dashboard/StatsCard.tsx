
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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
  type?: 'patients' | 'sessions' | 'orders' | 'consultations';
  href?: string; // Add href prop for linking
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  className,
  trend,
  type = 'patients',
  href, // Destructure href prop
}: StatsCardProps) => {
  // Map type to color classes
  const colorMap = {
    patients: {
      iconBg: 'bg-red-50',
      iconColor: 'text-stats-patients',
      borderColor: 'border-l-stats-patients'
    },
    sessions: {
      iconBg: 'bg-blue-50',
      iconColor: 'text-stats-sessions',
      borderColor: 'border-l-stats-sessions'
    },
    orders: {
      iconBg: 'bg-green-50',
      iconColor: 'text-stats-orders',
      borderColor: 'border-l-stats-orders'
    },
    consultations: {
      iconBg: 'bg-orange-50',
      iconColor: 'text-stats-consultations',
      borderColor: 'border-l-stats-consultations'
    }
  };

  const { iconBg, iconColor, borderColor } = colorMap[type];

  const content = (
    <div className={cn(
      "p-6 bg-white rounded-lg shadow-sm border-l-4",
      borderColor,
      className
    )}>
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
        {icon && (
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full",
            iconBg,
            iconColor
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block hover:shadow-md transition-shadow">
        {content}
      </Link>
    );
  }

  return content;
};
