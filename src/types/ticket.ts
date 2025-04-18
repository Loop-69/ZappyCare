
export interface Ticket {
  id: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_name: string;
  is_staff: boolean;
  content: string;
  created_at: string;
}
