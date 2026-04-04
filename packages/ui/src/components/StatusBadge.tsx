"use client";

import { cn } from "../lib/utils";

type ClaimStatus = "Paid" | "Pending" | "Denied";

interface StatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

const statusConfig: Record<
  ClaimStatus,
  { bg: string; text: string; dot: string }
> = {
  Paid: {
    bg: "bg-[#00c896]/15",
    text: "text-[#00c896]",
    dot: "bg-[#00c896]",
  },
  Pending: {
    bg: "bg-[#ffc800]/15",
    text: "text-[#ffc800]",
    dot: "bg-[#ffc800]",
  },
  Denied: {
    bg: "bg-[#ff2d55]/15",
    text: "text-[#ff2d55]",
    dot: "bg-[#ff2d55]",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.bg,
        config.text,
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", config.dot)}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

