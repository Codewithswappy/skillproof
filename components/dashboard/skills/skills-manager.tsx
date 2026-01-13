"use client";

import { useState } from "react";
import { FullProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SkillsList } from "./skills-list";
import { SkillDetailPanel } from "./skill-detail-panel";
import { SkillForm } from "./skill-form";
import { ProfileHeader } from "@/components/dashboard/profile-header";

interface SkillsManagerProps {
  data: FullProfile;
}

export function SkillsManager({ data }: SkillsManagerProps) {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const selectedSkill = data.skills.find((s) => s.id === selectedSkillId);

  // Filter evidence for the selected skill (using junction table)
  const skillEvidence = selectedSkill
    ? data.evidence.filter((e: any) =>
        e.skills?.some((es: any) => es.skillId === selectedSkill.id)
      )
    : [];

  const handleSelect = (id: string) => {
    setSelectedSkillId(id);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedSkillId(null);
    setIsCreating(true);
  };

  const handleClose = () => {
    setSelectedSkillId(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Skills Manager</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left List Panel */}
        <div className="w-full md:w-1/3 border rounded-lg bg-card flex flex-col overflow-hidden">
          <SkillsList
            skills={data.skills}
            selectedId={selectedSkillId}
            onSelect={handleSelect}
          />
        </div>

        {/* Right Detail Panel */}
        <div className="hidden md:flex flex-1 border rounded-lg bg-card overflow-hidden">
          {isCreating ? (
            <SkillForm onCancel={handleClose} onSuccess={handleClose} />
          ) : selectedSkill ? (
            <SkillDetailPanel
              skill={selectedSkill}
              evidence={skillEvidence}
              allProjects={data.projects}
              onClose={handleClose}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground p-6 text-center">
              <p>Select a skill to view details or add evidence.</p>
              <p className="text-sm mt-2">
                Or create a new skill to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Modal / Overlay would go here, or we conditionally render based on screen size in CSS */}
      {/* For simplicity in MVP, we might toggle views on mobile */}
      {(selectedSkillId || isCreating) && (
        <div className="fixed inset-0 z-50 bg-background md:hidden p-4 overflow-y-auto">
          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
          {isCreating ? (
            <SkillForm onCancel={handleClose} onSuccess={handleClose} />
          ) : selectedSkill ? (
            <SkillDetailPanel
              skill={selectedSkill}
              evidence={skillEvidence}
              allProjects={data.projects}
              onClose={handleClose}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
