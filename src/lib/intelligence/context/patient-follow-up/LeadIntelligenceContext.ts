export interface LeadIntelligenceContext {
  leadId?: string;
  entityId?: string;
  createdAt?: string | Date;
  lastRelevantEvent?: string | Date;
  lastActivityDate?: string | Date;
  currentState?: string;
  status?: string;
}
