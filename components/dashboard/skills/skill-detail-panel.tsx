"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSkill } from "@/lib/actions/skill";
import { deleteEvidence } from "@/lib/actions/evidence";
import { EvidenceForm } from "@/components/dashboard/evidence-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, X, Plus, ExternalLink } from "lucide-react";
import { Skill, Evidence, Project } from "@prisma/client";

interface SkillDetailPanelProps {
  skill: Skill;
  evidence: Evidence[];
  allProjects: Project[];
  onClose: () => void;
}

export function SkillDetailPanel({
  skill,
  evidence,
  allProjects,
  onClose,
}: SkillDetailPanelProps) {
  const router = useRouter();
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getProjectTitle = (projectId: string) => {
    return (
      allProjects.find((p) => p.id === projectId)?.title || "Unknown Project"
    );
  };

  async function handleDeleteSkill() {
    if (
      !confirm("Are you sure? This will delete the skill and all its evidence.")
    )
      return;
    setIsDeleting(true);
    const result = await deleteSkill({ skillId: skill.id });
    if (result.success) {
      router.refresh();
      onClose();
    } else {
      alert(result.error);
      setIsDeleting(false);
    }
  }

  async function handleDeleteEvidence(evidenceId: string) {
    if (!confirm("Remove this evidence?")) return;
    const result = await deleteEvidence({ evidenceId });
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  if (isAddingEvidence) {
    return (
      <EvidenceForm
        preselectedSkillId={skill.id}
        projects={allProjects}
        onCancel={() => setIsAddingEvidence(false)}
        onSuccess={() => setIsAddingEvidence(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">{skill.name}</h2>
            <Badge variant="outline">{skill.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {evidence.length} piece{evidence.length !== 1 ? "s" : ""} of
            evidence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Evidence List */}
        <div className="space-y-4">
          {evidence.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900/50">
              <p className="text-muted-foreground mb-4">
                No evidence added yet.
              </p>
              <Button onClick={() => setIsAddingEvidence(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Evidence
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Evidence</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddingEvidence(true)}
                  disabled={allProjects.length === 0}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              {allProjects.length === 0 && (
                <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
                  You need to create a Project before you can add evidence.
                </div>
              )}

              {evidence.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-md p-4 bg-card relative group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-lg">{item.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        via project:{" "}
                        <span className="font-medium text-foreground">
                          {getProjectTitle(item.projectId)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteEvidence(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {item.description && (
                    <p className="text-sm text-foreground/80 mt-2">
                      {item.description}
                    </p>
                  )}

                  {item.url && (
                    <div className="mt-3">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {item.url}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/20 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleDeleteSkill}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Skill
        </Button>
        <div className="flex gap-2">{/* Maybe other actions */}</div>
      </div>
    </div>
  );
}
