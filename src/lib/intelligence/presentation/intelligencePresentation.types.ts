import type { Evidence } from "../types";

export interface IntelligencePresentationModel {
  title: string;
  priority: string;
  explanation: string;
  evidence: Evidence[];
}
