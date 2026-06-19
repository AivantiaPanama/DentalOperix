import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { mockLeads } from "@/lib/mock/leads";
import {
  applyAdministrativeProfileUpdate,
  derivePatientAdministrativeProfiles,
  type PatientAdministrativeProfile,
  type PatientAdministrativeProfileUpdate,
  type PatientAdministrativeVerification,
} from "@/lib/patients/admin-profile";
import { getServerConfig } from "@/lib/config.server";
import { leadPersistenceProvider } from "@/server/leads/persistence";

export class PatientNotFoundError extends Error {}

export type StoredAdministrativeProfile = PatientAdministrativeProfileUpdate &
  PatientAdministrativeVerification & {
    updatedAt?: string;
    updatedBy?: string;
  };

type PatientAdministrativeStore = Record<string, StoredAdministrativeProfile>;

const STORE_PATH = resolve(process.cwd(), ".data/patient-administrative-profiles.json");

async function readStore(): Promise<PatientAdministrativeStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as PatientAdministrativeStore;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

async function writeStore(store: PatientAdministrativeStore): Promise<void> {
  await mkdir(dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

async function readBaseProfiles(): Promise<PatientAdministrativeProfile[]> {
  try {
    const config = getServerConfig();
    if (config.nodeEnv === "production" && !config.googleRefreshToken) {
      throw new Error("Patient access is restricted in production.");
    }

    const leads = await leadPersistenceProvider.getActiveLeadPersistenceAdapter().listLeads();
    if (!leads.length) throw new Error("No hay leads para derivar pacientes.");
    return derivePatientAdministrativeProfiles(leads);
  } catch (error) {
    if (getServerConfig().nodeEnv === "production") throw error;
    console.warn("Falling back to mock patient administrative profiles:", error);
    return derivePatientAdministrativeProfiles(mockLeads);
  }
}

function mergeStoredProfile(
  profile: PatientAdministrativeProfile,
  stored: StoredAdministrativeProfile | undefined,
): PatientAdministrativeProfile {
  if (!stored) return profile;
  return applyAdministrativeProfileUpdate(profile, stored);
}

export async function listPatientAdministrativeProfiles(): Promise<PatientAdministrativeProfile[]> {
  const [baseProfiles, store] = await Promise.all([readBaseProfiles(), readStore()]);
  return baseProfiles.map((profile) => mergeStoredProfile(profile, store[profile.id]));
}

export async function getPatientAdministrativeProfile(
  id: string,
): Promise<PatientAdministrativeProfile> {
  const profiles = await listPatientAdministrativeProfiles();
  const profile = profiles.find((patient) => patient.id === id);
  if (!profile) throw new PatientNotFoundError(`Paciente ${id} no encontrado.`);
  return profile;
}

export async function updatePatientAdministrativeProfile(
  id: string,
  update: PatientAdministrativeProfileUpdate,
  actor: { role: string; email?: string; userId?: string },
): Promise<PatientAdministrativeProfile> {
  await getPatientAdministrativeProfile(id);
  const store = await readStore();
  const updatedAt = new Date().toISOString();
  const updatedBy = actor.email ?? actor.userId ?? actor.role;

  store[id] = {
    ...(store[id] ?? {}),
    ...update,
    updatedAt,
    updatedBy,
  };

  await writeStore(store);
  return getPatientAdministrativeProfile(id);
}

export async function verifyPatientAdministrativeProfile(
  id: string,
  actor: { role: string; email?: string; userId?: string },
): Promise<PatientAdministrativeProfile> {
  await getPatientAdministrativeProfile(id);
  const store = await readStore();
  const timestamp = new Date().toISOString();
  const verifier = actor.email ?? actor.userId ?? actor.role;

  store[id] = {
    ...(store[id] ?? {}),
    verificationStatus: "verified",
    verifiedAt: timestamp,
    verifiedBy: verifier,
    updatedAt: timestamp,
    updatedBy: verifier,
  };

  await writeStore(store);
  return getPatientAdministrativeProfile(id);
}
