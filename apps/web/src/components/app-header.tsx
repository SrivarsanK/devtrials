"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { 
  Bell,
  Search,
  ChevronDown,
  Settings,
  Database,
  Globe,
  ShieldCheck,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  UserButton, 
  SignInButton, 
  SignUpButton,
  useAuth
} from "@clerk/nextjs";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const isMobile = useIsMobile();
  const { userId } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0a0a12]/70 backdrop-blur-2xl transition-all duration-500",
      isCollapsed ? "pl-2 px-4 md:px-10" : "px-4 md:px-10"
    )}>
      <div className="flex items-center gap-4">
        {isMobile ? (
          <Link href="/" className="flex items-center gap-2 group mr-2">
            <div className="flex aspect-square size-8 items-center justify-center shrink-0 rounded-lg bg-primary shadow-[0_0_10px_rgba(255,70,37,0.2)]">
              <ShieldCheck className="size-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-display font-black tracking-tight text-foreground uppercase">Gig<span className="text-primary italic">Shield</span></span>
          </Link>
        ) : (
          <SidebarTrigger className="hover:bg-primary/10 transition-colors rounded-lg" />
        )}
        <Separator orientation="vertical" className="h-4 bg-white/[0.06] hidden md:block" />
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-subtle text-[10px] font-black uppercase tracking-[0.12em] border-none">
            <Globe className="size-3.5 text-secondary animate-pulse" />
            <span className="text-white">IND-MUM-04</span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer hover:bg-white/[0.03] p-2 rounded-lg transition-colors">
            <Database className="size-3.5 text-muted-foreground group-hover:text-secondary transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Oracle Synced</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            placeholder="Search Intelligence..."
            className="h-9 pl-9 pr-4 w-56 glass rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-secondary/30 focus:border-secondary/30 transition-all placeholder:text-muted-foreground/30"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-9 rounded-lg hover:bg-primary/10 hover:text-primary group">
            <Bell className="size-4 group-hover:animate-bounce" />
          </Button>
          <Button variant="ghost" size="icon" className="size-9 rounded-lg hover:bg-secondary/10 hover:text-secondary">
            <Settings className="size-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-5 bg-white/[0.06] hidden sm:block" />
        
        {userId ? (
          <div className="flex items-center gap-3 pl-1 group cursor-pointer transition-all">
            <UserButton 
              appearance={{
                elements: {
                  userButtonTrigger: "hover:scale-105 transition-transform",
                  userButtonAvatarBox: "size-9 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(0,183,255,0.1)]",
                  userButtonPopoverCard: "rounded-3xl border border-white/5 bg-[#0a0a12]/95 backdrop-blur-xl shadow-2xl",
                }
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <Button variant="ghost" className="hidden sm:flex text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-white/5">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm" className="rounded-xl bg-primary text-white font-black uppercase text-[10px] px-5 h-9 shadow-lg hover:neon-primary transition-all flex items-center gap-2">
                <LogIn size={13} strokeWidth={3} />
                Enter Console
              </Button>
            </SignUpButton>
          </div>
        )}
      </div>
    </header>
  );
}
