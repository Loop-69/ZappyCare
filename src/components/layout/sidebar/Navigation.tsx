
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarRoute } from "./routes";

interface NavigationProps {
  routes: SidebarRoute[];
}

export function Navigation({ routes }: NavigationProps) {
  const location = useLocation();
  const isPatientDashboard = location.pathname.startsWith('/patients-dashboard') || 
                            location.pathname === '/records' ||
                            location.pathname === '/programs' ||
                            location.pathname === '/shop';

  // Filter routes based on the current dashboard
  const filteredRoutes = routes.filter(route => 
    isPatientDashboard 
      ? !route.isAdminOnly && ["/", "/records", "/programs", "/shop"].includes(route.href)
      : !route.href.startsWith('/patients-dashboard')
  );

  return (
    <ScrollArea className="flex-1">
      <div className="pt-2 pb-4 px-2">
        {filteredRoutes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className="flex items-center gap-x-3 rounded-md p-2 text-sm font-medium hover:bg-muted mb-1"
          >
            <div
              className="relative flex h-7 w-7 items-center justify-center rounded-sm"
              style={{ color: route.color, backgroundColor: route.bgColor }}
            >
              {route.icon}
            </div>
            <span>{route.label}</span>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}
