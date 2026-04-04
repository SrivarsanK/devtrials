import { SignUp } from "@clerk/nextjs";
import { ShieldAlert } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[30%] right-[15%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[35%] h-[35%] bg-primary/5 blur-[120px] rounded-full pointer-events-none fade-in duration-1000" />
      
      <div className="mb-8 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl">
           <ShieldAlert className="w-8 h-8 text-primary shadow-[0_0_20px_-5px_rgba(249,115,22,0.8)]" />
        </div>
        <h1 className="text-2xl font-manrope font-black text-white tracking-tight uppercase">Ride<span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">Suraksha</span> Activation</h1>
      </div>

      <div className="relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        <SignUp 
           path="/sign-up"
           routing="path"
           signInUrl="/sign-in"
           appearance={{
             elements: {
               card: "bg-surface-card border border-white/5 shadow-2xl rounded-[32px] overflow-hidden",
               headerTitle: "text-white font-manrope font-black text-2xl tracking-tighter",
               headerSubtitle: "text-white/40 font-medium text-sm",
               socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all",
               socialButtonsBlockButtonText: "text-white font-bold",
               dividerLine: "bg-white/5",
               dividerText: "text-white/20 font-black text-[10px] uppercase tracking-widest",
               formFieldLabel: "text-white/40 font-black text-[10px] uppercase tracking-[0.2em] mb-2",
               formFieldInput: "bg-white/5 border border-white/10 text-white rounded-2xl h-12 px-4 focus:border-primary/50 focus:ring-0 transition-all",
               formButtonPrimary: "bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 text-white font-black uppercase tracking-widest h-14 rounded-2xl border-none shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)] transition-all active:scale-95",
               footerActionText: "text-white/40 font-medium",
               footerActionLink: "text-primary hover:text-primary-dark font-bold transition-colors",
               identityPreviewText: "text-white",
               identityPreviewEditButtonIcon: "text-primary",
               formResendCodeLink: "text-primary",
               otpCodeFieldInput: "bg-white/5 border border-white/10 text-white rounded-xl focus:border-primary/50 transition-all"
             }
           }}
        />
      </div>
      
      <p className="mt-12 text-[10px] font-black uppercase text-white/20 tracking-[0.4em] animate-pulse">
        Every Worker Deserves Protection. Period.
      </p>
    </div>
  );
}
