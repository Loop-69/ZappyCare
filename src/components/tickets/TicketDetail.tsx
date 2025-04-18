
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Ticket, TicketMessage } from "@/types/ticket";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TicketDetailProps {
  ticketId: string;
  onTicketUpdated: () => void;
}

export function TicketDetail({ ticketId, onTicketUpdated }: TicketDetailProps) {
  const [newMessage, setNewMessage] = useState("");
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  // Fetch ticket details
  const { data: ticket, isLoading: isLoadingTicket } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single();
        
      if (error) {
        toast.error(`Error fetching ticket: ${error.message}`);
        throw error;
      }
      
      return data as Ticket;
    }
  });
  
  // Fetch messages for the ticket
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['ticket-messages', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
        
      if (error) {
        toast.error(`Error fetching messages: ${error.message}`);
        throw error;
      }
      
      return data as TicketMessage[];
    },
    enabled: Boolean(ticketId)
  });

  // Send a new message
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      // For demo purposes, we're hardcoding the staff status and name
      const isStaff = true;
      const senderName = isStaff ? 'Support Agent' : 'User';
      
      const { error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticketId,
          sender_name: senderName,
          is_staff: isStaff,
          content: newMessage
        });
      
      if (error) throw error;
      
      // Update the last_message_at timestamp for the ticket
      const { error: updateError } = await supabase
        .from('tickets')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', ticketId);
      
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ['ticket-messages', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      onTicketUpdated();
    },
    onError: (error) => {
      toast.error(`Failed to send message: ${error}`);
    }
  });

  // Update ticket status
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const { error } = await supabase
        .from('tickets')
        .update({ status })
        .eq('id', ticketId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success("Ticket status updated successfully");
      onTicketUpdated();
    },
    onError: (error) => {
      toast.error(`Failed to update ticket status: ${error}`);
    }
  });

  // Update ticket priority
  const updatePriorityMutation = useMutation({
    mutationFn: async (priority: string) => {
      const { error } = await supabase
        .from('tickets')
        .update({ priority })
        .eq('id', ticketId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success("Ticket priority updated successfully");
      onTicketUpdated();
    },
    onError: (error) => {
      toast.error(`Failed to update ticket priority: ${error}`);
    }
  });

  // Scroll to bottom of messages when new messages come in
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoadingTicket || !ticket) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Ticket Header */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">{ticket.subject}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>From: {ticket.created_by}</span>
              <span>•</span>
              <span>Created: {format(new Date(ticket.created_at), 'PPp')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div>
              <span className="block text-xs text-gray-500 mb-1">Status</span>
              <Select
                defaultValue={ticket.status}
                onValueChange={(value) => updateStatusMutation.mutate(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <span className="block text-xs text-gray-500 mb-1">Priority</span>
              <Select
                defaultValue={ticket.priority}
                onValueChange={(value) => updatePriorityMutation.mutate(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            No messages in this ticket yet.
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={cn(
                "flex gap-3",
                message.is_staff && "flex-row-reverse"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.is_staff ? "/placeholder.svg" : undefined} />
                <AvatarFallback className={message.is_staff ? "bg-blue-100 text-blue-700" : "bg-gray-100"}>
                  {message.sender_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className={cn(
                "rounded-lg p-3 max-w-[70%]",
                message.is_staff 
                  ? "bg-blue-100 text-blue-900" 
                  : "bg-gray-100"
              )}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{message.sender_name}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(message.created_at), 'p')}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Reply box */}
      <div className="p-4 border-t">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (newMessage.trim()) {
              sendMessageMutation.mutate();
            }
          }}
          className="flex gap-2"
        >
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="resize-none"
            rows={2}
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="self-end"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
