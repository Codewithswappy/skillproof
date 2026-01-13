import { getMyProfile } from "@/lib/actions/profile";
import { SkillsManager } from "@/components/dashboard/skills/skills-manager";

export const metadata = {
  title: "Skills Manager — SkillProof",
};

export default async function SkillsPage() {
  const result = await getMyProfile();

  if (!result.success) {
    return <div>Error loading profile</div>;
  }

  const data = result.data;

  // If no profile, we should redirect to dashboard which handles the wizard
  // For now simple check
  if (!data) {
    return (
      <div>
        Profile not found. Please go to dashboard overview to create one.
      </div>
    );
  }

  return <SkillsManager data={data} />;
}
