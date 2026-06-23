import { describe, expect, it } from "vitest";
import { RelationalUserRepository, type UserPersistenceClient } from "./relational-user-repository";

type QueryCall = { text: string; values?: unknown[] };

function createClient(row: Record<string, unknown> | null, calls: QueryCall[]): UserPersistenceClient {
  return {
    async query<T = Record<string, unknown>>(text: string, values?: unknown[]) {
      calls.push({ text, values });
      return { rows: row ? [row as T] : [], rowCount: row ? 1 : 0 };
    },
  };
}

const row = {
  id: "usr_001",
  email: "admin@dentaloperix.com",
  display_name: "Administrator User",
  role: "administrator",
  status: "pending_activation",
  created_at: "2026-06-22T00:00:00.000Z",
  updated_at: "2026-06-22T00:00:00.000Z",
  deactivated_at: null,
};

describe("61.1-FND-002 relational user repository", () => {
  it("creates users through the users table only", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalUserRepository(async () => createClient(row, calls));

    const created = await repository.createUser({
      email: "ADMIN@DentalOperix.com",
      displayName: "Administrator User",
      role: "administrator",
    });

    expect(created.email).toBe("admin@dentaloperix.com");
    expect(calls[0].text).toContain("INSERT INTO users");
    expect(calls[0].text).not.toContain("leads");
    expect(calls[0].values).toEqual([
      "admin@dentaloperix.com",
      "Administrator User",
      "administrator",
      "pending_activation",
    ]);
  });

  it("reads by id without touching Leads persistence", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalUserRepository(async () => createClient(row, calls));

    await expect(repository.findUserById("usr_001")).resolves.toMatchObject({ id: "usr_001" });

    expect(calls[0].text).toContain("FROM users");
    expect(calls[0].text).not.toContain("leads");
    expect(calls[0].values).toEqual(["usr_001"]);
  });

  it("deactivates using status lifecycle only", async () => {
    const calls: QueryCall[] = [];
    const repository = new RelationalUserRepository(async () =>
      createClient({ ...row, status: "inactive", deactivated_at: "2026-06-22T01:00:00.000Z" }, calls),
    );

    const user = await repository.deactivateUser("usr_001");

    expect(user.status).toBe("inactive");
    expect(calls[0].text).toContain("UPDATE users");
    expect(calls[0].text).not.toContain("leads");
    expect(calls[0].values).toEqual(["usr_001", undefined, undefined, "inactive"]);
  });
});
