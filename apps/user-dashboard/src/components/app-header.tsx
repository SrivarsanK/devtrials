"use client";

import { useUser, UserButton } from "@clerk/nextjs";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { 
  Bell,
  Search,
  Settings,
  Database,
  Globe,
  ShieldCheck,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Translate } from "@/components/ui/translate";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePathname, useRouter } from "next/navigation";

export function AppHeader() {
  const { user } = useUser();
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Weather Alert", message: "Heavy Rainfall in Velachery. Claimable: ₹1,450", time: "2m ago", unread: true, type: "urgent" },
    { id: 2, title: "Payout Sent", message: "₹1,200 deposited for AQI disruption", time: "1h ago", unread: true, type: "payout" },
    { id: 3, title: "Policy Active", message: "Your 24h coverage is now in effect", time: "5h ago", unread: false, type: "system" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const { language } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLang: string) => {
    if (newLang === language) return;
    const newPath = pathname.replace(`/${language}`, `/${newLang}`);
    router.push(newPath);
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0d0d15]/70 backdrop-blur-2xl transition-all duration-500",
      "px-4 md:px-8"
    )}>
      <div className="flex items-center gap-4">
        {isMobile ? (
          <Link href="/" className="flex items-center gap-2 group mr-2">
            <div className="flex aspect-square size-8 items-center justify-center shrink-0 rounded-lg bg-primary shadow-[0_0_10px_rgba(255,70,37,0.2)]">
              <ShieldCheck className="size-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-display font-black tracking-tight text-foreground uppercase">Ride<span className="text-primary italic">Suraksha</span></span>
          </Link>
        ) : (
          <SidebarTrigger className="hover:bg-primary/10 transition-colors rounded-lg" />
        )}
        <Separator orientation="vertical" className="h-4 bg-white/[0.06] hidden md:block" />
      </div>

      <div className="flex items-center gap-3">
        {/* Language Switcher - REINSTATED */}
        <div className="hidden sm:flex glass rounded-xl p-1 gap-1 border border-white/[0.03] mr-2 scale-90">
            <button onClick={() => handleLanguageChange('en')} className={`px-3 py-1.5 rounded-lg text-[8px] font-black tracking-[0.2em] transition-all ${language === 'en' ? 'bg-primary text-white shadow-lg neon-primary' : 'text-white/30 hover:text-white'}`}>EN</button>
            <button onClick={() => handleLanguageChange('ta')} className={`px-3 py-1.5 rounded-lg text-[8px] font-black tracking-widest transition-all ${language === 'ta' ? 'bg-primary text-white shadow-lg neon-primary' : 'text-white/30 hover:text-white'}`}>தமிழ்</button>
        </div>


        <div className="hidden md:flex relative group border-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search Intelligence..."
            className="h-9 pl-9 pr-4 w-64 glass rounded-lg text-xs font-medium focus:outline-none hover:bg-white/[0.05] transition-all placeholder:text-muted-foreground/50 border-none text-white"
          />
        </div>

        <div className="flex items-center gap-1">
             <div className="relative">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="size-9 rounded-lg hover:bg-primary/10 hover:text-primary group relative border-none"
                >
                    <Bell className={cn("size-4 text-muted-foreground group-hover:text-primary", unreadCount > 0 && "animate-pulse")} />
                    {unreadCount > 0 && (
                      <span className="absolute top-2.5 right-2.5 size-1.5 bg-primary rounded-full border border-[#0d0d15] shadow-[0_0_8px_rgba(255,70,37,0.5)]" />
                    )}
                </Button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-[320px] glass-strong border border-white/[0.08] rounded-[24px] shadow-2xl overflow-hidden py-2 z-50 origin-top-right"
                    >
                      <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40"><Translate text="Intelligent Alerts" /></span>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllRead}
                            className="text-[9px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest underline underline-offset-4"
                          >
                           <Translate text="Read All" />
                          </button>
                        )}
                      </div>
                      <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                        {notifications.map(notif => (
                          <div 
                            key={notif.id}
                            className={cn(
                              "px-5 py-4 hover:bg-white/[0.03] transition-colors border-b border-white/[0.03] last:border-none relative group",
                              notif.unread && "bg-primary/[0.02]"
                            )}
                          >
                            {notif.unread && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(255,70,37,0.5)]" />}
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between items-start gap-2">
                                <span className={cn(
                                  "text-[10px] font-black uppercase tracking-tight",
                                  notif.type === 'urgent' ? "text-primary italic" : notif.type === 'payout' ? "text-emerald-500" : "text-white/60"
                                )}>
                                  <Translate text={notif.title} />
                                </span>
                                <span className="text-[8px] font-bold text-white/15 uppercase">{notif.time}</span>
                              </div>
                              <p className="text-[11px] font-medium text-white/40 leading-relaxed pr-2">
                                <Translate text={notif.message} />
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link href="/claims" className="block text-center py-4 bg-white/[0.03] hover:bg-primary group-hover:bg-primary transition-all">
                        <span className="text-[9px] font-black text-white/20 group-hover:text-white uppercase tracking-[0.3em]"><Translate text="Security Hub Overview" /></span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

            <Link href="/settings">
              <Button variant="ghost" size="icon" className="size-9 rounded-lg hover:bg-secondary/10 hover:text-secondary group border-none">
                <Settings className="size-4 text-muted-foreground group-hover:text-secondary group-hover:rotate-45 transition-transform" />
              </Button>
            </Link>
        </div>

        <Separator orientation="vertical" className="h-5 bg-white/[0.06] hidden sm:block" />
        
        <div className="flex items-center gap-4 pl-2">
            <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none text-white whitespace-nowrap">
                   {user?.fullName || <Translate text="Field Agent" />}
                </span>
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                   <Translate text="Driver Profile" />
                </span>
            </div>
            <div className="relative group">
               <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
               <UserButton appearance={{ elements: { userButtonAvatarBox: "size-9 rounded-xl border border-white/10 shadow-lg" } }}>
                 <UserButton.MenuItems>
                   <UserButton.Link label="My Profile" labelIcon={<Activity className="size-4" />} href="/settings" />
                 </UserButton.MenuItems>
               </UserButton>
            </div>
        </div>
      </div>
    </header>
  );
}
