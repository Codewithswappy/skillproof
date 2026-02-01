"use client";

import { SocialLink } from "@prisma/client";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandInstagram,
  IconWorld,
  IconLink,
  IconBrandYoutube,
  IconBrandDiscord,
  IconBrandTelegram,
  IconBrandTwitch,
  IconMail,
  IconDots,
} from "@tabler/icons-react";
import { motion, Variants } from "motion/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SocialsSectionProps {
  links: SocialLink[];
  email?: string | null;
  className?: string;
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

export function SocialsSection({
  links,
  email,
  className,
}: SocialsSectionProps) {
  // 1. Prepare standardized items list
  type RenderItem = {
    id: string;
    platform: string;
    url: string;
    title?: string | null;
  };

  const items: RenderItem[] = (links || []).map((l) => ({
    id: l.id,
    platform: l.platform,
    url: l.url,
    title: l.title,
  }));

  if (email) {
    items.push({
      id: "email",
      platform: "email",
      url: `mailto:${email}`,
      title: "Email",
    });
  }

  if (items.length === 0) return null;

  // 2. Sort Items (Github, Twitter, LinkedIn, Email first)
  const priority = ["github", "twitter", "x", "linkedin", "email"];
  items.sort((a, b) => {
    const aP = a.platform.toLowerCase();
    const bP = b.platform.toLowerCase();
    const aIdx = priority.indexOf(aP);
    const bIdx = priority.indexOf(bP);

    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return 0;
  });

  // 3. Slice logic
  const visibleItems = items.slice(0, 4);
  const overflowItems = items.slice(4);

  // Helper functions
  function getIcon(platform: string, className?: string) {
    const p = platform.toLowerCase();
    const cls =
      className ??
      "w-5 h-5 transition-transform duration-300 group-hover:rotate-12";

    switch (p) {
      case "github":
        return <IconBrandGithub className={cls} />;
      case "linkedin":
        return <IconBrandLinkedin className={cls} />;
      case "twitter":
      case "x":
        return <IconBrandX className={cls} />;
      case "instagram":
        return <IconBrandInstagram className={cls} />;
      case "youtube":
        return <IconBrandYoutube className={cls} />;
      case "discord":
        return <IconBrandDiscord className={cls} />;
      case "telegram":
        return <IconBrandTelegram className={cls} />;
      case "twitch":
        return <IconBrandTwitch className={cls} />;
      case "website":
        return <IconWorld className={cls} />;
      case "email":
        return <IconMail className={cls} />;
      default:
        return <IconLink className={cls} />;
    }
  }

  function getLabel(item: RenderItem) {
    if (item.title) return item.title;
    const platform = item.platform.toLowerCase();
    if (platform === "email") return "Email";
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        "inline-flex flex-wrap items-center gap-4 w-fit",
        className,
      )}
    >
      {visibleItems.map((item) => (
        <motion.a
          key={item.id}
          href={item.url}
          target={item.platform === "email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-2 py-1 transition-all cursor-pointer"
        >
          <span className="text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
            {getIcon(item.platform)}
          </span>
          <span className="hidden sm:block text-xs font-mono font-medium text-neutral-500 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors duration-300 underline-offset-4 group-hover:underline decoration-neutral-300 dark:decoration-neutral-700 decoration-wavy">
            {getLabel(item)}
          </span>
        </motion.a>
      ))}

      {overflowItems.length > 0 && (
        <DropdownMenu>
          <motion.div variants={itemVariants}>
            <DropdownMenuTrigger className="group flex items-center gap-2 py-1 transition-all cursor-pointer outline-none bg-transparent border-none">
              <span className="text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                <IconDots className="w-5 h-5" />
              </span>
              <span className="hidden sm:block text-xs font-mono font-medium text-neutral-500 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors duration-300 underline-offset-4 group-hover:underline decoration-neutral-300 dark:decoration-neutral-700 decoration-wavy">
                More
              </span>
            </DropdownMenuTrigger>
          </motion.div>
          <DropdownMenuContent align="end" className="w-48">
            {overflowItems.map((item) => (
              <DropdownMenuItem key={item.id} className="p-0">
                <a
                  href={item.url}
                  target={item.platform === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 cursor-pointer w-full px-2 py-1.5"
                >
                  <span className="text-neutral-500 w-5 h-5 flex items-center justify-center">
                    {getIcon(item.platform, "w-4 h-4")}
                  </span>
                  <span className="font-mono text-xs">{getLabel(item)}</span>
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </motion.div>
  );
}
