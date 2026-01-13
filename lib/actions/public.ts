"use server";

import { db } from "@/lib/db";
import { FullProfile, ActionResult } from "./profile";
import { Evidence, EvidenceSkill, Skill } from "@prisma/client";

// Extended evidence type with skills
export type EvidenceWithSkills = Evidence & {
  skills: (EvidenceSkill & { skill: Skill })[];
};

// Extended public profile type
export type PublicProfileData = Omit<FullProfile, "evidence"> & {
  email?: string | null;
  userName?: string | null;
  evidence: EvidenceWithSkills[];
};

// ============================================
// GET PUBLIC PROFILE
// ============================================

export async function getPublicProfile(slug: string): Promise<ActionResult<PublicProfileData | null>> {
  try {
    // 1. Find profile by slug
    const profile = await db.profile.findUnique({
      where: { slug },
      include: {
        skills: {
          orderBy: { displayOrder: "asc" },
        },
        projects: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!profile) {
      // 404 behavior for non-existent profiles
      return { success: true, data: null };
    }

    // 2. Check profile settings
    const profileSettings = await db.profileSettings.findUnique({
      where: { userId: profile.userId },
    });

    if (!profileSettings || !profileSettings.isPublic) {
      // 404 behavior for private profiles (security requirement)
      return { success: true, data: null };
    }

    // 3. Get all evidence with skills
    const evidence = await db.evidence.findMany({
      where: {
        project: { profileId: profile.id },
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    // 4. Compute counts & filter visible data
    
    // Get all skill IDs that have evidence
    const skillIdsWithEvidence = new Set<string>();
    evidence.forEach(e => {
      e.skills.forEach(es => {
        skillIdsWithEvidence.add(es.skillId);
      });
    });
    
    // Filter skills based on settings
    let visibleSkills = profile.skills;
    
    if (!profileSettings.showUnprovenSkills) {
      // Filter out skills that have no evidence
      visibleSkills = visibleSkills.filter(skill => 
        skillIdsWithEvidence.has(skill.id)
      );
    }
    
    const skillsWithCounts = visibleSkills.map((skill) => ({
      ...skill,
      evidenceCount: evidence.filter(e => 
        e.skills.some(es => es.skillId === skill.id)
      ).length,
    }));

    const projectsWithCounts = profile.projects.map((project) => ({
      ...project,
      evidenceCount: evidence.filter((e) => e.projectId === project.id).length,
    }));

    // Fetch user info (name, email based on settings)
    const user = await db.user.findUnique({
      where: { id: profile.userId },
      select: { email: true, name: true }
    });

    const result: PublicProfileData = {
      profile,
      profileSettings,
      skills: skillsWithCounts,
      projects: projectsWithCounts,
      evidence,
      userName: user?.name,
      email: profileSettings.showEmail ? user?.email : undefined,
    };

    // 5. Return assembled public profile
    return {
      success: true,
      data: result,
    };

  } catch (error) {
    console.error("getPublicProfile error:", error);
    return { success: false, error: "Failed to load public profile" };
  }
}
