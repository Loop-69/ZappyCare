
import React from "react";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  date: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  status?: string;
}

interface MedicalTimelineProps {
  items: TimelineItemProps[];
  isLoading: boolean;
}

export function MedicalTimeline({ items, isLoading }: MedicalTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {items.map((item, index) => (
        <div key={index} className="relative pl-8 pb-8">
          {/* Timeline connector */}
          {index < items.length - 1 && (
            <div className="absolute left-4 top-4 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />
          )}
          
          {/* Timeline dot */}
          <div className={cn(
            "absolute left-4 top-4 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full",
            item.color
          )}>
            {item.icon}
          </div>
          
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <div className="mb-2">
              <div className="text-sm text-gray-500">
                {format(new Date(item.date), "MMMM d, yyyy")}
              </div>
              <h3 className="font-medium mt-1">{item.title}</h3>
            </div>
            
            <p className="text-gray-600 text-sm">{item.description}</p>
            
            <div className="mt-3 flex justify-end">
              <Button variant="ghost" size="sm" className="text-primary">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="text-primary">
          View Complete History
        </Button>
      </div>
    </div>
  );
}
