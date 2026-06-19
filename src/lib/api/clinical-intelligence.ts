import type { ClinicalIntelligenceSnapshot } from "@/lib/clinical-intelligence";

export type ClinicalIntelligenceApiResponse = {
  success: true;
  mode: "read-model" | "legacy-leads";
  snapshot: ClinicalIntelligenceSnapshot;
};

export async function fetchClinicalIntelligence(): Promise<ClinicalIntelligenceApiResponse> {
  const response = await fetch("/api/analytics/clinical");

  if (!response.ok) {
    throw new Error(`No se pudo cargar Clinical Intelligence (${response.status}).`);
  }

  const payload = (await response.json()) as ClinicalIntelligenceApiResponse | { success: false; error?: string };
  if (!payload.success) {
    throw new Error(payload.error ?? "No se pudo cargar Clinical Intelligence.");
  }

  return payload;
}
