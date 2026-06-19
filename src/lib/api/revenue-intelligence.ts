import type { RevenueSnapshotV1 } from "@/lib/revenue-intelligence";

export type RevenueIntelligenceApiResponse = {
  success: true;
  period: string | null;
  snapshot: RevenueSnapshotV1;
};

export async function fetchRevenueIntelligence(
  period: string | null = null,
): Promise<RevenueIntelligenceApiResponse> {
  const url = `/api/analytics/revenue${period ? `?period=${encodeURIComponent(period)}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Revenue intelligence request failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.success === false) {
    throw new Error(data.error ?? "Revenue intelligence fetch failed");
  }

  return data as RevenueIntelligenceApiResponse;
}
