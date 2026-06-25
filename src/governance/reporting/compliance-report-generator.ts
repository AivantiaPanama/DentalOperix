import type { IReportGenerator, ValidationContext, ValidationReport, ValidationResult } from "../sdk";
import { ReportBuilder } from "../sdk";

export class ComplianceReportGenerator implements IReportGenerator {
  constructor(private readonly reportBuilder = new ReportBuilder()) {}

  generate(context: ValidationContext, results: readonly ValidationResult[]): ValidationReport {
    return this.reportBuilder.generate(context, results);
  }
}
