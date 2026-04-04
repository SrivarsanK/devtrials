"use client";

import {} from "@repo/ui";
import {} from "@repo/ui";
import { useIsMobile } from "@repo/ui";
import Link from "next/link";
import { 
  Bell,
  Search,
  ChevronDown,
  Settings,
  Database,
  Globe,
  ShieldCheck,
  LogIn,
  Activity
} from "lucide-react";
import {} from "@repo/ui";
import { 
  UserButton, 
  SignInButton, 
  SignUpButton,
  useAuth,
  useClerk
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {} from "@repo/ui";
import { cn } from "@repo/ui";
import {} from "@repo/ui";
import {} from "@repo/ui";
import { useState, useEffect } from "react";

export function AppHeader() {
  const isMobile = useIsMobile();
  const { userId } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
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
        <div className="hidden md:flex relative group border-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            placeholder="Search Intelligence... (Ctrl+K)"
            readOnly
            onClick={() => setOpen(true)}
            className="h-9 pl-9 pr-4 w-64 glass rounded-lg text-xs font-medium focus:outline-none cursor-pointer hover:bg-white/[0.05] transition-all placeholder:text-muted-foreground/50 border-none"
          />
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList className="bg-[#0a0a12] border border-white/5">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem className="cursor-pointer">
                  <Database className="mr-2 h-4 w-4" />
                  <span>Oracle Status</span>
                </CommandItem>
                <CommandItem className="cursor-pointer">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  <span>Security Audit</span>
                </CommandItem>
                <CommandItem className="cursor-pointer">
                  <Activity className="mr-2 h-4 w-4" />
                  <span>Active Triggers</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator className="bg-white/5" />
              <CommandGroup heading="Settings">
                <CommandItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Configuration</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>

        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger
              render={
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setHasNotifications(false)}
                  className="size-9 rounded-lg hover:bg-primary/10 hover:text-primary group relative border-none"
                />
              }
            >
              <Bell className={cn("size-4", hasNotifications && "animate-pulse")} />
              {hasNotifications && (
                <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-[#0a0a12] shadow-[0_0_8px_rgba(255,70,37,0.5)]" />
              )}
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-[#0a0a12]/95 backdrop-blur-xl border-white/5 shadow-2xl rounded-2xl">
              <div className="p-4 border-b border-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest">Active Intelligence</h4>
              </div>
              <div className="p-2 space-y-1">
                <div className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex gap-3">
                    <div className="size-8 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                      <Activity className="size-4 text-success" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-foreground">Rainfall Trigger PROCESSED</p>
                      <p className="text-[9px] text-muted-foreground">Mumbai Central oracle confirmed magnitude 110.5mm</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <ShieldCheck className="size-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-foreground">Security Protocol Updated</p>
                      <p className="text-[9px] text-muted-foreground">Enhanced parametric encryption layer active</p>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
            <PopoverTrigger
              render={
                <Button variant="ghost" size="icon" className="size-9 rounded-lg hover:bg-secondary/10 hover:text-secondary group border-none" />
              }
            >
              <Settings className="size-4 group-hover:rotate-45 transition-transform" />
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 bg-[#0a0a12]/95 backdrop-blur-xl border-white/5 shadow-2xl rounded-2xl" sideOffset={8}>
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-9 rounded-xl px-3 hover:bg-white/5 transition-colors"
                  onClick={() => {
                    const profileBtn = document.querySelector(".cl-userButtonTrigger") as HTMLButtonElement;
                    profileBtn?.click();
                    setSettingsOpen(false);
                  }}
                >
                  <UserButton appearance={{ elements: { userButtonTrigger: "hidden" } }} /> Profile Settings
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-9 rounded-xl px-3 hover:bg-white/5 transition-colors"
                  onClick={() => {
                    router.push("/dashboard");
                    setSettingsOpen(false);
                  }}
                >
                  <Database className="mr-2 size-3.5" /> API Keys
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-9 rounded-xl px-3 hover:bg-white/5 text-destructive hover:text-destructive transition-colors"
                  onClick={() => {
                    signOut();
                    setSettingsOpen(false);
                  }}
                >
                  <LogIn className="mr-2 size-3.5" /> Force Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
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


