
import React from "react";
import { Calendar, FileText, Pill, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface RecordsSummaryCardsProps {
  summaryData: SummaryCardProps[];
  isLoading: boolean;
}

export function RecordsSummaryCards({ summaryData, isLoading }: RecordsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {isLoading ? (
        Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-16 mt-2" />
          </div>
        ))
      ) : (
        summaryData.map((card, index) => (
          <div
            key={index}
            className={cn(
              "bg-white rounded-lg shadow-sm p-4",
              "hover:shadow-md transition-shadow"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded",
                card.color === "text-blue-500" && "bg-blue-50",
                card.color === "text-orange-500" && "bg-orange-50",
                card.color === "text-red-500" && "bg-red-50",
                card.color === "text-green-500" && "bg-green-50"
              )}>
                {card.icon}
              </div>
              <div>
                <p className="text-gray-600 text-sm">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.count}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
