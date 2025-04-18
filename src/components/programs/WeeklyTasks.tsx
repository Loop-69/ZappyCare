
import React from "react";
import { Check, ListTodo } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function WeeklyTasks() {
  const tasks = [
    { id: 1, text: "Log meals daily", completed: true },
    { id: 2, text: "Complete 30 min walk M/W/F/S", completed: true },
    { id: 3, text: "Attend weekly check-in call", completed: false },
    { id: 4, text: "Read 'Healthy Eating Guide'", completed: false },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <ListTodo className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">This Week's Tasks</h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {task.completed ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2" />
                )}
                <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                  {task.text}
                </span>
              </div>
              {!task.completed && (
                <Button variant="ghost" className="text-primary text-sm">
                  Mark Complete
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
