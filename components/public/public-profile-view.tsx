"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Circle,
  ExternalLink,
  Calendar,
  Mail,
  Briefcase,
  Award,
  FolderOpen,
  FileCheck,
  User,
  Image as ImageIcon,
  Link2,
  Code,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import { PublicProfileData, EvidenceWithSkills } from "@/lib/actions/public";
import { Profile, Skill, Project, ProfileSettings } from "@prisma/client";

interface PublicProfileViewProps {
  data: PublicProfileData;
}

// Type for skills with evidenceCount
type SkillWithCount = Skill & { evidenceCount: number };
type ProjectWithCount = Project & { evidenceCount: number };

export function PublicProfileView({ data }: PublicProfileViewProps) {
  const { profile, skills, projects, evidence, email, userName } = data;

  const typedSkills = skills as SkillWithCount[];
  const typedProjects = projects as ProjectWithCount[];

  const provenSkills = typedSkills.filter((s) => s.evidenceCount > 0);
  const unprovenSkills = typedSkills.filter((s) => s.evidenceCount === 0);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    });
  };

  const getSkillNames = (evidenceItem: EvidenceWithSkills) => {
    return evidenceItem.skills.map((es) => es.skill.name);
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case "SCREENSHOT":
        return <ImageIcon className="w-4 h-4" />;
      case "LINK":
        return <Link2 className="w-4 h-4" />;
      case "CODE_SNIPPET":
        return <Code className="w-4 h-4" />;
      case "METRIC":
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <FileCheck className="w-4 h-4" />;
    }
  };

  const displayName = userName || profile.slug;

  // Calculate stats
  const totalEvidence = evidence.length;
  const totalSkills = typedSkills.length;
  const totalProjects = typedProjects.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-4 ">
        {/* Profile Header */}
        <Card className="border-y-[0.5px] shadow-none ring-0 ">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-muted border-b-2 border-border flex items-center justify-center ">
                  {profile.image ? (
                    <Image
                      src={profile.image}
                      alt={displayName}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Name & Info */}
              <div className="flex-1 pl-2">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold tracking-tighter">
                  {displayName}
                </h1>
                 <Badge variant="default" className="text-xs rounded-sm tracking-tighter ">
                    Skill Proof
                  </Badge>
                </div>
                  {profile.headline && (
                    <span className="text-muted-foreground text-sm mt-2">
                      {profile.headline}
                    </span>
                  )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-1 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {email}
                  </a>
                )}
              </div>
            </div>

            {/* Summary */}
            {profile.summary && (
              <p className="text-sm text-muted-foreground mt-4 leading-tight">
                {profile.summary}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 ">
          <Card className="ring-0">
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Skills
                </span>
              </div>
              <p className="text-xl font-bold">{totalSkills}</p>
              <p className="text-xs text-muted-foreground">
                {provenSkills.length} proven
              </p>
            </CardContent>
          </Card>

          <Card className="ring-0">
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <FolderOpen className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Projects
                </span>
              </div>
              <p className="text-xl font-bold">{totalProjects}</p>
            </CardContent>
          </Card>

          <Card className="ring-0">
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <FileCheck className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Evidence
                </span>
              </div>
              <p className="text-2xl font-bold">{totalEvidence}</p>
            </CardContent>
          </Card>
        </div>

        {/* Skills Section */}
        <Card className="ring-0 border-y-[0.5px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-1">
              <Award className="w-4 h-4" />
              Skills
            </CardTitle>
            <CardDescription>
              Proven skills are verified with project evidence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Proven Skills */}
            {provenSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Proven with Evidence
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {provenSkills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="default"
                      className="rounded-sm"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {skill.name}
                      <span className="ml-1 opacity-60 text-xs">
                        ({skill.evidenceCount})
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Unproven Skills */}
            {unprovenSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Circle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Claimed
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {unprovenSkills.map((skill) => (
                    <Badge key={skill.id} variant="outline">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {typedSkills.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No skills listed yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Projects & Evidence Section */}
        <Card className="ring-0 border-y-[0.5px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Projects & Evidence
            </CardTitle>
            <CardDescription>
              Work experience with verifiable proof
            </CardDescription>
          </CardHeader>
          <CardContent>
            {typedProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No projects listed yet.
              </p>
            ) : (
              <div className="space-y-6">
                {typedProjects.map((project, index) => {
                  const projectEvidence = evidence.filter(
                    (e) => e.projectId === project.id
                  );

                  return (
                    <div key={project.id}>
                      {index > 0 && <Separator className="mb-6" />}
                      <div className="space-y-4">
                        {/* Project Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold">{project.title}</h3>
                            {(project.startDate || project.endDate) && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <Calendar className="w-3 h-3" />
                                {project.startDate &&
                                  formatDate(project.startDate)}
                                {project.startDate && " — "}
                                {project.endDate
                                  ? formatDate(project.endDate)
                                  : "Present"}
                              </div>
                            )}
                          </div>
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </a>
                          )}
                        </div>

                        {/* Description */}
                        {project.description && (
                          <p className="text-sm text-muted-foreground">
                            {project.description}
                          </p>
                        )}

                        {/* Evidence Items */}
                        {projectEvidence.length > 0 && (
                          <div className="space-y-3 pt-2 ">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Evidence ({projectEvidence.length})
                            </p>
                            <div className="grid gap-3">
                              {projectEvidence.map((item) => (
                                <div
                                  key={item.id}
                                  className="rounded-sm p-4"
                                >
                                  {/* Evidence Header */}
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                      {getEvidenceIcon(item.type)}
                                      <span className="font-medium text-sm">
                                        {item.title}
                                      </span>
                                    </div>
                                    {item.url && item.type !== "SCREENSHOT" && (
                                      <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        Source
                                      </a>
                                    )}
                                  </div>

                                  {/* Skills demonstrated */}
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {getSkillNames(item).map((name, i) => (
                                      <Badge
                                        key={i}
                                        variant="default"
                                        className="text-xs py-0 rounded-sm"
                                      >
                                        {name}
                                      </Badge>
                                    ))}
                                  </div>

                                  {/* Screenshot Preview */}
                                  {item.type === "SCREENSHOT" && item.url && (
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block mt-2"
                                    >
                                      <img
                                        src={item.url}
                                        alt={item.title}
                                        className="w-full max-h-72 object-cover rounded-sm border hover:opacity-90 transition-opacity"
                                      />
                                    </a>
                                  )}

                                  {/* Code Snippet */}
                                  {item.type === "CODE_SNIPPET" &&
                                    item.content && (
                                      <pre className="mt-2 p-3 bg-zinc-900 text-zinc-100 rounded-md text-xs overflow-x-auto max-h-40">
                                        <code>{item.content}</code>
                                      </pre>
                                    )}

                                  {/* Metric */}
                                  {item.type === "METRIC" && item.content && (
                                    <p className="mt-2 text-lg font-bold text-primary">
                                      {item.content}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Verified profile powered by{" "}
            <span className="font-semibold text-foreground">SkillProof</span>
          </p>
        </div>
      </div>
    </div>
  );
}
