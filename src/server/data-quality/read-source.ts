import {
  getReadModelSource,
  type ReadModelSource,
  type ReadModelSourceMode,
} from "@/server/read-models/read-model-source-provider";

export type DataQualityReadSourceMode = ReadModelSourceMode;
export type DataQualityReadSource = ReadModelSource;

export async function getDataQualityReadSource(): Promise<DataQualityReadSource> {
  return await getReadModelSource({ consumerName: "Data Quality" });
}
