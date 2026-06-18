import { describe, expect, it } from "vitest";
import {
  RELATIONAL_LEAD_COLUMNS,
  RELATIONAL_LEADS_SCHEMA_GOVERNANCE,
  RELATIONAL_LEADS_SCHEMA_VERSION,
  RELATIONAL_LEADS_TABLE_NAME,
} from "./relational-leads-schema";

describe("57.1-B relational Leads schema governance", () => {
  it("defines a non-active relational Leads schema design", () => {
    expect(RELATIONAL_LEADS_SCHEMA_VERSION).toBe("57.1-B");
    expect(RELATIONAL_LEADS_TABLE_NAME).toBe("leads");
    expect(RELATIONAL_LEADS_SCHEMA_GOVERNANCE.runtimeActivation).toBe(false);
    expect(RELATIONAL_LEADS_SCHEMA_GOVERNANCE.dualWriteAllowed).toBe(false);
    expect(RELATIONAL_LEADS_SCHEMA_GOVERNANCE.operationalFlowChanged).toBe(false);
    expect(RELATIONAL_LEADS_SCHEMA_GOVERNANCE.sourceOfTruth).toBe("Leads");
  });

  it("preserves the current Google Sheet CRM fields as relational columns", () => {
    const columns = RELATIONAL_LEAD_COLUMNS.map((column) => column.name);

    expect(columns).toEqual(
      expect.arrayContaining([
        "id",
        "created_at",
        "name",
        "phone",
        "email",
        "treatment",
        "message",
        "urgency",
        "preferred_date",
        "status",
        "source",
        "ai_summary",
        "calendar_event_id",
        "email_sent",
      ]),
    );
  });
});
