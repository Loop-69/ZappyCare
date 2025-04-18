
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export function ProfilePicture() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const fetchProfilePicture = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles') // Assuming a 'profiles' table exists
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching profile picture:", error);
        // toast.error("Failed to fetch profile picture");
      } else if (data?.avatar_url) {
        // Get the public URL for the avatar
        const { data: publicUrlData } = supabase
          .storage
          .from('avatars') // Assuming an 'avatars' storage bucket exists
          .getPublicUrl(data.avatar_url);
        
        setAvatarUrl(publicUrlData.publicUrl);
      }
    }
  };

  const uploadProfilePicture = async (file: File) => {
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to upload a profile picture.");
      setUploading(false);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`; // File path within the bucket

    try {
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars') // Assuming an 'avatars' storage bucket exists
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Overwrite existing file
        });

      if (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        toast.error("Failed to upload profile picture: " + uploadError.message);
        throw uploadError;
      }

      // Update the user's profile in the database with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles') // Assuming a 'profiles' table exists
        .update({ avatar_url: filePath })
        .eq('id', user.id);

      if (updateError) {
        console.error("Error updating profile with avatar URL:", updateError);
        toast.error("Failed to update profile with avatar URL: " + updateError.message);
        throw updateError;
      }

      toast.success("Profile picture uploaded successfully");
      fetchProfilePicture(); // Refresh the avatar URL
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("An unexpected error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const removeProfilePicture = async () => {
    setRemoving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to remove a profile picture.");
      setRemoving(false);
      return;
    }

    if (!avatarUrl) {
      toast.info("No profile picture to remove.");
      setRemoving(false);
      return;
    }

    // Extract the file path from the current avatarUrl
    const urlParts = avatarUrl.split('/');
    const filePath = urlParts[urlParts.length - 1]; // Assuming the file name is the last part

    try {
      // Remove the file from Supabase Storage
      const { error: removeError } = await supabase.storage
        .from('avatars') // Assuming an 'avatars' storage bucket exists
        .remove([filePath]);

      if (removeError) {
        console.error("Error removing profile picture:", removeError);
        toast.error("Failed to remove profile picture: " + removeError.message);
        throw removeError;
      }

      // Update the user's profile in the database to remove the avatar URL
      const { error: updateError } = await supabase
        .from('profiles') // Assuming a 'profiles' table exists
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (updateError) {
        console.error("Error updating profile after removal:", updateError);
        toast.error("Failed to update profile after removal: " + updateError.message);
        throw updateError;
      }

      toast.success("Profile picture removed successfully");
      setAvatarUrl(null); // Clear the avatar URL
    } catch (error) {
      console.error("Removal failed:", error);
      toast.error("An unexpected error occurred during removal");
    } finally {
      setRemoving(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadProfilePicture(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveClick = () => {
    removeProfilePicture();
  };

  return (
    <div className="flex items-start gap-6">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl || undefined} alt="Profile" />
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Profile Picture</h3>
        <p className="text-sm text-muted-foreground">
          Upload a new profile picture. Recommended size: 512x512px
        </p>
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Upload new profile picture"
          />
          <Button variant="outline" size="sm" className="gap-2" onClick={handleUploadClick} disabled={uploading}>
            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload
          </Button>
          <Button variant="outline" size="sm" onClick={handleRemoveClick} disabled={removing || !avatarUrl}>
            {removing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
