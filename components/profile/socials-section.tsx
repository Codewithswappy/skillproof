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
} from "@tabler/icons-react";
import { motion, Variants } from "motion/react";
import { cn } from "@/lib/utils";

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

const item: Variants = {
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
  const hasLinks = links && links.length > 0;
  if (!hasLinks && !email) return null;

  function getIcon(platform: string) {
    const p = platform.toLowerCase();
    const iconClass =
      "w-5 h-5 transition-transform duration-300 group-hover:rotate-12";

    switch (p) {
      case "github":
        return <IconBrandGithub className={iconClass} />;
      case "linkedin":
        return <IconBrandLinkedin className={iconClass} />;
      case "twitter":
      case "x":
        return <IconBrandX className={iconClass} />;
      case "instagram":
        return <IconBrandInstagram className={iconClass} />;
      case "youtube":
        return <IconBrandYoutube className={iconClass} />;
      case "discord":
        return <IconBrandDiscord className={iconClass} />;
      case "telegram":
        return <IconBrandTelegram className={iconClass} />;
      case "twitch":
        return <IconBrandTwitch className={iconClass} />;
      case "website":
        return <IconWorld className={iconClass} />;
      default:
        return <IconLink className={iconClass} />;
    }
  }

  function getLabel(link: SocialLink) {
    if (link.title) return link.title;
    const platform = link.platform.toLowerCase();
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
      {hasLinks &&
        links.map((link) => {
          const iconNode = getIcon(link.platform);
          const label = getLabel(link);

          return (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={item}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 py-1 transition-all cursor-pointer"
            >
              <span className="text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                {iconNode}
              </span>
              <span className="hidden sm:block text-xs font-mono font-medium text-neutral-500 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors duration-300 underline-offset-4 group-hover:underline decoration-neutral-300 dark:decoration-neutral-700 decoration-wavy">
                {label}
              </span>
            </motion.a>
          );
        })}

      {email && (
        <motion.a
          href={`mailto:${email}`}
          variants={item}
          whileHover={{ y: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-2 py-1 transition-all cursor-pointer"
        >
          <span className="text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
            <IconMail className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
          </span>
          <span className="hidden sm:block text-xs font-mono font-medium text-neutral-500 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors duration-300 underline-offset-4 group-hover:underline decoration-neutral-300 dark:decoration-neutral-700 decoration-wavy">
            Email
          </span>
        </motion.a>
      )}
    </motion.div>
  );
}
