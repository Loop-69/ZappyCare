
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/layout/PageLayout";
import { Inbox, PlusCircle } from "lucide-react";
import { TicketList } from "@/components/tickets/TicketList";
import { TicketDetail } from "@/components/tickets/TicketDetail";
import { CreateTicketDialog } from "@/components/tickets/CreateTicketDialog";
import { Ticket } from "@/types/ticket";
import { toast } from "sonner";

export default function Messages() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  const { 
    data: tickets = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('last_message_at', { ascending: false });
        
      if (error) {
        toast.error(`Error fetching tickets: ${error.message}`);
        throw error;
      }
      
      return data as Ticket[];
    }
  });

  return (
    <PageLayout
      title="Helpdesk"
      description="Manage support tickets and communicate with customers"
      action={{
        label: "New Ticket",
        onClick: () => setIsDialogOpen(true),
        icon: <PlusCircle className="h-4 w-4" />
      }}
    >
      <div className="flex h-[calc(100vh-170px)]">
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <TicketList 
            tickets={tickets} 
            isLoading={isLoading}
            selectedTicketId={selectedTicketId}
            onSelectTicket={(id) => setSelectedTicketId(id)}
          />
        </div>
        <div className="w-2/3">
          {selectedTicketId ? (
            <TicketDetail 
              ticketId={selectedTicketId}
              onTicketUpdated={() => refetch()}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Inbox size={64} strokeWidth={1} />
              <p className="mt-4 text-lg">Select a ticket to view its details</p>
              <p className="text-sm">or create a new one using the "New Ticket" button</p>
            </div>
          )}
        </div>
      </div>

      <CreateTicketDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
        }}
      />
    </PageLayout>
  );
}
