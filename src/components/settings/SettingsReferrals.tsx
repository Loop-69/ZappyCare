
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Copy, Mail, Share2 } from "lucide-react";

export function SettingsReferrals() {
  const [email, setEmail] = useState("");
  const referralLink = "https://zappyhealth.com/refer?code=DR-SMITH-123";
  
  const referrals = [
    { name: "Jane Cooper", email: "jane.cooper@example.com", status: "Pending", date: "Apr 12, 2025" },
    { name: "Robert Fox", email: "robert.fox@example.com", status: "Active", date: "Apr 10, 2025" },
    { name: "Emily Wilson", email: "emily.wilson@example.com", status: "Active", date: "Apr 8, 2025" },
    { name: "Michael Brown", email: "michael.brown@example.com", status: "Active", date: "Apr 5, 2025" }
  ];
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard");
  };
  
  const sendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    
    toast.success(`Invitation sent to ${email}`);
    setEmail("");
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Your Referral Link</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Share this link with your colleagues to invite them to Zappy Health.
        </p>
        
        <div className="flex gap-2">
          <Input value={referralLink} readOnly className="flex-1" />
          <Button variant="outline" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Invite by Email</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Send a direct invitation to your colleagues via email.
        </p>
        
        <form onSubmit={sendInvite} className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="email" className="sr-only">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="colleague@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit">
            <Mail className="h-4 w-4 mr-2" />
            Send Invite
          </Button>
        </form>
      </div>

      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Referral Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Referrals</div>
            <div className="text-2xl font-bold">12</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Active Users</div>
            <div className="text-2xl font-bold">8</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Pending Invitations</div>
            <div className="text-2xl font-bold">4</div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Referrals</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invited Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map((referral, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{referral.name}</TableCell>
                <TableCell>{referral.email}</TableCell>
                <TableCell>
                  <Badge variant={referral.status === "Active" ? "default" : "secondary"}>
                    {referral.status}
                  </Badge>
                </TableCell>
                <TableCell>{referral.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
