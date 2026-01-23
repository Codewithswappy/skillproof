"use client";

import { useResumeStore } from "@/stores/resume-store";
import { cn } from "@/lib/utils";
import {
  IconUser,
  IconBriefcase,
  IconCode,
  IconSchool,
  IconCertificate,
  IconList,
  IconLayoutList,
} from "@tabler/icons-react";

export function ResumeEditorSidebar() {
  const { activeSection } = useResumeStore();

  const sections = [
    { id: "profile", label: "Personal", icon: IconUser },
    { id: "summary", label: "Summary", icon: IconLayoutList },
    { id: "experience", label: "Experience", icon: IconBriefcase },
    { id: "projects", label: "Projects", icon: IconCode },
    { id: "skills", label: "Skills", icon: IconList },
    { id: "education", label: "Education", icon: IconSchool },
    { id: "certifications", label: "Certificates", icon: IconCertificate },
  ];

  return (
    <div className="flex flex-col py-2">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => useResumeStore.setState({ activeSection: section.id })}
          className={cn(
            "flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-3 px-2 md:px-4 py-3 text-[10px] md:text-xs font-medium transition-colors text-center md:text-left border-l-0 md:border-l-2",
            activeSection === section.id
              ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border-lime-600 shadow-sm"
              : "text-neutral-500 dark:text-neutral-400 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white",
          )}
        >
          <section.icon className="w-4 h-4" />
          <span className="md:inline">{section.label}</span>
        </button>
      ))}
    </div>
  );
}
