export interface IntelligenceContext {
  entityType: string;
  entityId: string;
  state?: string;
  metadata?: Record<string, unknown>;
}

export interface Evidence {
  source: string;
  field: string;
  value: unknown;
  description: string;
}

export interface DecisionSignal {
  id: string;
  type: string;
  priority: string;
  context: IntelligenceContext;
  evidence: Evidence[];
  explanation: string;
}

export interface SignalDefinition {
  id: string;
  name: string;
  description?: string;
}
