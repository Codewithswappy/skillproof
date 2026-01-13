import { getMyProfile } from "@/lib/actions/profile";
import { ProfileEditor } from "@/components/dashboard/profile-editor";
import { VisibilitySettings } from "@/components/dashboard/visibility-settings";
import { ProfileHeader } from "@/components/dashboard/profile-header";

export const metadata = {
  title: "Profile Settings — SkillProof",
};

export default async function ProfilePage() {
  const result = await getMyProfile();

  if (!result.success || !result.data) {
    return <div>Error loading profile</div>;
  }

  const data = result.data;

  return (
    <div className="space-y-6">
      <ProfileHeader data={data} />

      <div className="grid gap-6">
        <ProfileEditor data={data} />
        <VisibilitySettings data={data} />
      </div>
    </div>
  );
}
