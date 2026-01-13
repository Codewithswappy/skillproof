import { getMyProfile } from "@/lib/actions/profile";
import { CreateProfileWizard } from "@/components/dashboard/create-profile-wizard";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export const metadata = {
  title: "Dashboard — SkillProof",
};

export default async function DashboardPage() {
  const result = await getMyProfile();

  if (!result.success) {
    // Check if error is auth-related, though middleware/layout should handle redirect usually
    // For now simple error display
    return (
      <div className="p-4 text-red-500">
        Error loading profile: {result.error}
      </div>
    );
  }

  const data = result.data;

  if (!data) {
    return <CreateProfileWizard />;
  }

  return <DashboardOverview data={data} />;
}
