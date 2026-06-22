import { describe, expect, it } from "vitest";
import {
  UserValidationError,
  applyUserUpdate,
  createUserEntity,
  deactivateUser,
  validateCreateUserInput,
} from "./user-domain";

describe("61.1-FND-001 user domain model", () => {
  it("creates a normalized identity-only user entity", () => {
    const user = createUserEntity(
      {
        email: "ADMIN@DentalOperix.com",
        displayName: "Administrator User",
        role: "administrator",
      },
      { id: "usr_001", now: "2026-06-22T00:00:00.000Z" },
    );

    expect(user).toMatchObject({
      id: "usr_001",
      email: "admin@dentaloperix.com",
      displayName: "Administrator User",
      role: "administrator",
      status: "pending_activation",
      createdAt: "2026-06-22T00:00:00.000Z",
      updatedAt: "2026-06-22T00:00:00.000Z",
    });
  });

  it("updates user lifecycle fields without introducing authorization behavior", () => {
    const user = createUserEntity(
      {
        email: "assistant@dentaloperix.com",
        displayName: "Assistant User",
        role: "assistant",
        status: "pending_activation",
      },
      { id: "usr_002", now: "2026-06-22T00:00:00.000Z" },
    );

    const updated = applyUserUpdate(user, { status: "active" }, "2026-06-22T01:00:00.000Z");

    expect(updated.status).toBe("active");
    expect(updated.updatedAt).toBe("2026-06-22T01:00:00.000Z");
    expect(updated).not.toHaveProperty("permissions");
  });

  it("deactivates a user idempotently", () => {
    const user = createUserEntity(
      {
        email: "doctor@dentaloperix.com",
        displayName: "Doctor User",
        role: "doctor",
        status: "active",
      },
      { id: "usr_003", now: "2026-06-22T00:00:00.000Z" },
    );

    const deactivated = deactivateUser(user, "2026-06-22T02:00:00.000Z");
    const secondPass = deactivateUser(deactivated, "2026-06-22T03:00:00.000Z");

    expect(deactivated.status).toBe("inactive");
    expect(deactivated.deactivatedAt).toBe("2026-06-22T02:00:00.000Z");
    expect(secondPass).toBe(deactivated);
  });

  it("rejects invalid user creation", () => {
    expect(() =>
      validateCreateUserInput({
        email: "not-an-email",
        displayName: "",
        role: "owner",
      }),
    ).toThrow(UserValidationError);
  });
});
