"use client";

import Link from "next/link";
import { FullProfile } from "@/lib/actions/profile";
import { ProfileHeader } from "@/components/dashboard/profile-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardOverviewProps {
  data: FullProfile;
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { skills, projects } = data;

  const provenSkillsCount = skills.filter((s) => s.evidenceCount > 0).length;
  const unprovenSkillsCount = skills.length - provenSkillsCount;

  return (
    <div className="space-y-6">
      <ProfileHeader data={data} />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills Summary */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Skills</CardTitle>
            <Link
              href="/dashboard/skills"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1"
              )}
            >
              Manage <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {skills.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center space-y-3 border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <p className="text-muted-foreground">No skills added yet</p>
                <Link
                  href="/dashboard/skills"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">
                      {provenSkillsCount}
                    </span>{" "}
                    Proven
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">
                      {unprovenSkillsCount}
                    </span>{" "}
                    Unproven
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 10).map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className={
                        skill.evidenceCount > 0
                          ? "border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900"
                          : "text-muted-foreground"
                      }
                    >
                      {skill.evidenceCount > 0 && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {skill.name}
                    </Badge>
                  ))}
                  {skills.length > 10 && (
                    <span className="text-xs text-muted-foreground flex items-center">
                      +{skills.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects Summary */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Projects</CardTitle>
            <Link
              href="/dashboard/projects"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1"
              )}
            >
              Manage <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center space-y-3 border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <p className="text-muted-foreground">No projects added yet</p>
                <Link
                  href="/dashboard/projects"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {projects.length}
                  </span>{" "}
                  total projects
                </div>

                <div className="space-y-3">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="p-3 border rounded-md bg-card"
                    >
                      <div className="font-medium truncate">
                        {project.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <span>{project.evidenceCount} evidence items</span>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline ml-auto"
                          >
                            View Link
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  {projects.length > 3 && (
                    <div className="text-center">
                      <Link
                        href="/dashboard/projects"
                        className={buttonVariants({
                          variant: "link",
                          size: "sm",
                        })}
                      >
                        View all projects
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
