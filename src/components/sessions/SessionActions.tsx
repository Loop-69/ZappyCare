
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Session } from "@/types/session-types";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { EditSessionDialog } from "./EditSessionDialog";

interface SessionActionsProps {
  session: Session;
}

export function SessionActions({ session }: SessionActionsProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const handleViewDetails = () => {
    setIsViewOpen(true);
  };

  const handleEditSession = () => {
    setIsEditOpen(true);
  };

  const handleCancelSession = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("sessions")
        .update({ status: "cancelled" })
        .eq("id", session.id);
      
      if (error) throw error;
      
      toast({
        title: "Session Cancelled",
        description: `Session has been cancelled successfully.`,
      });
      
      // Close the dialog
      setIsCancelDialogOpen(false);
      
      // Refresh the sessions data
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["patient-sessions"] });
    } catch (error) {
      console.error("Error cancelling session:", error);
      toast({
        title: "Error",
        description: "There was an error cancelling the session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isActionDisabled = session.status === "completed" || session.status === "cancelled";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleViewDetails}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleEditSession}
            disabled={isActionDisabled}
          >
            Edit Session
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsCancelDialogOpen(true)}
            disabled={isActionDisabled}
            className={isActionDisabled ? "text-muted-foreground" : "text-red-600"}
          >
            Cancel Session
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Session Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>
              Session ID: {session.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Patient:</div>
              <div>
                {session.patient ? 
                  `${session.patient.first_name} ${session.patient.last_name}` : 
                  "Unknown Patient"
                }
              </div>
              
              <div className="font-medium">Date & Time:</div>
              <div>{format(new Date(session.scheduled_date), "PPP p")}</div>
              
              <div className="font-medium">Type:</div>
              <div className="capitalize">{session.session_type}</div>
              
              <div className="font-medium">Duration:</div>
              <div>{session.duration_minutes} minutes</div>
              
              <div className="font-medium">Status:</div>
              <div className="capitalize">{session.status}</div>

              {session.notes && (
                <>
                  <div className="font-medium">Notes:</div>
                  <div>{session.notes}</div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Session Dialog */}
      <EditSessionDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen}
        session={session}
      />

      {/* Cancel Session Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this session? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isProcessing}
            >
              No, keep it
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSession}
              disabled={isProcessing}
            >
              {isProcessing ? "Cancelling..." : "Yes, cancel session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
