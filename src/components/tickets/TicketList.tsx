
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Ticket } from "@/types/ticket";
import { format, formatDistanceToNow } from "date-fns";
import { Search, AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketListProps {
  tickets: Ticket[];
  isLoading: boolean;
  selectedTicketId: string | null;
  onSelectTicket: (id: string) => void;
}

export function TicketList({ tickets, isLoading, selectedTicketId, onSelectTicket }: TicketListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTickets = tickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.created_by.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Closed':
        return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Low':
        return <Badge variant="outline" className="bg-gray-100">Low</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="bg-blue-100 border-blue-200 text-blue-700">Medium</Badge>;
      case 'High':
        return <Badge variant="outline" className="bg-yellow-100 border-yellow-200 text-yellow-800">High</Badge>;
      case 'Urgent':
        return <Badge variant="outline" className="bg-red-100 border-red-200 text-red-700">Urgent</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            {searchQuery ? 'No tickets match your search' : 'No tickets found'}
          </div>
        ) : (
          <div>
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={cn(
                  "border-b p-4 cursor-pointer hover:bg-gray-50",
                  selectedTicketId === ticket.id && "bg-gray-100 hover:bg-gray-100"
                )}
                onClick={() => onSelectTicket(ticket.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(ticket.status)}
                    <h3 className="font-medium truncate">
                      {ticket.subject}
                    </h3>
                  </div>
                  
                  <div>
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{ticket.created_by}</span>
                  <span title={format(new Date(ticket.last_message_at), 'PPpp')}>
                    {formatDistanceToNow(new Date(ticket.last_message_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
