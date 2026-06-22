import {
  validateCreateUserInput,
  validateUpdateUserInput,
  type CreateUserInput,
  type UpdateUserInput,
  type User,
  type UserId,
} from "./user-domain";
import { RELATIONAL_USERS_TABLE_NAME } from "./relational-users-schema";
import {
  DuplicateUserEmailError,
  UserNotFoundError,
  type UserRepository,
} from "./user-repository";

type PgQueryResult<T> = { rows: T[]; rowCount: number | null };

export type UserPersistenceClient = {
  query<T = Record<string, unknown>>(text: string, values?: unknown[]): Promise<PgQueryResult<T>>;
};

type RelationalUserRow = {
  id: string;
  email: string;
  display_name: string;
  role: User["role"];
  status: User["status"];
  created_at: string | Date;
  updated_at: string | Date;
  deactivated_at: string | Date | null;
};

type PgClient = UserPersistenceClient & {
  connect(): Promise<void>;
  end(): Promise<void>;
};

type PgClientConstructor = new (config: { connectionString: string; ssl?: { rejectUnauthorized: boolean } }) => PgClient;

function toIsoString(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value.toString();
}

function rowToUser(row: RelationalUserRow): User {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    status: row.status,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
    deactivatedAt: row.deactivated_at ? toIsoString(row.deactivated_at) : undefined,
  };
}

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

async function createPgClient(): Promise<PgClient> {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error("User persistence requires DATABASE_URL or POSTGRES_URL.");
  }

  const pgModule = (await import("pg")) as unknown as { Client: PgClientConstructor };
  return new pgModule.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
}

export class RelationalUserRepository implements UserRepository {
  constructor(private readonly clientFactory: () => Promise<UserPersistenceClient> = createPgClient) {}

  async createUser(input: CreateUserInput): Promise<User> {
    const validated = validateCreateUserInput(input);
    const client = await this.clientFactory();

    try {
      const result = await client.query<RelationalUserRow>(
        `
          INSERT INTO ${RELATIONAL_USERS_TABLE_NAME} (email, display_name, role, status)
          VALUES ($1, $2, $3, $4)
          RETURNING id, email, display_name, role, status, created_at, updated_at, deactivated_at
        `,
        [validated.email, validated.displayName, validated.role, validated.status],
      );

      return rowToUser(result.rows[0]);
    } catch (error) {
      if (error instanceof Error && /duplicate key|unique constraint/i.test(error.message)) {
        throw new DuplicateUserEmailError(validated.email);
      }
      throw error;
    }
  }

  async findUserById(id: UserId): Promise<User | null> {
    const client = await this.clientFactory();
    const result = await client.query<RelationalUserRow>(
      `
        SELECT id, email, display_name, role, status, created_at, updated_at, deactivated_at
        FROM ${RELATIONAL_USERS_TABLE_NAME}
        WHERE id = $1
        LIMIT 1
      `,
      [id],
    );

    return result.rows[0] ? rowToUser(result.rows[0]) : null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const client = await this.clientFactory();
    const result = await client.query<RelationalUserRow>(
      `
        SELECT id, email, display_name, role, status, created_at, updated_at, deactivated_at
        FROM ${RELATIONAL_USERS_TABLE_NAME}
        WHERE email = $1
        LIMIT 1
      `,
      [normalizedEmail],
    );

    return result.rows[0] ? rowToUser(result.rows[0]) : null;
  }

  async updateUser(id: UserId, input: UpdateUserInput): Promise<User> {
    const validated = validateUpdateUserInput(input);
    const client = await this.clientFactory();

    const result = await client.query<RelationalUserRow>(
      `
        UPDATE ${RELATIONAL_USERS_TABLE_NAME}
        SET
          display_name = COALESCE($2, display_name),
          role = COALESCE($3, role),
          status = COALESCE($4, status),
          deactivated_at = CASE
            WHEN $4 = 'inactive' AND deactivated_at IS NULL THEN now()
            ELSE deactivated_at
          END,
          updated_at = now()
        WHERE id = $1
        RETURNING id, email, display_name, role, status, created_at, updated_at, deactivated_at
      `,
      [id, validated.displayName, validated.role, validated.status],
    );

    if (!result.rows[0]) {
      throw new UserNotFoundError(id);
    }

    return rowToUser(result.rows[0]);
  }

  async deactivateUser(id: UserId): Promise<User> {
    return this.updateUser(id, { status: "inactive" });
  }
}
