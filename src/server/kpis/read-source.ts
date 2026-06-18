import {
  getReadModelSource,
  type ReadModelSource,
  type ReadModelSourceMode,
} from "@/server/read-models/read-model-source-provider";

export type OperationalKpisReadSourceMode = ReadModelSourceMode;
export type OperationalKpisReadSource = ReadModelSource;

export async function getOperationalKpisReadSource(): Promise<OperationalKpisReadSource> {
  return await getReadModelSource({ consumerName: "Operational Analytics" });
}
