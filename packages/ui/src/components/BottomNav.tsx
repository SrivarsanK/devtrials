"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText } from "lucide-react";
import { cn } from "../lib/utils";
import { useLanguage } from "./LanguageContext";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: "Claims",
      icon: FileText,
      href: "/claims",
    },
  ];

  // Only show bottom nav on dashboard and claims pages
  const showNav = pathname === "/dashboard" || pathname === "/claims";

  if (!showNav) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] glass-strong border-t border-white/5 pb-safe-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-xl transition-all duration-300",
                  isActive && "bg-primary/10 neon-primary"
                )}
              >
                <Icon className={cn("h-6 w-6", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
              </div>
              <span className="text-[10px] font-black tracking-wider uppercase">
                {t(item.label)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

