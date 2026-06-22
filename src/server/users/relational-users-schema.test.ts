import { describe, expect, it } from "vitest";
import {
  RELATIONAL_USER_COLUMNS,
  RELATIONAL_USERS_SCHEMA_GOVERNANCE,
  RELATIONAL_USERS_SCHEMA_VERSION,
  RELATIONAL_USERS_TABLE_NAME,
} from "./relational-users-schema";

describe("61.1-FND-002 relational Users schema governance", () => {
  it("defines Users as identity-only persistence metadata", () => {
    expect(RELATIONAL_USERS_SCHEMA_VERSION).toBe("61.1-FND-002");
    expect(RELATIONAL_USERS_TABLE_NAME).toBe("users");
    expect(RELATIONAL_USERS_SCHEMA_GOVERNANCE).toMatchObject({
      sourceOfTruth: "Users = Identity only",
      leadsSourceOfTruthPreserved: true,
      rbacEnforcementImplemented: false,
      dashboardRoutingImplemented: false,
      patientManagementImplemented: false,
    });
  });

  it("contains only identity and technical user columns", () => {
    const columns = RELATIONAL_USER_COLUMNS.map((column) => column.name);

    expect(columns).toEqual([
      "id",
      "email",
      "display_name",
      "role",
      "status",
      "created_at",
      "updated_at",
      "deactivated_at",
    ]);
  });
});
