import { Link } from "next-view-transitions";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Rocket,
  ArrowRight,
  LayoutDashboard,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { LandingBentoGrid } from "@/components/landing/bento-grid";

export const metadata = {
  title: "SkillDock — Proof Over Claims",
  description:
    "The structured skills profile for developers. Prove your abilities to recruiters in 60 seconds.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white selection:bg-neutral-200 dark:selection:bg-white/20 selection:text-neutral-950 dark:selection:text-white relative font-sans">
      {/* Background Patterns */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-white dark:from-neutral-950 to-transparent" />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-dashed border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo/blackLogo.png"
              alt="SkillDock"
              className="h-8 w-auto object-contain dark:hidden"
            />
            <img
              src="/logo/lightLogo.png"
              alt="SkillDock"
              className="h-8 w-auto object-contain hidden dark:block"
            />
            <span className="font-bold text-lg tracking-tight hidden sm:block">
              SkillDock
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="group relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-full bg-neutral-950 dark:bg-white px-6 text-sm font-semibold text-white dark:text-neutral-950 transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 pt-20">
        <section className="py-24 px-6 relative">
          {/* Subtle Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-100 dark:bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-8 relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/50 px-3 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              v1.0 is now live
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-neutral-950 dark:text-white leading-[1.1]">
              One Profile. <br className="hidden sm:block" />
              <span className="text-neutral-400 dark:text-neutral-500">
                Resume, Portfolio & Analytics.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Stop updating five different sites. Fill in your details once, get
              a tailored resume, a structured portfolio, and profile analytics
              in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="h-12 px-8 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-lg flex items-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all active:scale-95 shadow-lg"
              >
                <Rocket className="w-5 h-5" />
                Build Your Profile
              </Link>
              <Link
                href="/demo-profile"
                className="h-12 px-8 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium text-lg flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-500 transition-all"
              >
                View Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features / Visual */}
        <section className="bg-neutral-50/50 dark:bg-neutral-950/20">
          <LandingBentoGrid />
        </section>

        {/* CTA Footer */}
        <section className="py-24 px-6 text-center border-t border-dashed border-neutral-200 dark:border-neutral-800">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              Ready to professionalize <br />
              <span className="text-neutral-400 dark:text-neutral-600">
                your developer identity?
              </span>
            </h2>
            <Link
              href="/register"
              className="inline-flex h-14 px-10 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-lg items-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all hover:scale-105"
            >
              Join SkillDock Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-dashed border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500 dark:text-neutral-600 bg-white dark:bg-neutral-950 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <p>&copy; {new Date().getFullYear()} SkillDock. Proof over claims.</p>
      </footer>
    </div>
  );
}
