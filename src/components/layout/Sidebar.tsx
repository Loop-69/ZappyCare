
import { Link } from "react-router-dom";
import { Navigation } from "./sidebar/Navigation";
import { UserProfile } from "./sidebar/UserProfile";
import { sidebarRoutes } from "./sidebar/routes";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6">
        <Link to="/">
          <h1 className="font-bold text-2xl">Zappy Health</h1>
        </Link>
      </div>
      <Navigation routes={sidebarRoutes} />
      <UserProfile />
    </div>
  );
}
