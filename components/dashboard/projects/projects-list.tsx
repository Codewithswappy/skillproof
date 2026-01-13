"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Folder, ExternalLink } from "lucide-react";
import { Project } from "@prisma/client";

interface ProjectWithCount extends Project {
  evidenceCount: number;
}

interface ProjectsListProps {
  projects: ProjectWithCount[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ProjectsList({
  projects,
  selectedId,
  onSelect,
}: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-6 text-center text-muted-foreground">
        <p>No projects yet.</p>
        <p className="text-sm">Click &quot;Add Project&quot; to create one.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {projects.map((project) => {
        const isSelected = project.id === selectedId;

        return (
          <button
            key={project.id}
            onClick={() => onSelect(project.id)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-md text-left transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Folder
                className={cn(
                  "w-5 h-5 shrink-0",
                  isSelected
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              />
              <div className="flex flex-col items-start overflow-hidden">
                <span className="font-medium truncate w-full">
                  {project.title}
                </span>
                {project.url && (
                  <span className="text-xs opacity-70 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Link attached
                  </span>
                )}
              </div>
            </div>
            {project.evidenceCount > 0 && (
              <Badge
                variant={isSelected ? "outline" : "secondary"}
                className={cn(
                  "ml-2 text-xs",
                  isSelected &&
                    "border-primary-foreground text-primary-foreground"
                )}
              >
                {project.evidenceCount}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
