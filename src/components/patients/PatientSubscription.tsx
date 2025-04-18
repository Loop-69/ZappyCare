
import { BellRing, Link as LinkIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types";
import { useState } from "react";
import { AddSubscriptionDialog } from "./AddSubscriptionDialog";

interface PatientSubscriptionProps {
  patient: Patient;
}

export function PatientSubscription({ patient }: PatientSubscriptionProps) {
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
        <LinkIcon className="w-12 h-12 text-muted-foreground" />
        <h3 className="text-xl font-semibold">No Active Subscription</h3>
        <p className="text-muted-foreground">
          This patient doesn't have an active subscription plan.
        </p>
        <Button 
          variant="default" 
          className="mt-4"
          onClick={() => setSubscriptionDialogOpen(true)}
        >
          <BellRing className="mr-2 h-4 w-4" />
          Add/Renew Subscription
        </Button>

        <AddSubscriptionDialog 
          open={subscriptionDialogOpen} 
          onOpenChange={setSubscriptionDialogOpen}
          patientId={patient.id}
        />
      </CardContent>
    </Card>
  );
}
