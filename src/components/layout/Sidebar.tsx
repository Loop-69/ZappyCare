
import { Link } from "react-router-dom";
import { Navigation } from "./sidebar/Navigation";
import { UserProfile } from "./sidebar/UserProfile";
import { sidebarRoutes } from "./sidebar/routes";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="px-4 py-6 border-b border-gray-100">
        <Link to="/" className="flex items-center">
          <h1 className="font-bold text-2xl text-primary">Zappy Health</h1>
        </Link>
      </div>
      <Navigation routes={sidebarRoutes} />
      <div className="mt-auto border-t border-gray-100">
        <UserProfile />
      </div>
    </div>
  );
}
