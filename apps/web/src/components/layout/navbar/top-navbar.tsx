"use client";

import { MobileMenuToggle } from "./mobile-menu-toggle";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { NotificationButton } from "./notification-button";
import { ProfileDropdown } from "./profile-dropdown";
import type { BreadcrumbItem } from "@/types/layout.types";

interface TopNavbarProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function TopNavbar({ breadcrumbs }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-md px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <MobileMenuToggle />
        <BreadcrumbNav items={breadcrumbs} />
      </div>

      <div className="flex items-center gap-2">
        <NotificationButton />
        <ProfileDropdown />
      </div>
    </header>
  );
}
