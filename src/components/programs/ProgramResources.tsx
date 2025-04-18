
import React from "react";
import { BookOpen, FileText, Video } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProgramResources() {
  const resources = [
    {
      id: 1,
      title: "Healthy Eating Guide (PDF)",
      icon: <FileText className="h-4 w-4" />,
      link: "#",
    },
    {
      id: 2,
      title: "Exercise Video: Low Impact Cardio (Video)",
      icon: <Video className="h-4 w-4" />,
      link: "#",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Resources</h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {resources.map((resource) => (
            <li key={resource.id}>
              <Button
                variant="ghost"
                className="w-full justify-start text-primary"
                asChild
              >
                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                  {resource.icon}
                  <span className="ml-2">{resource.title}</span>
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
