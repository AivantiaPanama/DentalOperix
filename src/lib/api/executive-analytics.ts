import type { ExecutiveAnalyticsSnapshot } from "@/lib/executive-analytics";

export type ExecutiveAnalyticsApiResponse = {
  success: true;
  degraded?: boolean;
  source?: "google-sheets" | "empty-fallback";
  warning?: string;
  period: string;
  executive: ExecutiveAnalyticsSnapshot;
};

export async function fetchExecutiveAnalytics(
  period: string | null = null,
): Promise<ExecutiveAnalyticsApiResponse> {
  const url = `/api/analytics/executive${period ? `?period=${encodeURIComponent(period)}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No se pudo cargar Executive Analytics (${response.status}).`);
  }

  const payload = (await response.json()) as
    | ExecutiveAnalyticsApiResponse
    | { success: false; error?: string };
  if (!payload.success) {
    throw new Error(payload.error ?? "No se pudo cargar Executive Analytics.");
  }

  return payload;
}
