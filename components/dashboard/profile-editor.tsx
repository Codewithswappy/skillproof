"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, FullProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Save, Upload, User, X } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";

interface ProfileEditorProps {
  data: FullProfile;
}

export function ProfileEditor({ data }: ProfileEditorProps) {
  const router = useRouter();
  const { profile } = data;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    profile.image || null
  );
  const [imageUrl, setImageUrl] = useState<string>(profile.image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const slug = formData.get("slug") as string;
    const headline = formData.get("headline") as string;
    const summary = formData.get("summary") as string;

    const result = await updateProfile({
      slug,
      headline,
      summary,
      image: imageUrl || undefined,
    });

    if (result.success) {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }

  // For direct URL input (UploadThing gives you a URL)
  function handleImageUrlChange(url: string) {
    setImageUrl(url);
    setImagePreview(url);
  }

  // Clear image
  function handleRemoveImage() {
    setImageUrl("");
    setImagePreview(null);
  }

  return (
    <div className="space-y-6">
      {/* Profile Image Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Add a professional photo for your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Image Preview */}
            <div className="relative">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex items-center justify-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-zinc-400" />
                )}
              </div>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Upload Options */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://uploadthing.com/your-image.jpg"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Paste an image URL from UploadThing or any image hosting
                  service.
                </p>
              </div>

              {/* UploadThing Integration */}
              <div className="p-4 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg text-center flex flex-col items-center justify-center">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    if (res && res[0]) {
                      handleImageUrlChange(res[0].url);
                      alert("Upload Completed");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                  }}
                />
                <p className="text-xs text-zinc-400 mt-2">
                  Supported formats: PNG, JPG, JPEG (max 4MB)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>
            Your core profile information visible to recruiters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="profile-editor-form"
            action={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="slug">Profile URL</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  skillproof.app/
                </span>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={profile.slug}
                  required
                  placeholder="your-username"
                  pattern="[a-z0-9-]+"
                  className="font-mono bg-zinc-50 dark:bg-zinc-900"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Warning: Changing this will break existing links to your
                profile.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                name="headline"
                defaultValue={profile.headline || ""}
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                name="summary"
                defaultValue={profile.summary || ""}
                placeholder="Brief professional bio..."
                rows={6}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                <Save className="w-4 h-4" />
                <span>Profile saved successfully</span>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" form="profile-editor-form" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
