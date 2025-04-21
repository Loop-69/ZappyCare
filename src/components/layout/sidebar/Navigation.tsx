
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarRoute } from "./routes";
import { cn } from "@/lib/utils";

interface NavigationProps {
  routes: SidebarRoute[];
}

export function Navigation({ routes }: NavigationProps) {
  const location = useLocation();
  const isPatientDashboard = location.pathname.startsWith('/patients-dashboard') || 
                            location.pathname === '/records' ||
                            location.pathname === '/programs' ||
                            location.pathname === '/shop';
  const isAIDashboard = location.pathname.startsWith('/ai-dashboard'); // Check if on AI Dashboard

  // Filter routes based on the current dashboard
  const filteredRoutes = routes.filter(route => {
    if (isAIDashboard) {
      // If on AI Dashboard, only show AI Dashboard routes
      return route.href.startsWith('/ai-dashboard');
    } else if (isPatientDashboard) {
      // If on Patient Dashboard, apply existing patient filtering and exclude AI Dashboard routes
      return !route.isAdminOnly && (route.isPatientOnly || ["/"].includes(route.href)) && !route.href.startsWith('/ai-dashboard');
    } else {
      // Otherwise (Admin Dashboard), apply existing admin filtering and exclude AI Dashboard routes
      return !route.isPatientOnly && !route.href.startsWith('/patients-dashboard') && !route.href.startsWith('/ai-dashboard');
    }
  });

  return (
    <ScrollArea className="flex-1">
      <div className="py-2">
        {filteredRoutes.map((route) => {
          const isActive = location.pathname === route.href;
          
          return (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "flex items-center gap-x-3 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-white" // Active text color
                  : "text-gray-700 hover:text-gray-900" // Inactive text color
              )}
              style={{
                backgroundColor: isActive ? getBackgroundColor(route.href) : 'transparent', // Apply background color based on route
                borderLeft: isActive ? `2px solid ${getBorderColor(route.href)}` : 'none', // Apply border color
              }}
            >
              <div
                className={cn(
                  "relative flex h-6 w-6 items-center justify-center rounded-md",
                  isActive ? "text-white" : "text-gray-500" // Icon color
                )}
              >
                {route.icon}
              </div>
              <span>{route.label}</span>
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}

// Helper function to get background color based on route
function getBackgroundColor(href: string) {
  if (href === '/') return '#FF6B6B'; // Dashboard
  if (href.startsWith('/patients')) return '#4ECDC4'; // Patients, Patient Dashboard
  if (href === '/consultations') return '#45B7D1'; // Consultations
  if (href === '/sessions') return '#FED9B7'; // Sessions
  if (href === '/orders') return '#F7A262'; // Orders
  if (href === '/products') return '#8367C7'; // Products
  if (href === '/discounts') return '#D6A2E8'; // Discounts
  if (href === '/invoices') return '#A4F0A4'; // Invoices
  if (href === '/tasks') return '#5A809E'; // Tasks
  if (href === '/providers') return '#C1C8E4'; // Providers
  if (href === '/pharmacies') return '#8A9A5B'; // Pharmacies
  if (href === '/insurance') return '#FFD166'; // Insurance
  if (href === '/services') return '#06D6A0'; // Services
  if (href === '/tags') return '#1B9AAA'; // Tags
  if (href === '/messages') return '#EF476F'; // Messages
  if (href === '/system-map') return '#EE6352'; // System Map
  if (href === '/settings') return '#F4D35E'; // Settings
  if (href === '/audit-log') return '#90F1EF'; // Audit Log
  if (href === '/forms') return '#A7BED3'; // Forms
  if (href === '/ai-dashboard') return '#70D6FF'; // AI Dashboard
  if (href === '/ai-insights') return '#E29578'; // AI Insights
  if (href === '/automated-summaries') return '#C8B6FF'; // Automated Summaries
  // Add more routes and colors as needed
  return 'transparent'; // Default
}

// Helper function to get border color based on route (can be the same as background or a darker shade)
function getBorderColor(href: string) {
  // For simplicity, using the same color as background for now
  return getBackgroundColor(href);
}
