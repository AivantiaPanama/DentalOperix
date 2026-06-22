import { z } from "zod";

/**
 * 61.1 Users Foundation domain model.
 *
 * Governance boundary:
 * - Users are identity records only.
 * - Roles are stored as identity metadata for later 61.1 RBAC work.
 * - This module does not authorize requests, route dashboards, or alter Leads persistence.
 */
export const USER_DOMAIN_VERSION = "61.1-FND-001" as const;

export const USER_ROLES = ["administrator", "doctor", "assistant", "patient"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["pending_activation", "active", "inactive", "suspended"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export type UserId = string;

export type User = {
  id: UserId;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  deactivatedAt?: string;
};

export type CreateUserInput = {
  email: string;
  displayName: string;
  role: UserRole;
  status?: UserStatus;
};

export type UpdateUserInput = Partial<Pick<User, "displayName" | "role" | "status">>;

export class UserValidationError extends Error {
  readonly issues: string[];

  constructor(message: string, issues: string[] = [message]) {
    super(message);
    this.name = "UserValidationError";
    this.issues = issues;
  }
}

const trimmedRequiredString = z.string().trim().min(1);

export const userRoleSchema = z.enum(USER_ROLES);
export const userStatusSchema = z.enum(USER_STATUSES);

export const createUserInputSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  displayName: trimmedRequiredString,
  role: userRoleSchema,
  status: userStatusSchema.optional().default("pending_activation"),
});

export const updateUserInputSchema = z
  .object({
    displayName: trimmedRequiredString.optional(),
    role: userRoleSchema.optional(),
    status: userStatusSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one user field must be provided for update.",
  });

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);
}

export function isUserStatus(value: unknown): value is UserStatus {
  return typeof value === "string" && (USER_STATUSES as readonly string[]).includes(value);
}

function validationErrorFromZod(error: z.ZodError): UserValidationError {
  const issues = error.issues.map((issue) => issue.message);
  return new UserValidationError("Invalid user data.", issues);
}

export function validateCreateUserInput(input: unknown): CreateUserInput & { status: UserStatus } {
  const result = createUserInputSchema.safeParse(input);
  if (!result.success) {
    throw validationErrorFromZod(result.error);
  }
  return result.data;
}

export function validateUpdateUserInput(input: unknown): UpdateUserInput {
  const result = updateUserInputSchema.safeParse(input);
  if (!result.success) {
    throw validationErrorFromZod(result.error);
  }
  return result.data;
}

export function createUserEntity(
  input: CreateUserInput,
  options: { id: UserId; now?: string } = { id: crypto.randomUUID() },
): User {
  const validated = validateCreateUserInput(input);
  const now = options.now ?? new Date().toISOString();

  return {
    id: options.id,
    email: validated.email,
    displayName: validated.displayName,
    role: validated.role,
    status: validated.status,
    createdAt: now,
    updatedAt: now,
  };
}

export function applyUserUpdate(user: User, input: UpdateUserInput, now = new Date().toISOString()): User {
  const validated = validateUpdateUserInput(input);
  return {
    ...user,
    ...validated,
    updatedAt: now,
    deactivatedAt: validated.status === "inactive" ? user.deactivatedAt ?? now : user.deactivatedAt,
  };
}

export function deactivateUser(user: User, now = new Date().toISOString()): User {
  if (user.status === "inactive") {
    return user;
  }

  return {
    ...user,
    status: "inactive",
    updatedAt: now,
    deactivatedAt: now,
  };
}
