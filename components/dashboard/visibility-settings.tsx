"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileSettings, FullProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface VisibilitySettingsProps {
  data: FullProfile;
}

export function VisibilitySettings({ data }: VisibilitySettingsProps) {
  const router = useRouter();
  const { profileSettings } = data;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const showEmail = formData.get("showEmail") === "on";
    const showUnprovenSkills = formData.get("showUnprovenSkills") === "on";

    const result = await updateProfileSettings({
      showEmail,
      showUnprovenSkills,
    });

    if (result.success) {
      router.refresh();
      // Optional toast
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibility Settings</CardTitle>
        <CardDescription>
          Control what information is visible on your public profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="visibility-settings-form"
          action={handleSubmit}
          className="space-y-6"
        >
          <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
            <div className="space-y-0.5">
              <Label htmlFor="showEmail" className="text-base">
                Show Email Address
              </Label>
              <p className="text-sm text-muted-foreground">
                Display your registered email on your public profile.
              </p>
            </div>
            <div className="flex items-center h-6">
              <input
                id="showEmail"
                name="showEmail"
                type="checkbox"
                defaultChecked={profileSettings.showEmail}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
            <div className="space-y-0.5">
              <Label htmlFor="showUnprovenSkills" className="text-base">
                Show Unproven Skills
              </Label>
              <p className="text-sm text-muted-foreground">
                Display skills that don&apos;t have evidence yet.
              </p>
            </div>
            <div className="flex items-center h-6">
              <input
                id="showUnprovenSkills"
                name="showUnprovenSkills"
                type="checkbox"
                defaultChecked={profileSettings.showUnprovenSkills}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          form="visibility-settings-form"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
}
