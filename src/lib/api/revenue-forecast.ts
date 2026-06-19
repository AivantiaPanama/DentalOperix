import type { RevenueForecastSnapshot } from "@/lib/revenue-forecast";

export type RevenueForecastApiResponse = {
  success: true;
  period: string;
  forecast: RevenueForecastSnapshot;
};

export async function fetchRevenueForecast(period: string | null = null): Promise<RevenueForecastApiResponse> {
  const url = `/api/analytics/revenue-forecast${period ? `?period=${encodeURIComponent(period)}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No se pudo cargar el Revenue Forecast (${response.status}).`);
  }

  const payload = (await response.json()) as RevenueForecastApiResponse | { success: false; error?: string };
  if (!payload.success) {
    throw new Error(payload.error ?? "No se pudo cargar el Revenue Forecast.");
  }

  return payload;
}
