
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Scale } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function WeightProgress() {
  const data = [
    { week: "Week 1", weight: 210 },
    { week: "Week 2", weight: 208 },
    { week: "Week 3", weight: 207 },
    { week: "Week 4", weight: 205 },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Scale className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Progress: Weight</h3>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
