
import React from "react";
import { MessageCircle, UserCircle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProgramCoach() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <UserCircle className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Program Coach</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>EC</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Your coach is Dr. Emily Carter.</p>
            </div>
          </div>
          <Button variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" />
            Message Coach
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
