
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SettingsAccount } from "@/components/settings/SettingsAccount";
import { SettingsReferrals } from "@/components/settings/SettingsReferrals";
import { SettingsAI } from "@/components/settings/SettingsAI";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  
  return (
    <PageLayout
      title="Settings"
      description="Manage your account, referrals, and system configurations"
    >
      <div className="bg-white p-6 rounded-lg">
        <Tabs defaultValue="account" className="w-full" onValueChange={setActiveTab}>
          <SettingsNavigation activeTab={activeTab} />

          <TabsContent value="account" className="mt-0">
            <SettingsAccount />
          </TabsContent>
          
          <TabsContent value="referrals" className="mt-0">
            <SettingsReferrals />
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0">
            <SettingsAI />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
