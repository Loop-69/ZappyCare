
import { Calendar, FileText, Pill, FlaskConical, Sparkles } from "lucide-react";
import React from "react";

export function generateTimelineItems(data: {
  sessions: any[];
  forms: any[];
  medications: any[];
  notes: any[];
  labResults: any[];
}) {
  const { sessions, forms, medications, notes, labResults } = data;
  const allItems = [];
    
  // Add sessions to timeline
  sessions?.forEach(session => {
    allItems.push({
      id: session.id,
      type: "appointment",
      date: session.scheduled_date,
      title: `Follow-up Appointment`,
      description: `${session.session_type} session (${session.duration_minutes} min)`,
      status: session.status,
      icon: React.createElement(Calendar, { className: "h-5 w-5 text-blue-500" }),
      color: "bg-blue-100"
    });
  });
  
  // Add forms to timeline
  forms?.forEach(form => {
    allItems.push({
      id: form.id,
      type: "form",
      date: form.created_at,
      title: form.form_templates?.title || "Form Submission",
      description: "Form submitted",
      status: form.status,
      icon: React.createElement(FileText, { className: "h-5 w-5 text-orange-500" }),
      color: "bg-orange-100"
    });
  });
  
  // Add medications to timeline
  medications?.forEach(med => {
    allItems.push({
      id: med.id,
      type: "medication",
      date: med.order_date,
      title: med.medication_name,
      description: `Quantity: ${med.quantity}`,
      status: med.status,
      icon: React.createElement(Pill, { className: "h-5 w-5 text-red-500" }),
      color: "bg-red-100"
    });
  });
  
  // Add notes to timeline
  notes?.forEach(note => {
    allItems.push({
      id: note.id,
      type: "note",
      date: note.created_at,
      title: "Clinical Note",
      description: note.content.length > 100 ? note.content.substring(0, 100) + "..." : note.content,
      createdBy: note.created_by,
      icon: React.createElement(Sparkles, { className: "h-5 w-5 text-purple-500" }),
      color: "bg-purple-100"
    });
  });
  
  // Add lab results to timeline
  labResults?.forEach(result => {
    allItems.push({
      id: result.id,
      type: "lab",
      date: result.date,
      title: result.name,
      description: "Test results available",
      status: result.status,
      icon: React.createElement(FlaskConical, { className: "h-5 w-5 text-green-500" }),
      color: "bg-green-100"
    });
  });
  
  // Sort by date (most recent first)
  return allItems.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
