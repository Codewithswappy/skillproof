"use client";

import { useState } from "react";
import { FullProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectsList } from "./projects-list";
import { ProjectDetailPanel } from "./project-detail-panel";
import { ProjectForm } from "./project-form";

interface ProjectsManagerProps {
  data: FullProfile;
}

export function ProjectsManager({ data }: ProjectsManagerProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  const selectedProject = data.projects.find((p) => p.id === selectedProjectId);

  // Filter evidence for the selected project (cast to any since evidence includes skills from getMyProfile)
  const projectEvidence = selectedProject
    ? (data.evidence as any[]).filter((e) => e.projectId === selectedProject.id)
    : [];

  const handleSelect = (id: string) => {
    setSelectedProjectId(id);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedProjectId(null);
    setIsCreating(true);
  };

  const handleClose = () => {
    setSelectedProjectId(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects Manager</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left List Panel */}
        <div className="w-full md:w-1/3 border rounded-lg bg-card flex flex-col overflow-hidden">
          <ProjectsList
            projects={data.projects}
            selectedId={selectedProjectId}
            onSelect={handleSelect}
          />
        </div>

        {/* Right Detail Panel */}
        <div className="hidden md:flex flex-1 border rounded-lg bg-card overflow-hidden">
          {isCreating ? (
            <ProjectForm onCancel={handleClose} onSuccess={handleClose} />
          ) : selectedProject ? (
            <ProjectDetailPanel
              project={selectedProject}
              evidence={projectEvidence}
              allSkills={data.skills}
              onClose={handleClose}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground p-6 text-center">
              <p>Select a project to view details or add evidence.</p>
              <p className="text-sm mt-2">
                Or create a new project to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Modal */}
      {(selectedProjectId || isCreating) && (
        <div className="fixed inset-0 z-50 bg-background md:hidden p-4 overflow-y-auto">
          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
          {isCreating ? (
            <ProjectForm onCancel={handleClose} onSuccess={handleClose} />
          ) : selectedProject ? (
            <ProjectDetailPanel
              project={selectedProject}
              evidence={projectEvidence}
              allSkills={data.skills}
              onClose={handleClose}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
