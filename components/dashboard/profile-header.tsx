"use client";

import { useState } from "react";
import Link from "next/link";
import { FullProfile, toggleProfileVisibility } from "@/lib/actions/profile";
import { Button, buttonVariants } from "@/components/ui/button";
import { Globe, Lock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  data: FullProfile;
}

export function ProfileHeader({ data }: ProfileHeaderProps) {
  const { profile, profileSettings } = data;
  const [isPublic, setIsPublic] = useState(profileSettings.isPublic);
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle() {
    setIsLoading(true);
    const newStatus = !isPublic;

    // Optimistic update
    setIsPublic(newStatus);

    const result = await toggleProfileVisibility(newStatus);

    if (!result.success) {
      // Revert if failed
      setIsPublic(!newStatus);
      // Could show toast error here
    }

    setIsLoading(false);
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-6 bg-card rounded-lg border shadow-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="font-medium text-foreground">{profile.slug}</span>
          <span className="text-xs">•</span>
          <span className="truncate max-w-md">
            {profile.headline || "No headline set"}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        {isPublic && (
          <Link
            href={`/${profile.slug}`}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full sm:w-auto gap-2"
            )}
          >
            <ExternalLink className="w-4 h-4" />
            View Public
          </Link>
        )}

        <Button
          variant={isPublic ? "default" : "secondary"}
          size="sm"
          onClick={handleToggle}
          disabled={isLoading}
          className={cn(
            "w-full sm:w-auto gap-2 transition-all",
            isPublic ? "bg-green-600 hover:bg-green-700" : ""
          )}
        >
          {isPublic ? (
            <>
              <Globe className="w-4 h-4" />
              Public
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Private
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
