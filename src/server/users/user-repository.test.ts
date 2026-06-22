import { describe, expect, it } from "vitest";
import { UserValidationError } from "./user-domain";
import { DuplicateUserEmailError, InMemoryUserRepository, UserNotFoundError } from "./user-repository";

describe("61.1-FND-002 user persistence layer", () => {
  it("creates and reads a user", async () => {
    const repository = new InMemoryUserRepository();

    const created = await repository.createUser({
      email: "Patient@DentalOperix.com",
      displayName: "Patient User",
      role: "patient",
    });

    await expect(repository.findUserById(created.id)).resolves.toMatchObject({
      email: "patient@dentaloperix.com",
      displayName: "Patient User",
      role: "patient",
      status: "pending_activation",
    });
    await expect(repository.findUserByEmail("PATIENT@DentalOperix.com")).resolves.toMatchObject({
      id: created.id,
    });
  });

  it("updates a user", async () => {
    const repository = new InMemoryUserRepository();
    const created = await repository.createUser({
      email: "assistant@dentaloperix.com",
      displayName: "Assistant User",
      role: "assistant",
    });

    const updated = await repository.updateUser(created.id, {
      displayName: "Front Desk Assistant",
      status: "active",
    });

    expect(updated).toMatchObject({
      id: created.id,
      displayName: "Front Desk Assistant",
      status: "active",
    });
  });

  it("deactivates a user", async () => {
    const repository = new InMemoryUserRepository();
    const created = await repository.createUser({
      email: "doctor@dentaloperix.com",
      displayName: "Doctor User",
      role: "doctor",
      status: "active",
    });

    const deactivated = await repository.deactivateUser(created.id);

    expect(deactivated.status).toBe("inactive");
    expect(deactivated.deactivatedAt).toBeDefined();
  });

  it("rejects invalid user creation and duplicate emails", async () => {
    const repository = new InMemoryUserRepository();

    await expect(
      repository.createUser({
        email: "invalid",
        displayName: "Invalid User",
        role: "patient",
      }),
    ).rejects.toThrow(UserValidationError);

    await repository.createUser({
      email: "duplicate@dentaloperix.com",
      displayName: "Duplicate User",
      role: "patient",
    });

    await expect(
      repository.createUser({
        email: "DUPLICATE@DentalOperix.com",
        displayName: "Duplicate User 2",
        role: "patient",
      }),
    ).rejects.toThrow(DuplicateUserEmailError);
  });

  it("throws when updating an unknown user", async () => {
    const repository = new InMemoryUserRepository();

    await expect(repository.updateUser("missing", { status: "inactive" })).rejects.toThrow(
      UserNotFoundError,
    );
  });
});
