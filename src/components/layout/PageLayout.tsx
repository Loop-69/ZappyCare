
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type PageLayoutProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  };
  isLoading?: boolean;
  filters?: React.ReactNode;
  className?: string;
};

const PageLayout = ({
  children,
  title,
  description,
  action,
  isLoading = false,
  filters,
  className,
}: PageLayoutProps) => {
  return (
    <div className={cn("p-6 space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm italic">{description}</p>
          )}
        </div>
        
        {action && (
          <Button 
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            variant={action.variant || "default"}
            className="gap-2"
          >
            {action.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : action.icon}
            {action.label}
          </Button>
        )}
      </div>
      
      {filters && (
        <div className="flex flex-wrap gap-4 items-center">
          {filters}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default PageLayout;
