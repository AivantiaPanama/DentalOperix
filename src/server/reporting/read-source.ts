import {
  getReadModelSource,
  type ReadModelSource,
  type ReadModelSourceMode,
} from "@/server/read-models/read-model-source-provider";

export type ReportingReadSourceMode = ReadModelSourceMode;
export type ReportingReadSource = ReadModelSource;

export async function getReportingReadSource(): Promise<ReportingReadSource> {
  return await getReadModelSource({ consumerName: "Reporting" });
}
