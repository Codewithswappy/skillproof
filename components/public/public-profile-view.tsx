"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Mail,
  ArrowUpRight,
  User,
  LayoutGrid,
  List,
  FileCheck,
  Image as ImageIcon,
  Link as LinkIcon,
  Calendar,
  CheckCircle2,
  Trophy,
  Code2,
} from "lucide-react";
import Image from "next/image";
import { PublicProfileData } from "@/lib/actions/public";
import { Project } from "@prisma/client";
import { SkillTimelineV2 } from "./skill-timeline-v2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PublicProfileViewProps {
  data: PublicProfileData;
}

type ProjectWithCount = Project & { evidenceCount: number };

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export function PublicProfileView({ data }: PublicProfileViewProps) {
  const {
    profile,
    skills,
    projects,
    evidence,
    email,
    userName,
    profileCredibility,
  } = data;

  const typedProjects = projects as ProjectWithCount[];
  const displayName = userName || profile.slug;
  const [activeTab, setActiveTab] = useState<"overview" | "projects">(
    "overview",
  );

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 space-y-12">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row gap-8 md:items-start md:justify-between">
          <div className="flex gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 shadow-sm shrink-0 border border-neutral-100 dark:border-neutral-800">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={displayName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-700">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {displayName}
                </h1>
                <p className="text-base text-neutral-500 dark:text-neutral-400 font-medium">
                  {profile.headline || "Design Engineer"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 3).map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="font-normal text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  >
                    {skill.name}
                  </Badge>
                ))}
                {skills.length > 3 && (
                  <Badge
                    variant="outline"
                    className="font-normal text-neutral-500 border-dashed"
                  >
                    +{skills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {email && (
            <a
              href={`mailto:${email}`}
              className="hidden md:flex items-center gap-2 h-9 px-4 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-all"
            >
              <Mail className="w-4 h-4" />
              Contact Me
            </a>
          )}
        </div>

        {/* --- TABS --- */}
        <div className="border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex gap-8 text-sm">
            <button
              onClick={() => setActiveTab("overview")}
              className={cn(
                "pb-3 -mb-px font-medium transition-all",
                activeTab === "overview"
                  ? "text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100"
                  : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={cn(
                "pb-3 -mb-px font-medium transition-all",
                activeTab === "projects"
                  ? "text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100"
                  : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
              )}
            >
              Projects{" "}
              <span className="ml-1 text-xs text-neutral-300 dark:text-neutral-600">
                {projects.length}
              </span>
            </button>
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column: Stats & Credibility */}
              <div className="space-y-10">
                <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      Credibility
                    </span>
                    <Trophy className="w-4 h-4 text-neutral-300 dark:text-neutral-700" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-semibold tracking-tighter text-neutral-900 dark:text-neutral-100">
                      {profileCredibility.overallScore}
                    </span>
                    <span className="text-sm text-neutral-400">/ 100</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
                    Based on verified projects, code contributions, and skill
                    demonstrations.
                  </p>

                  {/* Minimal Progress Bar */}
                  <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full"
                      style={{ width: `${profileCredibility.overallScore}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <Code2 className="w-5 h-5 text-neutral-300 dark:text-neutral-600 mb-3" />
                    <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      {skills.length}
                    </div>
                    <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                      Skills
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <CheckCircle2 className="w-5 h-5 text-neutral-300 dark:text-neutral-600 mb-3" />
                    <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      {evidence.length}
                    </div>
                    <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                      Proofs
                    </div>
                  </div>
                </div>

                {email && (
                  <div className="md:hidden">
                    <a
                      href={`mailto:${email}`}
                      className="flex w-full items-center justify-center gap-2 h-12 text-sm font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-900 rounded-xl"
                    >
                      <Mail className="w-4 h-4" />
                      Contact Me
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: Timeline & Highlights */}
              <div className="lg:col-span-2 space-y-8">
                {skills.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
                      Skill Timeline
                    </h3>
                    <div className="border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 md:p-8 bg-white dark:bg-neutral-950">
                      <SkillTimelineV2
                        skills={skills}
                        evidence={evidence}
                        projects={typedProjects.map((p) => ({
                          id: p.id,
                          title: p.title,
                        }))}
                        compact
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                    <p className="text-neutral-400 font-medium">
                      No activity data available yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6 max-w-3xl">
              {typedProjects.length > 0 ? (
                typedProjects.map((project) => {
                  const projectEvidence = evidence.filter(
                    (e) => e.projectId === project.id,
                  );
                  return (
                    <div
                      key={project.id}
                      className="group bg-transparent rounded-none border-b border-neutral-100 dark:border-neutral-800 pb-10 mb-2 last:border-0"
                    >
                      <div className="flex justify-between items-baseline mb-3">
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              {project.title}
                              <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </a>
                          ) : (
                            project.title
                          )}
                        </h3>
                        {project.startDate && (
                          <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest shrink-0 ml-4">
                            {formatDate(project.startDate)}
                          </span>
                        )}
                      </div>

                      {project.description && (
                        <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6 max-w-2xl">
                          {project.description}
                        </p>
                      )}

                      {/* Evidence List - Subtle Links */}
                      {projectEvidence.length > 0 && (
                        <div className="space-y-3">
                          <div className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
                            Verification Evidence
                          </div>
                          <div className="grid gap-2">
                            {projectEvidence.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                              >
                                <div className="shrink-0 text-neutral-400">
                                  {item.type === "SCREENSHOT" ? (
                                    <ImageIcon className="w-4 h-4" />
                                  ) : item.type === "CODE_SNIPPET" ? (
                                    <Code2 className="w-4 h-4" />
                                  ) : (
                                    <LinkIcon className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-0.5">
                                    {item.type.replace("_", " ")}
                                  </div>
                                  {item.url ? (
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm font-medium text-neutral-900 dark:text-neutral-200 hover:underline truncate block"
                                    >
                                      {item.title}
                                    </a>
                                  ) : (
                                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-200 truncate block">
                                      {item.title}
                                    </span>
                                  )}
                                </div>
                                {item.url && (
                                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                  <div className="p-4 rounded-full bg-neutral-50 dark:bg-neutral-900 mb-4">
                    <List className="w-6 h-6 text-neutral-300 dark:text-neutral-600" />
                  </div>
                  <p className="text-neutral-900 dark:text-neutral-100 font-medium">
                    No projects showcasing skills yet.
                  </p>
                  <p className="text-neutral-400 text-sm mt-1">
                    This user hasn't proven their skills with projects.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
