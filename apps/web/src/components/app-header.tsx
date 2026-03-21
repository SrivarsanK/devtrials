"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Search, 
  ChevronDown, 
  Settings, 
  User, 
  Database,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-20 w-full shrink-0 items-center justify-between border-b border-border/50 bg-background/60 backdrop-blur-2xl px-6 md:px-12 transition-all">
      <div className="flex items-center gap-6">
        <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
        <Separator orientation="vertical" className="h-4 bg-border/50 hidden md:block" />
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/50 shadow-sm">
            <Globe className="size-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground">IND-MUM-04</span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer hover:bg-muted/10 p-2 rounded-lg transition-colors">
            <Database className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Oracle Synchronized</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            className="h-11 pl-10 pr-4 w-64 bg-muted/30 border border-border/50 rounded-xl text-xs font-bold uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/40"
          />
        </div>

        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary group">
              <Bell className="size-5 group-hover:animate-bounce" />
           </Button>
           <Button variant="ghost" size="icon" className="rounded-xl hover:bg-secondary/10 hover:text-secondary">
              <Settings className="size-5" />
           </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-border/50" />

        <div className="flex items-center gap-4 pl-2 group cursor-pointer">
           <div className="flex flex-col items-end gap-0.5">
             <span className="text-xs font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">Arunavo Gupta</span>
             <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50 px-2 py-0.5 rounded-full bg-muted border border-border">Senior Auditor</span>
           </div>
           <div className="size-11 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-[2px] shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform">
             <div className="size-full rounded-[14px] bg-card flex items-center justify-center border-2 border-white/10">
               <User className="size-6 text-foreground" />
             </div>
           </div>
           <ChevronDown className="size-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-y-0.5" />
        </div>
      </div>
    </header>
  );
}
