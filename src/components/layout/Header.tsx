import { useState, useRef, useEffect } from "react";
import type { Patient } from "@/types/patient-types";
import type { Order } from "@/types/order-types";
import type { Consultation } from "@/types/consultation-types";

interface SearchResults {
  patients: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  }[];
  orders: {
    id: string;
    patient_id: string;
    status: string;
    created_at: string;
  }[];
  consultations: {
    id: string;
    patient_id: string;
    service: string;
  }[];
}
import { Bell, Eye, Search, User, LayoutDashboard, BrainCircuit } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { searchDatabase } from "@/services/searchService";

type HeaderProps = {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
};

const Header = ({ user = { name: "Admin", role: "Admin" } }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPatientPage = location.pathname.includes('/patients/');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSearchResults(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResultClick = (type: string, id: string) => {
    setSearchResults(null);
    setSearchQuery('');
    navigate(`/${type}/${id}`);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchDatabase(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="w-[300px] relative">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients, orders, consultations..."
            className="pl-8 w-full bg-white border-muted rounded-md"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {searchResults && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              {searchResults.patients.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Patients</h3>
                  {searchResults.patients.map((patient) => (
                    <div 
                      key={patient.id} 
                      className="p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleResultClick('patients', patient.id)}
                    >
                      {patient.first_name} {patient.last_name}
                    </div>
                  ))}
                </div>
              )}
              {searchResults.orders.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Orders</h3>
                  {searchResults.orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleResultClick('orders', order.id)}
                    >
                      Order #{order.id} - {order.status}
                    </div>
                  ))}
                </div>
              )}
              {searchResults.consultations.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Consultations</h3>
                  {searchResults.consultations.map((consultation) => (
                    <div 
                      key={consultation.id} 
                      className="p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleResultClick('consultations', consultation.id)}
                    >
                      {consultation.service} consultation
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {!isPatientPage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative gap-2">
                <Eye className="h-4 w-4" />
                <span>Admin View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Switch Dashboard</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/patients-dashboard')}>
                <User className="mr-2 h-4 w-4" />
                <span>Patient Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/ai-dashboard')}>
                <BrainCircuit className="mr-2 h-4 w-4" />
                <span>AI Dashboard</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span>{user.name}</span>
                <span className="text-muted-foreground text-xs">{user.role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
