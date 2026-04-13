// apps/web/src/lib/api.client.ts
export type FraudRequest = {
  id: string;
  worker_id: string | number;
  zone_name: string;
  request_type: string;
  amount: number;
  status: "PENDING" | "PROCESSED" | string;
  category?: string;
  fraud_score?: number | null;
  top_signals?: string[];
  created_at: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5678";

if (!API_URL) {
  // Failing fast avoids mysterious build/runtime issues
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export async function fetchFraudRequests(): Promise<FraudRequest[]> {
  const res = await fetch(`${API_URL}/api/fraud/requests`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch requests: ${res.status}`);
  return res.json();
}

export async function scoreFraudRequest(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/fraud/requests/${id}/score`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to score request: ${res.status}`);
}
