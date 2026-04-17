"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { completeOnboarding } from "../onboarding/actions";

function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id"); // PhonePe might pass it differently

  useEffect(() => {
    // In a real flow, we'd verify with backend here
    // For now, if we landed here from PhonePe, we check the status
    const verifyStatus = async () => {
      try {
        const res = await fetch(`/api/payments/status/${transactionId}`);
        const data = await res.json();
        if (data.success || data.state === 'COMPLETED' || data.state === 'SUCCESS') {
          await completeOnboarding();
          window.location.href = `/dashboard`;
        } else {
          router.push(`/onboarding?status=failed`);
        }
      } catch (error) {
        console.error("Status check failed", error);
        router.push(`/onboarding?status=failed`);
      }
    };

    if (transactionId) {
       verifyStatus();
    } else {
       // Manual landing?
       router.push('/onboarding');
    }
  }, [transactionId, router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-6">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <h1 className="text-2xl font-black uppercase tracking-widest italic">Verifying Payment...</h1>
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Please do not refresh or close this window.</p>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}
