
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
      // If on Patient Dashboard, apply existing patient filtering
      return !route.isAdminOnly && (route.isPatientOnly || ["/"].includes(route.href));
    } else {
      // Otherwise (Admin Dashboard), apply existing admin filtering
      return !route.isPatientOnly && !route.href.startsWith('/patients-dashboard');
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
                  ? "bg-gray-50 text-primary border-l-2 border-primary" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div
                className={cn(
                  "relative flex h-6 w-6 items-center justify-center rounded-md",
                  isActive ? "text-primary" : "text-gray-500"
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
