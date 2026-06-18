import { runPatientFollowups } from "@/lib/patient-followup-engine";
import {
  createForbiddenResponse,
  createUnauthorizedResponse,
  ForbiddenError,
  requirePermissionOrInternalApiKey,
  UnauthorizedError,
} from "@/lib/rbac/guards.server";
import { logger } from "@/lib/logger.server";
import {
  appendAutomationRunRecord,
  calculateAutomationMetrics,
  readAutomationRunRecords,
} from "@/server/google/automation";

type FollowupsRunRequest = {
  dryRun?: boolean;
  confirmExecution?: boolean;
  executedBy?: string;
};

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(request: Request) {
  try {
    requirePermissionOrInternalApiKey(request, "automation:read");
    const runs = await readAutomationRunRecords();
    return jsonResponse({ success: true, runs, metrics: calculateAutomationMetrics(runs) });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return createUnauthorizedResponse();
    }
    if (error instanceof ForbiddenError) {
      return createForbiddenResponse();
    }

    logger.error("followups.run", "Failed to load automation history", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  let body: FollowupsRunRequest = {};

  try {
    requirePermissionOrInternalApiKey(request, "automation:run");
    body = await request.json();

    if (body.dryRun === false && body.confirmExecution !== true) {
      return jsonResponse(
        { success: false, error: "confirmExecution is required for real followup runs." },
        400,
      );
    }

    const result = await runPatientFollowups(body);
    const status = result.failed > 0 ? "failure" : result.errors.length > 0 ? "partial" : "success";

    try {
      await appendAutomationRunRecord({
        id: `run_${Date.now()}`,
        timestamp: new Date().toISOString(),
        flow: "followups",
        dryRun: result.dryRun,
        generated: result.generated,
        sent: result.sent,
        skipped: result.skipped,
        failed: result.failed,
        actionCount: result.actions.length,
        errors: JSON.stringify(result.errors),
        status,
        durationMs: Date.now() - startedAt,
        executedBy: body.executedBy ?? "system",
      });
    } catch (auditError) {
      logger.error("followups.run", "Unable to persist followup audit record", {
        error: auditError instanceof Error ? auditError.message : "Unknown error",
      });
    }

    logger.info("followups.run", "Followup run completed", {
      dryRun: result.dryRun,
      generated: result.generated,
      sent: result.sent,
      skipped: result.skipped,
      failed: result.failed,
      status,
    });

    return jsonResponse(result);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return createUnauthorizedResponse();
    }
    if (error instanceof ForbiddenError) {
      return createForbiddenResponse();
    }

    logger.error("followups.run", "Error running followups", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    try {
      await appendAutomationRunRecord({
        id: `run_${Date.now()}`,
        timestamp: new Date().toISOString(),
        flow: "followups",
        dryRun: body.dryRun !== false,
        generated: 0,
        sent: 0,
        skipped: 0,
        failed: 0,
        actionCount: 0,
        errors: JSON.stringify([error instanceof Error ? error.message : "Unknown error"]),
        status: "failure",
        durationMs: Date.now() - startedAt,
        executedBy: body.executedBy ?? "system",
      });
    } catch (auditError) {
      logger.error("followups.run", "Unable to persist failed followup audit record", {
        error: auditError instanceof Error ? auditError.message : "Unknown error",
      });
    }

    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
}
