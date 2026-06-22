import {
  applyUserUpdate,
  createUserEntity,
  deactivateUser,
  validateCreateUserInput,
  validateUpdateUserInput,
  type CreateUserInput,
  type UpdateUserInput,
  type User,
  type UserId,
} from "./user-domain";

export const USER_PERSISTENCE_VERSION = "61.1-FND-002" as const;

export interface UserRepository {
  createUser(input: CreateUserInput): Promise<User>;
  findUserById(id: UserId): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  updateUser(id: UserId, input: UpdateUserInput): Promise<User>;
  deactivateUser(id: UserId): Promise<User>;
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User not found: ${id}`);
    this.name = "UserNotFoundError";
  }
}

export class DuplicateUserEmailError extends Error {
  constructor(email: string) {
    super(`User email already exists: ${email}`);
    this.name = "DuplicateUserEmailError";
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<UserId, User>();
  private readonly emailIndex = new Map<string, UserId>();

  async createUser(input: CreateUserInput): Promise<User> {
    const validated = validateCreateUserInput(input);
    const normalizedEmail = normalizeEmail(validated.email);

    if (this.emailIndex.has(normalizedEmail)) {
      throw new DuplicateUserEmailError(normalizedEmail);
    }

    const user = createUserEntity(validated, { id: crypto.randomUUID() });
    this.users.set(user.id, user);
    this.emailIndex.set(user.email, user.id);
    return user;
  }

  async findUserById(id: UserId): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const id = this.emailIndex.get(normalizeEmail(email));
    return id ? this.findUserById(id) : null;
  }

  async updateUser(id: UserId, input: UpdateUserInput): Promise<User> {
    const current = await this.findUserById(id);
    if (!current) {
      throw new UserNotFoundError(id);
    }

    const validated = validateUpdateUserInput(input);
    const updated = applyUserUpdate(current, validated);
    this.users.set(id, updated);
    return updated;
  }

  async deactivateUser(id: UserId): Promise<User> {
    const current = await this.findUserById(id);
    if (!current) {
      throw new UserNotFoundError(id);
    }

    const updated = deactivateUser(current);
    this.users.set(id, updated);
    return updated;
  }
}
