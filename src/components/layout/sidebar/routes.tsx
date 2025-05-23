import React from "react";
import {
  Home,
  LayoutDashboard,
  User,
  Calendar,
  ShoppingCart,
  Package,
  ListChecks,
  Tag,
  Percent,
  Activity,
  FileText,
  Settings,
  MessageSquare,
  BrainCircuit,
  FormInput,
  UsersRound,
  ClipboardList,
  Grid3X3
} from "lucide-react";

export interface SidebarRoute {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  isAdminOnly?: boolean;
  isPatientOnly?: boolean;
}

export const sidebarRoutes: SidebarRoute[] = [
  // Patient Specific Routes (Keep at top or bottom based on convention)
  {
    href: "/",
    label: "Home",
    icon: <Home className="h-5 w-5" />,
    color: "text-sky-500",
    bgColor: "bg-sky-50",
    isPatientOnly: true, // Assuming Home is patient-specific
  },
  {
    href: "/records",
    label: "Records",
    icon: <ClipboardList className="h-5 w-5" />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    isPatientOnly: true,
  },
  {
    href: "/programs",
    label: "Programs",
    icon: <Grid3X3 className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    isPatientOnly: true,
  },
  {
    href: "/shop",
    label: "Shop",
    icon: <ShoppingCart className="h-5 w-5" />,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    isPatientOnly: true,
  },
  {
    href: "/patients-dashboard",
    label: "Patients Dashboard",
    icon: <UsersRound className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    // Assuming this is also patient-specific or general
  },

  // Admin/Staff Routes (Ordered as per image)
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    isAdminOnly: true,
  },
  {
    href: "/patients",
    label: "Patients",
    icon: <User className="h-5 w-5" />,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    href: "/consultations",
    label: "Consultations",
    icon: <Calendar className="h-5 w-5" />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    href: "/sessions",
    label: "Sessions",
    icon: <Activity className="h-5 w-5" />,
    color: "text-violet-500",
    bgColor: "bg-violet-50",
  },
  {
    href: "/orders",
    label: "Orders",
    icon: <Package className="h-5 w-5" />,
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-50",
  },
  {
    href: "/products",
    label: "Products",
    icon: <Package className="h-5 w-5" />,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
  },
  {
    href: "/discounts",
    label: "Discounts",
    icon: <Percent className="h-5 w-5" />,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    href: "/invoices",
    label: "Invoices",
    icon: <ShoppingCart className="h-5 w-5" />,
    color: "text-rose-500",
    bgColor: "bg-rose-50",
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: <ListChecks className="h-5 w-5" />,
    color: "text-lime-500",
    bgColor: "bg-lime-50",
  },
  {
    href: "/providers",
    label: "Providers",
    icon: <User className="h-5 w-5" />,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    href: "/pharmacies",
    label: "Pharmacies",
    icon: <Calendar className="h-5 w-5" />, // Consider changing icon if needed
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    href: "/insurance",
    label: "Insurance",
    icon: <Percent className="h-5 w-5" />, // Consider changing icon if needed
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    href: "/services",
    label: "Services",
    icon: <FileText className="h-5 w-5" />,
    color: "text-stone-500",
    bgColor: "bg-stone-50",
  },
  {
    href: "/tags",
    label: "Tags",
    icon: <Tag className="h-5 w-5" />,
    color: "text-teal-500",
    bgColor: "bg-teal-50",
  },
  {
    href: "/messages",
    label: "Messages",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    color: "text-gray-500",
    bgColor: "bg-gray-50",
  },
  {
    href: "/forms",
    label: "Forms",
    icon: <FormInput className="h-5 w-5" />,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  // Other Admin Routes
  {
    href: "/ai-insights",
    label: "AI Insights",
    icon: <BrainCircuit className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    isAdminOnly: true, // Assuming AI Insights is admin-only
  },
  // AI Dashboard Sub-pages
  {
    href: "/ai-dashboard/boothwyn",
    label: "Boothwyn Test",
    icon: <BrainCircuit className="h-5 w-5" />,
    color: "text-purple-500", // Consistent color for AI Dashboard sub-pages
    bgColor: "bg-purple-50",
  },
  {
    href: "/ai-dashboard/hallandale",
    label: "Hallandale / VIOS Test",
    icon: <BrainCircuit className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    href: "/ai-dashboard/shipping",
    label: "Shipping Test",
    icon: <BrainCircuit className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    href: "/ai-dashboard/sendgrid",
    label: "SendGrid Test",
    icon: <BrainCircuit className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    href: "/ai-dashboard/practice-better",
    label: "Practice Better Test",
    icon: <BrainCircuit className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    href: "/ai-dashboard/general-ai",
    label: "General AI Test",
    icon: <BrainCircuit className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    href: "/ai-dashboard/csv-integration", // New route for CSV integration
    label: "CSV Integration Test",
    icon: <BrainCircuit className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    href: "/ai-dashboard/word-integration", // New route for Word integration
    label: "Word Integration Test",
    icon: <BrainCircuit className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];
