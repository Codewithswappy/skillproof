import { ResumeContent } from "@/lib/schemas/resume";
import { cn } from "@/lib/utils";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandLinkedin,
  IconBrandGithub,
  IconWorld,
} from "@tabler/icons-react";

interface TemplateProps {
  content: ResumeContent;
}

export function ModernTemplate({ content }: TemplateProps) {
  const { profile } = content;

  // Helper for rendering HTML content safely-ish (Tiptap output)
  const HTML = ({ html, className }: { html?: string; className?: string }) => {
    if (!html) return null;
    return (
      <div
        className={cn(
          "prose prose-sm max-w-none text-neutral-700 leading-relaxed [&>ul]:list-disc [&>ul]:ml-4 [&>p]:mb-1",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <div
      className="w-full h-full bg-white text-neutral-900 p-8 font-sans"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <header className="border-b-2 border-neutral-900 pb-6 mb-6">
        <h1 className="text-4xl font-bold uppercase tracking-tight text-neutral-900 mb-2">
          {profile.firstName} {profile.lastName}
        </h1>
        {profile.headline && (
          <p className="text-lg font-medium text-neutral-600 mb-4">
            {profile.headline}
          </p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-neutral-600 font-medium">
          {profile.email && (
            <div className="flex items-center gap-1.5">
              <IconMail className="w-4 h-4" />
              <span>{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-1.5">
              <IconPhone className="w-4 h-4" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-1.5">
              <IconMapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.linkedin && (
            <div className="flex items-center gap-1.5">
              <IconBrandLinkedin className="w-4 h-4" />
              <span>{profile.linkedin.replace(/^https?:\/\//, "")}</span>
            </div>
          )}
          {profile.github && (
            <div className="flex items-center gap-1.5">
              <IconBrandGithub className="w-4 h-4" />
              <span>{profile.github.replace(/^https?:\/\//, "")}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1.5">
              <IconWorld className="w-4 h-4" />
              <span>{profile.website.replace(/^https?:\/\//, "")}</span>
            </div>
          )}
        </div>
      </header>

      {/* Body Content - Order determined by sectionOrder */}
      <div className="space-y-6">
        {/* Summary */}
        {content.summary && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-200 pb-1 mb-3 text-neutral-900">
              Professional Summary
            </h3>
            <HTML html={content.summary} />
          </section>
        )}

        {/* Experience */}
        {content.experience.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-200 pb-1 mb-3 text-neutral-900">
              Work Experience
            </h3>
            <div className="space-y-5">
              {content.experience.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-base text-neutral-900">
                      {item.title}
                    </h4>
                    <span className="text-sm font-medium text-neutral-500">
                      {item.startDate} –{" "}
                      {item.current ? "Present" : item.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-neutral-700 mb-2">
                    {item.company}{" "}
                    {item.location && <span>• {item.location}</span>}
                  </div>
                  <HTML html={item.description} className="text-sm" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {content.projects.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-200 pb-1 mb-3 text-neutral-900">
              Projects
            </h3>
            <div className="space-y-4">
              {content.projects.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                      {item.title}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          <IconWorld className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {item.repoUrl && (
                        <a
                          href={item.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          <IconBrandGithub className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </h4>
                    {(item.startDate || item.endDate) && (
                      <span className="text-xs font-medium text-neutral-500">
                        {item.startDate ? item.startDate.split("T")[0] : ""}
                        {item.startDate && item.endDate ? " – " : ""}
                        {item.endDate ? item.endDate.split("T")[0] : ""}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <div className="text-xs font-semibold text-neutral-600 mb-1">
                      {item.subtitle}
                    </div>
                  )}
                  <HTML
                    html={item.description ?? undefined}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {content.skills.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-200 pb-1 mb-3 text-neutral-900">
              Skills
            </h3>
            <div className="space-y-2 text-sm">
              {content.skills.map((group) => (
                <div key={group.id} className="flex">
                  <span className="font-bold w-32 shrink-0 text-neutral-800">
                    {group.name}:
                  </span>
                  <span className="text-neutral-700">
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
            <h3 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-200 pb-1 mb-3 text-neutral-900">
              Education
            </h3>
            <div className="space-y-3">
              {content.education.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <div className="font-bold text-neutral-900">
                      {item.school}
                    </div>
                    <div className="text-neutral-700">
                      {item.degree} {item.field && `in ${item.field}`}
                    </div>
                    {item.location && (
                      <div className="text-neutral-500 text-xs">
                        {item.location}
                      </div>
                    )}
                  </div>
                  <div className="text-right font-medium text-neutral-500">
                    {item.startDate && <span>{item.startDate} – </span>}{" "}
                    {item.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {content.certifications.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider border-b border-neutral-200 pb-1 mb-3 text-neutral-900">
              Certifications
            </h3>
            <ul className="list-disc ml-4 space-y-1 text-sm text-neutral-800">
              {content.certifications.map((item) => (
                <li key={item.id}>
                  <span className="font-bold">{item.name}</span>
                  {item.issuer && <span> — {item.issuer}</span>}
                  {item.date && (
                    <span className="text-neutral-500 text-xs ml-2">
                      ({item.date})
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
