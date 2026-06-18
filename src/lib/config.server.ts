import process from "node:process";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

const serverEnv = z.object({
  NODE_ENV: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url(),
  GOOGLE_SCOPES: z.string().min(1),
  GOOGLE_REFRESH_TOKEN: z.string().min(1).optional(),
  GOOGLE_SHEET_ID: z.string().min(1),
  GOOGLE_SHEET_NAME: z.string().min(1).default("Leads"),
  GOOGLE_FOLLOWUPS_SHEET_NAME: z.string().min(1).default("PatientFollowUps"),
  GOOGLE_CALENDAR_ID: z.string().min(1).default("primary"),
  GOOGLE_CALENDAR_TIMEZONE: z.string().min(1).default("America/Panama"),
  GMAIL_SENDER: z.string().email(),
  GOOGLE_AUTOMATION_SHEET_NAME: z.string().min(1).default("AutomationRuns"),
  INTERNAL_API_KEY: z.string().min(1).optional(),
  ADMIN_PASSWORD: z.string().min(1).optional(),
  ADMIN_SESSION_SECRET: z.string().min(32).optional(),
});

export type ServerConfig = {
  nodeEnv?: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  googleScopes: string;
  googleRefreshToken?: string;
  googleSheetId: string;
  googleSheetName: string;
  googleFollowupsSheetName: string;
  googleCalendarId: string;
  googleCalendarTimeZone: string;
  gmailSender: string;
  googleAutomationSheetName: string;
  internalApiKey?: string;
  adminPassword?: string;
  adminSessionSecret?: string;
};

export function getServerConfig(): ServerConfig {
  const parsed = serverEnv.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid server config environment: ${parsed.error.message}`);
  }

  return {
    nodeEnv: parsed.data.NODE_ENV,
    googleClientId: parsed.data.GOOGLE_CLIENT_ID,
    googleClientSecret: parsed.data.GOOGLE_CLIENT_SECRET,
    googleRedirectUri: parsed.data.GOOGLE_REDIRECT_URI,
    googleScopes: parsed.data.GOOGLE_SCOPES,
    googleRefreshToken: parsed.data.GOOGLE_REFRESH_TOKEN,
    googleSheetId: parsed.data.GOOGLE_SHEET_ID,
    googleSheetName: parsed.data.GOOGLE_SHEET_NAME,
    googleFollowupsSheetName: parsed.data.GOOGLE_FOLLOWUPS_SHEET_NAME,
    googleCalendarId: parsed.data.GOOGLE_CALENDAR_ID,
    googleCalendarTimeZone: parsed.data.GOOGLE_CALENDAR_TIMEZONE,
    gmailSender: parsed.data.GMAIL_SENDER,
    googleAutomationSheetName: parsed.data.GOOGLE_AUTOMATION_SHEET_NAME,
    internalApiKey: parsed.data.INTERNAL_API_KEY,
    adminPassword: parsed.data.ADMIN_PASSWORD,
    adminSessionSecret: parsed.data.ADMIN_SESSION_SECRET,
  };
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function assertEnvWritable(): void {
  if (isProduction()) {
    throw new Error(
      "Unsafe configuration change: writing to .env is disabled in production. Provide secrets through environment variables or a secret manager instead.",
    );
  }
}

const ENV_FILE_PATH = join(process.cwd(), ".env");

function normalizeEnvValue(value: string) {
  return value.replace(/\n/g, "\\n");
}

export async function setServerEnvValue(key: string, value: string): Promise<void> {
  assertEnvWritable();
  const escapedValue = normalizeEnvValue(value);
  let envContent = "";

  try {
    envContent = await fs.readFile(ENV_FILE_PATH, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  const lines = envContent.split(/\r?\n/);
  const lineKey = `${key}=`;
  let replaced = false;

  const updatedLines = lines.map((line) => {
    if (line.startsWith(lineKey)) {
      replaced = true;
      return `${lineKey}${escapedValue}`;
    }
    return line;
  });

  if (!replaced) {
    updatedLines.push(`${lineKey}${escapedValue}`);
  }

  await fs.writeFile(ENV_FILE_PATH, updatedLines.filter(Boolean).join("\n") + "\n", "utf8");
}
