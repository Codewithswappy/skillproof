"use client";

import { ResumeContent } from "@/lib/schemas/resume";
import { cn } from "@/lib/utils";

interface MinimalTemplateProps {
  content: ResumeContent;
}

export function MinimalTemplate({ content }: MinimalTemplateProps) {
  const { profile } = content;

  // Helper for rendering HTML content safely
  const HTML = ({ html, className }: { html?: string; className?: string }) => {
    if (!html) return null;
    return (
      <div
        className={cn(
          "prose prose-sm max-w-none text-neutral-600 leading-relaxed [&>ul]:list-disc [&>ul]:ml-4 [&>p]:mb-1",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  // Format date helper
  const formatDate = (date?: string | null) => {
    if (!date) return "";
    if (date.includes("T")) return date.split("T")[0];
    return date;
  };

  return (
    <div
      className="w-full h-full bg-white text-neutral-800 p-10 font-serif"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* Header */}
      <header className="text-center border-b border-neutral-300 pb-6 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-neutral-900 mb-1">
          {profile.firstName} {profile.lastName}
        </h1>
        {profile.headline && (
          <p className="text-sm italic text-neutral-500 mb-3">
            {profile.headline}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-4 text-xs text-neutral-500">
          {profile.email && <span>{profile.email}</span>}
          {profile.phone && <span>• {profile.phone}</span>}
          {profile.location && <span>• {profile.location}</span>}
          {profile.linkedin && (
            <span>• {profile.linkedin.replace(/^https?:\/\//, "")}</span>
          )}
          {profile.github && (
            <span>• {profile.github.replace(/^https?:\/\//, "")}</span>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="space-y-6 text-sm">
        {/* Summary */}
        {content.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Summary
            </h2>
            <HTML html={content.summary} />
          </section>
        )}

        {/* Experience */}
        {content.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Experience
            </h2>
            <div className="space-y-4">
              {content.experience.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-neutral-900">
                      {item.title}
                    </h3>
                    <span className="text-xs text-neutral-400">
                      {formatDate(item.startDate)} –{" "}
                      {item.current ? "Present" : formatDate(item.endDate)}
                    </span>
                  </div>
                  <div className="text-neutral-500 text-xs mb-1">
                    {item.company}
                    {item.location && ` • ${item.location}`}
                  </div>
                  <HTML html={item.description ?? undefined} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {content.projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Projects
            </h2>
            <div className="space-y-3">
              {content.projects.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-neutral-900">
                      {item.title}
                    </h3>
                    {(item.startDate || item.endDate) && (
                      <span className="text-xs text-neutral-400">
                        {formatDate(item.startDate)} –{" "}
                        {formatDate(item.endDate)}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <div className="text-neutral-500 text-xs">
                      {item.subtitle}
                    </div>
                  )}
                  <HTML html={item.description ?? undefined} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {content.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Skills
            </h2>
            <div className="space-y-1">
              {content.skills.map((group) => (
                <div key={group.id} className="flex">
                  <span className="font-semibold w-28 shrink-0">
                    {group.name}:
                  </span>
                  <span className="text-neutral-600">
                    {group.skills.map((s) => s.name).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {content.education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Education
            </h2>
            <div className="space-y-2">
              {content.education.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <div className="font-semibold">{item.school}</div>
                    <div className="text-neutral-500 text-xs">
                      {item.degree}
                      {item.field && ` in ${item.field}`}
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400 text-right">
                    {formatDate(item.startDate)} – {formatDate(item.endDate)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {content.certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Certifications
            </h2>
            <ul className="list-disc ml-4 space-y-1 text-neutral-700">
              {content.certifications.map((item) => (
                <li key={item.id}>
                  <span className="font-semibold">{item.name}</span>
                  {item.issuer && <span> — {item.issuer}</span>}
                  {item.date && (
                    <span className="text-neutral-400 text-xs ml-1">
                      ({formatDate(item.date)})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
