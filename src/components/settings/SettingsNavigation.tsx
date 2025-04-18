
import { User, Users, BrainCircuit } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsNavigationProps {
  activeTab: string;
}

export function SettingsNavigation({ activeTab }: SettingsNavigationProps) {
  return (
    <div className="border-b mb-6">
      <TabsList className="bg-transparent h-auto p-0 mb-[-1px]">
        <TabsTrigger 
          value="account" 
          className={`flex items-center gap-2 rounded-none border-b-2 px-4 py-3 ${
            activeTab === "account" ? "border-primary" : "border-transparent"
          }`}
        >
          <User className="h-5 w-5" />
          <span>Account</span>
        </TabsTrigger>
        <TabsTrigger 
          value="referrals" 
          className={`flex items-center gap-2 rounded-none border-b-2 px-4 py-3 ${
            activeTab === "referrals" ? "border-primary" : "border-transparent"
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Referrals</span>
        </TabsTrigger>
        <TabsTrigger 
          value="ai" 
          className={`flex items-center gap-2 rounded-none border-b-2 px-4 py-3 ${
            activeTab === "ai" ? "border-primary" : "border-transparent"
          }`}
        >
          <BrainCircuit className="h-5 w-5" />
          <span>AI / LLM Settings</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
