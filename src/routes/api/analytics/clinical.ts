import { createClinicalIntelligenceSnapshot } from "@/lib/clinical-intelligence";
import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermission,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { getReadModelSource } from "@/server/read-models/read-model-source-provider";

export async function GET(request: Request) {
  try {
    requirePermission(request, "reports:read");
  } catch (error) {
    if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
    if (error instanceof ForbiddenError) return createForbiddenResponse();
    throw error;
  }

  try {
    const source = await getReadModelSource({ consumerName: "Clinical Intelligence" });
    const snapshot = createClinicalIntelligenceSnapshot(
      source.clinicalAggregates,
      source.diagnostics.clinicalAggregateDiagnostics,
      new Date().toISOString(),
      source.mode === "read-model" ? "clinical-read-models" : "legacy-fallback",
    );

    return new Response(
      JSON.stringify({
        success: true,
        mode: source.mode,
        snapshot,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Failed to load Clinical Intelligence snapshot:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
