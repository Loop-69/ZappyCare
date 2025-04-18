
import React from "react";
import { Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function ProgramGoal() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Program Goal</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Lose 5-10% of body weight in 3 months.</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress:</span>
            <span>33%</span>
          </div>
          <Progress value={33} />
        </div>
      </CardContent>
    </Card>
  );
}
