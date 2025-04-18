
import { Separator } from "@/components/ui/separator";
import { ProfilePicture } from "./account/ProfilePicture";
import { PersonalInformation } from "./account/PersonalInformation";
import { SecuritySettings } from "./account/SecuritySettings";

export function SettingsAccount() {
  return (
    <div className="space-y-8">
      <ProfilePicture />
      <Separator />
      <PersonalInformation />
      <Separator />
      <SecuritySettings />
    </div>
  );
}
