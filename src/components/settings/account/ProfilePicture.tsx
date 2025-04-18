
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function ProfilePicture() {
  return (
    <div className="flex items-start gap-6">
      <Avatar className="h-20 w-20">
        <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="Profile" />
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Profile Picture</h3>
        <p className="text-sm text-muted-foreground">
          Upload a new profile picture. Recommended size: 512x512px
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline" size="sm">Remove</Button>
        </div>
      </div>
    </div>
  );
}
