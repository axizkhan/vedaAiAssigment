"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { NavigationItem } from "@/types/layout.types";
import { isNavItemActive } from "@/lib/layout/navigation.utils";

interface MobileNavItemProps {
  item: NavigationItem;
}

export function MobileNavItem({ item }: MobileNavItemProps) {
  const pathname = usePathname();
  const isActive = isNavItemActive(item, pathname);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2 focus-ring rounded-md"
    >
      <motion.div
        animate={isActive ? { scale: 1.15 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Icon
          className={`h-5 w-5 ${
            isActive ? "text-accent" : "text-foreground-muted"
          }`}
        />
      </motion.div>
      <span
        className={`text-caption ${
          isActive ? "font-semibold text-accent" : "text-foreground-muted"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}
