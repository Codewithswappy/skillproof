"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";
import { Skill } from "@prisma/client";

interface SkillWithCount extends Skill {
  evidenceCount: number;
}

interface SkillsListProps {
  skills: SkillWithCount[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SkillsList({ skills, selectedId, onSelect }: SkillsListProps) {
  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-6 text-center text-muted-foreground">
        <p>No skills yet.</p>
        <p className="text-sm">Click &quot;Add Skill&quot; to create one.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {skills.map((skill) => {
        const isSelected = skill.id === selectedId;
        const isProven = skill.evidenceCount > 0;

        return (
          <button
            key={skill.id}
            onClick={() => onSelect(skill.id)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-md text-left transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {isProven ? (
                <CheckCircle
                  className={cn(
                    "w-5 h-5 shrink-0",
                    isSelected ? "text-primary-foreground" : "text-green-600"
                  )}
                />
              ) : (
                <Circle
                  className={cn(
                    "w-5 h-5 shrink-0",
                    isSelected
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                />
              )}
              <span className="font-medium truncate">{skill.name}</span>
            </div>
            {skill.evidenceCount > 0 && (
              <Badge
                variant={isSelected ? "outline" : "secondary"}
                className={cn(
                  "ml-2 text-xs",
                  isSelected &&
                    "border-primary-foreground text-primary-foreground"
                )}
              >
                {skill.evidenceCount}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
