
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export const AddInsuranceDialog = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    patient_id: "",
    insurance_provider: "",
    provider_type: "",
    policy_number: "",
    group_number: "",
    verification_status: "Pending",
    prior_authorization_required: false,
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('insurance_records')
        .insert(formData)
        .select();

      if (error) throw error;

      toast({
        title: "Insurance Record Added",
        description: "A new insurance record has been successfully created.",
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error Adding Insurance Record",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Insurance Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Patient</label>
            <Select 
              onValueChange={(value) => setFormData(prev => ({ ...prev, patient_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label>Insurance Provider</label>
            <Input 
              value={formData.insurance_provider}
              onChange={(e) => setFormData(prev => ({ ...prev, insurance_provider: e.target.value }))}
              placeholder="Enter Insurance Provider"
              required
            />
          </div>
          <div>
            <label>Provider Type</label>
            <Input 
              value={formData.provider_type}
              onChange={(e) => setFormData(prev => ({ ...prev, provider_type: e.target.value }))}
              placeholder="Enter Provider Type"
              required
            />
          </div>
          <div>
            <label>Policy Number</label>
            <Input 
              value={formData.policy_number}
              onChange={(e) => setFormData(prev => ({ ...prev, policy_number: e.target.value }))}
              placeholder="Enter Policy Number"
            />
          </div>
          <div>
            <label>Group Number</label>
            <Input 
              value={formData.group_number}
              onChange={(e) => setFormData(prev => ({ ...prev, group_number: e.target.value }))}
              placeholder="Enter Group Number"
            />
          </div>
          <div>
            <label>Verification Status</label>
            <Select 
              value={formData.verification_status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, verification_status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={formData.prior_authorization_required}
              onChange={(e) => setFormData(prev => ({ ...prev, prior_authorization_required: e.target.checked }))}
            />
            <label>Prior Authorization Required</label>
          </div>
          <Button type="submit">Add Insurance Record</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
