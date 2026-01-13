"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  CreateSkillInput,
  UpdateSkillInput,
  ReorderSkillsInput,
  DeleteSkillInput,
  CreateSkillSchema,
  UpdateSkillSchema,
  ReorderSkillsSchema,
  DeleteSkillSchema,
} from "@/lib/validations";
import { ActionResult } from "./profile";
import { Skill } from "@prisma/client";

// ============================================
// CREATE SKILL
// ============================================

export async function createSkill(input: CreateSkillInput): Promise<ActionResult<Skill>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const userId = session.user.id;
    const validated = CreateSkillSchema.safeParse(input);

    if (!validated.success) {
      return { success: false, error: (validated.error as any).errors[0].message };
    }

    const { name, category } = validated.data;

    const profile = await db.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    // Check for duplicate skill name in this profile
    const existingSkill = await db.skill.findUnique({
      where: {
        profileId_name: {
          profileId: profile.id,
          name,
        },
      },
    });

    if (existingSkill) {
      return { success: false, error: "A skill with this name already exists" };
    }

    // Get current highest order to append to end
    const lastSkill = await db.skill.findFirst({
      where: { profileId: profile.id },
      orderBy: { displayOrder: "desc" },
    });

    const displayOrder = lastSkill ? lastSkill.displayOrder + 1 : 0;

    const skill = await db.skill.create({
      data: {
        profileId: profile.id,
        name,
        category: category ?? "OTHER",
        displayOrder,
      },
    });

    return { success: true, data: skill };
  } catch (error) {
    console.error("createSkill error:", error);
    return { success: false, error: "Failed to create skill" };
  }
}

// ============================================
// UPDATE SKILL
// ============================================

export async function updateSkill(input: UpdateSkillInput): Promise<ActionResult<Skill>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const userId = session.user.id;
    const validated = UpdateSkillSchema.safeParse(input);

    if (!validated.success) {
      return { success: false, error: (validated.error as any).errors[0].message };
    }

    const { skillId, name, category } = validated.data;

    // Verify ownership
    const skill = await db.skill.findUnique({
      where: { id: skillId },
      include: { profile: true },
    });

    if (!skill || skill.profile.userId !== userId) {
      return { success: false, error: "Skill not found or access denied" };
    }

    // If name is changing, check uniqueness
    if (name && name !== skill.name) {
      const existingSkill = await db.skill.findUnique({
        where: {
          profileId_name: {
            profileId: skill.profileId,
            name,
          },
        },
      });

      if (existingSkill) {
        return { success: false, error: "A skill with this name already exists" };
      }
    }

    const updatedSkill = await db.skill.update({
      where: { id: skillId },
      data: {
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
      },
    });

    return { success: true, data: updatedSkill };
  } catch (error) {
    console.error("updateSkill error:", error);
    return { success: false, error: "Failed to update skill" };
  }
}

// ============================================
// REORDER SKILLS
// ============================================

export async function reorderSkills(input: ReorderSkillsInput): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const userId = session.user.id;
    const validated = ReorderSkillsSchema.safeParse(input);

    if (!validated.success) {
      return { success: false, error: (validated.error as any).errors[0].message };
    }

    const { skillIds } = validated.data;

    // Verify profile ownership for all skills implicitly by checking profile existence
    // and ensuring the operation is scoped to the user's profile
    const profile = await db.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    // Transaction to update all skills securely
    await db.$transaction(
      skillIds.map((id, index) =>
        db.skill.update({
          where: { id, profileId: profile.id }, // Ensure skill belongs to user's profile
          data: { displayOrder: index },
        })
      )
    );

    return { success: true, data: undefined };
  } catch (error) {
    console.error("reorderSkills error:", error);
    return { success: false, error: "Failed to reorder skills" };
  }
}

// ============================================
// DELETE SKILL
// ============================================

export async function deleteSkill(input: DeleteSkillInput): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const userId = session.user.id;
    const validated = DeleteSkillSchema.safeParse(input);

    if (!validated.success) {
      return { success: false, error: (validated.error as any).errors[0].message };
    }

    const { skillId } = validated.data;

    // Verify ownership
    const skill = await db.skill.findUnique({
      where: { id: skillId },
      include: { profile: true },
    });

    if (!skill || skill.profile.userId !== userId) {
      return { success: false, error: "Skill not found or access denied" };
    }

    // Delete skill (cascade will handle evidence)
    await db.skill.delete({
      where: { id: skillId },
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("deleteSkill error:", error);
    return { success: false, error: "Failed to delete skill" };
  }
}
