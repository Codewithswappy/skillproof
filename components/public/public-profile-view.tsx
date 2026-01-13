"use client";

import { useState } from "react";
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
  ChevronDown,
} from "lucide-react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandFigma,
  IconBrandCodepen,
  IconBrandDribbble,
  IconBrandVercel,
  IconWorld,
} from "@tabler/icons-react";
import Image from "next/image";
import { PublicProfileData, EvidenceWithSkills } from "@/lib/actions/public";
import { Profile, Skill, Project, ProfileSettings } from "@prisma/client";

interface PublicProfileViewProps {
  data: PublicProfileData;
}

// Type for skills with evidenceCount
type SkillWithCount = Skill & { evidenceCount: number };
type ProjectWithCount = Project & { evidenceCount: number };

// Smart link icon detector
interface LinkInfo {
  icon: React.ReactNode;
  label: string;
}

function getLinkInfo(url: string): LinkInfo {
  const u = url.toLowerCase();
  if (u.includes("github.com"))
    return { icon: <IconBrandGithub className="w-4 h-4" />, label: "GitHub" };
  if (u.includes("linkedin.com"))
    return {
      icon: <IconBrandLinkedin className="w-4 h-4" />,
      label: "LinkedIn",
    };
  if (u.includes("twitter.com") || u.includes("x.com"))
    return { icon: <IconBrandTwitter className="w-4 h-4" />, label: "Twitter" };
  if (u.includes("youtube.com") || u.includes("youtu.be"))
    return { icon: <IconBrandYoutube className="w-4 h-4" />, label: "YouTube" };
  if (u.includes("figma.com"))
    return { icon: <IconBrandFigma className="w-4 h-4" />, label: "Figma" };
  if (u.includes("codepen.io"))
    return { icon: <IconBrandCodepen className="w-4 h-4" />, label: "CodePen" };
  if (u.includes("dribbble.com"))
    return {
      icon: <IconBrandDribbble className="w-4 h-4" />,
      label: "Dribbble",
    };
  if (u.includes("vercel.com") || u.includes("vercel.app"))
    return { icon: <IconBrandVercel className="w-4 h-4" />, label: "Vercel" };
  return { icon: <IconWorld className="w-4 h-4" />, label: "Website" };
}

// Simple syntax highlighting for code snippets
function highlightCode(code: string): React.ReactNode[] {
  const lines = code.split("\n");

  return lines.map((line, lineIndex) => {
    // Process each line for syntax highlighting
    let highlighted = line;

    // Keywords (purple/pink)
    const keywords = [
      "import",
      "export",
      "from",
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "extends",
      "interface",
      "type",
      "enum",
      "default",
      "async",
      "await",
      "try",
      "catch",
      "throw",
      "new",
      "this",
      "super",
      "static",
      "public",
      "private",
      "protected",
      "readonly",
    ];

    // Create regex pattern for keywords
    const keywordPattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");

    // Split line into parts and process
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Handle strings first (green)
    const stringRegex = /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g;
    let match;
    const stringMatches: { start: number; end: number; text: string }[] = [];

    while ((match = stringRegex.exec(line)) !== null) {
      stringMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }

    // Handle comments (gray)
    const commentStart = line.indexOf("//");
    const hasComment = commentStart !== -1;

    // Build the line with highlights
    let currentPos = 0;

    for (let i = 0; i < line.length; i++) {
      // Check if we're in a string
      const inString = stringMatches.some((s) => i >= s.start && i < s.end);
      const inComment = hasComment && i >= commentStart;

      if (inString || inComment) continue;
    }

    // Simple approach: just colorize the whole line based on patterns
    let result = line
      .replace(
        keywordPattern,
        '<span class="text-blue-600 font-semibold">$1</span>'
      )
      .replace(
        /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g,
        '<span class="text-green-600">$&</span>'
      )
      .replace(/\/\/.*/g, '<span class="text-gray-500 italic">$&</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-orange-600">$1</span>')
      .replace(/\{|\}|\(|\)|\[|\]/g, '<span class="text-gray-500">$&</span>')
      .replace(
        /\b(className|href|src|alt|key|variant|size)\b/g,
        '<span class="text-purple-600">$1</span>'
      );

    return (
      <span key={lineIndex}>
        <span dangerouslySetInnerHTML={{ __html: result }} />
        {lineIndex < lines.length - 1 && "\n"}
      </span>
    );
  });
}

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

  // Track expanded evidence sections
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );
  // Track expanded code snippets
  const [expandedCodeItems, setExpandedCodeItems] = useState<Set<string>>(
    new Set()
  );

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
                  <Badge
                    variant="default"
                    className="text-xs rounded-sm tracking-tighter "
                  >
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
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[5px] top-3 bottom-3 w-px border-l-2 border-dashed border-border" />

                <div className="space-y-6">
                  {typedProjects.map((project, index) => {
                    const projectEvidence = evidence.filter(
                      (e) => e.projectId === project.id
                    );

                    return (
                      <div key={project.id} className="relative pl-6">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />

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
                            {project.url &&
                              (() => {
                                const linkInfo = getLinkInfo(project.url);
                                return (
                                  <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                                  >
                                    {linkInfo.icon}
                                    <span>{linkInfo.label}</span>
                                  </a>
                                );
                              })()}
                          </div>

                          {/* Description */}
                          {project.description && (
                            <p className="text-sm text-muted-foreground">
                              {project.description}
                            </p>
                          )}

                          {/* Evidence Items */}
                          {projectEvidence.length > 0 &&
                            (() => {
                              const isExpanded = expandedProjects.has(
                                project.id
                              );
                              const showFirst = projectEvidence[0];
                              const hasMore = projectEvidence.length > 1;
                              const itemsToShow = isExpanded
                                ? projectEvidence
                                : [showFirst];

                              const toggleExpand = () => {
                                setExpandedProjects((prev) => {
                                  const newSet = new Set(prev);
                                  if (newSet.has(project.id)) {
                                    newSet.delete(project.id);
                                  } else {
                                    newSet.add(project.id);
                                  }
                                  return newSet;
                                });
                              };

                              return (
                                <div className="pt-2">
                                  {/* Collapsible header when multiple items */}
                                  {hasMore && (
                                    <button
                                      onClick={toggleExpand}
                                      className="w-full flex items-center justify-between py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                                    >
                                      <span>
                                        Evidence ({projectEvidence.length})
                                      </span>
                                      <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                      />
                                    </button>
                                  )}

                                  {!hasMore && (
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider py-2">
                                      Evidence ({projectEvidence.length})
                                    </p>
                                  )}

                                  <div className="space-y-4">
                                    {itemsToShow.map((item) => (
                                      <div key={item.id} className="py-1">
                                        {/* Evidence Header */}
                                        <div className="py-2">
                                          <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                              <span className="text-muted-foreground">
                                                {getEvidenceIcon(item.type)}
                                              </span>
                                              <span className="font-medium text-sm">
                                                {item.title}
                                              </span>
                                            </div>
                                            {item.url &&
                                              item.type !== "SCREENSHOT" &&
                                              (() => {
                                                const linkInfo = getLinkInfo(
                                                  item.url
                                                );
                                                return (
                                                  <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                                                  >
                                                    {linkInfo.icon}
                                                    <span>
                                                      {linkInfo.label}
                                                    </span>
                                                  </a>
                                                );
                                              })()}
                                          </div>

                                          {/* Skills demonstrated */}
                                          {getSkillNames(item).length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                              {getSkillNames(item).map(
                                                (name, i) => (
                                                  <Badge
                                                    key={i}
                                                    variant="secondary"
                                                    className="text-xs py-0.5 rounded-full"
                                                  >
                                                    {name}
                                                  </Badge>
                                                )
                                              )}
                                            </div>
                                          )}
                                        </div>

                                        {/* Screenshot Preview - Centered with nice styling */}
                                        {item.type === "SCREENSHOT" &&
                                          item.url && (
                                            <div className="p-4 flex justify-center bg-muted/20">
                                              <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block max-w-md"
                                              >
                                                <img
                                                  src={item.url}
                                                  alt={item.title}
                                                  className="rounded shadow-lg hover:shadow-xl transition-shadow max-h-64 object-contain"
                                                />
                                              </a>
                                            </div>
                                          )}

                                        {/* Code Snippet - Beautiful styling */}
                                        {item.type === "CODE_SNIPPET" &&
                                          item.content &&
                                          (() => {
                                            const isCodeExpanded =
                                              expandedCodeItems.has(item.id);
                                            const toggleCodeExpand = () => {
                                              setExpandedCodeItems((prev) => {
                                                const newSet = new Set(prev);
                                                if (newSet.has(item.id))
                                                  newSet.delete(item.id);
                                                else newSet.add(item.id);
                                                return newSet;
                                              });
                                            };

                                            return (
                                              <div className="overflow-hidden border border-gray-200 rounded-lg">
                                                <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b border-gray-200">
                                                  <div className="flex items-center gap-2">
                                                    <div className="flex gap-1.5">
                                                      <span className="w-3 h-3 rounded-full bg-red-400" />
                                                      <span className="w-3 h-3 rounded-full bg-yellow-400" />
                                                      <span className="w-3 h-3 rounded-full bg-green-400" />
                                                    </div>
                                                    <span className="text-xs text-gray-500 ml-2 font-medium">
                                                      code snippet
                                                    </span>
                                                  </div>
                                                  <button
                                                    onClick={toggleCodeExpand}
                                                    className="text-xs text-primary hover:underline font-medium"
                                                  >
                                                    {isCodeExpanded
                                                      ? "Collapse"
                                                      : "Expand"}
                                                  </button>
                                                </div>
                                                <div
                                                  className={`relative bg-white ${isCodeExpanded ? "" : "max-h-48 overflow-hidden"}`}
                                                >
                                                  <pre className="p-4 text-sm font-mono leading-relaxed overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                    <code>
                                                      {highlightCode(
                                                        item.content
                                                      )}
                                                    </code>
                                                  </pre>

                                                  {/* Gradient Mask */}
                                                  {!isCodeExpanded && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent pointer-events-none flex items-end justify-center pb-4">
                                                      <div className="pointer-events-auto">
                                                        <button
                                                          onClick={
                                                            toggleCodeExpand
                                                          }
                                                          className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-600 hover:text-black hover:bg-white transition-all flex items-center gap-1"
                                                        >
                                                          <ChevronDown className="w-3 h-3" />
                                                          Show full code
                                                        </button>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          })()}

                                        {/* Metric - Nice card styling */}
                                        {item.type === "METRIC" &&
                                          item.content && (
                                            <div className="p-6 text-center bg-primary/5">
                                              <p className="text-3xl font-bold text-primary">
                                                {item.content}
                                              </p>
                                            </div>
                                          )}

                                        {/* Link type - just show the link info */}
                                        {item.type === "LINK" && item.url && (
                                          <div className="p-4 flex justify-center">
                                            <a
                                              href={item.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                                            >
                                              {getLinkInfo(item.url).icon}
                                              <span>
                                                View{" "}
                                                {getLinkInfo(item.url).label}
                                              </span>
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>

                                  {/* Show more indicator */}
                                  {hasMore && !isExpanded && (
                                    <button
                                      onClick={toggleExpand}
                                      className="w-full mt-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
                                    >
                                      <span>
                                        Show {projectEvidence.length - 1} more
                                        evidence
                                      </span>
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              );
                            })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
