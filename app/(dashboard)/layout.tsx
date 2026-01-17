import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

// Force dynamic rendering for all dashboard routes (uses auth/headers)
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 h-full">
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="md:hidden h-16 border-b bg-card flex items-center px-4 justify-between">
          <MobileSidebar />
          <span className="font-bold">SkillDock</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
