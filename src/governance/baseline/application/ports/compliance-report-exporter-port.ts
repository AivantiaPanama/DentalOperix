import type { ComplianceReport } from "../../domain/entities/compliance-report";

export type ComplianceReportExportFormat = "json" | "markdown" | "text";

export interface ComplianceReportExportResult {
  readonly format: ComplianceReportExportFormat;
  readonly artifactName: string;
  readonly content: string;
  readonly generatedAt: string;
}

export interface ComplianceReportExporterPort {
  export(report: ComplianceReport, format: ComplianceReportExportFormat): Promise<ComplianceReportExportResult> | ComplianceReportExportResult;
}
