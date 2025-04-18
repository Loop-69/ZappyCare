
import { Calendar, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Patient } from "@/types";

interface PatientInfoProps {
  patient: Patient;
}

export function PatientInfo({ patient }: PatientInfoProps) {
  // Format address for display if it exists
  const formatAddress = (address: any) => {
    if (!address) return "Not provided";
    
    try {
      if (typeof address === 'string') {
        // Try to parse if it's a JSON string
        const parsedAddress = JSON.parse(address);
        const addressParts = [];
        if (parsedAddress.line1) addressParts.push(parsedAddress.line1);
        if (parsedAddress.city) addressParts.push(parsedAddress.city);
        if (parsedAddress.state) addressParts.push(parsedAddress.state);
        if (parsedAddress.zip_code) addressParts.push(parsedAddress.zip_code);
        if (parsedAddress.country) addressParts.push(parsedAddress.country);
        return addressParts.join(", ") || "Not provided";
      } else if (typeof address === 'object') {
        // If it's already an object
        const addressParts = [];
        if (address.line1) addressParts.push(address.line1);
        if (address.city) addressParts.push(address.city);
        if (address.state) addressParts.push(address.state);
        if (address.zip_code) addressParts.push(address.zip_code);
        if (address.country) addressParts.push(address.country);
        return addressParts.join(", ") || "Not provided";
      }
      return "Not provided";
    } catch (e) {
      console.error("Error parsing address:", e);
      return "Not provided";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span>{patient.email || "Not provided"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{patient.phone || "Not provided"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{formatAddress(patient.address)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "Not provided"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
