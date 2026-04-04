import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
  width: "device-width",
  initialScale: 1,
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] flex flex-col items-center justify-center text-center p-6 space-y-8">
      <div className="w-24 h-24 bg-primary/20 rounded-[40px] flex items-center justify-center border border-primary/20 animate-pulse">
        <Shield className="w-12 h-12 text-primary" />
      </div>
      <div className="space-y-4">
        <h1 className="text-6xl font-manrope font-black text-white tracking-tighter">404</h1>
        <p className="text-white/40 font-bold uppercase tracking-[0.4em] text-xs">Page Not Found</p>
      </div>
      <p className="max-w-xs text-white/20 text-sm font-medium leading-relaxed">
        The coverage zone you are looking for does not exist or has been moved to another grid.
      </p>
      <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-8 py-4 rounded-3xl text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all active:scale-95 group">
        Back to Shield <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
