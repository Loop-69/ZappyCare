
import { Link } from "react-router-dom";
import { Navigation } from "./sidebar/Navigation";
import { sidebarRoutes } from "./sidebar/routes";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      <div className="px-4 py-6 border-b border-gray-800">
        <Link to="/" className="flex items-center">
          <h1 className="font-bold text-2xl text-primary">Zappy Health</h1>
        </Link>
      </div>
      <Navigation routes={sidebarRoutes} />
    </div>
  );
}
