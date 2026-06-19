import process$1 from "node:process";
import { promises } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { z } from "zod";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { google } from "googleapis";
import { format, startOfMonth, startOfWeek } from "date-fns";
import { mkdir, readFile, writeFile } from "node:fs/promises";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/lib/error-capture.ts
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
//#endregion
//#region src/lib/error-page.ts
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
//#endregion
//#region src/lib/config.server.ts
var serverEnv = z.object({
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
	ADMIN_SESSION_SECRET: z.string().min(32).optional()
});
function getServerConfig() {
	const parsed = serverEnv.safeParse(process$1.env);
	if (!parsed.success) throw new Error(`Invalid server config environment: ${parsed.error.message}`);
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
		adminSessionSecret: parsed.data.ADMIN_SESSION_SECRET
	};
}
function isProduction() {
	return process$1.env.NODE_ENV === "production";
}
function assertEnvWritable() {
	if (isProduction()) throw new Error("Unsafe configuration change: writing to .env is disabled in production. Provide secrets through environment variables or a secret manager instead.");
}
var ENV_FILE_PATH = join(process$1.cwd(), ".env");
function normalizeEnvValue(value) {
	return value.replace(/\n/g, "\\n");
}
async function setServerEnvValue(key, value) {
	assertEnvWritable();
	const escapedValue = normalizeEnvValue(value);
	let envContent = "";
	try {
		envContent = await promises.readFile(ENV_FILE_PATH, "utf8");
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
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
	if (!replaced) updatedLines.push(`${lineKey}${escapedValue}`);
	await promises.writeFile(ENV_FILE_PATH, updatedLines.filter(Boolean).join("\n") + "\n", "utf8");
}
//#endregion
//#region src/lib/internal-api-key.server.ts
var UnauthorizedApiKeyError = class extends Error {};
function requireInternalApiKey(request) {
	const config = getServerConfig();
	const apiKey = request.headers.get("x-api-key")?.trim();
	if (config.internalApiKey) {
		if (!apiKey || apiKey !== config.internalApiKey) throw new UnauthorizedApiKeyError("Unauthorized");
		return;
	}
	if (isProduction()) throw new UnauthorizedApiKeyError("Unauthorized");
}
function createUnauthorizedResponse$1() {
	return new Response(JSON.stringify({
		success: false,
		error: "Unauthorized"
	}), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/lib/admin-auth.server.ts
var ADMIN_SESSION_COOKIE = "dentaloperix_admin_session";
var SESSION_MAX_AGE_SECONDS = 3600 * 8;
var UnauthorizedAdminError = class extends Error {};
function base64UrlEncode(value) {
	return Buffer.from(value, "utf8").toString("base64url");
}
function base64UrlDecode(value) {
	return Buffer.from(value, "base64url").toString("utf8");
}
function sign(value, secret) {
	return createHmac("sha256", secret).update(value).digest("base64url");
}
function safeEqual(a, b) {
	const aBuffer = Buffer.from(a);
	const bBuffer = Buffer.from(b);
	if (aBuffer.length !== bBuffer.length) return false;
	return timingSafeEqual(aBuffer, bBuffer);
}
function verifyAdminPassword(password) {
	const { adminPassword } = getServerConfig();
	if (!adminPassword) return false;
	return safeEqual(password, adminPassword);
}
function createAdminSessionToken(now = Math.floor(Date.now() / 1e3)) {
	const { adminSessionSecret } = getServerConfig();
	if (!adminSessionSecret) throw new Error("ADMIN_SESSION_SECRET is not configured.");
	const payload = {
		role: "admin",
		iat: now,
		exp: now + SESSION_MAX_AGE_SECONDS
	};
	const encodedPayload = base64UrlEncode(JSON.stringify(payload));
	return `${encodedPayload}.${sign(encodedPayload, adminSessionSecret)}`;
}
function verifyAdminSessionToken(token) {
	if (!token) return null;
	const { adminSessionSecret } = getServerConfig();
	if (!adminSessionSecret) return null;
	const [encodedPayload, signature] = token.split(".");
	if (!encodedPayload || !signature) return null;
	if (!safeEqual(signature, sign(encodedPayload, adminSessionSecret))) return null;
	try {
		const payload = JSON.parse(base64UrlDecode(encodedPayload));
		if (payload.role !== "admin") return null;
		if (!payload.exp || payload.exp < Math.floor(Date.now() / 1e3)) return null;
		return payload;
	} catch {
		return null;
	}
}
function parseCookies$1(cookieHeader) {
	const cookies = /* @__PURE__ */ new Map();
	if (!cookieHeader) return cookies;
	for (const part of cookieHeader.split(";")) {
		const [rawName, ...rawValue] = part.trim().split("=");
		if (!rawName) continue;
		cookies.set(rawName, decodeURIComponent(rawValue.join("=")));
	}
	return cookies;
}
function getAdminSessionFromRequest(request) {
	return verifyAdminSessionToken(parseCookies$1(request.headers.get("cookie")).get(ADMIN_SESSION_COOKIE));
}
function isTestRuntime() {
	return process$1.env.NODE_ENV === "test" || process$1.env.VITEST === "true" || process$1.env.VITEST === "1";
}
function canBypassAdminAuthInDevelopment() {
	return isTestRuntime();
}
function requireAdminSession(request) {
	if (canBypassAdminAuthInDevelopment()) return {
		role: "admin",
		iat: 0,
		exp: Number.MAX_SAFE_INTEGER
	};
	if (!request) throw new UnauthorizedAdminError("Unauthorized");
	const session = getAdminSessionFromRequest(request);
	if (!session) throw new UnauthorizedAdminError("Unauthorized");
	return session;
}
function createAdminSessionCookie(token) {
	const attributes = [
		`${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}`,
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		`Max-Age=${SESSION_MAX_AGE_SECONDS}`
	];
	if (process$1.env.NODE_ENV === "production") attributes.push("Secure");
	return attributes.join("; ");
}
function createAdminLogoutCookie() {
	const attributes = [
		`${ADMIN_SESSION_COOKIE}=`,
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		"Max-Age=0"
	];
	if (process$1.env.NODE_ENV === "production") attributes.push("Secure");
	return attributes.join("; ");
}
var ROLE_PERMISSIONS = {
	admin: [
		"crm:read",
		"crm:write",
		"leads:read",
		"leads:create",
		"leads:update",
		"appointments:read",
		"appointments:create",
		"appointments:update",
		"appointments:confirm",
		"appointments:checkin",
		"appointments:checkout",
		"calendar:create",
		"gmail:send",
		"finance:read",
		"reports:read",
		"goals:read",
		"goals:write",
		"automation:read",
		"automation:run",
		"audit:read",
		"notifications:read",
		"kpis:read",
		"executive-observability:read",
		"dataQuality:read",
		"users:read",
		"users:write",
		"patients:read",
		"patients:selfRead",
		"patients:update",
		"patients:adminUpdate",
		"patients:verifyProfile",
		"clinical:read",
		"clinical:write",
		"settings:read",
		"settings:write",
		"documents:selfRead",
		"requests:create"
	],
	doctor: [
		"appointments:read",
		"appointments:update",
		"patients:read",
		"patients:update",
		"clinical:read",
		"clinical:write"
	],
	assistant: [
		"leads:read",
		"leads:update",
		"reports:read",
		"appointments:read",
		"appointments:update",
		"appointments:confirm",
		"appointments:checkin",
		"appointments:checkout",
		"patients:read",
		"patients:update",
		"patients:adminUpdate",
		"patients:verifyProfile",
		"notifications:read",
		"kpis:read",
		"dataQuality:read"
	],
	patient: [
		"appointments:read",
		"patients:selfRead",
		"documents:selfRead",
		"requests:create"
	]
};
function getPermissionsForRole(role) {
	return ROLE_PERMISSIONS[role];
}
function hasPermission(role, permission) {
	return getPermissionsForRole(role).includes(permission);
}
//#endregion
//#region src/lib/rbac/roles.ts
function isRoleAllowed(role, allowedRoles) {
	return role === "admin" || allowedRoles.includes(role);
}
//#endregion
//#region src/lib/rbac/guards.server.ts
var UnauthorizedError = class extends Error {};
var ForbiddenError = class extends Error {};
function toAuthSession(session) {
	return {
		role: session.role,
		permissions: getPermissionsForRole(session.role),
		iat: session.iat,
		exp: session.exp
	};
}
function getAuthSessionFromRequest(request) {
	const adminSession = getAdminSessionFromRequest(request);
	if (!adminSession) return null;
	return toAuthSession(adminSession);
}
function requireAuth(request) {
	try {
		return toAuthSession(requireAdminSession(request));
	} catch (error) {
		if (error instanceof UnauthorizedAdminError) throw new UnauthorizedError("Unauthorized");
		throw error;
	}
}
function requirePermission(request, permission) {
	const session = requireAuth(request);
	if (!hasPermission(session.role, permission)) throw new ForbiddenError("Forbidden");
	return session;
}
function requirePermissionOrInternalApiKey(request, permission) {
	const session = getAuthSessionFromRequest(request);
	if (session) {
		if (!hasPermission(session.role, permission)) throw new ForbiddenError("Forbidden");
		return session;
	}
	try {
		requireInternalApiKey(request);
		return null;
	} catch (error) {
		if (error instanceof UnauthorizedApiKeyError) throw new UnauthorizedError("Unauthorized");
		throw error;
	}
}
function createUnauthorizedResponse() {
	return new Response(JSON.stringify({
		success: false,
		error: "Unauthorized"
	}), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
}
function createForbiddenResponse() {
	return new Response(JSON.stringify({
		success: false,
		error: "Forbidden"
	}), {
		status: 403,
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/lib/oauth-state.server.ts
var STATE_COOKIE_NAME = "GOOGLE_OAUTH_STATE";
var STATE_COOKIE_MAX_AGE = 600;
function generateOAuthState() {
	return randomUUID();
}
function parseCookies(cookieHeader) {
	if (!cookieHeader) return {};
	return Object.fromEntries(cookieHeader.split(";").map((cookie) => {
		const [key, ...valueParts] = cookie.trim().split("=");
		return [key, decodeURIComponent(valueParts.join("="))];
	}));
}
function getOAuthStateFromCookies(request) {
	return parseCookies(request.headers.get("cookie"))[STATE_COOKIE_NAME];
}
function createOAuthStateCookie(state, secure = false) {
	const parts = [
		`${STATE_COOKIE_NAME}=${encodeURIComponent(state)}`,
		`Path=/`,
		`Max-Age=${STATE_COOKIE_MAX_AGE}`,
		`SameSite=Lax`,
		`HttpOnly`
	];
	if (secure) parts.push("Secure");
	return parts.join("; ");
}
function clearOAuthStateCookie(secure = false) {
	const parts = [
		`${STATE_COOKIE_NAME}=; Path=/`,
		`Max-Age=0`,
		`SameSite=Lax`,
		`HttpOnly`
	];
	if (secure) parts.push("Secure");
	return parts.join("; ");
}
//#endregion
//#region src/routes/api/google/login.ts
var GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
async function GET$15() {
	try {
		const config = getServerConfig();
		const state = generateOAuthState();
		const url = `${GOOGLE_AUTH_ENDPOINT}?${new URLSearchParams({
			client_id: config.googleClientId,
			redirect_uri: config.googleRedirectUri,
			response_type: "code",
			access_type: "offline",
			prompt: "consent",
			scope: config.googleScopes,
			state
		}).toString()}`;
		const cookie = createOAuthStateCookie(state, false);
		return new Response(null, {
			status: 302,
			headers: {
				Location: url,
				"Set-Cookie": cookie
			}
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}
//#endregion
//#region src/routes/api/google/callback.ts
var TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
async function GET$14(request) {
	try {
		const url = new URL(request.url);
		const code = url.searchParams.get("code");
		const state = url.searchParams.get("state");
		if (!code) return new Response(JSON.stringify({
			success: false,
			error: "Missing authorization code from Google callback."
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const savedState = getOAuthStateFromCookies(request);
		if (!state || !savedState || state !== savedState) return new Response(JSON.stringify({
			success: false,
			error: "Invalid or missing OAuth state."
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const config = getServerConfig();
		const body = new URLSearchParams({
			client_id: config.googleClientId,
			client_secret: config.googleClientSecret,
			code,
			grant_type: "authorization_code",
			redirect_uri: config.googleRedirectUri
		});
		const tokenResponse = await fetch(TOKEN_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: body.toString()
		});
		const tokenData = await tokenResponse.json();
		if (!tokenResponse.ok) return new Response(JSON.stringify({
			success: false,
			error: "Google returned an error while exchanging the authorization code.",
			details: tokenData
		}), {
			status: tokenResponse.status || 500,
			headers: { "Content-Type": "application/json" }
		});
		const refreshToken = tokenData.refresh_token;
		if (!refreshToken) return new Response(JSON.stringify({
			success: false,
			error: "Google did not return a refresh_token."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
		if (!(config.nodeEnv === "production")) await setServerEnvValue("GOOGLE_REFRESH_TOKEN", refreshToken);
		else console.warn("Production environment: received refresh token but .env writes are disabled. Configure GOOGLE_REFRESH_TOKEN through your deployment environment.");
		process.env.GOOGLE_REFRESH_TOKEN = refreshToken;
		return new Response(`<html><body><h1>Google OAuth callback</h1><p>Authorization completed successfully.</p></body></html>`, {
			status: 200,
			headers: {
				"Content-Type": "text/html; charset=utf-8",
				"Set-Cookie": clearOAuthStateCookie(false)
			}
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}
//#endregion
//#region src/data/dental-services.ts
var DENTAL_SERVICES = [
	{
		id: "odontologia-preventiva",
		label: "Odontología Preventiva",
		aliases: [
			"odontologia preventiva",
			"preventiva",
			"limpieza",
			"control",
			"revisión preventiva",
			"revisión dental"
		],
		shortDescription: "Revisamos tu salud bucal, detectamos problemas tempranos y te orientamos para mantener una sonrisa sana.",
		patientExplanation: "Durante la consulta hacemos un examen completo de dientes y encías, evaluamos hábitos de higiene y te recomendamos los cuidados preventivos más adecuados.",
		benefits: [
			"Detecta caries y problemas a tiempo",
			"Reduce el riesgo de enfermedad periodontal",
			"Recibes una guía personalizada de cuidado dental"
		],
		idealFor: [
			"Pacientes que desean prevenir problemas dentales",
			"Quienes quieren un chequeo regular",
			"Personas que buscan mantener su salud oral en buen estado"
		],
		cta: "¿Te gustaría agendar una revisión preventiva para tu sonrisa?"
	},
	{
		id: "ortodoncia",
		label: "Ortodoncia",
		aliases: [
			"ortodoncia",
			"brackets",
			"alineadores",
			"alineadores invisibles",
			"dientes chuecos",
			"mordida"
		],
		shortDescription: "Ajustamos la posición de tus dientes mediante tratamientos que pueden ser estéticos y personalizados según tu caso.",
		patientExplanation: "Evaluamos la alineación dental, la mordida y el movimiento necesario para diseñar un plan con brackets o alineadores que mejore tu función y apariencia.",
		benefits: [
			"Mejora la posición dental y la mordida",
			"Reduce el desgaste irregular de los dientes",
			"Ofrece opciones discretas según tu estilo"
		],
		idealFor: [
			"Personas con dientes desalineados",
			"Pacientes con mordida cruzada o apiñamiento",
			"Adolescentes y adultos que buscan una sonrisa más armónica"
		],
		cta: "¿Quieres saber si tu caso puede mejorar con ortodoncia?"
	},
	{
		id: "diseno-de-sonrisa",
		label: "Diseño de Sonrisa",
		aliases: [
			"diseño de sonrisa",
			"sonrisa",
			"estética dental",
			"carillas",
			"bonding"
		],
		shortDescription: "Trabajamos la estética dental para lograr una sonrisa más armónica con tratamientos adaptados a tu perfil.",
		patientExplanation: "Analizamos forma, color y proporciones dentales, revisamos tu sonrisa completa y te proponemos un plan estético acorde a tus expectativas.",
		benefits: [
			"Mejora la apariencia de tu sonrisa",
			"Combina estética y función dental",
			"Ofrece opciones personalizadas según tu caso"
		],
		idealFor: [
			"Pacientes que desean una sonrisa más equilibrada",
			"Quienes quieren corregir forma o color dental",
			"Personas interesadas en carillas o estética integral"
		],
		cta: "¿Te gustaría una valoración para conocer opciones de diseño de sonrisa?"
	},
	{
		id: "implantes-dentales",
		label: "Implantes Dentales",
		aliases: [
			"implantes dentales",
			"implante",
			"implantes",
			"me falta un diente",
			"falta un diente"
		],
		shortDescription: "Reemplazamos piezas dentales faltantes con soluciones fijas que se planifican según tu caso y salud oral.",
		patientExplanation: "Verificamos tu estructura ósea, salud gingival y el espacio disponible para determinar si un implante es la opción adecuada.",
		benefits: [
			"Recupera función masticatoria",
			"No altera dientes vecinos sanos",
			"Planificación con tecnología digital"
		],
		idealFor: [
			"Personas que han perdido uno o varios dientes",
			"Quienes buscan una solución fija y estable",
			"Pacientes que desean evitar prótesis removibles"
		],
		cta: "¿Quieres evaluar si un implante es adecuado para ti?"
	},
	{
		id: "odontopediatria",
		label: "Odontopediatría",
		aliases: [
			"odontopediatria",
			"odontopediatría",
			"niños",
			"pediatría dental",
			"dentista infantil"
		],
		shortDescription: "Atendemos a niños con un enfoque amable y adaptado para que su primera experiencia dental sea positiva.",
		patientExplanation: "Revisamos el crecimiento dental, hábitos de higiene y factores que pueden afectar la salud bucal de los más pequeños.",
		benefits: [
			"Ambiente cómodo para niños",
			"Prevención temprana de caries",
			"Educación y guía para toda la familia"
		],
		idealFor: [
			"Niños en su primera consulta dental",
			"Familias que buscan seguimiento infantil",
			"Pacientes infantiles con miedo o ansiedad al dentista"
		],
		cta: "¿Deseas agendar una consulta infantil para tu hijo?"
	},
	{
		id: "blanqueamiento-dental",
		label: "Blanqueamiento Dental",
		aliases: [
			"blanqueamiento dental",
			"blanqueamiento",
			"dientes blancos",
			"aclaramiento dental"
		],
		shortDescription: "Ayudamos a mejorar el tono de tus dientes con un tratamiento supervisado por profesionales.",
		patientExplanation: "Revisamos tu estado dental y de encías, evaluamos sensibilidad y determinamos qué método es más seguro para ti.",
		benefits: [
			"Mejora estética visible",
			"Procedimiento supervisado por profesionales",
			"Puede ayudar a reducir manchas externas"
		],
		idealFor: [
			"Pacientes que desean una sonrisa más clara",
			"Personas con manchas por café, té o tabaco",
			"Quienes buscan un tono dental más uniforme"
		],
		cta: "¿Te gustaría agendar una valoración para saber si eres candidato?"
	},
	{
		id: "endodoncia",
		label: "Endodoncia",
		aliases: [
			"endodoncia",
			"tratamiento de conducto",
			"muelas",
			"dolor de muelas",
			"sensibilidad dental"
		],
		shortDescription: "Atendemos problemas de nervio dental para aliviar el dolor y conservar la pieza natural cuando es posible.",
		patientExplanation: "Evaluamos el origen de la molestia, realizamos el tratamiento del conducto y cuidamos la estructura dental para evitar extracciones.",
		benefits: [
			"Alivia dolor intenso",
			"Conserva el diente natural",
			"Reduce el riesgo de infección profunda"
		],
		idealFor: [
			"Pacientes con dolor persistente en una pieza dental",
			"Quienes presentan sensibilidad prolongada",
			"Casos con caries profundas o inflamación pulpar"
		],
		cta: "¿Quieres evaluar si necesitas un tratamiento de conducto?"
	},
	{
		id: "urgencias-dentales",
		label: "Urgencias Dentales",
		aliases: [
			"urgencias dentales",
			"urgencia",
			"dolor dental",
			"dolor de muelas",
			"me duele una muela",
			"sangrado",
			"trauma",
			"inflamación",
			"me sangran las encías"
		],
		shortDescription: "Atendemos problemas dentales que requieren respuesta pronta y orientación para reducir complicaciones.",
		patientExplanation: "Evaluamos el origen del dolor, sangrado o trauma y te orientamos sobre el siguiente paso con prioridad.",
		benefits: [
			"Respuesta más oportuna",
			"Reduce riesgo de complicaciones",
			"Orientación inmediata sobre el manejo del caso"
		],
		idealFor: [
			"Pacientes con dolor agudo",
			"Quienes presentan sangrado, inflamación o trauma",
			"Casos que requieren atención pronta"
		],
		cta: "¿Te gustaría agendar una atención pronta para revisar tu caso?"
	},
	{
		id: "revision-dental",
		label: "Revisión Dental",
		aliases: [
			"revisión dental",
			"revision dental",
			"revisión",
			"revision",
			"control dental",
			"chequeo",
			"me sangran las encías"
		],
		shortDescription: "Revisamos cambios recientes en tu salud bucal y te orientamos sobre el cuidado que necesitas.",
		patientExplanation: "Evaluamos tu estado actual, buscamos signos de caries o inflamación y te recomendamos los pasos a seguir.",
		benefits: [
			"Actualiza tu estado dental",
			"Detecta cambios recientes",
			"Refuerza tu plan de cuidado"
		],
		idealFor: [
			"Pacientes con chequeos periódicos pendientes",
			"Quienes notaron cambios en sus dientes o encías",
			"Personas que quieren confirmar su salud bucal"
		],
		cta: "¿Te gustaría una revisión rápida para detectar cualquier cambio reciente?"
	}
];
var normalize$25 = (value) => value.trim().toLowerCase();
function getDentalServiceById(id) {
	if (!id) return void 0;
	return DENTAL_SERVICES.find((service) => service.id === id);
}
function findDentalService(input) {
	const normalizedInput = normalize$25(input);
	if (!normalizedInput) return null;
	const exactMatch = DENTAL_SERVICES.find((service) => normalize$25(service.label) === normalizedInput || normalize$25(service.id) === normalizedInput || service.aliases.some((alias) => normalize$25(alias) === normalizedInput));
	if (exactMatch) return exactMatch;
	const containsMatch = DENTAL_SERVICES.find((service) => normalize$25(service.label).includes(normalizedInput) || service.aliases.some((alias) => normalize$25(alias).includes(normalizedInput)));
	if (containsMatch) return containsMatch;
	const aliasPhraseMatch = DENTAL_SERVICES.find((service) => service.aliases.some((alias) => normalizedInput.includes(normalize$25(alias))));
	if (aliasPhraseMatch) return aliasPhraseMatch;
	for (const [pattern, serviceId] of [
		[/\bme duele una muela\b|\bdolor de muelas?\b|\bdolor dental\b|\burgencia\b|\btrauma\b|\binflamaci[oó]n\b|\bsangrado\b|\bme sangran las enc[ií]as\b/, "urgencias-dentales"],
		[/\bquiero dientes blancos\b|\bdientes blancos\b|\bblanqueamiento\b|\baclaramiento\b/, "blanqueamiento-dental"],
		[/\bdientes chuecos\b|\bbrackets?\b|\balineadores?\b|\bortodoncia\b/, "ortodoncia"],
		[/\bme falta un diente\b|\bfalta un diente\b|\bimplante(s)?\b/, "implantes-dentales"],
		[/\blimpieza\b|\bcontrol\b|\brevisión preventiva\b|\bchequeo\b/, "odontologia-preventiva"],
		[/\bcaries?\b|\brevisión\b|\bchequeo\b|\benc[ií]as\b/, "revision-dental"]
	]) if (pattern.test(normalizedInput)) return getDentalServiceById(serviceId) ?? null;
	const tokens = normalizedInput.split(/\s+/);
	return DENTAL_SERVICES.find((service) => service.aliases.some((alias) => tokens.every((token) => token && normalize$25(alias).includes(token)))) ?? null;
}
//#endregion
//#region src/lib/google/schemas.ts
var ALLOWED_DENTAL_SERVICES = new Set(DENTAL_SERVICES.flatMap((service) => [
	service.label,
	service.id,
	...service.aliases
]).map((value) => value.trim().toLocaleLowerCase("es")));
function isAllowedDentalService(service) {
	return ALLOWED_DENTAL_SERVICES.has(service.trim().toLocaleLowerCase("es"));
}
var googleLeadPayloadSchema$1 = z.object({
	name: z.string().min(2, "Ingresa tu nombre."),
	email: z.string().email("Ingresa un correo válido."),
	phone: z.string().min(8, "Ingresa un teléfono válido.").max(20, "Teléfono demasiado largo."),
	service: z.string().trim().min(1, "Describe el tratamiento que buscas.").refine(isAllowedDentalService, "Selecciona un servicio válido del catálogo."),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida."),
	time: z.string().regex(/^\d{2}:\d{2}$/, "Selecciona una hora válida."),
	notes: z.string().optional(),
	preferredDate: z.string().optional(),
	source: z.string().optional()
});
//#endregion
//#region src/server/google/types.ts
var CRM_STATUS = {
	NUEVO: "nuevo",
	AGENDADA: "agendada",
	COMPLETADA: "completada",
	CANCELADA: "cancelada",
	NO_ASISTIO: "no asistió"
};
var CRM_STATUS_VALUES = Object.values(CRM_STATUS);
var googleCRMLeadSchema = z.object({
	id: z.string().min(1),
	createdAt: z.string().datetime(),
	name: z.string().min(1),
	phone: z.string().min(6).max(20),
	email: z.string().email(),
	treatment: z.string().min(1),
	message: z.string().optional(),
	urgency: z.enum([
		"low",
		"media",
		"high"
	]).optional(),
	preferredDate: z.string().optional(),
	status: z.enum(CRM_STATUS_VALUES),
	source: z.string().optional(),
	aiSummary: z.string().optional(),
	calendarEventId: z.string().optional(),
	emailSent: z.boolean()
});
var googleCalendarAppointmentSchema = z.object({
	name: z.string().min(1),
	email: z.string().email().optional(),
	phone: z.string().min(6).max(20),
	service: z.string().min(1),
	date: z.string().min(1),
	time: z.string().min(1),
	notes: z.string().optional()
});
var googleDentalConfirmationSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	phone: z.string().min(6).max(20),
	service: z.string().min(1),
	date: z.string().min(1),
	time: z.string().min(1),
	eventLink: z.string().url(),
	notes: z.string().optional()
});
z.object({
	name: z.string().min(2, "Ingresa tu nombre."),
	email: z.string().email("Ingresa un correo válido."),
	phone: z.string().min(8, "Ingresa un teléfono válido.").max(20, "Teléfono demasiado largo."),
	service: z.string().min(1, "Describe el tratamiento que buscas."),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida."),
	time: z.string().regex(/^\d{2}:\d{2}$/, "Selecciona una hora válida."),
	notes: z.string().optional(),
	source: z.string().optional()
});
//#endregion
//#region src/server/google/auth.ts
function getGoogleAuth$1() {
	const config = getServerConfig();
	const auth = new google.auth.OAuth2({
		clientId: config.googleClientId,
		clientSecret: config.googleClientSecret,
		redirectUri: config.googleRedirectUri
	});
	if (!config.googleRefreshToken) throw new Error("Missing GOOGLE_REFRESH_TOKEN. This endpoint requires a refresh token to authenticate with Google.");
	auth.setCredentials({ refresh_token: config.googleRefreshToken });
	return auth;
}
//#endregion
//#region src/server/google/crm.ts
var CRM_COLUMNS = [
	"ID",
	"Fecha",
	"Nombre",
	"Teléfono",
	"Email",
	"Tratamiento",
	"Mensaje",
	"Urgencia",
	"Fecha Preferida",
	"Estado",
	"Fuente",
	"Resumen IA",
	"Evento Calendar ID",
	"Email Enviado"
];
function leadToCRMRow(lead) {
	return [
		lead.id,
		lead.createdAt,
		lead.name,
		lead.phone,
		lead.email,
		lead.treatment,
		lead.message,
		lead.urgency,
		lead.preferredDate,
		lead.status,
		lead.source,
		lead.aiSummary,
		lead.calendarEventId,
		lead.emailSent ? "TRUE" : "FALSE"
	];
}
function isCRMHeaderRow(row) {
	return row.length === CRM_COLUMNS.length && CRM_COLUMNS.every((column, index) => row[index] === column);
}
var LEGACY_CRM_STATUS_MAP = {
	nuevo: "nuevo",
	new: "nuevo",
	agendada: "agendada",
	scheduled: "agendada",
	completada: "completada",
	closed: "completada",
	contacted: "nuevo",
	cancelada: "cancelada",
	cancelled: "cancelada",
	"no asistió": "no asistió",
	"no asistio": "no asistió",
	"no-show": "no asistió",
	"no show": "no asistió",
	no_show: "no asistió"
};
function normalizeCRMStatus(raw) {
	return LEGACY_CRM_STATUS_MAP[raw?.toString().trim().toLowerCase() ?? ""] ?? "nuevo";
}
var googleCRMLeadWriteInputSchema = googleCRMLeadSchema.omit({
	id: true,
	createdAt: true,
	status: true,
	aiSummary: true,
	calendarEventId: true,
	emailSent: true,
	urgency: true
}).extend({
	id: z.string().min(1).optional(),
	createdAt: z.string().datetime().optional(),
	treatment: z.string().min(1).optional(),
	status: z.enum(CRM_STATUS_VALUES).optional(),
	source: z.string().optional(),
	aiSummary: z.string().optional(),
	calendarEventId: z.string().optional(),
	emailSent: z.boolean().optional(),
	urgency: z.enum([
		"low",
		"media",
		"high"
	]).optional(),
	service: z.string().min(1).optional(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida").optional(),
	time: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida").optional(),
	notes: z.string().optional(),
	message: z.string().optional(),
	preferredDate: z.string().optional()
}).superRefine((data, ctx) => {
	if (!data.treatment && !data.service) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "Se requiere un tratamiento o servicio."
	});
});
function getSheets$4() {
	return google.sheets({
		version: "v4",
		auth: getGoogleAuth$1()
	});
}
async function appendLeadToSheet(input) {
	const config = getServerConfig();
	const sheets = getSheets$4();
	const payload = googleCRMLeadWriteInputSchema.parse(input);
	const treatment = payload.treatment ?? payload.service ?? "";
	const row = {
		id: payload.id ?? `dental_${Date.now()}`,
		createdAt: payload.createdAt ?? (/* @__PURE__ */ new Date()).toISOString(),
		name: payload.name,
		phone: payload.phone,
		email: payload.email,
		treatment,
		message: payload.message ?? payload.notes ?? "",
		urgency: payload.urgency ?? "media",
		preferredDate: payload.preferredDate ?? `${payload.date ?? ""} ${payload.time ?? ""}`.trim(),
		status: payload.status ? normalizeCRMStatus(payload.status) : "nuevo",
		source: payload.source ?? "web-form",
		aiSummary: payload.aiSummary ?? "",
		calendarEventId: payload.calendarEventId ?? "",
		emailSent: payload.emailSent ?? false
	};
	console.log("LEAD PAYLOAD:", payload);
	console.log("LEAD RECORD:", row);
	const range = `${config.googleSheetName}!A:N`;
	const values = [leadToCRMRow(row)];
	await sheets.spreadsheets.values.append({
		spreadsheetId: config.googleSheetId,
		range,
		valueInputOption: "RAW",
		requestBody: { values }
	});
	return row;
}
async function updateLeadInSheet(id, update) {
	const config = getServerConfig();
	const sheets = getSheets$4();
	const idRange = `${config.googleSheetName}!A:A`;
	const rowIndex = ((await sheets.spreadsheets.values.get({
		spreadsheetId: config.googleSheetId,
		range: idRange
	})).data.values ?? []).findIndex((row) => row[0] === id);
	if (rowIndex < 0) throw new Error(`Lead con ID ${id} no encontrado para actualización.`);
	const rowNumber = rowIndex + 1;
	const existingRange = `${config.googleSheetName}!A${rowNumber}:N${rowNumber}`;
	const existingRow = (await sheets.spreadsheets.values.get({
		spreadsheetId: config.googleSheetId,
		range: existingRange
	})).data.values?.[0] ?? [];
	const currentStatus = normalizeCRMStatus(existingRow[9]?.toString());
	existingRow[10]?.toString();
	existingRow[11]?.toString();
	const currentCalendarEventId = existingRow[12]?.toString() || "";
	const currentEmailSent = existingRow[13]?.toString() === "TRUE";
	const updatedStatus = update.status ? normalizeCRMStatus(update.status) : currentStatus;
	const updatedCalendarEventId = update.calendarEventId ?? currentCalendarEventId;
	const updatedEmailSent = update.emailSent !== void 0 ? update.emailSent : currentEmailSent;
	await sheets.spreadsheets.values.batchUpdate({
		spreadsheetId: config.googleSheetId,
		requestBody: {
			valueInputOption: "RAW",
			data: [
				{
					range: `${config.googleSheetName}!J${rowNumber}`,
					values: [[updatedStatus]]
				},
				{
					range: `${config.googleSheetName}!M${rowNumber}`,
					values: [[updatedCalendarEventId]]
				},
				{
					range: `${config.googleSheetName}!N${rowNumber}`,
					values: [[updatedEmailSent ? "TRUE" : "FALSE"]]
				}
			]
		}
	});
}
async function readLeadsFromSheet$1() {
	const config = getServerConfig();
	const sheets = getSheets$4();
	const range = `${config.googleSheetName}!A:N`;
	return ((await sheets.spreadsheets.values.get({
		spreadsheetId: config.googleSheetId,
		range
	})).data.values ?? []).filter((row) => row.length >= 2 && !isCRMHeaderRow(row)).map((row, index) => {
		const [id, createdAt, name, phone, email, treatment, message, urgency, preferredDate, status, source, aiSummary, calendarEventId, emailSent] = row;
		return {
			id: id?.toString() ?? `sheet-${index + 1}`,
			createdAt: createdAt?.toString() ?? (/* @__PURE__ */ new Date()).toISOString(),
			name: name?.toString() ?? "",
			email: email?.toString() ?? "",
			phone: phone?.toString() ?? "",
			treatment: treatment?.toString() ?? "",
			status: normalizeCRMStatus(status?.toString()),
			source: source?.toString() ?? "sheet",
			preferredDate: preferredDate?.toString() ?? "",
			message: message?.toString() ?? "",
			urgency: urgency?.toString() ?? "",
			aiSummary: aiSummary?.toString() ?? "",
			calendarEventId: calendarEventId?.toString() ?? "",
			emailSent: emailSent === "TRUE"
		};
	});
}
//#endregion
//#region src/lib/utils/date-format.ts
function parseDate(value) {
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
	const trimmed = value.trim();
	if (!trimmed) return null;
	const isoDateMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (isoDateMatch) {
		const [, year, month, day] = isoDateMatch;
		const date = new Date(Number(year), Number(month) - 1, Number(day));
		return Number.isNaN(date.getTime()) ? null : date;
	}
	const isoDateTimeMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
	if (isoDateTimeMatch) {
		const [, year, month, day, hour, minute, second] = isoDateTimeMatch;
		const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second ?? "0"));
		return Number.isNaN(date.getTime()) ? null : date;
	}
	const parts = trimmed.split("/").map((part) => part.trim());
	if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
		const [day, month, year] = parts;
		const date = new Date(Number(year), Number(month) - 1, Number(day));
		return Number.isNaN(date.getTime()) ? null : date;
	}
	const fallback = new Date(trimmed);
	return Number.isNaN(fallback.getTime()) ? null : fallback;
}
function pad(value) {
	return String(value).padStart(2, "0");
}
function formatDateMX(value) {
	const date = parseDate(value);
	if (!date) return String(value);
	return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
}
//#endregion
//#region src/lib/google/google.server.ts
function escapeHtml$1(text) {
	return text.replace(/[&<>"']/g, (match) => {
		switch (match) {
			case "&": return "&amp;";
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "\"": return "&quot;";
			case "'": return "&#39;";
			default: return match;
		}
	});
}
function getGoogleAuth() {
	const config = getServerConfig();
	const auth = new google.auth.OAuth2({
		clientId: config.googleClientId,
		clientSecret: config.googleClientSecret,
		redirectUri: config.googleRedirectUri
	});
	if (!config.googleRefreshToken) throw new Error("Missing GOOGLE_REFRESH_TOKEN. This endpoint requires a refresh token to authenticate with Google.");
	auth.setCredentials({ refresh_token: config.googleRefreshToken });
	return auth;
}
function getCalendar() {
	return google.calendar({
		version: "v3",
		auth: getGoogleAuth()
	});
}
function getGmail() {
	return google.gmail({
		version: "v1",
		auth: getGoogleAuth()
	});
}
function formatDateTime(date, time) {
	return `${date}T${time}:00`;
}
function addMinutesToTime(date, time, minutes) {
	const [hoursPart, minutesPart] = time.split(":").map(Number);
	if (!Number.isFinite(hoursPart) || !Number.isFinite(minutesPart)) throw new Error("Invalid time format");
	const totalMinutes = hoursPart * 60 + minutesPart + minutes;
	const daysToAdd = Math.floor(totalMinutes / 1440);
	const adjustedMinutes = (totalMinutes % 1440 + 1440) % 1440;
	const endHours = Math.floor(adjustedMinutes / 60);
	const endMinutes = adjustedMinutes % 60;
	const [year, month, day] = date.split("-").map(Number);
	const baseDate = new Date(year, month - 1, day);
	if (Number.isNaN(baseDate.getTime())) throw new Error("Invalid date format");
	baseDate.setDate(baseDate.getDate() + daysToAdd);
	const paddedMonth = String(baseDate.getMonth() + 1).padStart(2, "0");
	const paddedDay = String(baseDate.getDate()).padStart(2, "0");
	const paddedHours = String(endHours).padStart(2, "0");
	const paddedMinutes = String(endMinutes).padStart(2, "0");
	return `${baseDate.getFullYear()}-${paddedMonth}-${paddedDay}T${paddedHours}:${paddedMinutes}:00`;
}
async function createGoogleCalendarEvent(payload) {
	const config = getServerConfig();
	const startDateTime = formatDateTime(payload.date, payload.time);
	const endDateTime = addMinutesToTime(payload.date, payload.time, 60);
	const calendarId = config.googleCalendarId || "primary";
	const event = await getCalendar().events.insert({
		calendarId,
		sendUpdates: "all",
		requestBody: {
			summary: `Cita DentalOperix: ${payload.service}`,
			description: `Reserva realizada por ${payload.name} (${payload.email})\nTeléfono: ${payload.phone}\nNotas: ${payload.notes ?? "N/A"}`,
			start: {
				dateTime: startDateTime,
				timeZone: config.googleCalendarTimeZone
			},
			end: {
				dateTime: endDateTime,
				timeZone: config.googleCalendarTimeZone
			},
			attendees: [{ email: payload.email }],
			reminders: { useDefault: true }
		}
	});
	if (!event.data || !event.data.id || !event.data.htmlLink) throw new Error("No se pudo crear el evento de Google Calendar.");
	console.log("CALENDAR EVENT:", {
		id: event.data.id,
		htmlLink: event.data.htmlLink,
		calendarId,
		start: event.data.start,
		end: event.data.end
	});
	return event.data;
}
async function sendConfirmationEmail$1(payload, eventLink) {
	const config = getServerConfig();
	const safeName = escapeHtml$1(payload.name);
	const safeService = escapeHtml$1(payload.service);
	escapeHtml$1(payload.date);
	const safeTime = escapeHtml$1(payload.time);
	const safeNotes = payload.notes ? escapeHtml$1(payload.notes) : "";
	const safeEventLink = escapeHtml$1(eventLink);
	const subject = `Confirmación de cita DentalOperix (${safeService})`;
	const html = `
    <p>Hola ${safeName},</p>
    <p>Tu cita ha sido confirmada para el <strong>${formatDateMX(payload.date)}</strong> a las <strong>${safeTime}</strong>.</p>
    <p>Servicio: <strong>${safeService}</strong></p>
    ${safeNotes ? `<p>Notas: ${safeNotes}</p>` : ""}
    <p><a href="${safeEventLink}">Ver evento en Google Calendar</a></p>
    <p>Si necesitas cambiar tu cita, responde este correo o contáctanos.</p>
    <p>Saludos,<br />Equipo DentalOperix</p>
  `;
	function encodeMimeWord(text) {
		return `=?UTF-8?B?${Buffer.from(text, "utf-8").toString("base64")}?=`;
	}
	const encodedSubject = encodeMimeWord(subject);
	const encodedHtml = Buffer.from(html, "utf-8").toString("base64");
	const messageParts = [
		`From: ${config.gmailSender}`,
		`To: ${payload.email}`,
		`Subject: ${encodedSubject}`,
		"MIME-Version: 1.0",
		"Content-Type: text/html; charset=UTF-8",
		"Content-Transfer-Encoding: base64",
		"",
		encodedHtml
	];
	const raw = Buffer.from(messageParts.join("\r\n"), "utf-8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	await getGmail().users.messages.send({
		userId: "me",
		requestBody: { raw }
	});
}
//#endregion
//#region src/lib/api/dental.server.ts
var dental_server_exports = /* @__PURE__ */ __exportAll({ processDentalLead: () => processDentalLead });
async function processDentalLead(payload) {
	const appointmentId = payload.appointmentId ?? `dental_${Date.now()}`;
	const service = payload.service?.trim() ?? "";
	const completePayload = {
		...payload,
		appointmentId,
		source: payload.source ?? "web-form",
		service
	};
	const treatment = (payload.treatment?.trim() || service).trim();
	const leadRecord = {
		id: appointmentId,
		name: completePayload.name,
		email: completePayload.email,
		phone: completePayload.phone,
		treatment,
		message: completePayload.notes,
		urgency: "media",
		preferredDate: completePayload.preferredDate ?? `${completePayload.date} ${completePayload.time}`,
		status: CRM_STATUS.NUEVO,
		source: completePayload.source,
		aiSummary: "",
		calendarEventId: "",
		emailSent: false
	};
	console.log("LEAD PAYLOAD:", {
		appointmentId: completePayload.appointmentId,
		name: completePayload.name,
		email: completePayload.email,
		phone: completePayload.phone,
		service: completePayload.service,
		treatment: completePayload.treatment,
		date: completePayload.date,
		time: completePayload.time,
		preferredDate: completePayload.preferredDate,
		notes: completePayload.notes,
		source: completePayload.source
	});
	console.log("LEAD RECORD:", leadRecord);
	await appendLeadToSheet(leadRecord);
	let event;
	let calendarEventId = "";
	let updatedStatus = CRM_STATUS.NUEVO;
	let emailSent = false;
	let calendarError;
	let emailError;
	try {
		event = await createGoogleCalendarEvent(completePayload);
		calendarEventId = event.id ?? "";
		updatedStatus = CRM_STATUS.AGENDADA;
		await updateLeadInSheet(leadRecord.id, {
			status: updatedStatus,
			calendarEventId
		});
	} catch (error) {
		console.error("Error creando evento de Google Calendar:", error);
		calendarError = error instanceof Error ? error.message : "Error desconocido al crear el evento de Google Calendar.";
	}
	try {
		await sendConfirmationEmail$1(completePayload, event?.htmlLink ?? "");
		emailSent = true;
		await updateLeadInSheet(leadRecord.id, { emailSent: true });
	} catch (error) {
		console.error("Error enviando correo Gmail:", error);
		emailError = error instanceof Error ? error.message : "Error desconocido al enviar el correo de confirmación.";
	}
	const message = calendarEventId ? emailSent ? "Tu cita fue registrada y enviamos la confirmación a tu correo." : "Tu cita fue registrada. No pudimos enviar el correo de confirmación, pero nos pondremos en contacto contigo." : "Recibimos tu solicitud. Nuestro equipo confirmará la disponibilidad contigo.";
	const responseBody = {
		appointmentId: leadRecord.id,
		status: updatedStatus === CRM_STATUS.AGENDADA ? "confirmed" : "pending",
		eventLink: event?.htmlLink ?? null,
		calendarCreated: Boolean(calendarEventId),
		emailSent,
		crmSaved: true,
		message
	};
	responseBody.calendarError = calendarError;
	responseBody.emailError = emailError;
	return responseBody;
}
//#endregion
//#region src/routes/api/leads/create.ts
async function POST$7(request) {
	const body = await request.json();
	const parseResult = googleLeadPayloadSchema$1.safeParse(body);
	if (!parseResult.success) {
		const firstIssue = parseResult.error.errors[0];
		const baseMessage = firstIssue?.message ?? "Para continuar necesito saber qué tratamiento o servicio necesitas.";
		const message = firstIssue?.path.includes("service") || firstIssue?.message.includes("Describe el tratamiento") ? "Para continuar necesito saber qué tratamiento o servicio necesitas." : baseMessage;
		return new Response(JSON.stringify({
			success: false,
			error: message
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
	}
	try {
		const result = await processDentalLead({
			...parseResult.data,
			appointmentId: `lead_${Date.now()}`
		});
		return new Response(JSON.stringify({
			success: true,
			...result
		}), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Error al procesar lead en CRM/Calendar/Gmail:", error);
		if (error instanceof z.ZodError || error instanceof Error && error.message.includes("Se requiere un tratamiento o servicio.")) return new Response(JSON.stringify({
			success: false,
			error: "Para continuar necesito saber qué tratamiento o servicio necesitas."
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const errorMessage = error instanceof Error ? error.message : "Error desconocido al procesar la solicitud.";
		return new Response(JSON.stringify({
			success: false,
			error: errorMessage
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}
//#endregion
//#region src/lib/mock/leads.ts
var mockLeads = [
	{
		id: "LD-001",
		createdAt: "2026-06-10",
		name: "Camila Ríos",
		email: "camila.rios@mail.cl",
		phone: "+56 9 8123 4567",
		treatment: "Ortodoncia",
		status: "nuevo",
		source: "web",
		preferredDate: "2026-06-18",
		notes: "Busca financiamiento para brackets invisibles."
	},
	{
		id: "LD-002",
		createdAt: "2026-06-09",
		name: "Javier Soto",
		email: "javier.soto@mail.cl",
		phone: "+56 9 7654 3210",
		treatment: "Implante dental",
		status: "agendada",
		source: "chat-widget",
		preferredDate: "2026-06-20",
		notes: "Prefiere cita por la tarde."
	},
	{
		id: "LD-003",
		createdAt: "2026-06-08",
		name: "María Pérez",
		email: "maria.perez@mail.cl",
		phone: "+56 9 9988 7766",
		treatment: "Blanqueamiento",
		status: "completada",
		source: "web",
		preferredDate: "2026-06-17",
		notes: "Quiere opciones de blanqueamiento rápido."
	},
	{
		id: "LD-004",
		createdAt: "2026-06-07",
		name: "Lucía Suárez",
		email: "lucia.suarez@mail.cl",
		phone: "+56 9 3245 7812",
		treatment: "Carillas",
		status: "nuevo",
		source: "landing",
		preferredDate: "2026-06-22",
		notes: "Interesada en carillas de porcelana."
	},
	{
		id: "LD-005",
		createdAt: "2026-06-06",
		name: "Pedro Fernández",
		email: "pedro.fernandez@mail.cl",
		phone: "+56 9 2334 5566",
		treatment: "Limpieza dental",
		status: "agendada",
		source: "web",
		preferredDate: "2026-06-15",
		notes: "Cita de control anual."
	}
];
//#endregion
//#region src/server/google/sheets.ts
async function readLeadsFromSheet() {
	return (await readLeadsFromSheet$1()).map((lead) => ({
		id: lead.id,
		createdAt: lead.createdAt.slice(0, 10),
		name: lead.name,
		email: lead.email,
		phone: lead.phone,
		treatment: lead.treatment,
		status: lead.status,
		source: lead.source,
		preferredDate: lead.preferredDate,
		notes: lead.message
	}));
}
//#endregion
//#region src/routes/api/leads/list.ts
async function GET$13(request) {
	try {
		requirePermissionOrInternalApiKey(request, "leads:read");
		const config = getServerConfig();
		if (config.nodeEnv === "production" && !config.googleRefreshToken) return new Response(JSON.stringify({
			success: false,
			error: "Leads access is restricted in production."
		}), {
			status: 403,
			headers: { "Content-Type": "application/json" }
		});
		const leads = await readLeadsFromSheet();
		if (!leads.length) throw new Error("No hay leads en la hoja de cálculo.");
		return new Response(JSON.stringify({ leads }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		console.warn("Falling back to mock leads:", error);
		return new Response(JSON.stringify({
			leads: mockLeads,
			fallback: true,
			message: "No se pudo leer Google Sheets, usando demo."
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	}
}
//#endregion
//#region src/lib/lead-scoring.ts
var PRIORITY_SERVICES = [
	"Implantes Dentales",
	"Diseño de Sonrisa",
	"Ortodoncia"
];
function normalizeText$1(value) {
	return value?.toString().trim().toLowerCase() ?? "";
}
function clampScore(value) {
	return Math.min(100, Math.max(0, Math.round(value)));
}
function calculateLeadScore(lead) {
	const reasons = [];
	const urgency = normalizeText$1(lead.urgency);
	const treatment = (lead.treatment ?? "").toString().trim();
	const status = normalizeText$1(lead.status);
	const source = normalizeText$1(lead.source);
	let score = 0;
	switch (urgency) {
		case "alta":
			score += 25;
			reasons.push("Alta urgencia");
			break;
		case "media":
			score += 15;
			reasons.push("Urgencia media");
			break;
		case "baja":
			score += 5;
			reasons.push("Urgencia baja");
			break;
		default:
			reasons.push("Urgencia no definida");
			break;
	}
	const servicePriority = PRIORITY_SERVICES.findIndex((service) => service.toLowerCase() === treatment.toLowerCase());
	if (servicePriority >= 0) {
		score += 20;
		reasons.push(`Servicio prioritario: ${PRIORITY_SERVICES[servicePriority]}`);
	} else if (treatment) {
		score += 10;
		reasons.push("Servicio detectado");
	} else reasons.push("Servicio no definido");
	switch (status) {
		case "nuevo":
			score += 20;
			reasons.push("Lead nuevo");
			break;
		case "agendada":
			score += 20;
			reasons.push("Cita agendada");
			break;
		case "completada":
			score += 10;
			reasons.push("Cita completada");
			break;
		case "cancelada":
			score -= 10;
			reasons.push("Cita cancelada");
			break;
		case "no asistió":
		case "no asistio":
		case "no-show":
		case "no_show":
			score -= 20;
			reasons.push("No asistió");
			break;
		default:
			reasons.push("Estado indefinido");
			break;
	}
	if (source) {
		score += 10;
		reasons.push("Fuente identificada");
	}
	const normalizedSourceValue = source ? Math.min(10, source.length % 10) : 0;
	score += normalizedSourceValue;
	if (normalizedSourceValue > 0) reasons.push("Historial de fuente disponible");
	const finalScore = clampScore(score);
	return {
		score: finalScore,
		category: finalScore >= 75 ? "hot" : finalScore >= 40 ? "warm" : "cold",
		reasons
	};
}
//#endregion
//#region src/lib/service-values.ts
var SERVICE_ESTIMATED_VALUE = {
	Ortodoncia: 2500,
	"Implantes Dentales": 1800,
	"Diseño de Sonrisa": 1200,
	Endodoncia: 400,
	"Blanqueamiento Dental": 250,
	"Revisión Dental": 50,
	"Odontología Preventiva": 80,
	Odontopediatría: 120,
	"Urgencias Dentales": 150
};
//#endregion
//#region src/lib/crm-metrics.ts
function parseLeadDate$1(value) {
	if (!value) return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	const isoDateMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (isoDateMatch) {
		const [, year, month, day] = isoDateMatch;
		const date = new Date(Number(year), Number(month) - 1, Number(day));
		return Number.isNaN(date.getTime()) ? null : date;
	}
	const date = new Date(trimmed);
	return Number.isNaN(date.getTime()) ? null : date;
}
function getLeadDate(row) {
	return parseLeadDate$1(row.createdAt ?? row.date);
}
function buildTrend(rows, groupFn, labelFn) {
	const grouped = /* @__PURE__ */ new Map();
	rows.forEach((row) => {
		const leadDate = getLeadDate(row);
		if (!leadDate) return;
		const groupStart = groupFn(leadDate);
		const key = groupStart.getTime();
		const existing = grouped.get(key);
		const label = labelFn(groupStart);
		if (!existing) grouped.set(key, {
			key,
			label,
			leads: 0,
			agendadas: 0,
			completadas: 0,
			canceladas: 0,
			noAsistio: 0
		});
		const entry = grouped.get(key);
		entry.leads += 1;
		if (row.status === "agendada") entry.agendadas += 1;
		if (row.status === "completada") entry.completadas += 1;
		if (row.status === "cancelada") entry.canceladas += 1;
		if (row.status === "no asistió") entry.noAsistio += 1;
	});
	return Array.from(grouped.values()).sort((a, b) => a.key - b.key).map(({ key, ...item }) => item);
}
function calculateDailyTrend(rows) {
	return buildTrend(rows, (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()), (date) => format(date, "yyyy-MM-dd"));
}
function calculateWeeklyTrend(rows) {
	return buildTrend(rows, (date) => startOfWeek(date, { weekStartsOn: 1 }), (date) => `Semana ${format(date, "yyyy-MM-dd")}`);
}
function calculateMonthlyTrend(rows) {
	return buildTrend(rows, (date) => startOfMonth(date), (date) => format(date, "yyyy-MM"));
}
function formatChangePercent(current, previous) {
	if (previous === 0) return current === 0 ? 0 : 100;
	return Number(((current - previous) / previous * 100).toFixed(1));
}
function calculatePeriodComparison(currentRows, previousRows) {
	const currentLeads = currentRows.length;
	const previousLeads = previousRows.length;
	const currentScheduled = currentRows.filter((row) => row.status === "agendada" || row.status === "completada").length;
	const previousScheduled = previousRows.filter((row) => row.status === "agendada" || row.status === "completada").length;
	const currentCompleted = currentRows.filter((row) => row.status === "completada").length;
	const previousCompleted = previousRows.filter((row) => row.status === "completada").length;
	const currentConversion = calculateConversionRate(currentRows);
	const previousConversion = calculateConversionRate(previousRows);
	const currentCanceladas = currentRows.filter((row) => row.status === "cancelada").length;
	const previousCanceladas = previousRows.filter((row) => row.status === "cancelada").length;
	return {
		leads: {
			current: currentLeads,
			previous: previousLeads,
			changePercent: formatChangePercent(currentLeads, previousLeads)
		},
		agendadas: {
			current: currentScheduled,
			previous: previousScheduled,
			changePercent: formatChangePercent(currentScheduled, previousScheduled)
		},
		completadas: {
			current: currentCompleted,
			previous: previousCompleted,
			changePercent: formatChangePercent(currentCompleted, previousCompleted)
		},
		canceladas: {
			current: currentCanceladas,
			previous: previousCanceladas,
			changePercent: formatChangePercent(currentCanceladas, previousCanceladas)
		},
		conversionRate: {
			current: currentConversion,
			previous: previousConversion,
			changePercent: formatChangePercent(currentConversion, previousConversion)
		}
	};
}
function calculateConversionRate(rows) {
	const total = rows.length;
	if (total === 0) return 0;
	const converted = rows.filter((row) => row.status === "agendada" || row.status === "completada").length;
	return Number((converted / total * 100).toFixed(1));
}
function calculateAttendanceRate(rows) {
	const scheduled = rows.filter((row) => row.status === "agendada" || row.status === "completada").length;
	if (scheduled === 0) return 0;
	const attended = rows.filter((row) => row.status === "completada").length;
	return Number((attended / scheduled * 100).toFixed(1));
}
function calculateSourcePerformance(rows) {
	const grouped = {};
	rows.forEach((row) => {
		const source = row.source ?? "unknown";
		const entry = grouped[source] ?? {
			source,
			leads: 0,
			scheduled: 0,
			completed: 0,
			conversionRate: 0
		};
		entry.leads += 1;
		if (row.status === "agendada" || row.status === "completada") entry.scheduled += 1;
		if (row.status === "completada") entry.completed += 1;
		grouped[source] = entry;
	});
	return Object.values(grouped).map((item) => ({
		...item,
		conversionRate: item.leads === 0 ? 0 : Number((item.scheduled / item.leads * 100).toFixed(1))
	}));
}
function getServiceEstimatedValue(service) {
	if (!service) return 0;
	return SERVICE_ESTIMATED_VALUE[service] ?? 0;
}
function calculateServicePerformance(rows) {
	const grouped = {};
	rows.forEach((row) => {
		const service = row.treatment || "unknown";
		const entry = grouped[service] ?? {
			service,
			leads: 0,
			scheduled: 0,
			completed: 0,
			conversionRate: 0
		};
		entry.leads += 1;
		if (row.status === "agendada" || row.status === "completada") entry.scheduled += 1;
		if (row.status === "completada") entry.completed += 1;
		grouped[service] = entry;
	});
	return Object.values(grouped).map((item) => ({
		...item,
		conversionRate: item.leads === 0 ? 0 : Number((item.scheduled / item.leads * 100).toFixed(1))
	}));
}
function calculateEstimatedPipelineValue(rows) {
	return rows.reduce((sum, row) => {
		const status = row.status?.toLowerCase();
		if (!(status !== "cancelada" && status !== "no asistió")) return sum;
		return sum + getServiceEstimatedValue(row.treatment);
	}, 0);
}
function calculateSourceConversion(rows) {
	const grouped = {};
	rows.forEach((row) => {
		const source = row.source ?? "unknown";
		const entry = grouped[source] ?? {
			source,
			leads: 0,
			scheduled: 0,
			completed: 0,
			conversionRate: 0
		};
		entry.leads += 1;
		if (row.status === "agendada" || row.status === "completada") entry.scheduled += 1;
		if (row.status === "completada") entry.completed += 1;
		grouped[source] = entry;
	});
	return Object.values(grouped).map((item) => ({
		...item,
		conversionRate: item.leads === 0 ? 0 : Number((item.scheduled / item.leads * 100).toFixed(1))
	}));
}
function calculateServiceConversion(rows) {
	const grouped = {};
	rows.forEach((row) => {
		const service = row.treatment || "unknown";
		const entry = grouped[service] ?? {
			service,
			leads: 0,
			scheduled: 0,
			completed: 0,
			conversionRate: 0,
			estimatedPipelineValue: 0
		};
		entry.leads += 1;
		if (row.status === "agendada" || row.status === "completada") entry.scheduled += 1;
		if (row.status === "completada") entry.completed += 1;
		entry.estimatedPipelineValue += getServiceEstimatedValue(row.treatment);
		grouped[service] = entry;
	});
	return Object.values(grouped).map((item) => ({
		...item,
		conversionRate: item.leads === 0 ? 0 : Number((item.scheduled / item.leads * 100).toFixed(1))
	})).sort((a, b) => b.leads - a.leads);
}
function calculateServiceTrend(rows, top = 5) {
	return calculateServiceConversion(rows).slice(0, top).map((item) => ({
		service: item.service,
		leads: item.leads
	}));
}
//#endregion
//#region src/lib/date-filters.ts
var labels = {
	today: "Hoy",
	last7days: "Últimos 7 días",
	last30days: "Últimos 30 días",
	thisMonth: "Este mes",
	previousMonth: "Mes anterior",
	all: "Todo"
};
var periodValues = [
	"today",
	"last7days",
	"last30days",
	"thisMonth",
	"previousMonth",
	"all"
];
function startOfDay(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function addDays(date, amount) {
	const next = new Date(date);
	next.setDate(next.getDate() + amount);
	return next;
}
function parseLeadDate(value) {
	if (!value) return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	const isoDateMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (isoDateMatch) {
		const [, year, month, day] = isoDateMatch;
		const date = new Date(Number(year), Number(month) - 1, Number(day));
		return Number.isNaN(date.getTime()) ? null : date;
	}
	const date = new Date(trimmed);
	return Number.isNaN(date.getTime()) ? null : date;
}
function validPeriod(value) {
	return periodValues.includes(value);
}
function getPeriodLabel(period) {
	return labels[period];
}
function getCurrentPeriodRange(period, now) {
	const today = startOfDay(now);
	let startDate;
	let endDate = today;
	switch (period) {
		case "today":
			startDate = today;
			break;
		case "last7days":
			startDate = addDays(today, -6);
			break;
		case "last30days":
			startDate = addDays(today, -29);
			break;
		case "thisMonth":
			startDate = new Date(today.getFullYear(), today.getMonth(), 1);
			break;
		case "previousMonth":
			startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
			endDate = new Date(today.getFullYear(), today.getMonth(), 0);
			break;
		default: return null;
	}
	return {
		startDate,
		endDate
	};
}
function getPreviousPeriodRange(period, now = /* @__PURE__ */ new Date()) {
	const today = startOfDay(now);
	switch (period) {
		case "today": {
			const yesterday = addDays(today, -1);
			return {
				startDate: yesterday,
				endDate: yesterday
			};
		}
		case "last7days": return {
			startDate: addDays(today, -13),
			endDate: addDays(today, -7)
		};
		case "last30days": return {
			startDate: addDays(today, -59),
			endDate: addDays(today, -30)
		};
		case "thisMonth": return {
			startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
			endDate: new Date(today.getFullYear(), today.getMonth(), 0)
		};
		case "previousMonth": return {
			startDate: new Date(today.getFullYear(), today.getMonth() - 2, 1),
			endDate: new Date(today.getFullYear(), today.getMonth() - 1, 0)
		};
		case "all": return null;
		default: return null;
	}
}
function filterLeadsByDateRange(leads, startDate, endDate) {
	return leads.filter((lead) => {
		const createdAt = parseLeadDate(lead.createdAt ?? lead.date);
		if (!createdAt) return false;
		const createdDate = startOfDay(createdAt);
		return createdDate >= startDate && createdDate <= endDate;
	});
}
function filterLeadsByPeriod(leads, period, now = /* @__PURE__ */ new Date()) {
	if (period === "all") return leads;
	const range = getCurrentPeriodRange(period, now);
	if (!range) return leads;
	return filterLeadsByDateRange(leads, range.startDate, range.endDate);
}
function normalizeDashboardPeriod(value) {
	return validPeriod(value) ? value : "all";
}
//#endregion
//#region src/routes/api/crm/metrics.ts
var KNOWN_SOURCES = [
	"chat-widget",
	"hero-button",
	"navbar-button",
	"services-page",
	"whatsapp"
];
async function GET$12(request) {
	try {
		requirePermission(request, "reports:read");
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		throw error;
	}
	const config = getServerConfig();
	if (config.nodeEnv === "production" && !config.googleRefreshToken) return new Response(JSON.stringify({
		success: false,
		error: "CRM access is restricted in production."
	}), {
		status: 403,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const leads = await readLeadsFromSheet();
		if (!leads.length) return new Response(JSON.stringify({
			success: true,
			emptyCRM: true,
			totals: {
				leads: 0,
				agendadas: 0,
				completadas: 0,
				canceladas: 0,
				noAsistio: 0
			},
			conversionRate: 0,
			attendanceRate: 0,
			pipelineValue: 0,
			averageLeadScore: 0,
			leadScoreDistribution: {
				hot: 0,
				warm: 0,
				cold: 0
			},
			sources: [],
			sourceConversions: [],
			services: [],
			serviceConversions: [],
			serviceTrend: [],
			urgency: {
				alta: 0,
				media: 0,
				baja: 0
			},
			trend: {
				daily: [],
				weekly: [],
				monthly: []
			},
			comparison: {
				leads: {
					current: 0,
					previous: 0,
					changePercent: 0
				},
				agendadas: {
					current: 0,
					previous: 0,
					changePercent: 0
				},
				completadas: {
					current: 0,
					previous: 0,
					changePercent: 0
				},
				canceladas: {
					current: 0,
					previous: 0,
					changePercent: 0
				},
				conversionRate: {
					current: 0,
					previous: 0,
					changePercent: 0
				}
			}
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		const periodParam = normalizeDashboardPeriod(new URL(request.url).searchParams.get("period"));
		const filteredLeads = filterLeadsByPeriod(leads, periodParam);
		const totals = {
			leads: filteredLeads.length,
			agendadas: filteredLeads.filter((row) => row.status === "agendada").length,
			completadas: filteredLeads.filter((row) => row.status === "completada").length,
			canceladas: filteredLeads.filter((row) => row.status === "cancelada").length,
			noAsistio: filteredLeads.filter((row) => row.status === "no asistió").length
		};
		const urgency = filteredLeads.reduce((acc, row) => {
			const level = row.urgency?.toString().toLowerCase();
			if (level === "alta") acc.alta += 1;
			else if (level === "media") acc.media += 1;
			else if (level === "baja") acc.baja += 1;
			return acc;
		}, {
			alta: 0,
			media: 0,
			baja: 0
		});
		const scoredLeads = filteredLeads.map((lead) => calculateLeadScore(lead));
		const averageLeadScore = scoredLeads.length > 0 ? Math.round(scoredLeads.reduce((sum, item) => sum + item.score, 0) / scoredLeads.length) : 0;
		const leadScoreDistribution = scoredLeads.reduce((acc, item) => {
			acc[item.category] += 1;
			return acc;
		}, {
			hot: 0,
			warm: 0,
			cold: 0
		});
		const sourcePerformance = calculateSourcePerformance(filteredLeads);
		const sources = KNOWN_SOURCES.map((source) => {
			return {
				source,
				total: sourcePerformance.find((row) => row.source === source)?.leads ?? 0
			};
		}).sort((a, b) => b.total - a.total);
		const services = calculateServicePerformance(filteredLeads).map((row) => ({
			service: row.service,
			total: row.leads
		})).sort((a, b) => b.total - a.total);
		const trend = {
			daily: calculateDailyTrend(filteredLeads),
			weekly: calculateWeeklyTrend(filteredLeads),
			monthly: calculateMonthlyTrend(filteredLeads)
		};
		const pipelineValue = calculateEstimatedPipelineValue(filteredLeads);
		const sourceConversions = calculateSourceConversion(filteredLeads);
		const serviceConversions = calculateServiceConversion(filteredLeads);
		const serviceTrend = calculateServiceTrend(filteredLeads);
		const previousRange = getPreviousPeriodRange(periodParam);
		const previousLeads = previousRange ? filterLeadsByDateRange(leads, previousRange.startDate, previousRange.endDate) : [];
		const comparison = previousRange ? calculatePeriodComparison(filteredLeads, previousLeads) : {
			leads: {
				current: 0,
				previous: 0,
				changePercent: 0
			},
			agendadas: {
				current: 0,
				previous: 0,
				changePercent: 0
			},
			completadas: {
				current: 0,
				previous: 0,
				changePercent: 0
			},
			canceladas: {
				current: 0,
				previous: 0,
				changePercent: 0
			},
			conversionRate: {
				current: 0,
				previous: 0,
				changePercent: 0
			}
		};
		return new Response(JSON.stringify({
			totals,
			conversionRate: calculateConversionRate(filteredLeads),
			attendanceRate: calculateAttendanceRate(filteredLeads),
			pipelineValue,
			averageLeadScore,
			leadScoreDistribution,
			sources,
			sourceConversions,
			services,
			serviceConversions,
			serviceTrend,
			urgency,
			trend,
			comparison
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Failed to load CRM metrics:", error);
		return new Response(JSON.stringify({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}
//#endregion
//#region src/server/google/calendar.ts
function getGoogleCalendar() {
	return google.calendar({
		version: "v3",
		auth: getGoogleAuth$1()
	});
}
async function createDentalAppointment(input) {
	const config = getServerConfig();
	const calendar = getGoogleCalendar();
	const payload = googleCalendarAppointmentSchema.parse(input);
	const startDateTime = `${payload.date}T${payload.time}:00`;
	const endDate = new Date(startDateTime);
	endDate.setMinutes(endDate.getMinutes() + 45);
	const calendarId = config.googleCalendarId || "primary";
	const event = await calendar.events.insert({
		calendarId,
		sendUpdates: "all",
		requestBody: {
			summary: `Valoración dental - ${payload.service} - ${payload.name}`,
			description: `Teléfono: ${payload.phone}\nEmail: ${payload.email ?? "N/A"}\nTratamiento: ${payload.service}\nFecha: ${formatDateMX(payload.date)}\nHora: ${payload.time}\nNotas: ${payload.notes ?? "N/A"}`,
			start: {
				dateTime: startDateTime,
				timeZone: config.googleCalendarTimeZone
			},
			end: {
				dateTime: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}T${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}:00`,
				timeZone: config.googleCalendarTimeZone
			},
			attendees: payload.email ? [{ email: payload.email }] : [],
			reminders: { useDefault: true }
		}
	});
	if (!event.data || !event.data.id) throw new Error("No se pudo crear el evento en Google Calendar.");
	console.log("CALENDAR EVENT:", {
		id: event.data.id,
		htmlLink: event.data.htmlLink,
		calendarId,
		start: event.data.start,
		end: event.data.end
	});
	return event.data;
}
var createGoogleEvent = createDentalAppointment;
//#endregion
//#region src/routes/api/calendar/create-event.ts
async function POST$6(request) {
	try {
		requireInternalApiKey(request);
		const body = await request.json();
		const parseResult = googleCalendarAppointmentSchema.safeParse(body);
		if (!parseResult.success) return new Response(JSON.stringify({
			success: false,
			errors: parseResult.error.flatten()
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const event = await createGoogleEvent(parseResult.data);
		return new Response(JSON.stringify({
			success: true,
			eventLink: event.htmlLink
		}), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		if (error instanceof UnauthorizedApiKeyError) return createUnauthorizedResponse$1();
		console.error(error);
		return new Response(JSON.stringify({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}
//#endregion
//#region src/server/google/gmail.ts
function escapeHtml(text) {
	return text.replace(/[&<>"']/g, (match) => {
		switch (match) {
			case "&": return "&amp;";
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "\"": return "&quot;";
			case "'": return "&#39;";
			default: return match;
		}
	});
}
function encodeMimeWord(text) {
	return `=?UTF-8?B?${Buffer.from(text, "utf-8").toString("base64")}?=`;
}
function buildMessage(payload, config) {
	const name = escapeHtml(payload.name);
	const service = escapeHtml(payload.service);
	const date = escapeHtml(formatDateMX(payload.date));
	const time = escapeHtml(payload.time);
	const eventLink = escapeHtml(payload.eventLink);
	const notes = payload.notes ? escapeHtml(payload.notes) : "";
	const subject = encodeMimeWord("Confirmación de solicitud - DentalOperix");
	const html = `
    <p>Hola ${name},</p>
    <p>Gracias por solicitar una valoración dental con DentalOperix.</p>
    <p><strong>Tratamiento solicitado:</strong> ${service}</p>
    <p><strong>Fecha:</strong> ${date}</p>
    <p><strong>Hora:</strong> ${time}</p>
    <p><strong>Ver detalles:</strong> <a href="${eventLink}">evento en Google Calendar</a></p>
    ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ""}
    <p>Pronto nos pondremos en contacto para confirmar disponibilidad del horario y los detalles de la cita.</p>
    <p>Si tienes alguna pregunta, puedes responder a este correo o llamarnos.</p>
    <p>Saludos,<br/>Equipo DentalOperix</p>
  `;
	const encodedHtml = Buffer.from(html, "utf-8").toString("base64");
	const messageParts = [
		`From: ${config.gmailSender}`,
		`To: ${payload.email}`,
		`Subject: ${subject}`,
		"MIME-Version: 1.0",
		"Content-Type: text/html; charset=UTF-8",
		"Content-Transfer-Encoding: base64",
		"",
		encodedHtml
	];
	return Buffer.from(messageParts.join("\r\n"), "utf-8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function buildRawEmailMessage(payload) {
	const encodedSubject = encodeMimeWord(payload.subject);
	const encodedHtml = Buffer.from(payload.html, "utf-8").toString("base64");
	const messageParts = [
		`From: ${payload.from}`,
		`To: ${payload.to}`,
		`Subject: ${encodedSubject}`,
		"MIME-Version: 1.0",
		"Content-Type: text/html; charset=UTF-8",
		"Content-Transfer-Encoding: base64",
		"",
		encodedHtml
	];
	return Buffer.from(messageParts.join("\r\n"), "utf-8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function sendDentalConfirmationEmail(input) {
	const config = getServerConfig();
	const gmail = google.gmail({
		version: "v1",
		auth: getGoogleAuth$1()
	});
	const raw = buildMessage(googleDentalConfirmationSchema.parse(input), config);
	await gmail.users.messages.send({
		userId: "me",
		requestBody: { raw }
	});
}
async function sendFollowupEmail(input) {
	const config = getServerConfig();
	const gmail = google.gmail({
		version: "v1",
		auth: getGoogleAuth$1()
	});
	const raw = buildRawEmailMessage({
		from: config.gmailSender,
		to: input.recipient,
		subject: input.subject,
		html: `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${input.body}</pre>`
	});
	await gmail.users.messages.send({
		userId: "me",
		requestBody: { raw }
	});
}
var sendConfirmationEmail = sendDentalConfirmationEmail;
//#endregion
//#region src/routes/api/gmail/send-confirmation.ts
async function POST$5(request) {
	try {
		requireInternalApiKey(request);
		const body = await request.json();
		const parseResult = googleDentalConfirmationSchema.safeParse(body);
		if (!parseResult.success) return new Response(JSON.stringify({
			success: false,
			errors: parseResult.error.flatten()
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		await sendConfirmationEmail(parseResult.data);
		return new Response(JSON.stringify({ success: true }), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		if (error instanceof UnauthorizedApiKeyError) return createUnauthorizedResponse$1();
		console.error(error);
		return new Response(JSON.stringify({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}
//#endregion
//#region src/server/google/followups.ts
var FOLLOWUP_COLUMNS = [
	"ID",
	"Fecha",
	"Lead ID",
	"Nombre",
	"Email",
	"Teléfono",
	"Tipo",
	"Estado",
	"Mensaje",
	"Fuente",
	"Ejecutado En",
	"Error"
];
function getSheets$3() {
	return google.sheets({
		version: "v4",
		auth: getGoogleAuth$1()
	});
}
function isHeaderRow$1(row) {
	return row.length >= FOLLOWUP_COLUMNS.length && FOLLOWUP_COLUMNS.every((column, index) => row[index]?.toString() === column);
}
async function ensureFollowupsSheetExists(sheets, spreadsheetId, sheetName) {
	if ((await sheets.spreadsheets.get({
		spreadsheetId,
		fields: "sheets.properties"
	})).data.sheets?.find((sheet) => sheet.properties?.title === sheetName)) return;
	await sheets.spreadsheets.batchUpdate({
		spreadsheetId,
		requestBody: { requests: [{ addSheet: { properties: { title: sheetName } } }] }
	});
	await sheets.spreadsheets.values.update({
		spreadsheetId,
		range: `${sheetName}!A1:L1`,
		valueInputOption: "RAW",
		requestBody: { values: [FOLLOWUP_COLUMNS] }
	});
}
async function readFollowupRecords() {
	const config = getServerConfig();
	const sheets = getSheets$3();
	const range = `${config.googleFollowupsSheetName}!A:L`;
	try {
		await ensureFollowupsSheetExists(sheets, config.googleSheetId, config.googleFollowupsSheetName);
		return ((await sheets.spreadsheets.values.get({
			spreadsheetId: config.googleSheetId,
			range
		})).data.values ?? []).filter((row) => !isHeaderRow$1(row)).map((row) => ({
			id: row[0]?.toString() ?? "",
			date: row[1]?.toString() ?? "",
			leadId: row[2]?.toString() ?? "",
			name: row[3]?.toString() ?? "",
			email: row[4]?.toString() ?? "",
			phone: row[5]?.toString() || void 0,
			type: row[6]?.toString() ?? "appointment_reminder",
			status: row[7]?.toString() ?? "pending",
			message: row[8]?.toString() ?? "",
			source: row[9]?.toString() || void 0,
			executedAt: row[10]?.toString() || void 0,
			error: row[11]?.toString() || void 0
		})).filter((record) => record.leadId && record.type && record.email);
	} catch (error) {
		console.error("Unable to read PatientFollowUps sheet:", error);
		return [];
	}
}
async function appendFollowupRecord(record) {
	const config = getServerConfig();
	const sheets = getSheets$3();
	try {
		await ensureFollowupsSheetExists(sheets, config.googleSheetId, config.googleFollowupsSheetName);
		await sheets.spreadsheets.values.append({
			spreadsheetId: config.googleSheetId,
			range: `${config.googleFollowupsSheetName}!A:L`,
			valueInputOption: "RAW",
			requestBody: { values: [[
				record.id,
				record.date,
				record.leadId,
				record.name,
				record.email,
				record.phone ?? "",
				record.type,
				record.status,
				record.message,
				record.source ?? "",
				record.executedAt ?? "",
				record.error ?? ""
			]] }
		});
	} catch (error) {
		console.error("Unable to append followup record to PatientFollowUps sheet:", error);
		throw error;
	}
}
//#endregion
//#region src/lib/patient-followup-engine.ts
var followupRunSchema = z.object({ dryRun: z.boolean().optional().default(true) });
function parseDateTime(value) {
	const raw = value?.trim();
	if (!raw) return void 0;
	const dateTimeMatch = raw.replace(/\//g, "-").replace(/\s+/g, " ").trim().match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}))?/);
	if (!dateTimeMatch) return void 0;
	const [, date, time] = dateTimeMatch;
	const dateTime = time ? `${date}T${time}:00` : `${date}T00:00:00`;
	const parsed = new Date(dateTime);
	return Number.isNaN(parsed.getTime()) ? void 0 : parsed;
}
function toIso(value) {
	return value.toISOString();
}
function differenceInDays(from, to) {
	return Math.floor((to.getTime() - from.getTime()) / (1e3 * 60 * 60 * 24));
}
function isDuplicateAction(existing, leadId, type, scheduledAt) {
	return existing.some((record) => {
		return record.leadId === leadId && record.type === type && record.status === "sent" && record.date === scheduledAt;
	});
}
function buildFollowupMessage(lead, type, appointmentDate) {
	const name = lead.name || "Paciente";
	const treatment = lead.treatment ? ` sobre ${lead.treatment}` : "";
	const friendlyDate = appointmentDate ? appointmentDate.toLocaleDateString("es-ES") : "próximamente";
	const friendlyTime = appointmentDate ? appointmentDate.toLocaleTimeString("es-ES", {
		hour: "2-digit",
		minute: "2-digit"
	}) : "";
	switch (type) {
		case "appointment_reminder": return `Hola ${name},\n\nTe recordamos que tienes una cita${treatment} programada para el ${friendlyDate}${friendlyTime ? ` a las ${friendlyTime}` : ""}. Si necesitas reprogramar, responde a este correo.`;
		case "attendance_confirmation": return `Hola ${name},\n\n¿Confirmas tu asistencia a la cita${treatment}${friendlyDate ? ` el ${friendlyDate}` : ""}${friendlyTime ? ` a las ${friendlyTime}` : ""}? Responde este correo para confirmar.`;
		case "cancellation_recovery": return `Hola ${name},\n\nHemos visto que tu cita fue cancelada. Si deseas reagendar o tienes dudas, estamos aquí para ayudarte. Responde este correo y coordinamos tu nueva cita.`;
		case "inactive_reactivation": return `Hola ${name},\n\nTe extrañamos en DentalOperix. Si quieres retomar tu cuidado dental o agendar una valoración, responde este correo y te apoyamos con el siguiente paso.`;
		case "no_show_recovery": return `Hola ${name},\n\nVimos que no pudiste asistir a tu cita. Si deseas reagendar o necesitas ayuda, responde este correo y te apoyamos a reactivar tu atención.`;
		case "post_appointment_followup": return `Hola ${name},\n\nGracias por visitarnos. ¿Cómo estuvo tu experiencia${treatment}? Si necesitas alguna atención adicional, responde este correo y te ayudamos.`;
		default: return `Hola ${name},\n\nTe contactamos desde DentalOperix para darle seguimiento a tu atención.`;
	}
}
function buildFollowupSubject(type) {
	switch (type) {
		case "appointment_reminder": return "Recordatorio de cita DentalOperix";
		case "attendance_confirmation": return "Confirmación de asistencia DentalOperix";
		case "cancellation_recovery": return "Recuperación de cita cancelada";
		case "inactive_reactivation": return "Te ayudamos a retomar tu atención dental";
		case "no_show_recovery": return "Recuperación de cita no asistida";
		case "post_appointment_followup": return "Seguimiento post consulta DentalOperix";
		default: return "Seguimiento DentalOperix";
	}
}
function createFollowupAction(lead, type, appointmentDate, scheduledAt) {
	const leadScore = calculateLeadScore(lead);
	return {
		leadId: lead.id,
		type,
		channel: "email",
		recipient: lead.email,
		name: lead.name,
		subject: buildFollowupSubject(type),
		message: buildFollowupMessage(lead, type, appointmentDate),
		scheduledAt: toIso(scheduledAt),
		leadScore: leadScore.score,
		leadCategory: leadScore.category
	};
}
function generateFollowupActions(leads, existingFollowups, now = /* @__PURE__ */ new Date()) {
	const actions = [];
	for (const lead of leads) {
		if (!lead.id || !lead.email) continue;
		calculateLeadScore(lead);
		const status = lead.status?.toString().toLowerCase();
		const appointmentDate = parseDateTime(lead.preferredDate) ?? parseDateTime(lead.createdAt);
		const daysSinceCreation = differenceInDays(parseDateTime(lead.createdAt) ?? /* @__PURE__ */ new Date(), now);
		const daysUntilAppointment = appointmentDate ? differenceInDays(now, appointmentDate) : void 0;
		if (status === "agendada" && appointmentDate) {
			if (daysUntilAppointment !== void 0 && daysUntilAppointment >= 0 && daysUntilAppointment <= 1) {
				const action = createFollowupAction(lead, "attendance_confirmation", appointmentDate, now);
				if (!isDuplicateAction(existingFollowups, lead.id, action.type, action.scheduledAt)) actions.push(action);
			} else if (daysUntilAppointment !== void 0 && daysUntilAppointment > 1 && daysUntilAppointment <= 3) {
				const action = createFollowupAction(lead, "appointment_reminder", appointmentDate, now);
				if (!isDuplicateAction(existingFollowups, lead.id, action.type, action.scheduledAt)) actions.push(action);
			}
		}
		if (status === "cancelada" && daysSinceCreation >= 1) {
			const action = createFollowupAction(lead, "cancellation_recovery", appointmentDate, now);
			if (!isDuplicateAction(existingFollowups, lead.id, action.type, action.scheduledAt)) actions.push(action);
		}
		if (status === "completada" && appointmentDate) {
			if (differenceInDays(appointmentDate, now) >= 2) {
				const action = createFollowupAction(lead, "post_appointment_followup", appointmentDate, now);
				if (!isDuplicateAction(existingFollowups, lead.id, action.type, action.scheduledAt)) actions.push(action);
			}
		}
		if (status === "no asistió" || status === "no asistio" || status === "no-show" || status === "no_show") {
			const action = createFollowupAction(lead, "no_show_recovery", appointmentDate, now);
			if (!isDuplicateAction(existingFollowups, lead.id, action.type, action.scheduledAt)) actions.push(action);
		}
		if (status === "nuevo" && daysSinceCreation >= 30) {
			const action = createFollowupAction(lead, "inactive_reactivation", appointmentDate, now);
			if (!isDuplicateAction(existingFollowups, lead.id, action.type, action.scheduledAt)) actions.push(action);
		}
	}
	return actions.sort((a, b) => b.leadScore - a.leadScore);
}
async function runPatientFollowups(input, now = /* @__PURE__ */ new Date()) {
	const dryRun = followupRunSchema.parse(input).dryRun;
	const leads = await readLeadsFromSheet();
	const errors = [];
	let existingFollowups = [];
	try {
		existingFollowups = await readFollowupRecords();
	} catch (error) {
		errors.push(error instanceof Error ? error.message : "Unable to read existing followups");
	}
	const actions = generateFollowupActions(leads, existingFollowups, now);
	let sent = 0;
	let skipped = 0;
	let failed = 0;
	for (const action of actions) {
		if (dryRun) {
			skipped += 1;
			continue;
		}
		const recordBase = {
			id: `${action.leadId}_${action.type}_${Date.now()}`,
			date: action.scheduledAt,
			leadId: action.leadId,
			name: action.name,
			email: action.recipient,
			type: action.type,
			status: "sent",
			message: action.message,
			source: void 0,
			executedAt: toIso(now),
			error: void 0
		};
		try {
			await sendFollowupEmail({
				recipient: action.recipient,
				subject: action.subject,
				body: action.message
			});
			sent += 1;
			try {
				await appendFollowupRecord({
					...recordBase,
					status: "sent"
				});
			} catch (appendError) {
				const appendMessage = appendError instanceof Error ? appendError.message : "Unable to persist sent followup";
				errors.push(appendMessage);
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			errors.push(errorMessage);
			failed += 1;
			try {
				await appendFollowupRecord({
					...recordBase,
					status: "failed",
					error: errorMessage
				});
			} catch (appendError) {
				const appendMessage = appendError instanceof Error ? appendError.message : "Unable to persist failed followup";
				errors.push(appendMessage);
			}
		}
	}
	return {
		dryRun,
		generated: actions.length,
		sent,
		skipped,
		failed,
		errors,
		actions
	};
}
//#endregion
//#region src/lib/logger.server.ts
var SECRET_KEY_PATTERN = /(secret|token|api[-_]?key|refresh|credential|password|authorization)/i;
function sanitizeValue(value) {
	if (Array.isArray(value)) return value.map(sanitizeValue);
	if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, SECRET_KEY_PATTERN.test(key) ? "[REDACTED]" : sanitizeValue(nestedValue)]));
	return value;
}
function sanitizeLogMetadata(metadata = {}) {
	return sanitizeValue(metadata);
}
function writeLog(level, scope, message, metadata = {}) {
	const entry = {
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		level,
		scope,
		message,
		metadata: sanitizeLogMetadata(metadata)
	};
	const serialized = JSON.stringify(entry);
	if (level === "error") console.error(serialized);
	else if (level === "warn") console.warn(serialized);
	else console.info(serialized);
}
var logger = {
	info: (scope, message, metadata) => writeLog("info", scope, message, metadata),
	warn: (scope, message, metadata) => writeLog("warn", scope, message, metadata),
	error: (scope, message, metadata) => writeLog("error", scope, message, metadata)
};
//#endregion
//#region src/server/google/automation.ts
var AUTOMATION_COLUMNS = [
	"ID",
	"Timestamp",
	"Flow",
	"Dry Run",
	"Generated",
	"Sent",
	"Skipped",
	"Failed",
	"Action Count",
	"Errors",
	"Status",
	"DurationMs",
	"ExecutedBy"
];
function getSheets$2() {
	return google.sheets({
		version: "v4",
		auth: getGoogleAuth$1()
	});
}
function isHeaderRow(row) {
	return row.length >= AUTOMATION_COLUMNS.length && AUTOMATION_COLUMNS.every((column, index) => row[index]?.toString() === column);
}
async function ensureAutomationSheetExists(sheets, spreadsheetId, sheetName) {
	if ((await sheets.spreadsheets.get({
		spreadsheetId,
		fields: "sheets.properties"
	})).data.sheets?.find((sheet) => sheet.properties?.title === sheetName)) return;
	await sheets.spreadsheets.batchUpdate({
		spreadsheetId,
		requestBody: { requests: [{ addSheet: { properties: { title: sheetName } } }] }
	});
	await sheets.spreadsheets.values.update({
		spreadsheetId,
		range: `${sheetName}!A1:M1`,
		valueInputOption: "RAW",
		requestBody: { values: [AUTOMATION_COLUMNS] }
	});
}
async function appendAutomationRunRecord(record) {
	const config = getServerConfig();
	const sheets = getSheets$2();
	await ensureAutomationSheetExists(sheets, config.googleSheetId, config.googleAutomationSheetName);
	await sheets.spreadsheets.values.append({
		spreadsheetId: config.googleSheetId,
		range: `${config.googleAutomationSheetName}!A:M`,
		valueInputOption: "RAW",
		requestBody: { values: [[
			record.id,
			record.timestamp,
			record.flow,
			record.dryRun ? "true" : "false",
			record.generated,
			record.sent,
			record.skipped,
			record.failed,
			record.actionCount,
			record.errors,
			record.status,
			record.durationMs ?? 0,
			record.executedBy ?? "system"
		]] }
	});
}
async function readAutomationRunRecords() {
	const config = getServerConfig();
	const sheets = getSheets$2();
	await ensureAutomationSheetExists(sheets, config.googleSheetId, config.googleAutomationSheetName);
	return ((await sheets.spreadsheets.values.get({
		spreadsheetId: config.googleSheetId,
		range: `${config.googleAutomationSheetName}!A:M`
	})).data.values ?? []).filter((row) => !isHeaderRow(row)).map((row) => ({
		id: row[0]?.toString() ?? "",
		timestamp: row[1]?.toString() ?? "",
		flow: row[2]?.toString() ?? "",
		dryRun: row[3]?.toString() === "true",
		generated: Number(row[4] ?? 0),
		sent: Number(row[5] ?? 0),
		skipped: Number(row[6] ?? 0),
		failed: Number(row[7] ?? 0),
		actionCount: Number(row[8] ?? 0),
		errors: row[9]?.toString() ?? "",
		status: row[10]?.toString() ?? "failure",
		durationMs: Number(row[11] ?? 0),
		executedBy: row[12]?.toString() ?? "system"
	})).filter((record) => record.id && record.timestamp && record.flow);
}
//#endregion
//#region src/routes/api/followups/run.ts
function jsonResponse$2(payload, status = 200) {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}
async function POST$4(request) {
	const startedAt = Date.now();
	let body = {};
	try {
		requirePermissionOrInternalApiKey(request, "automation:run");
		body = await request.json();
		if (body.dryRun === false && body.confirmExecution !== true) return jsonResponse$2({
			success: false,
			error: "confirmExecution is required for real followup runs."
		}, 400);
		const result = await runPatientFollowups(body);
		const status = result.failed > 0 ? "failure" : result.errors.length > 0 ? "partial" : "success";
		try {
			await appendAutomationRunRecord({
				id: `run_${Date.now()}`,
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				flow: "followups",
				dryRun: result.dryRun,
				generated: result.generated,
				sent: result.sent,
				skipped: result.skipped,
				failed: result.failed,
				actionCount: result.actions.length,
				errors: JSON.stringify(result.errors),
				status,
				durationMs: Date.now() - startedAt,
				executedBy: body.executedBy ?? "system"
			});
		} catch (auditError) {
			logger.error("followups.run", "Unable to persist followup audit record", { error: auditError instanceof Error ? auditError.message : "Unknown error" });
		}
		logger.info("followups.run", "Followup run completed", {
			dryRun: result.dryRun,
			generated: result.generated,
			sent: result.sent,
			skipped: result.skipped,
			failed: result.failed,
			status
		});
		return jsonResponse$2(result);
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		logger.error("followups.run", "Error running followups", { error: error instanceof Error ? error.message : "Unknown error" });
		try {
			await appendAutomationRunRecord({
				id: `run_${Date.now()}`,
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				flow: "followups",
				dryRun: body.dryRun !== false,
				generated: 0,
				sent: 0,
				skipped: 0,
				failed: 0,
				actionCount: 0,
				errors: JSON.stringify([error instanceof Error ? error.message : "Unknown error"]),
				status: "failure",
				durationMs: Date.now() - startedAt,
				executedBy: body.executedBy ?? "system"
			});
		} catch (auditError) {
			logger.error("followups.run", "Unable to persist failed followup audit record", { error: auditError instanceof Error ? auditError.message : "Unknown error" });
		}
		return jsonResponse$2({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}
//#endregion
//#region src/routes/api/followups/history.ts
async function GET$11(request) {
	try {
		requirePermissionOrInternalApiKey(request, "automation:read");
		const records = await readAutomationRunRecords();
		return new Response(JSON.stringify({
			success: true,
			records
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		logger.error("followups.history", "Failed to load automation history", { error: error instanceof Error ? error.message : "Unknown error" });
		return new Response(JSON.stringify({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}
//#endregion
//#region src/routes/api/admin/login.ts
async function POST$3(request) {
	try {
		const body = await request.json();
		if (!body.password || !verifyAdminPassword(body.password)) return new Response(JSON.stringify({
			success: false,
			error: "Credenciales inválidas."
		}), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		});
		const token = createAdminSessionToken();
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Set-Cookie": createAdminSessionCookie(token)
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			error: error instanceof Error ? error.message : "Error de autenticación."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}
//#endregion
//#region src/routes/api/admin/logout.ts
async function POST$2() {
	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Set-Cookie": createAdminLogoutCookie()
		}
	});
}
//#endregion
//#region src/routes/api/admin/session.ts
async function GET$10(request) {
	const session = getAuthSessionFromRequest(request);
	return new Response(JSON.stringify({
		authenticated: Boolean(session),
		role: session?.role,
		permissions: session?.permissions ?? []
	}), {
		status: session ? 200 : 401,
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/lib/goal-config.ts
var DEFAULT_GOAL_CONFIGURATION = {
	monthlyLeadsGoal: 50,
	conversionGoal: 40,
	attendanceGoal: 85,
	pipelineValueGoal: 25e3
};
var STORAGE_KEY = "dentaloperix-goals";
var GOALS_GET_ENDPOINT = "/api/goals/get";
var GOALS_SAVE_ENDPOINT = "/api/goals/save";
function getDefaultGoals() {
	return { ...DEFAULT_GOAL_CONFIGURATION };
}
function loadGoalSettingsFromLocalStorage() {
	if (typeof window === "undefined") return getDefaultGoals();
	const raw = window.localStorage.getItem(STORAGE_KEY);
	if (!raw) return getDefaultGoals();
	try {
		const parsed = JSON.parse(raw);
		const parsedSettings = {
			monthlyLeadsGoal: Number(parsed.monthlyLeadsGoal ?? DEFAULT_GOAL_CONFIGURATION.monthlyLeadsGoal),
			conversionGoal: Number(parsed.conversionGoal ?? DEFAULT_GOAL_CONFIGURATION.conversionGoal),
			attendanceGoal: Number(parsed.attendanceGoal ?? DEFAULT_GOAL_CONFIGURATION.attendanceGoal),
			pipelineValueGoal: Number(parsed.pipelineValueGoal ?? DEFAULT_GOAL_CONFIGURATION.pipelineValueGoal)
		};
		const validationErrors = validateGoalSettings(parsedSettings);
		return Object.keys(validationErrors).length === 0 ? parsedSettings : getDefaultGoals();
	} catch {
		return getDefaultGoals();
	}
}
function saveGoalSettingsToLocalStorage(settings) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
async function loadGoalSettingsFromSheet() {
	if (typeof window === "undefined") return getDefaultGoals();
	const response = await fetch(GOALS_GET_ENDPOINT, { method: "GET" });
	if (!response.ok) throw new Error(`Goals API responded with ${response.status}`);
	const payload = await response.json();
	if (!payload?.success || !payload?.goals) throw new Error(payload?.error ?? "Invalid goals response from sheet.");
	return payload.goals;
}
async function saveGoalSettingsToSheet(settings) {
	if (typeof window === "undefined") return;
	const response = await fetch(GOALS_SAVE_ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(settings)
	});
	if (!response.ok) throw new Error(`Goals API responded with ${response.status}`);
	const payload = await response.json();
	if (!payload?.success) throw new Error(payload?.error ?? "Invalid save response from sheet.");
}
async function loadGoalSettings() {
	if (typeof window === "undefined") return getDefaultGoals();
	try {
		const settings = await loadGoalSettingsFromSheet();
		saveGoalSettingsToLocalStorage(settings);
		return settings;
	} catch (error) {
		console.warn("Falling back to localStorage for goal settings:", error);
		return loadGoalSettingsFromLocalStorage();
	}
}
async function saveGoalSettings(settings) {
	if (typeof window === "undefined") return;
	try {
		await saveGoalSettingsToSheet(settings);
	} catch (error) {
		console.warn("Failed to save goals to sheet, persisting locally instead:", error);
	}
	saveGoalSettingsToLocalStorage(settings);
}
function validateGoalSettings(settings) {
	const errors = {};
	if (!Number.isFinite(settings.monthlyLeadsGoal) || settings.monthlyLeadsGoal <= 0) errors.monthlyLeadsGoal = "Ingresa una meta de leads válida mayor a 0.";
	if (!Number.isFinite(settings.conversionGoal) || settings.conversionGoal <= 0) errors.conversionGoal = "Ingresa un porcentaje de conversión válido mayor a 0.";
	if (!Number.isFinite(settings.attendanceGoal) || settings.attendanceGoal <= 0) errors.attendanceGoal = "Ingresa un porcentaje de asistencia válido mayor a 0.";
	if (!Number.isFinite(settings.pipelineValueGoal) || settings.pipelineValueGoal <= 0) errors.pipelineValueGoal = "Ingresa un valor de pipeline válido mayor a 0.";
	return errors;
}
//#endregion
//#region src/server/google/goals.ts
var GOALS_RANGE = `Goals!A:B`;
function getSheets$1() {
	return google.sheets({
		version: "v4",
		auth: getGoogleAuth$1()
	});
}
function parseGoalSettingsRows(rows) {
	const parsed = {};
	for (const row of rows) {
		if (!Array.isArray(row) || row.length < 2) continue;
		const key = row[0]?.toString().trim();
		const value = Number(row[1]);
		if (!key || Number.isNaN(value)) continue;
		if (key in DEFAULT_GOAL_CONFIGURATION) parsed[key] = value;
	}
	return {
		...DEFAULT_GOAL_CONFIGURATION,
		...parsed
	};
}
async function readGoalSettingsFromSheet() {
	const config = getServerConfig();
	return parseGoalSettingsRows((await getSheets$1().spreadsheets.values.get({
		spreadsheetId: config.googleSheetId,
		range: GOALS_RANGE
	})).data.values ?? []);
}
async function writeGoalSettingsToSheet(settings) {
	const config = getServerConfig();
	const sheets = getSheets$1();
	const values = [
		["monthlyLeadsGoal", settings.monthlyLeadsGoal.toString()],
		["conversionGoal", settings.conversionGoal.toString()],
		["attendanceGoal", settings.attendanceGoal.toString()],
		["pipelineValueGoal", settings.pipelineValueGoal.toString()]
	];
	await sheets.spreadsheets.values.update({
		spreadsheetId: config.googleSheetId,
		range: GOALS_RANGE,
		valueInputOption: "RAW",
		requestBody: { values }
	});
}
//#endregion
//#region src/routes/api/goals/get.ts
async function GET$9(request) {
	try {
		requirePermission(request, "goals:read");
		const goals = await readGoalSettingsFromSheet();
		return new Response(JSON.stringify({
			success: true,
			goals
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		console.error("Failed to load goal settings from sheet:", error);
		return new Response(JSON.stringify({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}
//#endregion
//#region src/routes/api/goals/save.ts
async function POST$1(request) {
	try {
		requirePermission(request, "goals:write");
		const settings = await request.json();
		const validationErrors = validateGoalSettings(settings);
		if (Object.keys(validationErrors).length > 0) return new Response(JSON.stringify({
			success: false,
			error: "Invalid goal settings",
			validationErrors
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		await writeGoalSettingsToSheet(settings);
		return new Response(JSON.stringify({
			success: true,
			goals: settings
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		console.error("Failed to save goal settings to sheet:", error);
		return new Response(JSON.stringify({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}
//#endregion
//#region src/lib/patients/admin-profile.ts
var PATIENT_ADMINISTRATIVE_FIELDS = [
	"name",
	"lastName",
	"phone",
	"email",
	"birthDate",
	"address",
	"emergencyContact",
	"preferredContactMethod"
];
var PATIENT_ADMINISTRATIVE_UPDATE_FIELDS = [
	"displayName",
	"firstName",
	"lastName",
	"phone",
	"email",
	"birthDate",
	"address",
	"emergencyContact",
	"preferredContactMethod"
];
var CLINICAL_PROFILE_FIELDS = [
	"diagnosis",
	"diagnóstico",
	"treatments",
	"tratamientos",
	"clinicalNotes",
	"notasClinicas",
	"notasClinicas",
	"notas clínicas",
	"odontogram",
	"odontograma",
	"radiographs",
	"radiografias",
	"radiografías",
	"medicalDocuments",
	"documentosMedicos",
	"documentos médicos",
	"treatmentPlan",
	"planTratamiento"
];
function normalizeValue$5(value) {
	return (value ?? "").trim();
}
function normalizeKey(value) {
	return value.toLowerCase().replace(/\s+/g, " ").trim();
}
function normalizePhoneDigits$1(value) {
	return normalizeValue$5(value).replace(/\D+/g, "");
}
function isValidAdministrativeEmail$1(value) {
	const normalized = normalizeValue$5(value);
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}
function isValidAdministrativePhone$1(value) {
	return normalizePhoneDigits$1(value).length >= 7;
}
function isUsableAdministrativeName(value) {
	const normalized = normalizeValue$5(value);
	if (!normalized) return false;
	if (normalized.includes("@")) return false;
	if (/^\d+$/.test(normalized.replace(/\D+/g, ""))) return false;
	return true;
}
function sanitizeAdministrativeEmail(value) {
	const normalized = normalizeValue$5(value);
	return isValidAdministrativeEmail$1(normalized) ? normalized : "";
}
function sanitizeAdministrativePhone(value) {
	const normalized = normalizeValue$5(value);
	return isValidAdministrativePhone$1(normalized) ? normalized : "";
}
function sanitizeAdministrativeName(value) {
	const normalized = normalizeValue$5(value);
	return isUsableAdministrativeName(normalized) ? normalized : "";
}
function splitDisplayName(displayName) {
	const normalized = normalizeValue$5(displayName);
	if (!normalized) return {
		firstName: "",
		lastName: ""
	};
	const parts = normalized.split(/\s+/);
	if (parts.length === 1) return {
		firstName: parts[0],
		lastName: ""
	};
	return {
		firstName: parts.slice(0, -1).join(" "),
		lastName: parts.at(-1) ?? ""
	};
}
function createPatientKey(lead) {
	const email = sanitizeAdministrativeEmail(lead.email);
	const phone = sanitizeAdministrativePhone(lead.phone);
	const phoneKey = normalizePhoneDigits$1(phone) || normalizeKey(phone);
	if (email && phoneKey) return `contact:${normalizeKey(email)}:${phoneKey}`;
	if (phoneKey) return `phone:${phoneKey}`;
	const name = sanitizeAdministrativeName(lead.name);
	if (email) {
		const fallback = normalizeValue$5(lead.id) || normalizeValue$5(lead.createdAt) || normalizeKey(name) || "sin-identificador";
		return `email-review:${normalizeKey(email)}:${fallback}`;
	}
	if (name) return `name:${normalizeKey(name)}`;
	return `lead:${normalizeValue$5(lead.id) || "sin-identificador"}`;
}
function getMissingFieldsFromAdministrativeValues(values) {
	const fieldMap = {
		name: sanitizeAdministrativeName(values.firstName),
		lastName: sanitizeAdministrativeName(values.lastName),
		phone: sanitizeAdministrativePhone(values.phone),
		email: sanitizeAdministrativeEmail(values.email),
		birthDate: normalizeValue$5(values.birthDate),
		address: normalizeValue$5(values.address),
		emergencyContact: normalizeValue$5(values.emergencyContact),
		preferredContactMethod: normalizeValue$5(values.preferredContactMethod)
	};
	return PATIENT_ADMINISTRATIVE_FIELDS.filter((field) => !normalizeValue$5(fieldMap[field]));
}
function getCompletionPercentage$1(missingFields) {
	const completed = PATIENT_ADMINISTRATIVE_FIELDS.length - missingFields.length;
	return Math.round(completed / PATIENT_ADMINISTRATIVE_FIELDS.length * 100);
}
function getAdministrativeStatus(missingFields) {
	return missingFields.length > 0 ? "incomplete" : "pending-verification";
}
function pickLatestLead(leads) {
	return [...leads].sort((a, b) => {
		const aTime = Date.parse(a.createdAt ?? a.preferredDate ?? "");
		const bTime = Date.parse(b.createdAt ?? b.preferredDate ?? "");
		return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
	})[0];
}
function applyAdministrativeProfileUpdate(profile, update) {
	const splitName = splitDisplayName(normalizeValue$5(update.displayName) || profile.displayName);
	const firstName = normalizeValue$5(update.firstName) || profile.firstName || splitName.firstName;
	const lastName = normalizeValue$5(update.lastName) || profile.lastName || splitName.lastName;
	const displayName = normalizeValue$5(update.displayName) || normalizeValue$5(`${firstName} ${lastName}`) || profile.displayName;
	const phone = normalizeValue$5(update.phone) || profile.phone;
	const email = normalizeValue$5(update.email) || profile.email;
	const birthDate = normalizeValue$5(update.birthDate) || profile.birthDate;
	const address = normalizeValue$5(update.address) || profile.address;
	const emergencyContact = normalizeValue$5(update.emergencyContact) || profile.emergencyContact;
	const preferredContactMethod = normalizeValue$5(update.preferredContactMethod) || profile.preferredContactMethod;
	const missingFields = getMissingFieldsFromAdministrativeValues({
		firstName,
		lastName,
		phone,
		email,
		birthDate,
		address,
		emergencyContact,
		preferredContactMethod
	});
	const nextStatus = missingFields.length > 0 ? "incomplete" : update.verificationStatus ?? (profile.administrativeStatus === "verified" ? "verified" : "pending-verification");
	return {
		...profile,
		displayName,
		firstName,
		lastName,
		phone,
		email,
		birthDate,
		address,
		emergencyContact,
		preferredContactMethod,
		missingFields,
		completionPercentage: getCompletionPercentage$1(missingFields),
		administrativeStatus: nextStatus,
		verifiedAt: nextStatus === "verified" ? update.verifiedAt ?? profile.verifiedAt : void 0,
		verifiedBy: nextStatus === "verified" ? update.verifiedBy ?? profile.verifiedBy : void 0,
		updatedAt: update.updatedAt ?? profile.updatedAt,
		updatedBy: update.updatedBy ?? profile.updatedBy
	};
}
function derivePatientAdministrativeProfiles(leads) {
	const grouped = /* @__PURE__ */ new Map();
	for (const lead of leads) {
		const key = createPatientKey(lead);
		grouped.set(key, [...grouped.get(key) ?? [], lead]);
	}
	return [...grouped.entries()].map(([key, patientLeads]) => {
		const latestLead = pickLatestLead(patientLeads);
		const notes = normalizeValue$5(latestLead.notes) || normalizeValue$5(latestLead.message) || normalizeValue$5(latestLead.aiSummary) || "Perfil administrativo pendiente de validación amable.";
		const displayName = sanitizeAdministrativeName(latestLead.name) || "Paciente sin nombre";
		const { firstName, lastName } = splitDisplayName(displayName);
		const phone = sanitizeAdministrativePhone(latestLead.phone) || "Teléfono no registrado";
		const email = sanitizeAdministrativeEmail(latestLead.email) || "Correo no registrado";
		const birthDate = "";
		const address = "";
		const emergencyContact = "";
		const preferredContactMethod = "";
		const missingFields = getMissingFieldsFromAdministrativeValues({
			firstName,
			lastName,
			phone,
			email,
			birthDate,
			address,
			emergencyContact,
			preferredContactMethod
		});
		return {
			id: key,
			displayName,
			firstName,
			lastName,
			phone,
			email,
			birthDate,
			address,
			emergencyContact,
			preferredContactMethod,
			treatmentInterest: normalizeValue$5(latestLead.treatment) || "Servicio por definir",
			preferredDate: normalizeValue$5(latestLead.preferredDate),
			latestStatus: normalizeValue$5(latestLead.status) || "nuevo",
			source: normalizeValue$5(latestLead.source) || "Sin canal",
			createdAt: normalizeValue$5(latestLead.createdAt),
			notes,
			sourceLeadIds: patientLeads.map((lead) => normalizeValue$5(lead.id) || "Sin folio"),
			missingFields,
			completionPercentage: getCompletionPercentage$1(missingFields),
			administrativeStatus: getAdministrativeStatus(missingFields)
		};
	}).sort((a, b) => a.displayName.localeCompare(b.displayName, "es"));
}
//#endregion
//#region src/server/patients/api-validation.ts
var administrativeUpdateSchema = z.object({
	displayName: z.string().trim().min(1).max(160).optional(),
	firstName: z.string().trim().min(1).max(100).optional(),
	lastName: z.string().trim().min(1).max(120).optional(),
	phone: z.string().trim().min(6).max(30).optional(),
	email: z.string().trim().email().max(180).optional(),
	birthDate: z.string().trim().max(40).optional(),
	address: z.string().trim().max(280).optional(),
	emergencyContact: z.string().trim().max(180).optional(),
	preferredContactMethod: z.string().trim().max(80).optional()
}).strict();
var InvalidPatientPayloadError = class extends Error {};
function getPayloadKeys$1(payload) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
	return Object.keys(payload);
}
function parseAdministrativeProfileUpdate(payload) {
	const keys = getPayloadKeys$1(payload);
	const clinicalFields = keys.filter((key) => CLINICAL_PROFILE_FIELDS.some((field) => field.toLowerCase() === key.toLowerCase()));
	if (clinicalFields.length > 0) throw new InvalidPatientPayloadError(`El perfil administrativo no acepta campos clínicos: ${clinicalFields.join(", ")}.`);
	const invalidFields = keys.filter((key) => !PATIENT_ADMINISTRATIVE_UPDATE_FIELDS.includes(key));
	if (invalidFields.length > 0) throw new InvalidPatientPayloadError(`Campos administrativos no permitidos: ${invalidFields.join(", ")}.`);
	const result = administrativeUpdateSchema.safeParse(payload);
	if (!result.success) throw new InvalidPatientPayloadError(result.error.issues.map((issue) => issue.message).join(" "));
	if (Object.keys(result.data).length === 0) throw new InvalidPatientPayloadError("No se enviaron campos administrativos para actualizar.");
	return result.data;
}
function getPatientIdFromPath(request, suffix = "") {
	const pathname = new URL(request.url).pathname;
	if (!pathname.startsWith("/api/patients/")) return "";
	const raw = pathname.slice(14, suffix ? -suffix.length : void 0);
	return decodeURIComponent(raw.replace(/\/$/, ""));
}
function jsonResponse$1(payload, status = 200) {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/server/leads/operations-repository.ts
var LeadNotFoundError = class extends Error {};
var STORE_PATH$2 = resolve(process.cwd(), ".data/lead-operations.json");
async function readStore$2() {
	try {
		const raw = await readFile(STORE_PATH$2, "utf8");
		return JSON.parse(raw);
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return {};
		throw error;
	}
}
async function writeStore$2(store) {
	await mkdir(dirname(STORE_PATH$2), { recursive: true });
	await writeFile(STORE_PATH$2, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}
async function readBaseLeads() {
	try {
		const config = getServerConfig();
		if (config.nodeEnv === "production" && !config.googleRefreshToken) throw new Error("Lead operations access is restricted in production.");
		const leads = await readLeadsFromSheet();
		if (!leads.length) throw new Error("No hay leads para gestionar operativamente.");
		return leads;
	} catch (error) {
		if (getServerConfig().nodeEnv === "production") throw error;
		console.warn("Falling back to mock lead operations:", error);
		return mockLeads;
	}
}
function deriveOperationalStatus(lead) {
	const normalized = (lead.status ?? "").toLowerCase().trim();
	if (normalized === "cancelada" || normalized === "no asistió" || normalized === "no asistio") return "seguimiento";
	if (normalized === "agendada" || normalized === "completada") return "contactado";
	return "nuevo";
}
function mergeLeadOperations(lead, stored) {
	const fallbackUpdatedAt = lead.createdAt || "";
	return {
		leadId: lead.id,
		lead,
		operationalStatus: stored?.operationalStatus ?? deriveOperationalStatus(lead),
		priority: stored?.priority ?? "normal",
		lastContactAt: stored?.lastContactAt ?? "",
		nextFollowUpAt: stored?.nextFollowUpAt ?? "",
		contactResult: stored?.contactResult ?? "",
		internalNote: stored?.internalNote ?? "",
		updatedAt: stored?.updatedAt ?? fallbackUpdatedAt,
		updatedBy: stored?.updatedBy ?? "sistema"
	};
}
async function listLeadOperationsProfiles() {
	const [leads, store] = await Promise.all([readBaseLeads(), readStore$2()]);
	return leads.map((lead) => mergeLeadOperations(lead, store[lead.id]));
}
async function getLeadOperationsProfile(id) {
	const profile = (await listLeadOperationsProfiles()).find((leadOperations) => leadOperations.leadId === id);
	if (!profile) throw new LeadNotFoundError(`Lead ${id} no encontrado.`);
	return profile;
}
async function updateLeadOperationsProfile(id, update, actor) {
	await getLeadOperationsProfile(id);
	const store = await readStore$2();
	const updatedAt = (/* @__PURE__ */ new Date()).toISOString();
	const updatedBy = actor.email ?? actor.userId ?? actor.role;
	store[id] = {
		...store[id] ?? {},
		...update,
		updatedAt,
		updatedBy
	};
	await writeStore$2(store);
	return getLeadOperationsProfile(id);
}
//#endregion
//#region src/server/patients/admin-repository.ts
var PatientNotFoundError = class extends Error {};
var STORE_PATH$1 = resolve(process.cwd(), ".data/patient-administrative-profiles.json");
async function readStore$1() {
	try {
		const raw = await readFile(STORE_PATH$1, "utf8");
		return JSON.parse(raw);
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return {};
		throw error;
	}
}
async function writeStore$1(store) {
	await mkdir(dirname(STORE_PATH$1), { recursive: true });
	await writeFile(STORE_PATH$1, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}
async function readBaseProfiles() {
	try {
		const config = getServerConfig();
		if (config.nodeEnv === "production" && !config.googleRefreshToken) throw new Error("Patient access is restricted in production.");
		const leads = await readLeadsFromSheet();
		if (!leads.length) throw new Error("No hay leads para derivar pacientes.");
		return derivePatientAdministrativeProfiles(leads);
	} catch (error) {
		if (getServerConfig().nodeEnv === "production") throw error;
		console.warn("Falling back to mock patient administrative profiles:", error);
		return derivePatientAdministrativeProfiles(mockLeads);
	}
}
function mergeStoredProfile(profile, stored) {
	if (!stored) return profile;
	return applyAdministrativeProfileUpdate(profile, stored);
}
async function listPatientAdministrativeProfiles() {
	const [baseProfiles, store] = await Promise.all([readBaseProfiles(), readStore$1()]);
	return baseProfiles.map((profile) => mergeStoredProfile(profile, store[profile.id]));
}
async function getPatientAdministrativeProfile(id) {
	const profile = (await listPatientAdministrativeProfiles()).find((patient) => patient.id === id);
	if (!profile) throw new PatientNotFoundError(`Paciente ${id} no encontrado.`);
	return profile;
}
async function updatePatientAdministrativeProfile(id, update, actor) {
	await getPatientAdministrativeProfile(id);
	const store = await readStore$1();
	const updatedAt = (/* @__PURE__ */ new Date()).toISOString();
	const updatedBy = actor.email ?? actor.userId ?? actor.role;
	store[id] = {
		...store[id] ?? {},
		...update,
		updatedAt,
		updatedBy
	};
	await writeStore$1(store);
	return getPatientAdministrativeProfile(id);
}
async function verifyPatientAdministrativeProfile(id, actor) {
	await getPatientAdministrativeProfile(id);
	const store = await readStore$1();
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	const verifier = actor.email ?? actor.userId ?? actor.role;
	store[id] = {
		...store[id] ?? {},
		verificationStatus: "verified",
		verifiedAt: timestamp,
		verifiedBy: verifier,
		updatedAt: timestamp,
		updatedBy: verifier
	};
	await writeStore$1(store);
	return getPatientAdministrativeProfile(id);
}
//#endregion
//#region src/server/read-models/patient-read-adapter.ts
function normalizeValue$4(value) {
	return (value ?? "").trim();
}
function normalizePhoneDigits(value) {
	return normalizeValue$4(value).replace(/\D+/g, "");
}
function isValidAdministrativeEmail(value) {
	const normalized = normalizeValue$4(value);
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}
function isValidAdministrativePhone(value) {
	return normalizePhoneDigits(value).length >= 7;
}
function getMissingFields(values) {
	const missing = [];
	if (!values.firstName) missing.push("name");
	if (!values.lastName) missing.push("lastName");
	if (!isValidAdministrativePhone(values.phone)) missing.push("phone");
	if (!isValidAdministrativeEmail(values.email)) missing.push("email");
	if (!values.birthDate) missing.push("birthDate");
	if (!values.address) missing.push("address");
	if (!values.emergencyContact) missing.push("emergencyContact");
	if (!values.preferredContactMethod) missing.push("preferredContactMethod");
	return missing;
}
function getCompletionPercentage(missingFields) {
	return Math.round((8 - missingFields.length) / 8 * 100);
}
function normalizeAdministrativeStatus(value, missingFields) {
	const normalized = normalizeValue$4(value).toLowerCase();
	if (missingFields.length > 0) return "incomplete";
	if (normalized === "verified" || normalized === "verificado") return "verified";
	return "pending-verification";
}
function findPrimaryContact(contacts, patientId, type) {
	const matching = contacts.filter((contact) => contact.patientId === patientId && contact.contactType.trim().toLowerCase() === type);
	return matching.find((contact) => contact.isPrimary)?.contactValue ?? matching[0]?.contactValue ?? "";
}
function findProfile(profiles, patientId) {
	return profiles.find((profile) => profile.patientId === patientId);
}
function findLatestTreatment(treatmentInterests, patientId) {
	return [...treatmentInterests.filter((interest) => interest.patientId === patientId)].sort((a, b) => {
		const aTime = Date.parse(a.updatedAt || a.createdAt || "");
		const bTime = Date.parse(b.updatedAt || b.createdAt || "");
		return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
	})[0];
}
function sourceLeadIdsForPatient(crmFolios, patientId) {
	const ids = crmFolios.filter((folio) => folio.patientId === patientId).map((folio) => normalizeValue$4(folio.leadId) || normalizeValue$4(folio.folio)).filter(Boolean);
	return ids.length ? ids : [patientId];
}
function getEmergencyContact(profile) {
	return [normalizeValue$4(profile?.emergencyContactName), normalizeValue$4(profile?.emergencyContactPhone)].filter(Boolean).join(" · ");
}
function mapReadModelPatient(patient, models) {
	const profile = findProfile(models.administrativeProfiles, patient.patientId);
	const treatment = findLatestTreatment(models.treatmentInterests, patient.patientId);
	const phone = findPrimaryContact(models.contacts, patient.patientId, "phone");
	const email = findPrimaryContact(models.contacts, patient.patientId, "email");
	const birthDate = normalizeValue$4(patient.dateOfBirth);
	const address = normalizeValue$4(profile?.address);
	const emergencyContact = getEmergencyContact(profile);
	const preferredContactMethod = normalizeValue$4(profile?.preferredContactMethod);
	const missingFields = getMissingFields({
		firstName: normalizeValue$4(patient.firstName),
		lastName: normalizeValue$4(patient.lastName),
		phone,
		email,
		birthDate,
		address,
		emergencyContact,
		preferredContactMethod
	});
	const administrativeStatus = normalizeAdministrativeStatus(profile?.verificationStatus || patient.administrativeStatus, missingFields);
	return {
		id: patient.patientId,
		displayName: normalizeValue$4(patient.displayName) || "Paciente sin nombre",
		firstName: normalizeValue$4(patient.firstName),
		lastName: normalizeValue$4(patient.lastName),
		phone: normalizeValue$4(phone) || "Teléfono no registrado",
		email: normalizeValue$4(email) || "Correo no registrado",
		birthDate,
		address,
		emergencyContact,
		preferredContactMethod,
		treatmentInterest: normalizeValue$4(treatment?.serviceName) || "Servicio por definir",
		preferredDate: "",
		latestStatus: normalizeValue$4(treatment?.status) || "nuevo",
		source: normalizeValue$4(patient.source) || "read-model",
		createdAt: normalizeValue$4(patient.createdAt),
		notes: normalizeValue$4(profile?.notes) || normalizeValue$4(patient.notes) || "Perfil administrativo construido desde read model.",
		sourceLeadIds: sourceLeadIdsForPatient(models.crmFolios, patient.patientId),
		missingFields,
		completionPercentage: getCompletionPercentage(missingFields),
		administrativeStatus,
		verifiedAt: administrativeStatus === "verified" ? normalizeValue$4(profile?.verifiedAt) : void 0,
		verifiedBy: administrativeStatus === "verified" ? normalizeValue$4(profile?.verifiedBy) : void 0,
		updatedAt: normalizeValue$4(profile?.updatedAt) || normalizeValue$4(patient.updatedAt) || void 0
	};
}
function buildPatientAdministrativeProfilesFromReadModels(models) {
	return models.patients.map((patient) => mapReadModelPatient(patient, models)).sort((a, b) => a.displayName.localeCompare(b.displayName, "es"));
}
//#endregion
//#region src/server/read-models/patient-identifier-read-adapter.ts
var DOCUMENT_PRIORITY = {
	CID: 1,
	PASSPORT: 2,
	FOREIGN_ID: 3,
	"TMP-PAT": 4
};
function normalizeIdentifierValue(value) {
	return (value ?? "").trim();
}
function normalizeIdentityType(value) {
	const normalized = normalizeIdentifierValue(value).toUpperCase().replace(/[\s_-]+/g, "_");
	if ([
		"CID",
		"CEDULA",
		"CÉDULA",
		"CEDULA_PANAMA",
		"PANAMA_CID"
	].includes(normalized)) return "CID";
	if (["PASSPORT", "PASAPORTE"].includes(normalized)) return "PASSPORT";
	if ([
		"FOREIGN_ID",
		"FOREIGNID",
		"EXTRANJERO",
		"ID_EXTRANJERO"
	].includes(normalized)) return "FOREIGN_ID";
	if ([
		"TMP_PAT",
		"TMP-PAT",
		"TEMPORARY",
		"TEMPORAL"
	].includes(normalized)) return "TMP-PAT";
	return null;
}
function createTemporaryIdentity(patientId) {
	return {
		patientId,
		documentType: "TMP-PAT",
		documentValue: `TMP-PAT-${patientId}`,
		priority: DOCUMENT_PRIORITY["TMP-PAT"],
		isTemporary: true
	};
}
function sortIdentifiersByPriority(left, right) {
	const leftType = normalizeIdentityType(left.identifierType) ?? "TMP-PAT";
	const rightType = normalizeIdentityType(right.identifierType) ?? "TMP-PAT";
	const priorityDelta = DOCUMENT_PRIORITY[leftType] - DOCUMENT_PRIORITY[rightType];
	if (priorityDelta !== 0) return priorityDelta;
	if (left.isPrimary !== right.isPrimary) return left.isPrimary ? -1 : 1;
	const leftTime = Date.parse(left.updatedAt || left.createdAt || "");
	const rightTime = Date.parse(right.updatedAt || right.createdAt || "");
	return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
}
function resolvePatientIdentity(patientId, identifiers) {
	const selectedIdentifier = [...identifiers.filter((identifier) => identifier.patientId === patientId && normalizeIdentifierValue(identifier.identifierValue) && normalizeIdentityType(identifier.identifierType))].sort(sortIdentifiersByPriority)[0];
	const documentType = normalizeIdentityType(selectedIdentifier?.identifierType);
	if (!selectedIdentifier || !documentType) return createTemporaryIdentity(patientId);
	return {
		patientId,
		documentType,
		documentValue: normalizeIdentifierValue(selectedIdentifier.identifierValue),
		sourceIdentifierId: normalizeIdentifierValue(selectedIdentifier.identifierId) || void 0,
		priority: DOCUMENT_PRIORITY[documentType],
		isTemporary: documentType === "TMP-PAT"
	};
}
function findDuplicateResolvedIdentities(identities) {
	const explicitIdentities = identities.filter((identity) => !identity.isTemporary);
	const identityKeys = /* @__PURE__ */ new Map();
	for (const identity of explicitIdentities) {
		const key = `${identity.documentType}:${identity.documentValue.toUpperCase()}`;
		identityKeys.set(key, (identityKeys.get(key) ?? 0) + 1);
	}
	return [...identityKeys.entries()].filter(([, count]) => count > 1).map(([key]) => key).sort();
}
//#endregion
//#region src/server/read-models/patient-contact-read-adapter.ts
function normalizeContactValue(value) {
	return (value ?? "").trim();
}
function contactTypeMatches(value, type) {
	return normalizeContactValue(value).toLowerCase() === type;
}
function sortContactsByPriority(left, right) {
	if (left.isPrimary !== right.isPrimary) return left.isPrimary ? -1 : 1;
	const leftTime = Date.parse(left.updatedAt || left.createdAt || "");
	const rightTime = Date.parse(right.updatedAt || right.createdAt || "");
	return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
}
function findContact(contacts, patientId, type) {
	return [...contacts].filter((contact) => contact.patientId === patientId && contactTypeMatches(contact.contactType, type) && normalizeContactValue(contact.contactValue)).sort(sortContactsByPriority)[0];
}
function resolvePatientContacts(patientId, contacts) {
	const emailContact = findContact(contacts, patientId, "email");
	const phoneContact = findContact(contacts, patientId, "phone");
	const sourceContactIds = [emailContact?.contactId, phoneContact?.contactId].map(normalizeContactValue).filter(Boolean);
	return {
		patientId,
		email: normalizeContactValue(emailContact?.contactValue),
		phone: normalizeContactValue(phoneContact?.contactValue),
		sourceContactIds,
		hasExplicitEmail: Boolean(emailContact),
		hasExplicitPhone: Boolean(phoneContact)
	};
}
//#endregion
//#region src/server/read-models/patient-administrative-profile-read-adapter.ts
function normalizeValue$3(value) {
	return (value ?? "").trim();
}
function parseTime(value) {
	const time = Date.parse(normalizeValue$3(value));
	return Number.isNaN(time) ? 0 : time;
}
function getCompletenessScore(profile) {
	return [
		profile.address,
		profile.emergencyContactName,
		profile.emergencyContactPhone,
		profile.preferredContactMethod,
		profile.verificationStatus,
		profile.verifiedAt,
		profile.verifiedBy
	].filter((value) => normalizeValue$3(value).length > 0).length;
}
function isVerified(profile) {
	const status = normalizeValue$3(profile.verificationStatus).toLowerCase();
	return status === "verified" || status === "verificado";
}
function compareAdministrativeProfiles(left, right) {
	const verifiedDelta = Number(isVerified(right)) - Number(isVerified(left));
	if (verifiedDelta !== 0) return verifiedDelta;
	const updatedDelta = parseTime(right.updatedAt) - parseTime(left.updatedAt);
	if (updatedDelta !== 0) return updatedDelta;
	const completenessDelta = getCompletenessScore(right) - getCompletenessScore(left);
	if (completenessDelta !== 0) return completenessDelta;
	return normalizeValue$3(right.profileId).localeCompare(normalizeValue$3(left.profileId), "es");
}
function resolvePatientAdministrativeProfile(patientId, profiles) {
	const profile = profiles.filter((candidate) => normalizeValue$3(candidate.patientId) === patientId).sort(compareAdministrativeProfiles)[0];
	if (!profile) return {
		patientId,
		address: "",
		emergencyContactName: "",
		emergencyContactPhone: "",
		emergencyContact: "",
		preferredContactMethod: "",
		verificationStatus: "",
		notes: "",
		hasExplicitAdministrativeProfile: false,
		isVerified: false
	};
	const emergencyContactName = normalizeValue$3(profile.emergencyContactName);
	const emergencyContactPhone = normalizeValue$3(profile.emergencyContactPhone);
	return {
		patientId,
		profileId: normalizeValue$3(profile.profileId) || void 0,
		address: normalizeValue$3(profile.address),
		emergencyContactName,
		emergencyContactPhone,
		emergencyContact: [emergencyContactName, emergencyContactPhone].filter(Boolean).join(" · "),
		preferredContactMethod: normalizeValue$3(profile.preferredContactMethod),
		verificationStatus: normalizeValue$3(profile.verificationStatus),
		verifiedAt: normalizeValue$3(profile.verifiedAt) || void 0,
		verifiedBy: normalizeValue$3(profile.verifiedBy) || void 0,
		updatedAt: normalizeValue$3(profile.updatedAt) || void 0,
		notes: normalizeValue$3(profile.notes),
		hasExplicitAdministrativeProfile: true,
		isVerified: isVerified(profile)
	};
}
//#endregion
//#region src/server/read-models/patient-aggregate-read-service.ts
function applyResolvedContactToAdministrativeProfile(profile, resolvedContact) {
	return {
		...profile,
		...resolvedContact.email ? { email: resolvedContact.email } : {},
		...resolvedContact.phone ? { phone: resolvedContact.phone } : {}
	};
}
function buildPatientAggregatesFromReadModels(models) {
	const profiles = buildPatientAdministrativeProfilesFromReadModels(models);
	const patients = profiles.map((profile) => {
		const resolvedContact = resolvePatientContacts(profile.id, models.contacts);
		const resolvedAdministrativeProfile = resolvePatientAdministrativeProfile(profile.id, models.administrativeProfiles);
		return {
			...applyResolvedContactToAdministrativeProfile(profile, resolvedContact),
			resolvedIdentity: resolvePatientIdentity(profile.id, models.identifiers),
			resolvedContact,
			resolvedAdministrativeProfile
		};
	});
	const identities = patients.map((patient) => patient.resolvedIdentity);
	return {
		patients,
		administrativeProfiles: models.contacts.length ? patients.map(({ resolvedIdentity, resolvedContact, resolvedAdministrativeProfile, ...profile }) => profile) : profiles,
		diagnostics: {
			totalPatients: patients.length,
			totalIdentifiers: models.identifiers.length,
			totalContacts: models.contacts.length,
			patientsWithExplicitIdentity: identities.filter((identity) => !identity.isTemporary).length,
			patientsWithTemporaryIdentity: identities.filter((identity) => identity.isTemporary).length,
			patientsWithExplicitEmail: patients.filter((patient) => patient.resolvedContact.hasExplicitEmail).length,
			patientsWithExplicitPhone: patients.filter((patient) => patient.resolvedContact.hasExplicitPhone).length,
			patientsWithExplicitAdministrativeProfile: patients.filter((patient) => patient.resolvedAdministrativeProfile.hasExplicitAdministrativeProfile).length,
			verifiedAdministrativeProfiles: patients.filter((patient) => patient.resolvedAdministrativeProfile.isVerified).length,
			duplicateResolvedIdentities: findDuplicateResolvedIdentities(identities)
		}
	};
}
//#endregion
//#region src/server/read-models/worksheet-read-models.ts
var READ_MODEL_SHEETS = {
	patients: "Patients",
	identifiers: "PatientIdentifiers",
	contacts: "PatientContacts",
	administrativeProfiles: "PatientAdministrativeProfiles",
	treatmentInterests: "TreatmentInterests",
	crmFolios: "CrmFolios",
	billingProfiles: "PatientBillingProfiles",
	treatmentPlans: "TreatmentPlans",
	treatmentStages: "TreatmentStages",
	clinicalOutcomes: "ClinicalOutcomes",
	automationRuns: "AutomationRuns",
	operationalKpis: "OperationalKPIs",
	workflowExecutionStatus: "WorkflowExecutionStatus",
	invoices: "Invoices",
	payments: "Payments",
	collections: "Collections",
	financialKpis: "FinancialKPIs",
	products: "Products",
	consumables: "Consumables",
	stockLevels: "StockLevels",
	warehouses: "Warehouses",
	supportCases: "SupportCases",
	supportTickets: "SupportTickets",
	resolutionMetrics: "ResolutionMetrics",
	satisfactionMetrics: "SatisfactionMetrics"
};
function getSheets() {
	return google.sheets({
		version: "v4",
		auth: getGoogleAuth$1()
	});
}
function normalizeHeader(value) {
	return value.trim().toLowerCase();
}
function toCamelCase(value) {
	return normalizeHeader(value).replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}
function toBoolean(value) {
	const normalized = (value ?? "").trim().toLowerCase();
	return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "si";
}
function normalizeRowValue(value) {
	return value?.toString().trim() ?? "";
}
function normalizeRecords(rows) {
	const header = rows[0]?.map((cell) => toCamelCase(normalizeRowValue(cell))) ?? [];
	if (!header.length) return [];
	return rows.slice(1).map((row) => {
		const record = {};
		header.forEach((column, index) => {
			if (!column) return;
			record[column] = normalizeRowValue(row[index]);
		});
		return record;
	});
}
async function readSheetRecords(sheetName) {
	const config = getServerConfig();
	const sheets = getSheets();
	try {
		const rows = (await sheets.spreadsheets.values.get({
			spreadsheetId: config.googleSheetId,
			range: `${sheetName}!A:Z`
		})).data.values ?? [];
		if (rows.length < 2) return {
			records: [],
			available: false
		};
		const records = normalizeRecords(rows).filter((record) => Object.values(record).some((value) => value.trim().length > 0));
		return {
			records,
			available: records.length > 0
		};
	} catch (error) {
		console.warn(`Read model sheet ${sheetName} is unavailable; falling back when possible.`, error);
		return {
			records: [],
			available: false
		};
	}
}
function mapPatient(record) {
	return {
		patientId: record.patientId ?? "",
		displayName: record.displayName ?? "",
		firstName: record.firstName ?? "",
		lastName: record.lastName ?? "",
		dateOfBirth: record.dateOfBirth ?? "",
		administrativeStatus: record.administrativeStatus ?? "",
		identityStatus: record.identityStatus ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapIdentifier(record) {
	return {
		identifierId: record.identifierId ?? "",
		patientId: record.patientId ?? "",
		identifierType: record.identifierType ?? "",
		identifierValue: record.identifierValue ?? "",
		country: record.country ?? "",
		isPrimary: toBoolean(record.isPrimary),
		verificationStatus: record.verificationStatus ?? "",
		issuedAt: record.issuedAt ?? "",
		expiresAt: record.expiresAt ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapContact(record) {
	return {
		contactId: record.contactId ?? "",
		patientId: record.patientId ?? "",
		contactType: record.contactType ?? "",
		contactValue: record.contactValue ?? "",
		isPrimary: toBoolean(record.isPrimary),
		verificationStatus: record.verificationStatus ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapAdministrativeProfile(record) {
	return {
		profileId: record.profileId ?? "",
		patientId: record.patientId ?? "",
		address: record.address ?? "",
		emergencyContactName: record.emergencyContactName ?? "",
		emergencyContactPhone: record.emergencyContactPhone ?? "",
		preferredContactMethod: record.preferredContactMethod ?? "",
		verificationStatus: record.verificationStatus ?? "",
		verifiedAt: record.verifiedAt ?? "",
		verifiedBy: record.verifiedBy ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapTreatmentInterest(record) {
	return {
		treatmentInterestId: record.treatmentInterestId ?? "",
		patientId: record.patientId ?? "",
		leadId: record.leadId ?? "",
		serviceSlug: record.serviceSlug ?? "",
		serviceName: record.serviceName ?? "",
		status: record.status ?? "",
		interestSource: record.interestSource ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapCrmFolio(record) {
	return {
		crmFolioId: record.crmFolioId ?? "",
		folio: record.folio ?? "",
		patientId: record.patientId ?? "",
		leadId: record.leadId ?? "",
		originSheet: record.originSheet ?? "",
		originRow: record.originRow ?? "",
		createdAt: record.createdAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapBillingProfile(record) {
	return {
		billingProfileId: record.billingProfileId ?? record.profileId ?? "",
		patientId: record.patientId ?? "",
		billingType: record.billingType ?? record.profileType ?? "",
		taxIdType: record.taxIdType ?? record.documentType ?? "",
		taxIdValue: record.taxIdValue ?? record.documentValue ?? "",
		ruc: record.ruc ?? "",
		dv: record.dv ?? "",
		legalName: record.legalName ?? record.razonSocial ?? record.businessName ?? "",
		fiscalAddress: record.fiscalAddress ?? record.direccionFiscal ?? record.address ?? "",
		billingEmail: record.billingEmail ?? record.email ?? "",
		billingPhone: record.billingPhone ?? record.phone ?? "",
		country: record.country ?? "",
		billingStatus: record.billingStatus ?? record.status ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapTreatmentPlan(record) {
	return {
		treatmentPlanId: record.treatmentPlanId ?? record.planId ?? "",
		patientId: record.patientId ?? "",
		planName: record.planName ?? record.name ?? "",
		status: record.status ?? "",
		priority: record.priority ?? "",
		startDate: record.startDate ?? "",
		targetEndDate: record.targetEndDate ?? record.endDate ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapTreatmentStage(record) {
	return {
		treatmentStageId: record.treatmentStageId ?? record.stageId ?? "",
		treatmentPlanId: record.treatmentPlanId ?? record.planId ?? "",
		patientId: record.patientId ?? "",
		stageName: record.stageName ?? record.name ?? "",
		status: record.status ?? "",
		sequence: record.sequence ?? "",
		startedAt: record.startedAt ?? record.startDate ?? "",
		completedAt: record.completedAt ?? record.completedDate ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapClinicalOutcome(record) {
	return {
		clinicalOutcomeId: record.clinicalOutcomeId ?? record.outcomeId ?? "",
		treatmentPlanId: record.treatmentPlanId ?? record.planId ?? "",
		patientId: record.patientId ?? "",
		outcomeType: record.outcomeType ?? record.type ?? "",
		status: record.status ?? "",
		outcomeValue: record.outcomeValue ?? record.value ?? "",
		recordedAt: record.recordedAt ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapAutomationRun(record) {
	return {
		automationRunId: record.automationRunId ?? record.runId ?? "",
		patientId: record.patientId ?? "",
		leadId: record.leadId ?? "",
		workflowName: record.workflowName ?? record.workflow ?? record.name ?? "",
		status: record.status ?? "",
		startedAt: record.startedAt ?? record.startDate ?? "",
		completedAt: record.completedAt ?? record.completedDate ?? "",
		durationMs: record.durationMs ?? record.duration ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapOperationalKpi(record) {
	return {
		operationalKpiId: record.operationalKpiId ?? record.kpiId ?? record.metricId ?? "",
		metricName: record.metricName ?? record.name ?? "",
		metricValue: record.metricValue ?? record.value ?? "",
		metricUnit: record.metricUnit ?? record.unit ?? "",
		periodStart: record.periodStart ?? record.startDate ?? "",
		periodEnd: record.periodEnd ?? record.endDate ?? "",
		domain: record.domain ?? "Operations",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapWorkflowExecutionStatus(record) {
	return {
		workflowExecutionStatusId: record.workflowExecutionStatusId ?? record.statusId ?? "",
		automationRunId: record.automationRunId ?? record.runId ?? "",
		workflowName: record.workflowName ?? record.workflow ?? record.name ?? "",
		status: record.status ?? "",
		currentStep: record.currentStep ?? record.step ?? "",
		lastTransitionAt: record.lastTransitionAt ?? record.updatedAt ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapInvoice(record) {
	return {
		invoiceId: record.invoiceId ?? record.id ?? "",
		patientId: record.patientId ?? "",
		invoiceNumber: record.invoiceNumber ?? record.number ?? record.folio ?? "",
		status: record.status ?? record.invoiceStatus ?? "",
		totalAmount: record.totalAmount ?? record.total ?? record.amount ?? "",
		currency: record.currency ?? "",
		issuedAt: record.issuedAt ?? record.issueDate ?? record.createdAt ?? "",
		dueAt: record.dueAt ?? record.dueDate ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapPayment(record) {
	return {
		paymentId: record.paymentId ?? record.id ?? "",
		invoiceId: record.invoiceId ?? "",
		patientId: record.patientId ?? "",
		amount: record.amount ?? record.paymentAmount ?? "",
		currency: record.currency ?? "",
		method: record.method ?? record.paymentMethod ?? "",
		status: record.status ?? record.paymentStatus ?? "",
		paidAt: record.paidAt ?? record.paymentDate ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapCollection(record) {
	return {
		collectionId: record.collectionId ?? record.id ?? "",
		invoiceId: record.invoiceId ?? "",
		patientId: record.patientId ?? "",
		status: record.status ?? record.collectionStatus ?? "",
		outstandingAmount: record.outstandingAmount ?? record.balance ?? record.amountDue ?? "",
		attempts: record.attempts ?? record.collectionAttempts ?? "",
		lastAttemptAt: record.lastAttemptAt ?? record.lastContactAt ?? record.updatedAt ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapProduct(record) {
	return {
		productId: record.productId ?? record.id ?? "",
		sku: record.sku ?? record.code ?? "",
		productName: record.productName ?? record.name ?? "",
		category: record.category ?? "",
		status: record.status ?? "",
		unit: record.unit ?? record.uom ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapConsumable(record) {
	return {
		consumableId: record.consumableId ?? record.id ?? "",
		productId: record.productId ?? "",
		consumableName: record.consumableName ?? record.name ?? "",
		category: record.category ?? "",
		status: record.status ?? "",
		unit: record.unit ?? record.uom ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapStockLevel(record) {
	return {
		stockLevelId: record.stockLevelId ?? record.id ?? "",
		productId: record.productId ?? "",
		warehouseId: record.warehouseId ?? "",
		availableQuantity: record.availableQuantity ?? record.available ?? record.quantity ?? "",
		reservedQuantity: record.reservedQuantity ?? record.reserved ?? "",
		reorderThreshold: record.reorderThreshold ?? record.threshold ?? "",
		status: record.status ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapWarehouse(record) {
	return {
		warehouseId: record.warehouseId ?? record.id ?? "",
		warehouseName: record.warehouseName ?? record.name ?? "",
		location: record.location ?? record.address ?? "",
		status: record.status ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapSupportCase(record) {
	return {
		supportCaseId: record.supportCaseId ?? record.caseId ?? record.id ?? "",
		patientId: record.patientId ?? "",
		caseStatus: record.caseStatus ?? record.status ?? "",
		casePriority: record.casePriority ?? record.priority ?? "",
		caseCategory: record.caseCategory ?? record.category ?? "",
		openedAt: record.openedAt ?? record.createdAt ?? "",
		closedAt: record.closedAt ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapSupportTicket(record) {
	return {
		supportTicketId: record.supportTicketId ?? record.ticketId ?? record.id ?? "",
		supportCaseId: record.supportCaseId ?? record.caseId ?? "",
		patientId: record.patientId ?? "",
		ticketStatus: record.ticketStatus ?? record.status ?? "",
		ticketHistory: record.ticketHistory ?? record.history ?? "",
		openedAt: record.openedAt ?? record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapResolutionMetric(record) {
	return {
		resolutionMetricId: record.resolutionMetricId ?? record.metricId ?? record.id ?? "",
		supportTicketId: record.supportTicketId ?? record.ticketId ?? "",
		firstResponseTimeMinutes: record.firstResponseTimeMinutes ?? record.firstResponseTime ?? record.firstResponse ?? "",
		resolutionTimeMinutes: record.resolutionTimeMinutes ?? record.resolutionTime ?? "",
		escalationRate: record.escalationRate ?? record.escalations ?? "",
		periodStart: record.periodStart ?? record.startDate ?? "",
		periodEnd: record.periodEnd ?? record.endDate ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapSatisfactionMetric(record) {
	return {
		satisfactionMetricId: record.satisfactionMetricId ?? record.metricId ?? record.id ?? "",
		supportTicketId: record.supportTicketId ?? record.ticketId ?? "",
		csat: record.csat ?? record.csatScore ?? "",
		nps: record.nps ?? record.npsScore ?? "",
		surveyResult: record.surveyResult ?? record.result ?? "",
		recordedAt: record.recordedAt ?? record.createdAt ?? "",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
function mapFinancialKpi(record) {
	return {
		financialKpiId: record.financialKpiId ?? record.kpiId ?? record.metricId ?? "",
		metricName: record.metricName ?? record.name ?? "",
		metricValue: record.metricValue ?? record.value ?? "",
		metricUnit: record.metricUnit ?? record.unit ?? "",
		periodStart: record.periodStart ?? record.startDate ?? "",
		periodEnd: record.periodEnd ?? record.endDate ?? "",
		domain: record.domain ?? "Finance",
		createdAt: record.createdAt ?? "",
		updatedAt: record.updatedAt ?? "",
		source: record.source ?? "read-model",
		isMock: toBoolean(record.isMock),
		notes: record.notes ?? ""
	};
}
async function readWorksheetReadModels() {
	const [patients, identifiers, contacts, administrativeProfiles, treatmentInterests, crmFolios, billingProfiles, treatmentPlans, treatmentStages, clinicalOutcomes, automationRuns, operationalKpis, workflowExecutionStatus, invoices, payments, collections, financialKpis, products, consumables, stockLevels, warehouses, supportCases, supportTickets, resolutionMetrics, satisfactionMetrics] = await Promise.all([
		readSheetRecords(READ_MODEL_SHEETS.patients),
		readSheetRecords(READ_MODEL_SHEETS.identifiers),
		readSheetRecords(READ_MODEL_SHEETS.contacts),
		readSheetRecords(READ_MODEL_SHEETS.administrativeProfiles),
		readSheetRecords(READ_MODEL_SHEETS.treatmentInterests),
		readSheetRecords(READ_MODEL_SHEETS.crmFolios),
		readSheetRecords(READ_MODEL_SHEETS.billingProfiles),
		readSheetRecords(READ_MODEL_SHEETS.treatmentPlans),
		readSheetRecords(READ_MODEL_SHEETS.treatmentStages),
		readSheetRecords(READ_MODEL_SHEETS.clinicalOutcomes),
		readSheetRecords(READ_MODEL_SHEETS.automationRuns),
		readSheetRecords(READ_MODEL_SHEETS.operationalKpis),
		readSheetRecords(READ_MODEL_SHEETS.workflowExecutionStatus),
		readSheetRecords(READ_MODEL_SHEETS.invoices),
		readSheetRecords(READ_MODEL_SHEETS.payments),
		readSheetRecords(READ_MODEL_SHEETS.collections),
		readSheetRecords(READ_MODEL_SHEETS.financialKpis),
		readSheetRecords(READ_MODEL_SHEETS.products),
		readSheetRecords(READ_MODEL_SHEETS.consumables),
		readSheetRecords(READ_MODEL_SHEETS.stockLevels),
		readSheetRecords(READ_MODEL_SHEETS.warehouses),
		readSheetRecords(READ_MODEL_SHEETS.supportCases),
		readSheetRecords(READ_MODEL_SHEETS.supportTickets),
		readSheetRecords(READ_MODEL_SHEETS.resolutionMetrics),
		readSheetRecords(READ_MODEL_SHEETS.satisfactionMetrics)
	]);
	if (!patients.available) return null;
	return {
		patients: patients.records.map(mapPatient).filter((patient) => patient.patientId),
		identifiers: identifiers.records.map(mapIdentifier).filter((identifier) => identifier.patientId),
		contacts: contacts.records.map(mapContact).filter((contact) => contact.patientId),
		administrativeProfiles: administrativeProfiles.records.map(mapAdministrativeProfile).filter((profile) => profile.patientId),
		treatmentInterests: treatmentInterests.records.map(mapTreatmentInterest).filter((interest) => interest.patientId),
		crmFolios: crmFolios.records.map(mapCrmFolio).filter((folio) => folio.patientId),
		billingProfiles: billingProfiles.records.map(mapBillingProfile).filter((profile) => profile.patientId),
		treatmentPlans: treatmentPlans.records.map(mapTreatmentPlan).filter((plan) => plan.patientId),
		treatmentStages: treatmentStages.records.map(mapTreatmentStage).filter((stage) => stage.patientId),
		clinicalOutcomes: clinicalOutcomes.records.map(mapClinicalOutcome).filter((outcome) => outcome.patientId),
		automationRuns: automationRuns.records.map(mapAutomationRun).filter((run) => run.automationRunId),
		operationalKpis: operationalKpis.records.map(mapOperationalKpi).filter((kpi) => kpi.operationalKpiId),
		workflowExecutionStatus: workflowExecutionStatus.records.map(mapWorkflowExecutionStatus).filter((status) => status.workflowExecutionStatusId || status.automationRunId),
		invoices: invoices.records.map(mapInvoice).filter((invoice) => invoice.invoiceId),
		payments: payments.records.map(mapPayment).filter((payment) => payment.paymentId),
		collections: collections.records.map(mapCollection).filter((collection) => collection.collectionId),
		financialKpis: financialKpis.records.map(mapFinancialKpi).filter((kpi) => kpi.financialKpiId),
		products: products.records.map(mapProduct).filter((product) => product.productId),
		consumables: consumables.records.map(mapConsumable).filter((consumable) => consumable.consumableId),
		stockLevels: stockLevels.records.map(mapStockLevel).filter((stockLevel) => stockLevel.stockLevelId),
		warehouses: warehouses.records.map(mapWarehouse).filter((warehouse) => warehouse.warehouseId),
		supportCases: supportCases.records.map(mapSupportCase).filter((supportCase) => supportCase.supportCaseId),
		supportTickets: supportTickets.records.map(mapSupportTicket).filter((supportTicket) => supportTicket.supportTicketId),
		resolutionMetrics: resolutionMetrics.records.map(mapResolutionMetric).filter((metric) => metric.resolutionMetricId),
		satisfactionMetrics: satisfactionMetrics.records.map(mapSatisfactionMetric).filter((metric) => metric.satisfactionMetricId)
	};
}
//#endregion
//#region src/server/read-models/crm-folio-read-adapter.ts
function normalize$24(value) {
	return (value ?? "").trim();
}
function compareByCreatedAtDesc(a, b) {
	return normalize$24(b.createdAt).localeCompare(normalize$24(a.createdAt));
}
function readCrmFoliosForPatient(patientId, folios) {
	return folios.filter((folio) => normalize$24(folio.patientId) === patientId).map((folio) => ({
		crmFolioId: folio.crmFolioId,
		folio: folio.folio,
		patientId: folio.patientId,
		...folio.leadId ? { leadId: folio.leadId } : {},
		...folio.originSheet ? { originSheet: folio.originSheet } : {},
		...folio.originRow ? { originRow: folio.originRow } : {},
		...folio.createdAt ? { createdAt: folio.createdAt } : {},
		source: folio.source,
		isMock: folio.isMock,
		...folio.notes ? { notes: folio.notes } : {}
	})).sort(compareByCreatedAtDesc);
}
//#endregion
//#region src/server/read-models/treatment-interest-read-adapter.ts
function normalize$23(value) {
	return (value ?? "").trim();
}
function compareByUpdatedAtDesc(a, b) {
	return normalize$23(b.updatedAt || b.createdAt).localeCompare(normalize$23(a.updatedAt || a.createdAt));
}
function readTreatmentInterestsForPatient(patientId, interests) {
	return interests.filter((interest) => normalize$23(interest.patientId) === patientId).map((interest) => ({
		treatmentInterestId: interest.treatmentInterestId,
		patientId: interest.patientId,
		...interest.leadId ? { leadId: interest.leadId } : {},
		serviceSlug: interest.serviceSlug,
		serviceName: interest.serviceName,
		status: interest.status,
		...interest.interestSource ? { interestSource: interest.interestSource } : {},
		...interest.createdAt ? { createdAt: interest.createdAt } : {},
		...interest.updatedAt ? { updatedAt: interest.updatedAt } : {},
		source: interest.source,
		isMock: interest.isMock,
		...interest.notes ? { notes: interest.notes } : {}
	})).sort(compareByUpdatedAtDesc);
}
//#endregion
//#region src/server/read-models/crm-read-aggregate-service.ts
function getPatientIds$2(models) {
	return new Set(models.patients.map((patient) => patient.patientId).filter(Boolean));
}
function buildCrmReadAggregatesFromReadModels(models) {
	const patientIds = getPatientIds$2(models);
	const crmAggregates = [...patientIds].map((patientId) => ({
		patientId,
		treatmentInterests: readTreatmentInterestsForPatient(patientId, models.treatmentInterests),
		crmFolios: readCrmFoliosForPatient(patientId, models.crmFolios)
	}));
	return {
		crmAggregates,
		diagnostics: {
			totalPatients: patientIds.size,
			totalTreatmentInterests: models.treatmentInterests.length,
			totalCrmFolios: models.crmFolios.length,
			patientsWithTreatmentInterests: crmAggregates.filter((aggregate) => aggregate.treatmentInterests.length > 0).length,
			patientsWithCrmFolios: crmAggregates.filter((aggregate) => aggregate.crmFolios.length > 0).length,
			orphanTreatmentInterests: models.treatmentInterests.filter((interest) => !patientIds.has(interest.patientId)).length,
			orphanCrmFolios: models.crmFolios.filter((folio) => !patientIds.has(folio.patientId)).length
		}
	};
}
//#endregion
//#region src/server/read-models/patient-billing-profile-read-adapter.ts
function normalizeValue$2(value) {
	return (value ?? "").trim();
}
function readTimestamp$17(profile) {
	const timestamp = Date.parse(profile.updatedAt || profile.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isProfileUsable(profile) {
	return Boolean(normalizeValue$2(profile.taxIdValue) || normalizeValue$2(profile.ruc) || normalizeValue$2(profile.legalName) || normalizeValue$2(profile.fiscalAddress));
}
function toBillingProfileDto(profile) {
	return {
		billingProfileId: normalizeValue$2(profile.billingProfileId),
		patientId: normalizeValue$2(profile.patientId),
		billingType: normalizeValue$2(profile.billingType),
		taxIdType: normalizeValue$2(profile.taxIdType),
		taxIdValue: normalizeValue$2(profile.taxIdValue),
		ruc: normalizeValue$2(profile.ruc),
		dv: normalizeValue$2(profile.dv),
		legalName: normalizeValue$2(profile.legalName),
		fiscalAddress: normalizeValue$2(profile.fiscalAddress),
		billingEmail: normalizeValue$2(profile.billingEmail),
		billingPhone: normalizeValue$2(profile.billingPhone),
		country: normalizeValue$2(profile.country),
		billingStatus: normalizeValue$2(profile.billingStatus),
		source: normalizeValue$2(profile.source) || "read-model",
		isMock: profile.isMock,
		notes: normalizeValue$2(profile.notes)
	};
}
function readBillingProfilesForPatient(patientId, billingProfiles) {
	return billingProfiles.filter((profile) => normalizeValue$2(profile.patientId) === patientId && isProfileUsable(profile)).sort((left, right) => readTimestamp$17(right) - readTimestamp$17(left)).map(toBillingProfileDto);
}
//#endregion
//#region src/server/read-models/billing-read-aggregate-service.ts
function normalizeValue$1(value) {
	return (value ?? "").trim();
}
function getPatientIds$1(models) {
	return new Set(models.patients.map((patient) => patient.patientId).filter(Boolean));
}
function hasFiscalIdentity(profile) {
	return Boolean(normalizeValue$1(profile.taxIdValue) || normalizeValue$1(profile.ruc) || normalizeValue$1(profile.legalName) || normalizeValue$1(profile.fiscalAddress));
}
function buildBillingReadAggregatesFromReadModels(models) {
	const patientIds = getPatientIds$1(models);
	const billingProfiles = models.billingProfiles ?? [];
	const billingAggregates = [...patientIds].map((patientId) => ({
		patientId,
		billingProfiles: readBillingProfilesForPatient(patientId, billingProfiles)
	}));
	return {
		billingAggregates,
		diagnostics: {
			totalPatients: patientIds.size,
			totalBillingProfiles: billingProfiles.length,
			patientsWithBillingProfiles: billingAggregates.filter((aggregate) => aggregate.billingProfiles.length > 0).length,
			orphanBillingProfiles: billingProfiles.filter((profile) => !patientIds.has(profile.patientId)).length,
			incompleteBillingProfiles: billingProfiles.filter((profile) => !hasFiscalIdentity(profile)).length
		}
	};
}
//#endregion
//#region src/server/read-models/read-observability-provider.ts
var sink;
var memoryEvents = [];
function now() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function emit(event) {
	memoryEvents.push(event);
	if (!sink) return;
	try {
		Promise.resolve(sink(event)).catch(() => void 0);
	} catch {}
}
var readObservabilityProvider = {
	trackRead(event) {
		emit({
			...event,
			type: "read",
			timestamp: now()
		});
	},
	trackFallback(event) {
		emit({
			...event,
			type: "fallback",
			timestamp: now()
		});
	},
	trackAggregate(event) {
		emit({
			...event,
			type: "aggregate",
			timestamp: now()
		});
	},
	trackDomain(event) {
		emit({
			...event,
			type: "domain",
			timestamp: now()
		});
	},
	setSink(nextSink) {
		sink = nextSink;
	},
	getBufferedEvents() {
		return [...memoryEvents];
	},
	clearBufferedEvents() {
		memoryEvents.length = 0;
	}
};
//#endregion
//#region src/server/read-models/clinical-outcome-read-adapter.ts
function normalize$22(value) {
	return (value ?? "").trim();
}
function readTimestamp$16(outcome) {
	const timestamp = Date.parse(outcome.recordedAt || outcome.updatedAt || outcome.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableOutcome(outcome) {
	return Boolean(normalize$22(outcome.clinicalOutcomeId) && normalize$22(outcome.patientId) && normalize$22(outcome.outcomeType));
}
function toClinicalOutcomeDto(outcome) {
	return {
		clinicalOutcomeId: normalize$22(outcome.clinicalOutcomeId),
		treatmentPlanId: normalize$22(outcome.treatmentPlanId),
		patientId: normalize$22(outcome.patientId),
		outcomeType: normalize$22(outcome.outcomeType),
		status: normalize$22(outcome.status),
		...normalize$22(outcome.outcomeValue) ? { outcomeValue: normalize$22(outcome.outcomeValue) } : {},
		...normalize$22(outcome.recordedAt) ? { recordedAt: normalize$22(outcome.recordedAt) } : {},
		source: normalize$22(outcome.source) || "read-model",
		isMock: outcome.isMock,
		...normalize$22(outcome.notes) ? { notes: normalize$22(outcome.notes) } : {}
	};
}
function readClinicalOutcomesForPatient(patientId, clinicalOutcomes) {
	return clinicalOutcomes.filter((outcome) => normalize$22(outcome.patientId) === patientId && isUsableOutcome(outcome)).sort((left, right) => readTimestamp$16(right) - readTimestamp$16(left)).map(toClinicalOutcomeDto);
}
//#endregion
//#region src/server/read-models/treatment-plan-read-adapter.ts
function normalize$21(value) {
	return (value ?? "").trim();
}
function readTimestamp$15(plan) {
	const timestamp = Date.parse(plan.updatedAt || plan.createdAt || plan.startDate || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsablePlan(plan) {
	return Boolean(normalize$21(plan.treatmentPlanId) && normalize$21(plan.patientId) && normalize$21(plan.planName));
}
function toTreatmentPlanDto(plan) {
	return {
		treatmentPlanId: normalize$21(plan.treatmentPlanId),
		patientId: normalize$21(plan.patientId),
		planName: normalize$21(plan.planName),
		status: normalize$21(plan.status),
		priority: normalize$21(plan.priority),
		...normalize$21(plan.startDate) ? { startDate: normalize$21(plan.startDate) } : {},
		...normalize$21(plan.targetEndDate) ? { targetEndDate: normalize$21(plan.targetEndDate) } : {},
		source: normalize$21(plan.source) || "read-model",
		isMock: plan.isMock,
		...normalize$21(plan.notes) ? { notes: normalize$21(plan.notes) } : {}
	};
}
function readTreatmentPlansForPatient(patientId, treatmentPlans) {
	return treatmentPlans.filter((plan) => normalize$21(plan.patientId) === patientId && isUsablePlan(plan)).sort((left, right) => readTimestamp$15(right) - readTimestamp$15(left)).map(toTreatmentPlanDto);
}
//#endregion
//#region src/server/read-models/treatment-stage-read-adapter.ts
function normalize$20(value) {
	return (value ?? "").trim();
}
function sequenceValue(stage) {
	const value = Number.parseInt(normalize$20(stage.sequence), 10);
	return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
}
function isUsableStage(stage) {
	return Boolean(normalize$20(stage.treatmentStageId) && normalize$20(stage.patientId) && normalize$20(stage.stageName));
}
function toTreatmentStageDto(stage) {
	return {
		treatmentStageId: normalize$20(stage.treatmentStageId),
		treatmentPlanId: normalize$20(stage.treatmentPlanId),
		patientId: normalize$20(stage.patientId),
		stageName: normalize$20(stage.stageName),
		status: normalize$20(stage.status),
		...normalize$20(stage.sequence) ? { sequence: normalize$20(stage.sequence) } : {},
		...normalize$20(stage.startedAt) ? { startedAt: normalize$20(stage.startedAt) } : {},
		...normalize$20(stage.completedAt) ? { completedAt: normalize$20(stage.completedAt) } : {},
		source: normalize$20(stage.source) || "read-model",
		isMock: stage.isMock,
		...normalize$20(stage.notes) ? { notes: normalize$20(stage.notes) } : {}
	};
}
function readTreatmentStagesForPatient(patientId, treatmentStages) {
	return treatmentStages.filter((stage) => normalize$20(stage.patientId) === patientId && isUsableStage(stage)).sort((left, right) => sequenceValue(left) - sequenceValue(right)).map(toTreatmentStageDto);
}
//#endregion
//#region src/server/read-models/clinical-read-aggregate-service.ts
function normalize$19(value) {
	return (value ?? "").trim();
}
function getPatientIds(models) {
	return new Set(models.patients.map((patient) => patient.patientId).filter(Boolean));
}
function buildClinicalReadAggregatesFromReadModels(models) {
	const patientIds = getPatientIds(models);
	const treatmentPlans = models.treatmentPlans ?? [];
	const treatmentStages = models.treatmentStages ?? [];
	const clinicalOutcomes = models.clinicalOutcomes ?? [];
	const clinicalAggregates = [...patientIds].map((patientId) => ({
		patientId,
		treatmentPlans: readTreatmentPlansForPatient(patientId, treatmentPlans),
		treatmentStages: readTreatmentStagesForPatient(patientId, treatmentStages),
		clinicalOutcomes: readClinicalOutcomesForPatient(patientId, clinicalOutcomes)
	}));
	return {
		clinicalAggregates,
		diagnostics: {
			totalPatients: patientIds.size,
			totalTreatmentPlans: treatmentPlans.length,
			totalTreatmentStages: treatmentStages.length,
			totalClinicalOutcomes: clinicalOutcomes.length,
			patientsWithTreatmentPlans: clinicalAggregates.filter((aggregate) => aggregate.treatmentPlans.length > 0).length,
			patientsWithTreatmentStages: clinicalAggregates.filter((aggregate) => aggregate.treatmentStages.length > 0).length,
			patientsWithClinicalOutcomes: clinicalAggregates.filter((aggregate) => aggregate.clinicalOutcomes.length > 0).length,
			orphanTreatmentPlans: treatmentPlans.filter((plan) => !patientIds.has(plan.patientId)).length,
			orphanTreatmentStages: treatmentStages.filter((stage) => !patientIds.has(stage.patientId)).length,
			orphanClinicalOutcomes: clinicalOutcomes.filter((outcome) => !patientIds.has(outcome.patientId)).length,
			incompleteTreatmentPlans: treatmentPlans.filter((plan) => !normalize$19(plan.treatmentPlanId) || !normalize$19(plan.planName)).length,
			incompleteTreatmentStages: treatmentStages.filter((stage) => !normalize$19(stage.treatmentStageId) || !normalize$19(stage.stageName)).length,
			incompleteClinicalOutcomes: clinicalOutcomes.filter((outcome) => !normalize$19(outcome.clinicalOutcomeId) || !normalize$19(outcome.outcomeType)).length
		}
	};
}
//#endregion
//#region src/server/read-models/automation-run-read-adapter.ts
function normalize$18(value) {
	return (value ?? "").trim();
}
function readTimestamp$14(run) {
	const timestamp = Date.parse(run.updatedAt || run.completedAt || run.startedAt || run.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableRun(run) {
	return Boolean(normalize$18(run.automationRunId) && normalize$18(run.workflowName));
}
function toAutomationRunDto(run) {
	return {
		automationRunId: normalize$18(run.automationRunId),
		...normalize$18(run.patientId) ? { patientId: normalize$18(run.patientId) } : {},
		...normalize$18(run.leadId) ? { leadId: normalize$18(run.leadId) } : {},
		workflowName: normalize$18(run.workflowName),
		status: normalize$18(run.status),
		...normalize$18(run.startedAt) ? { startedAt: normalize$18(run.startedAt) } : {},
		...normalize$18(run.completedAt) ? { completedAt: normalize$18(run.completedAt) } : {},
		...normalize$18(run.durationMs) ? { durationMs: normalize$18(run.durationMs) } : {},
		source: normalize$18(run.source) || "read-model",
		isMock: run.isMock,
		...normalize$18(run.notes) ? { notes: normalize$18(run.notes) } : {}
	};
}
function readAutomationRuns(automationRuns) {
	return automationRuns.filter(isUsableRun).sort((left, right) => readTimestamp$14(right) - readTimestamp$14(left)).map(toAutomationRunDto);
}
//#endregion
//#region src/server/read-models/operational-kpi-read-adapter.ts
function normalize$17(value) {
	return (value ?? "").trim();
}
function readTimestamp$13(kpi) {
	const timestamp = Date.parse(kpi.updatedAt || kpi.periodEnd || kpi.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableKpi$1(kpi) {
	return Boolean(normalize$17(kpi.operationalKpiId) && normalize$17(kpi.metricName));
}
function toOperationalKpiDto(kpi) {
	return {
		operationalKpiId: normalize$17(kpi.operationalKpiId),
		metricName: normalize$17(kpi.metricName),
		metricValue: normalize$17(kpi.metricValue),
		...normalize$17(kpi.metricUnit) ? { metricUnit: normalize$17(kpi.metricUnit) } : {},
		...normalize$17(kpi.periodStart) ? { periodStart: normalize$17(kpi.periodStart) } : {},
		...normalize$17(kpi.periodEnd) ? { periodEnd: normalize$17(kpi.periodEnd) } : {},
		domain: normalize$17(kpi.domain) || "Operations",
		source: normalize$17(kpi.source) || "read-model",
		isMock: kpi.isMock,
		...normalize$17(kpi.notes) ? { notes: normalize$17(kpi.notes) } : {}
	};
}
function readOperationalKpis(operationalKpis) {
	return operationalKpis.filter(isUsableKpi$1).sort((left, right) => readTimestamp$13(right) - readTimestamp$13(left)).map(toOperationalKpiDto);
}
//#endregion
//#region src/server/read-models/workflow-execution-read-adapter.ts
function normalize$16(value) {
	return (value ?? "").trim();
}
function readTimestamp$12(status) {
	const timestamp = Date.parse(status.updatedAt || status.lastTransitionAt || status.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableStatus(status) {
	return Boolean(normalize$16(status.workflowExecutionStatusId) && normalize$16(status.workflowName));
}
function toWorkflowExecutionDto(status) {
	return {
		workflowExecutionStatusId: normalize$16(status.workflowExecutionStatusId),
		...normalize$16(status.automationRunId) ? { automationRunId: normalize$16(status.automationRunId) } : {},
		workflowName: normalize$16(status.workflowName),
		status: normalize$16(status.status),
		...normalize$16(status.currentStep) ? { currentStep: normalize$16(status.currentStep) } : {},
		...normalize$16(status.lastTransitionAt) ? { lastTransitionAt: normalize$16(status.lastTransitionAt) } : {},
		source: normalize$16(status.source) || "read-model",
		isMock: status.isMock,
		...normalize$16(status.notes) ? { notes: normalize$16(status.notes) } : {}
	};
}
function readWorkflowExecutionStatuses(workflowExecutionStatus) {
	return workflowExecutionStatus.filter(isUsableStatus).sort((left, right) => readTimestamp$12(right) - readTimestamp$12(left)).map(toWorkflowExecutionDto);
}
//#endregion
//#region src/server/read-models/operations-read-aggregate-service.ts
function normalize$15(value) {
	return (value ?? "").trim();
}
function buildOperationsReadAggregateFromReadModels(models) {
	const automationRuns = models.automationRuns ?? [];
	const operationalKpis = models.operationalKpis ?? [];
	const workflowExecutionStatus = models.workflowExecutionStatus ?? [];
	const usableAutomationRuns = readAutomationRuns(automationRuns);
	const usableOperationalKpis = readOperationalKpis(operationalKpis);
	const usableWorkflowExecutionStatus = readWorkflowExecutionStatuses(workflowExecutionStatus);
	return {
		operationsAggregate: {
			automationRuns: usableAutomationRuns,
			operationalKpis: usableOperationalKpis,
			workflowExecutionStatus: usableWorkflowExecutionStatus
		},
		diagnostics: {
			totalAutomationRuns: automationRuns.length,
			totalOperationalKpis: operationalKpis.length,
			totalWorkflowExecutionStatus: workflowExecutionStatus.length,
			usableAutomationRuns: usableAutomationRuns.length,
			usableOperationalKpis: usableOperationalKpis.length,
			usableWorkflowExecutionStatus: usableWorkflowExecutionStatus.length,
			incompleteAutomationRuns: automationRuns.filter((run) => !normalize$15(run.automationRunId) || !normalize$15(run.workflowName)).length,
			incompleteOperationalKpis: operationalKpis.filter((kpi) => !normalize$15(kpi.operationalKpiId) || !normalize$15(kpi.metricName)).length,
			incompleteWorkflowExecutionStatus: workflowExecutionStatus.filter((status) => !normalize$15(status.workflowExecutionStatusId) || !normalize$15(status.workflowName)).length
		}
	};
}
//#endregion
//#region src/server/read-models/collection-read-adapter.ts
function normalize$14(value) {
	return (value ?? "").trim();
}
function readTimestamp$11(collection) {
	const timestamp = Date.parse(collection.updatedAt || collection.lastAttemptAt || collection.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableCollection(collection) {
	return Boolean(normalize$14(collection.collectionId) && normalize$14(collection.status));
}
function toCollectionDto(collection) {
	return {
		collectionId: normalize$14(collection.collectionId),
		...normalize$14(collection.invoiceId) ? { invoiceId: normalize$14(collection.invoiceId) } : {},
		...normalize$14(collection.patientId) ? { patientId: normalize$14(collection.patientId) } : {},
		status: normalize$14(collection.status),
		outstandingAmount: normalize$14(collection.outstandingAmount),
		...normalize$14(collection.attempts) ? { attempts: normalize$14(collection.attempts) } : {},
		...normalize$14(collection.lastAttemptAt) ? { lastAttemptAt: normalize$14(collection.lastAttemptAt) } : {},
		source: normalize$14(collection.source) || "read-model",
		isMock: collection.isMock,
		...normalize$14(collection.notes) ? { notes: normalize$14(collection.notes) } : {}
	};
}
function readCollections(collections) {
	return collections.filter(isUsableCollection).sort((left, right) => readTimestamp$11(right) - readTimestamp$11(left)).map(toCollectionDto);
}
//#endregion
//#region src/server/read-models/financial-kpi-read-adapter.ts
function normalize$13(value) {
	return (value ?? "").trim();
}
function readTimestamp$10(kpi) {
	const timestamp = Date.parse(kpi.updatedAt || kpi.periodEnd || kpi.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableKpi(kpi) {
	return Boolean(normalize$13(kpi.financialKpiId) && normalize$13(kpi.metricName));
}
function toFinancialKpiDto(kpi) {
	return {
		financialKpiId: normalize$13(kpi.financialKpiId),
		metricName: normalize$13(kpi.metricName),
		metricValue: normalize$13(kpi.metricValue),
		...normalize$13(kpi.metricUnit) ? { metricUnit: normalize$13(kpi.metricUnit) } : {},
		...normalize$13(kpi.periodStart) ? { periodStart: normalize$13(kpi.periodStart) } : {},
		...normalize$13(kpi.periodEnd) ? { periodEnd: normalize$13(kpi.periodEnd) } : {},
		domain: normalize$13(kpi.domain) || "Finance",
		source: normalize$13(kpi.source) || "read-model",
		isMock: kpi.isMock,
		...normalize$13(kpi.notes) ? { notes: normalize$13(kpi.notes) } : {}
	};
}
function readFinancialKpis(financialKpis) {
	return financialKpis.filter(isUsableKpi).sort((left, right) => readTimestamp$10(right) - readTimestamp$10(left)).map(toFinancialKpiDto);
}
//#endregion
//#region src/server/read-models/invoice-read-adapter.ts
function normalize$12(value) {
	return (value ?? "").trim();
}
function readTimestamp$9(invoice) {
	const timestamp = Date.parse(invoice.updatedAt || invoice.dueAt || invoice.issuedAt || invoice.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableInvoice(invoice) {
	return Boolean(normalize$12(invoice.invoiceId) && normalize$12(invoice.invoiceNumber));
}
function toInvoiceDto(invoice) {
	return {
		invoiceId: normalize$12(invoice.invoiceId),
		...normalize$12(invoice.patientId) ? { patientId: normalize$12(invoice.patientId) } : {},
		invoiceNumber: normalize$12(invoice.invoiceNumber),
		status: normalize$12(invoice.status),
		totalAmount: normalize$12(invoice.totalAmount),
		...normalize$12(invoice.currency) ? { currency: normalize$12(invoice.currency) } : {},
		...normalize$12(invoice.issuedAt) ? { issuedAt: normalize$12(invoice.issuedAt) } : {},
		...normalize$12(invoice.dueAt) ? { dueAt: normalize$12(invoice.dueAt) } : {},
		source: normalize$12(invoice.source) || "read-model",
		isMock: invoice.isMock,
		...normalize$12(invoice.notes) ? { notes: normalize$12(invoice.notes) } : {}
	};
}
function readInvoices(invoices) {
	return invoices.filter(isUsableInvoice).sort((left, right) => readTimestamp$9(right) - readTimestamp$9(left)).map(toInvoiceDto);
}
//#endregion
//#region src/server/read-models/payment-read-adapter.ts
function normalize$11(value) {
	return (value ?? "").trim();
}
function readTimestamp$8(payment) {
	const timestamp = Date.parse(payment.updatedAt || payment.paidAt || payment.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsablePayment(payment) {
	return Boolean(normalize$11(payment.paymentId) && normalize$11(payment.amount));
}
function toPaymentDto(payment) {
	return {
		paymentId: normalize$11(payment.paymentId),
		...normalize$11(payment.invoiceId) ? { invoiceId: normalize$11(payment.invoiceId) } : {},
		...normalize$11(payment.patientId) ? { patientId: normalize$11(payment.patientId) } : {},
		amount: normalize$11(payment.amount),
		...normalize$11(payment.currency) ? { currency: normalize$11(payment.currency) } : {},
		...normalize$11(payment.method) ? { method: normalize$11(payment.method) } : {},
		status: normalize$11(payment.status),
		...normalize$11(payment.paidAt) ? { paidAt: normalize$11(payment.paidAt) } : {},
		source: normalize$11(payment.source) || "read-model",
		isMock: payment.isMock,
		...normalize$11(payment.notes) ? { notes: normalize$11(payment.notes) } : {}
	};
}
function readPayments(payments) {
	return payments.filter(isUsablePayment).sort((left, right) => readTimestamp$8(right) - readTimestamp$8(left)).map(toPaymentDto);
}
//#endregion
//#region src/server/read-models/finance-read-aggregate-service.ts
function normalize$10(value) {
	return (value ?? "").trim();
}
function buildFinanceReadAggregateFromReadModels(models) {
	const invoices = models.invoices ?? [];
	const payments = models.payments ?? [];
	const collections = models.collections ?? [];
	const financialKpis = models.financialKpis ?? [];
	const usableInvoices = readInvoices(invoices);
	const usablePayments = readPayments(payments);
	const usableCollections = readCollections(collections);
	const usableFinancialKpis = readFinancialKpis(financialKpis);
	return {
		financeAggregate: {
			invoices: usableInvoices,
			payments: usablePayments,
			collections: usableCollections,
			financialKpis: usableFinancialKpis
		},
		diagnostics: {
			totalInvoices: invoices.length,
			totalPayments: payments.length,
			totalCollections: collections.length,
			totalFinancialKpis: financialKpis.length,
			usableInvoices: usableInvoices.length,
			usablePayments: usablePayments.length,
			usableCollections: usableCollections.length,
			usableFinancialKpis: usableFinancialKpis.length,
			incompleteInvoices: invoices.filter((invoice) => !normalize$10(invoice.invoiceId) || !normalize$10(invoice.invoiceNumber)).length,
			incompletePayments: payments.filter((payment) => !normalize$10(payment.paymentId) || !normalize$10(payment.amount)).length,
			incompleteCollections: collections.filter((collection) => !normalize$10(collection.collectionId) || !normalize$10(collection.status)).length,
			incompleteFinancialKpis: financialKpis.filter((kpi) => !normalize$10(kpi.financialKpiId) || !normalize$10(kpi.metricName)).length
		}
	};
}
//#endregion
//#region src/server/read-models/consumable-read-adapter.ts
function normalize$9(value) {
	return (value ?? "").trim();
}
function readTimestamp$7(consumable) {
	const timestamp = Date.parse(consumable.updatedAt || consumable.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableConsumable(consumable) {
	return Boolean(normalize$9(consumable.consumableId) && normalize$9(consumable.consumableName));
}
function toConsumableDto(consumable) {
	return {
		consumableId: normalize$9(consumable.consumableId),
		...normalize$9(consumable.productId) ? { productId: normalize$9(consumable.productId) } : {},
		consumableName: normalize$9(consumable.consumableName),
		...normalize$9(consumable.category) ? { category: normalize$9(consumable.category) } : {},
		status: normalize$9(consumable.status),
		...normalize$9(consumable.unit) ? { unit: normalize$9(consumable.unit) } : {},
		source: normalize$9(consumable.source) || "read-model",
		isMock: consumable.isMock,
		...normalize$9(consumable.notes) ? { notes: normalize$9(consumable.notes) } : {}
	};
}
function readConsumables(consumables) {
	return consumables.filter(isUsableConsumable).sort((left, right) => readTimestamp$7(right) - readTimestamp$7(left)).map(toConsumableDto);
}
//#endregion
//#region src/server/read-models/product-read-adapter.ts
function normalize$8(value) {
	return (value ?? "").trim();
}
function readTimestamp$6(product) {
	const timestamp = Date.parse(product.updatedAt || product.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableProduct(product) {
	return Boolean(normalize$8(product.productId) && normalize$8(product.productName));
}
function toProductDto(product) {
	return {
		productId: normalize$8(product.productId),
		...normalize$8(product.sku) ? { sku: normalize$8(product.sku) } : {},
		productName: normalize$8(product.productName),
		...normalize$8(product.category) ? { category: normalize$8(product.category) } : {},
		status: normalize$8(product.status),
		...normalize$8(product.unit) ? { unit: normalize$8(product.unit) } : {},
		source: normalize$8(product.source) || "read-model",
		isMock: product.isMock,
		...normalize$8(product.notes) ? { notes: normalize$8(product.notes) } : {}
	};
}
function readProducts(products) {
	return products.filter(isUsableProduct).sort((left, right) => readTimestamp$6(right) - readTimestamp$6(left)).map(toProductDto);
}
//#endregion
//#region src/server/read-models/stock-level-read-adapter.ts
function normalize$7(value) {
	return (value ?? "").trim();
}
function readTimestamp$5(stockLevel) {
	const timestamp = Date.parse(stockLevel.updatedAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableStockLevel(stockLevel) {
	return Boolean(normalize$7(stockLevel.stockLevelId) && normalize$7(stockLevel.productId) && normalize$7(stockLevel.warehouseId));
}
function toStockLevelDto(stockLevel) {
	return {
		stockLevelId: normalize$7(stockLevel.stockLevelId),
		productId: normalize$7(stockLevel.productId),
		warehouseId: normalize$7(stockLevel.warehouseId),
		availableQuantity: normalize$7(stockLevel.availableQuantity),
		...normalize$7(stockLevel.reservedQuantity) ? { reservedQuantity: normalize$7(stockLevel.reservedQuantity) } : {},
		...normalize$7(stockLevel.reorderThreshold) ? { reorderThreshold: normalize$7(stockLevel.reorderThreshold) } : {},
		status: normalize$7(stockLevel.status),
		source: normalize$7(stockLevel.source) || "read-model",
		isMock: stockLevel.isMock,
		...normalize$7(stockLevel.notes) ? { notes: normalize$7(stockLevel.notes) } : {}
	};
}
function readStockLevels(stockLevels) {
	return stockLevels.filter(isUsableStockLevel).sort((left, right) => readTimestamp$5(right) - readTimestamp$5(left)).map(toStockLevelDto);
}
//#endregion
//#region src/server/read-models/warehouse-read-adapter.ts
function normalize$6(value) {
	return (value ?? "").trim();
}
function readTimestamp$4(warehouse) {
	const timestamp = Date.parse(warehouse.updatedAt || warehouse.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableWarehouse(warehouse) {
	return Boolean(normalize$6(warehouse.warehouseId) && normalize$6(warehouse.warehouseName));
}
function toWarehouseDto(warehouse) {
	return {
		warehouseId: normalize$6(warehouse.warehouseId),
		warehouseName: normalize$6(warehouse.warehouseName),
		...normalize$6(warehouse.location) ? { location: normalize$6(warehouse.location) } : {},
		status: normalize$6(warehouse.status),
		source: normalize$6(warehouse.source) || "read-model",
		isMock: warehouse.isMock,
		...normalize$6(warehouse.notes) ? { notes: normalize$6(warehouse.notes) } : {}
	};
}
function readWarehouses(warehouses) {
	return warehouses.filter(isUsableWarehouse).sort((left, right) => readTimestamp$4(right) - readTimestamp$4(left)).map(toWarehouseDto);
}
//#endregion
//#region src/server/read-models/inventory-read-aggregate-service.ts
function normalize$5(value) {
	return (value ?? "").trim();
}
function buildInventoryReadAggregateFromReadModels(models) {
	const products = models.products ?? [];
	const consumables = models.consumables ?? [];
	const stockLevels = models.stockLevels ?? [];
	const warehouses = models.warehouses ?? [];
	const usableProducts = readProducts(products);
	const usableConsumables = readConsumables(consumables);
	const usableStockLevels = readStockLevels(stockLevels);
	const usableWarehouses = readWarehouses(warehouses);
	return {
		inventoryAggregate: {
			products: usableProducts,
			consumables: usableConsumables,
			stockLevels: usableStockLevels,
			warehouses: usableWarehouses
		},
		diagnostics: {
			totalProducts: products.length,
			totalConsumables: consumables.length,
			totalStockLevels: stockLevels.length,
			totalWarehouses: warehouses.length,
			usableProducts: usableProducts.length,
			usableConsumables: usableConsumables.length,
			usableStockLevels: usableStockLevels.length,
			usableWarehouses: usableWarehouses.length,
			incompleteProducts: products.filter((product) => !normalize$5(product.productId) || !normalize$5(product.productName)).length,
			incompleteConsumables: consumables.filter((consumable) => !normalize$5(consumable.consumableId) || !normalize$5(consumable.consumableName)).length,
			incompleteStockLevels: stockLevels.filter((stockLevel) => !normalize$5(stockLevel.stockLevelId) || !normalize$5(stockLevel.productId) || !normalize$5(stockLevel.warehouseId)).length,
			incompleteWarehouses: warehouses.filter((warehouse) => !normalize$5(warehouse.warehouseId) || !normalize$5(warehouse.warehouseName)).length
		}
	};
}
//#endregion
//#region src/server/read-models/resolution-metric-read-adapter.ts
function normalize$4(value) {
	return (value ?? "").trim();
}
function readTimestamp$3(metric) {
	const timestamp = Date.parse(metric.updatedAt || metric.createdAt || metric.periodEnd || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableResolutionMetric(metric) {
	return Boolean(normalize$4(metric.resolutionMetricId));
}
function toResolutionMetricDto(metric) {
	return {
		resolutionMetricId: normalize$4(metric.resolutionMetricId),
		...normalize$4(metric.supportTicketId) ? { supportTicketId: normalize$4(metric.supportTicketId) } : {},
		...normalize$4(metric.firstResponseTimeMinutes) ? { firstResponseTimeMinutes: normalize$4(metric.firstResponseTimeMinutes) } : {},
		...normalize$4(metric.resolutionTimeMinutes) ? { resolutionTimeMinutes: normalize$4(metric.resolutionTimeMinutes) } : {},
		...normalize$4(metric.escalationRate) ? { escalationRate: normalize$4(metric.escalationRate) } : {},
		...normalize$4(metric.periodStart) ? { periodStart: normalize$4(metric.periodStart) } : {},
		...normalize$4(metric.periodEnd) ? { periodEnd: normalize$4(metric.periodEnd) } : {},
		source: normalize$4(metric.source) || "read-model",
		isMock: metric.isMock,
		...normalize$4(metric.notes) ? { notes: normalize$4(metric.notes) } : {}
	};
}
function readResolutionMetrics(metrics) {
	return metrics.filter(isUsableResolutionMetric).sort((left, right) => readTimestamp$3(right) - readTimestamp$3(left)).map(toResolutionMetricDto);
}
//#endregion
//#region src/server/read-models/satisfaction-metric-read-adapter.ts
function normalize$3(value) {
	return (value ?? "").trim();
}
function readTimestamp$2(metric) {
	const timestamp = Date.parse(metric.updatedAt || metric.recordedAt || metric.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableSatisfactionMetric(metric) {
	return Boolean(normalize$3(metric.satisfactionMetricId));
}
function toSatisfactionMetricDto(metric) {
	return {
		satisfactionMetricId: normalize$3(metric.satisfactionMetricId),
		...normalize$3(metric.supportTicketId) ? { supportTicketId: normalize$3(metric.supportTicketId) } : {},
		...normalize$3(metric.csat) ? { csat: normalize$3(metric.csat) } : {},
		...normalize$3(metric.nps) ? { nps: normalize$3(metric.nps) } : {},
		...normalize$3(metric.surveyResult) ? { surveyResult: normalize$3(metric.surveyResult) } : {},
		...normalize$3(metric.recordedAt) ? { recordedAt: normalize$3(metric.recordedAt) } : {},
		source: normalize$3(metric.source) || "read-model",
		isMock: metric.isMock,
		...normalize$3(metric.notes) ? { notes: normalize$3(metric.notes) } : {}
	};
}
function readSatisfactionMetrics(metrics) {
	return metrics.filter(isUsableSatisfactionMetric).sort((left, right) => readTimestamp$2(right) - readTimestamp$2(left)).map(toSatisfactionMetricDto);
}
//#endregion
//#region src/server/read-models/support-case-read-adapter.ts
function normalize$2(value) {
	return (value ?? "").trim();
}
function readTimestamp$1(supportCase) {
	const timestamp = Date.parse(supportCase.updatedAt || supportCase.openedAt || supportCase.createdAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableSupportCase(supportCase) {
	return Boolean(normalize$2(supportCase.supportCaseId));
}
function toSupportCaseDto(supportCase) {
	return {
		supportCaseId: normalize$2(supportCase.supportCaseId),
		...normalize$2(supportCase.patientId) ? { patientId: normalize$2(supportCase.patientId) } : {},
		caseStatus: normalize$2(supportCase.caseStatus),
		...normalize$2(supportCase.casePriority) ? { casePriority: normalize$2(supportCase.casePriority) } : {},
		...normalize$2(supportCase.caseCategory) ? { caseCategory: normalize$2(supportCase.caseCategory) } : {},
		...normalize$2(supportCase.openedAt) ? { openedAt: normalize$2(supportCase.openedAt) } : {},
		...normalize$2(supportCase.closedAt) ? { closedAt: normalize$2(supportCase.closedAt) } : {},
		source: normalize$2(supportCase.source) || "read-model",
		isMock: supportCase.isMock,
		...normalize$2(supportCase.notes) ? { notes: normalize$2(supportCase.notes) } : {}
	};
}
function readSupportCases(supportCases) {
	return supportCases.filter(isUsableSupportCase).sort((left, right) => readTimestamp$1(right) - readTimestamp$1(left)).map(toSupportCaseDto);
}
//#endregion
//#region src/server/read-models/support-ticket-read-adapter.ts
function normalize$1(value) {
	return (value ?? "").trim();
}
function readTimestamp(supportTicket) {
	const timestamp = Date.parse(supportTicket.updatedAt || supportTicket.openedAt || "");
	return Number.isNaN(timestamp) ? 0 : timestamp;
}
function isUsableSupportTicket(supportTicket) {
	return Boolean(normalize$1(supportTicket.supportTicketId));
}
function toSupportTicketDto(supportTicket) {
	return {
		supportTicketId: normalize$1(supportTicket.supportTicketId),
		...normalize$1(supportTicket.supportCaseId) ? { supportCaseId: normalize$1(supportTicket.supportCaseId) } : {},
		...normalize$1(supportTicket.patientId) ? { patientId: normalize$1(supportTicket.patientId) } : {},
		ticketStatus: normalize$1(supportTicket.ticketStatus),
		...normalize$1(supportTicket.ticketHistory) ? { ticketHistory: normalize$1(supportTicket.ticketHistory) } : {},
		...normalize$1(supportTicket.openedAt) ? { openedAt: normalize$1(supportTicket.openedAt) } : {},
		source: normalize$1(supportTicket.source) || "read-model",
		isMock: supportTicket.isMock,
		...normalize$1(supportTicket.notes) ? { notes: normalize$1(supportTicket.notes) } : {}
	};
}
function readSupportTickets(supportTickets) {
	return supportTickets.filter(isUsableSupportTicket).sort((left, right) => readTimestamp(right) - readTimestamp(left)).map(toSupportTicketDto);
}
//#endregion
//#region src/server/read-models/support-read-aggregate-service.ts
function normalize(value) {
	return (value ?? "").trim();
}
function buildSupportReadAggregateFromReadModels(models) {
	const supportCases = models.supportCases ?? [];
	const supportTickets = models.supportTickets ?? [];
	const resolutionMetrics = models.resolutionMetrics ?? [];
	const satisfactionMetrics = models.satisfactionMetrics ?? [];
	const usableSupportCases = readSupportCases(supportCases);
	const usableSupportTickets = readSupportTickets(supportTickets);
	const usableResolutionMetrics = readResolutionMetrics(resolutionMetrics);
	const usableSatisfactionMetrics = readSatisfactionMetrics(satisfactionMetrics);
	return {
		supportAggregate: {
			supportCases: usableSupportCases,
			supportTickets: usableSupportTickets,
			resolutionMetrics: usableResolutionMetrics,
			satisfactionMetrics: usableSatisfactionMetrics
		},
		diagnostics: {
			totalSupportCases: supportCases.length,
			totalSupportTickets: supportTickets.length,
			totalResolutionMetrics: resolutionMetrics.length,
			totalSatisfactionMetrics: satisfactionMetrics.length,
			usableSupportCases: usableSupportCases.length,
			usableSupportTickets: usableSupportTickets.length,
			usableResolutionMetrics: usableResolutionMetrics.length,
			usableSatisfactionMetrics: usableSatisfactionMetrics.length,
			incompleteSupportCases: supportCases.filter((supportCase) => !normalize(supportCase.supportCaseId)).length,
			incompleteSupportTickets: supportTickets.filter((supportTicket) => !normalize(supportTicket.supportTicketId)).length,
			incompleteResolutionMetrics: resolutionMetrics.filter((metric) => !normalize(metric.resolutionMetricId)).length,
			incompleteSatisfactionMetrics: satisfactionMetrics.filter((metric) => !normalize(metric.satisfactionMetricId)).length
		}
	};
}
//#endregion
//#region src/server/read-models/read-model-source-provider.ts
function trackDomainTelemetry(consumerName, mode, counts) {
	const source = mode === "read-model" ? "ReadModel" : "LeadProjection";
	readObservabilityProvider.trackRead({
		consumerName,
		domain: "Patient",
		aggregate: "PatientAggregateReadService",
		source,
		recordCount: counts.patients
	});
	readObservabilityProvider.trackDomain({
		consumerName,
		domain: "Patient",
		healthy: true,
		source
	});
	readObservabilityProvider.trackRead({
		consumerName,
		domain: "CRM",
		aggregate: "CRMReadAggregateService",
		source,
		recordCount: counts.crm
	});
	readObservabilityProvider.trackDomain({
		consumerName,
		domain: "CRM",
		healthy: true,
		source
	});
	readObservabilityProvider.trackRead({
		consumerName,
		domain: "Billing",
		aggregate: "BillingReadAggregateService",
		source,
		recordCount: counts.billing
	});
	readObservabilityProvider.trackDomain({
		consumerName,
		domain: "Billing",
		healthy: true,
		source
	});
	readObservabilityProvider.trackRead({
		consumerName,
		domain: "Clinical",
		aggregate: "ClinicalAggregateReadService",
		source,
		recordCount: counts.clinical
	});
	readObservabilityProvider.trackDomain({
		consumerName,
		domain: "Clinical",
		healthy: true,
		source
	});
	readObservabilityProvider.trackRead({
		consumerName,
		domain: "Operations",
		aggregate: "OperationsAggregateReadService",
		source,
		recordCount: counts.operations
	});
	readObservabilityProvider.trackDomain({
		consumerName,
		domain: "Operations",
		healthy: true,
		source
	});
	readObservabilityProvider.trackRead({
		consumerName,
		domain: "Finance",
		aggregate: "FinanceAggregateReadService",
		source,
		recordCount: counts.finance
	});
	readObservabilityProvider.trackDomain({
		consumerName,
		domain: "Finance",
		healthy: true,
		source
	});
	readObservabilityProvider.trackRead({
		consumerName,
		domain: "Inventory",
		aggregate: "InventoryAggregateReadService",
		source,
		recordCount: counts.inventory
	});
	readObservabilityProvider.trackDomain({
		consumerName,
		domain: "Inventory",
		healthy: true,
		source
	});
	readObservabilityProvider.trackRead({
		consumerName,
		domain: "Support",
		aggregate: "SupportAggregateReadService",
		source,
		recordCount: counts.support
	});
	readObservabilityProvider.trackDomain({
		consumerName,
		domain: "Support",
		healthy: true,
		source
	});
}
async function getLegacyLeadsSource(leadOperationsPromise, fallbackReason, consumerName) {
	const [patients, leadOperations] = await Promise.all([listPatientAdministrativeProfiles(), leadOperationsPromise]);
	const reason = fallbackReason ?? "read-model-unavailable";
	readObservabilityProvider.trackFallback({
		consumerName,
		domain: "Patient",
		aggregate: "ReadModelSourceProvider",
		reason
	});
	readObservabilityProvider.trackFallback({
		consumerName,
		domain: "CRM",
		aggregate: "ReadModelSourceProvider",
		reason
	});
	readObservabilityProvider.trackFallback({
		consumerName,
		domain: "Billing",
		aggregate: "ReadModelSourceProvider",
		reason
	});
	readObservabilityProvider.trackFallback({
		consumerName,
		domain: "Clinical",
		aggregate: "ReadModelSourceProvider",
		reason
	});
	readObservabilityProvider.trackFallback({
		consumerName,
		domain: "Operations",
		aggregate: "ReadModelSourceProvider",
		reason
	});
	readObservabilityProvider.trackFallback({
		consumerName,
		domain: "Finance",
		aggregate: "ReadModelSourceProvider",
		reason
	});
	readObservabilityProvider.trackFallback({
		consumerName,
		domain: "Inventory",
		aggregate: "ReadModelSourceProvider",
		reason
	});
	readObservabilityProvider.trackFallback({
		consumerName,
		domain: "Support",
		aggregate: "ReadModelSourceProvider",
		reason
	});
	trackDomainTelemetry(consumerName, "legacy-leads", {
		patients: patients.length,
		crm: 0,
		billing: 0,
		clinical: 0,
		operations: 0,
		finance: 0,
		inventory: 0,
		support: 0
	});
	return {
		mode: "legacy-leads",
		patients,
		leadOperations,
		crmAggregates: [],
		billingAggregates: [],
		clinicalAggregates: [],
		operationsAggregate: {
			automationRuns: [],
			operationalKpis: [],
			workflowExecutionStatus: []
		},
		financeAggregate: {
			invoices: [],
			payments: [],
			collections: [],
			financialKpis: []
		},
		inventoryAggregate: {
			products: [],
			consumables: [],
			stockLevels: [],
			warehouses: []
		},
		supportAggregate: {
			supportCases: [],
			supportTickets: [],
			resolutionMetrics: [],
			satisfactionMetrics: []
		},
		diagnostics: {
			usedReadModel: false,
			fallbackReason,
			checkedReadModelPatients: 0
		}
	};
}
async function getReadModelSource({ consumerName }) {
	const leadOperationsPromise = listLeadOperationsProfiles();
	try {
		const models = await readWorksheetReadModels();
		if (!models || models.patients.length === 0) return await getLegacyLeadsSource(leadOperationsPromise, "read-model-unavailable", consumerName);
		const [leadOperations] = await Promise.all([leadOperationsPromise]);
		const aggregateResult = buildPatientAggregatesFromReadModels(models);
		const crmAggregateResult = buildCrmReadAggregatesFromReadModels(models);
		const billingAggregateResult = buildBillingReadAggregatesFromReadModels(models);
		const clinicalAggregateResult = buildClinicalReadAggregatesFromReadModels(models);
		const operationsAggregateResult = buildOperationsReadAggregateFromReadModels(models);
		const financeAggregateResult = buildFinanceReadAggregateFromReadModels(models);
		const inventoryAggregateResult = buildInventoryReadAggregateFromReadModels(models);
		const supportAggregateResult = buildSupportReadAggregateFromReadModels(models);
		const patients = aggregateResult.administrativeProfiles ?? aggregateResult.patients;
		readObservabilityProvider.trackAggregate({
			consumerName,
			domain: "Patient",
			aggregate: "PatientAggregateReadService",
			success: true,
			recordCount: patients.length,
			diagnostics: aggregateResult.diagnostics
		});
		readObservabilityProvider.trackAggregate({
			consumerName,
			domain: "CRM",
			aggregate: "CRMReadAggregateService",
			success: true,
			recordCount: crmAggregateResult.crmAggregates.length,
			diagnostics: crmAggregateResult.diagnostics
		});
		readObservabilityProvider.trackAggregate({
			consumerName,
			domain: "Billing",
			aggregate: "BillingReadAggregateService",
			success: true,
			recordCount: billingAggregateResult.billingAggregates.length,
			diagnostics: billingAggregateResult.diagnostics
		});
		readObservabilityProvider.trackAggregate({
			consumerName,
			domain: "Clinical",
			aggregate: "ClinicalAggregateReadService",
			success: true,
			recordCount: clinicalAggregateResult.clinicalAggregates.length,
			diagnostics: clinicalAggregateResult.diagnostics
		});
		readObservabilityProvider.trackAggregate({
			consumerName,
			domain: "Operations",
			aggregate: "OperationsAggregateReadService",
			success: true,
			recordCount: operationsAggregateResult.operationsAggregate.automationRuns.length + operationsAggregateResult.operationsAggregate.operationalKpis.length + operationsAggregateResult.operationsAggregate.workflowExecutionStatus.length,
			diagnostics: operationsAggregateResult.diagnostics
		});
		readObservabilityProvider.trackAggregate({
			consumerName,
			domain: "Finance",
			aggregate: "FinanceAggregateReadService",
			success: true,
			recordCount: financeAggregateResult.financeAggregate.invoices.length + financeAggregateResult.financeAggregate.payments.length + financeAggregateResult.financeAggregate.collections.length + financeAggregateResult.financeAggregate.financialKpis.length,
			diagnostics: financeAggregateResult.diagnostics
		});
		readObservabilityProvider.trackAggregate({
			consumerName,
			domain: "Inventory",
			aggregate: "InventoryAggregateReadService",
			success: true,
			recordCount: inventoryAggregateResult.inventoryAggregate.products.length + inventoryAggregateResult.inventoryAggregate.consumables.length + inventoryAggregateResult.inventoryAggregate.stockLevels.length + inventoryAggregateResult.inventoryAggregate.warehouses.length,
			diagnostics: inventoryAggregateResult.diagnostics
		});
		readObservabilityProvider.trackAggregate({
			consumerName,
			domain: "Support",
			aggregate: "SupportAggregateReadService",
			success: true,
			recordCount: supportAggregateResult.supportAggregate.supportCases.length + supportAggregateResult.supportAggregate.supportTickets.length + supportAggregateResult.supportAggregate.resolutionMetrics.length + supportAggregateResult.supportAggregate.satisfactionMetrics.length,
			diagnostics: supportAggregateResult.diagnostics
		});
		trackDomainTelemetry(consumerName, "read-model", {
			patients: patients.length,
			crm: crmAggregateResult.crmAggregates.length,
			billing: billingAggregateResult.billingAggregates.length,
			clinical: clinicalAggregateResult.clinicalAggregates.length,
			operations: operationsAggregateResult.operationsAggregate.automationRuns.length + operationsAggregateResult.operationsAggregate.operationalKpis.length + operationsAggregateResult.operationsAggregate.workflowExecutionStatus.length,
			finance: financeAggregateResult.financeAggregate.invoices.length + financeAggregateResult.financeAggregate.payments.length + financeAggregateResult.financeAggregate.collections.length + financeAggregateResult.financeAggregate.financialKpis.length,
			inventory: inventoryAggregateResult.inventoryAggregate.products.length + inventoryAggregateResult.inventoryAggregate.consumables.length + inventoryAggregateResult.inventoryAggregate.stockLevels.length + inventoryAggregateResult.inventoryAggregate.warehouses.length,
			support: supportAggregateResult.supportAggregate.supportCases.length + supportAggregateResult.supportAggregate.supportTickets.length + supportAggregateResult.supportAggregate.resolutionMetrics.length + supportAggregateResult.supportAggregate.satisfactionMetrics.length
		});
		return {
			mode: "read-model",
			patients,
			leadOperations,
			crmAggregates: crmAggregateResult.crmAggregates,
			billingAggregates: billingAggregateResult.billingAggregates,
			clinicalAggregates: clinicalAggregateResult.clinicalAggregates,
			operationsAggregate: operationsAggregateResult.operationsAggregate,
			financeAggregate: financeAggregateResult.financeAggregate,
			inventoryAggregate: inventoryAggregateResult.inventoryAggregate,
			supportAggregate: supportAggregateResult.supportAggregate,
			diagnostics: {
				usedReadModel: true,
				checkedReadModelPatients: aggregateResult.patients.length,
				patientAggregateDiagnostics: aggregateResult.diagnostics,
				crmAggregateDiagnostics: crmAggregateResult.diagnostics,
				billingAggregateDiagnostics: billingAggregateResult.diagnostics,
				clinicalAggregateDiagnostics: clinicalAggregateResult.diagnostics,
				operationsAggregateDiagnostics: operationsAggregateResult.diagnostics,
				financeAggregateDiagnostics: financeAggregateResult.diagnostics,
				inventoryAggregateDiagnostics: inventoryAggregateResult.diagnostics,
				supportAggregateDiagnostics: supportAggregateResult.diagnostics
			}
		};
	} catch (error) {
		console.warn(`${consumerName} read model pilot fell back to legacy Leads source:`, error);
		return await getLegacyLeadsSource(leadOperationsPromise, "read-model-error", consumerName);
	}
}
//#endregion
//#region src/routes/api/patients/list.ts
async function GET$8(request) {
	try {
		requirePermission(request, "patients:read");
		return jsonResponse$1({
			success: true,
			patients: (await getReadModelSource({ consumerName: "Patient Management" })).patients
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		console.error("Failed to list patient administrative profiles:", error);
		return jsonResponse$1({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}
//#endregion
//#region src/routes/api/patients/$id.ts
async function GET$7(request) {
	try {
		requirePermission(request, "patients:read");
		const id = getPatientIdFromPath(request);
		const source = await getReadModelSource({ consumerName: "Patient Management Detail" });
		const patient = source.patients.find((candidate) => candidate.id === id);
		if (patient) return jsonResponse$1({
			success: true,
			patient
		});
		if (source.mode === "read-model") return jsonResponse$1({
			success: true,
			patient: await getPatientAdministrativeProfile(id)
		});
		throw new PatientNotFoundError(`Paciente ${id} no encontrado.`);
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		if (error instanceof PatientNotFoundError) return jsonResponse$1({
			success: false,
			error: error.message
		}, 404);
		console.error("Failed to get patient administrative profile:", error);
		return jsonResponse$1({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}
//#endregion
//#region src/server/audit/operational-audit.ts
var OPERATIONAL_AUDIT_ACTIONS = [
	"patient.admin_profile.updated",
	"patient.profile.verified",
	"lead.operations.updated",
	"report.operational.viewed",
	"report.operational.exported"
];
var InvalidOperationalAuditFiltersError = class extends Error {};
var STORE_PATH = resolve(process.cwd(), ".data/operational-audit-log.json");
var DEFAULT_LIMIT$1 = 100;
var MAX_LIMIT$1 = 250;
function createAuditId() {
	const random = Math.random().toString(36).slice(2, 10);
	return `audit_${Date.now().toString(36)}_${random}`;
}
function sanitizeMetadata(metadata) {
	if (!metadata) return void 0;
	const sanitizedEntries = Object.entries(metadata).filter((entry) => entry[1] !== void 0);
	return sanitizedEntries.length ? Object.fromEntries(sanitizedEntries) : void 0;
}
function toActor(session) {
	return {
		role: session.role,
		userId: session.userId,
		email: session.email,
		name: session.name
	};
}
async function readStore() {
	try {
		const raw = await readFile(STORE_PATH, "utf8");
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return [];
		throw error;
	}
}
async function writeStore(events) {
	await mkdir(dirname(STORE_PATH), { recursive: true });
	await writeFile(STORE_PATH, `${JSON.stringify(events, null, 2)}\n`, "utf8");
}
async function recordOperationalAuditEvent(input, session) {
	const actor = toActor(session);
	const event = {
		id: createAuditId(),
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		action: input.action,
		resourceType: input.resourceType,
		resourceId: input.resourceId,
		actorRole: actor.role,
		actorId: actor.userId,
		actorEmail: actor.email,
		actorName: actor.name,
		metadata: sanitizeMetadata(input.metadata)
	};
	const events = await readStore();
	events.unshift(event);
	await writeStore(events.slice(0, 1e3));
	return event;
}
function recordOperationalAuditEventSafely(input, session) {
	recordOperationalAuditEvent(input, session).catch((error) => {
		console.error("Failed to record operational audit event:", error);
	});
}
function isOperationalAuditAction(value) {
	return OPERATIONAL_AUDIT_ACTIONS.includes(value);
}
function isOperationalAuditResourceType(value) {
	return value === "patient" || value === "lead" || value === "report";
}
function parseDateFilter(value, fieldName) {
	const timestamp = Date.parse(value);
	if (Number.isNaN(timestamp)) throw new InvalidOperationalAuditFiltersError(`Invalid ${fieldName} filter.`);
	return new Date(timestamp).toISOString();
}
function parseOperationalAuditFilters(request) {
	const url = new URL(request.url);
	const action = url.searchParams.get("action")?.trim();
	const resourceType = url.searchParams.get("resourceType")?.trim();
	const resourceId = url.searchParams.get("resourceId")?.trim();
	const actorRole = url.searchParams.get("actorRole")?.trim();
	const from = url.searchParams.get("from")?.trim();
	const to = url.searchParams.get("to")?.trim();
	const limitParam = url.searchParams.get("limit")?.trim();
	const filters = { limit: DEFAULT_LIMIT$1 };
	if (action) {
		if (!isOperationalAuditAction(action)) throw new InvalidOperationalAuditFiltersError("Invalid action filter.");
		filters.action = action;
	}
	if (resourceType) {
		if (!isOperationalAuditResourceType(resourceType)) throw new InvalidOperationalAuditFiltersError("Invalid resourceType filter.");
		filters.resourceType = resourceType;
	}
	if (resourceId) filters.resourceId = resourceId;
	if (actorRole) filters.actorRole = actorRole;
	if (from) filters.from = parseDateFilter(from, "from");
	if (to) filters.to = parseDateFilter(to, "to");
	if (limitParam) {
		const parsedLimit = Number.parseInt(limitParam, 10);
		if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > MAX_LIMIT$1) throw new InvalidOperationalAuditFiltersError(`Invalid limit filter. Use 1-${MAX_LIMIT$1}.`);
		filters.limit = parsedLimit;
	}
	return filters;
}
async function listOperationalAuditEvents(filters) {
	const events = await readStore();
	const fromTime = filters.from ? Date.parse(filters.from) : void 0;
	const toTime = filters.to ? Date.parse(filters.to) : void 0;
	return events.filter((event) => {
		if (filters.action && event.action !== filters.action) return false;
		if (filters.resourceType && event.resourceType !== filters.resourceType) return false;
		if (filters.resourceId && event.resourceId !== filters.resourceId) return false;
		if (filters.actorRole && event.actorRole !== filters.actorRole) return false;
		const eventTime = Date.parse(event.timestamp);
		if (fromTime !== void 0 && eventTime < fromTime) return false;
		if (toTime !== void 0 && eventTime > toTime) return false;
		return true;
	}).slice(0, filters.limit);
}
//#endregion
//#region src/routes/api/patients/$id/admin-profile.ts
async function PATCH$1(request) {
	try {
		const session = requirePermission(request, "patients:adminUpdate");
		const id = getPatientIdFromPath(request, "/admin-profile");
		const update = parseAdministrativeProfileUpdate(await request.json());
		const patient = await updatePatientAdministrativeProfile(id, update, session);
		recordOperationalAuditEventSafely({
			action: "patient.admin_profile.updated",
			resourceType: "patient",
			resourceId: id,
			metadata: { updatedFields: Object.keys(update).join(",") }
		}, session);
		return jsonResponse$1({
			success: true,
			patient
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		if (error instanceof InvalidPatientPayloadError) return jsonResponse$1({
			success: false,
			error: error.message
		}, 400);
		if (error instanceof PatientNotFoundError) return jsonResponse$1({
			success: false,
			error: error.message
		}, 404);
		console.error("Failed to update patient administrative profile:", error);
		return jsonResponse$1({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}
//#endregion
//#region src/routes/api/patients/$id/verify-profile.ts
async function POST(request) {
	try {
		const session = requirePermission(request, "patients:verifyProfile");
		const id = getPatientIdFromPath(request, "/verify-profile");
		const patient = await verifyPatientAdministrativeProfile(id, session);
		recordOperationalAuditEventSafely({
			action: "patient.profile.verified",
			resourceType: "patient",
			resourceId: id
		}, session);
		return jsonResponse$1({
			success: true,
			patient
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		if (error instanceof PatientNotFoundError) return jsonResponse$1({
			success: false,
			error: error.message
		}, 404);
		console.error("Failed to verify patient administrative profile:", error);
		return jsonResponse$1({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}
//#endregion
//#region src/server/leads/api-validation.ts
var LEAD_OPERATIONAL_STATUSES = [
	"nuevo",
	"contactado",
	"seguimiento",
	"descartado"
];
var LEAD_OPERATION_PRIORITIES = [
	"baja",
	"normal",
	"alta"
];
var LEAD_OPERATIONS_UPDATE_FIELDS = [
	"operationalStatus",
	"priority",
	"lastContactAt",
	"nextFollowUpAt",
	"contactResult",
	"internalNote"
];
var PROTECTED_LEAD_FIELDS = [
	"calendarEventId",
	"emailSent",
	"appointmentDate",
	"appointmentTime",
	"date",
	"time",
	"eventLink",
	"gmailMessageId",
	"diagnosis",
	"diagnóstico",
	"treatmentPlan",
	"clinicalNotes",
	"odontogram",
	"radiographs",
	"medicalDocuments",
	"historiaClinica",
	"notasMedicas"
];
var optionalDateValue = z.string().trim().max(40).refine((value) => value === "" || !Number.isNaN(Date.parse(value)), "La fecha enviada no es válida.").optional();
var leadOperationsUpdateSchema = z.object({
	operationalStatus: z.enum(LEAD_OPERATIONAL_STATUSES).optional(),
	priority: z.enum(LEAD_OPERATION_PRIORITIES).optional(),
	lastContactAt: optionalDateValue,
	nextFollowUpAt: optionalDateValue,
	contactResult: z.string().trim().max(160).optional(),
	internalNote: z.string().trim().max(1200).optional()
}).strict();
var InvalidLeadOperationsPayloadError = class extends Error {};
function getPayloadKeys(payload) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
	return Object.keys(payload);
}
function parseLeadOperationsUpdate(payload) {
	const keys = getPayloadKeys(payload);
	const protectedFields = keys.filter((key) => PROTECTED_LEAD_FIELDS.some((field) => field.toLowerCase() === key.toLowerCase()));
	if (protectedFields.length > 0) throw new InvalidLeadOperationsPayloadError(`La operación de leads no acepta campos protegidos: ${protectedFields.join(", ")}.`);
	const invalidFields = keys.filter((key) => !LEAD_OPERATIONS_UPDATE_FIELDS.includes(key));
	if (invalidFields.length > 0) throw new InvalidLeadOperationsPayloadError(`Campos operativos no permitidos: ${invalidFields.join(", ")}.`);
	const result = leadOperationsUpdateSchema.safeParse(payload);
	if (!result.success) throw new InvalidLeadOperationsPayloadError(result.error.issues.map((issue) => issue.message).join(" "));
	if (Object.keys(result.data).length === 0) throw new InvalidLeadOperationsPayloadError("No se enviaron campos operativos para actualizar.");
	return result.data;
}
function jsonResponse(payload, status = 200) {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/routes/api/leads/operations.ts
async function GET$6(request) {
	try {
		requirePermission(request, "leads:read");
		return jsonResponse({
			success: true,
			leadOperations: await listLeadOperationsProfiles()
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		console.error("Failed to list lead operations:", error);
		return jsonResponse({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}
//#endregion
//#region src/routes/api/leads/$id/operations.ts
function getLeadIdFromRequest(request) {
	const id = new URL(request.url).searchParams.get("id");
	if (!id) throw new LeadNotFoundError("Lead id is required.");
	return id;
}
async function GET$5(request) {
	try {
		requirePermission(request, "leads:read");
		return jsonResponse({
			success: true,
			leadOperations: await getLeadOperationsProfile(getLeadIdFromRequest(request))
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		if (error instanceof LeadNotFoundError) return jsonResponse({
			success: false,
			error: error.message
		}, 404);
		console.error("Failed to read lead operations:", error);
		return jsonResponse({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}
async function PATCH(request) {
	try {
		const session = requirePermission(request, "leads:update");
		const id = getLeadIdFromRequest(request);
		const update = parseLeadOperationsUpdate(await request.json());
		const leadOperations = await updateLeadOperationsProfile(id, update, session);
		recordOperationalAuditEventSafely({
			action: "lead.operations.updated",
			resourceType: "lead",
			resourceId: id,
			metadata: { updatedFields: Object.keys(update).join(",") }
		}, session);
		return jsonResponse({
			success: true,
			leadOperations
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		if (error instanceof InvalidLeadOperationsPayloadError) return jsonResponse({
			success: false,
			error: error.message
		}, 400);
		if (error instanceof LeadNotFoundError) return jsonResponse({
			success: false,
			error: error.message
		}, 404);
		console.error("Failed to update lead operations:", error);
		return jsonResponse({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		}, 500);
	}
}
//#endregion
//#region src/server/reporting/read-source.ts
async function getReportingReadSource() {
	return await getReadModelSource({ consumerName: "Reporting" });
}
//#endregion
//#region src/server/reporting/operational-analytics.ts
var PATIENT_ADMINISTRATIVE_STATUSES = [
	"incomplete",
	"pending-verification",
	"verified"
];
var OPERATIONAL_REPORT_EXPORT_FORMATS = ["json", "csv"];
var InvalidOperationalReportFiltersError = class extends Error {};
function percentage$1(part, total) {
	if (!total) return 0;
	return Math.round(part / total * 100);
}
function normalizeValue(value) {
	return (value ?? "").trim();
}
function normalizeText(value) {
	return normalizeValue(value).toLowerCase();
}
function safeDate(value) {
	const normalized = normalizeValue(value);
	if (!normalized) return null;
	const date = new Date(normalized);
	return Number.isNaN(date.getTime()) ? null : date;
}
function safeDayRange(value, endOfDay) {
	const date = safeDate(value);
	if (!date) return null;
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) date.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
	return date;
}
function isDueFollowUp$1(value) {
	const date = safeDate(value);
	if (!date) return false;
	const today = /* @__PURE__ */ new Date();
	today.setHours(23, 59, 59, 999);
	return date.getTime() <= today.getTime();
}
function leadAppointmentStatus(leadOperations) {
	return normalizeText(leadOperations.lead.status);
}
function treatmentKey(value) {
	return normalizeValue(value) || "Servicio por definir";
}
function operationalStatusLabel(status) {
	if (status === "contactado") return "Contactado";
	if (status === "seguimiento") return "Seguimiento";
	if (status === "descartado") return "Descartado";
	return "Nuevo";
}
function buildStatusBuckets(leadOperations) {
	const total = leadOperations.length;
	return [
		"nuevo",
		"contactado",
		"seguimiento",
		"descartado"
	].map((status) => {
		const value = leadOperations.filter((item) => item.operationalStatus === status).length;
		return {
			label: operationalStatusLabel(status),
			value,
			percentage: percentage$1(value, total)
		};
	});
}
function buildServiceBuckets(leadOperations) {
	const total = leadOperations.length;
	const grouped = leadOperations.reduce((accumulator, item) => {
		const key = treatmentKey(item.lead.treatment);
		accumulator[key] = (accumulator[key] ?? 0) + 1;
		return accumulator;
	}, {});
	return Object.entries(grouped).map(([key, value]) => ({
		key,
		label: key,
		value,
		percentage: percentage$1(value, total)
	})).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "es")).slice(0, 5);
}
function buildRecommendationSummary(params) {
	if (params.dueFollowUps > 0) return `${params.dueFollowUps} seguimiento(s) requieren revisión administrativa hoy o antes.`;
	if (params.pendingVerification > 0) return `${params.pendingVerification} perfil(es) pueden avanzar con verificación administrativa.`;
	if (params.highPriority > 0) return `${params.highPriority} lead(s) de prioridad alta conviene revisar con acompañamiento claro.`;
	return "La operación no muestra pendientes críticos administrativos en este momento.";
}
function getLeadReportDate(item) {
	return safeDate(item.lead.createdAt) ?? safeDate(item.lead.preferredDate) ?? safeDate(item.updatedAt);
}
function getPatientReportDate(patient) {
	return safeDate(patient.createdAt) ?? safeDate(patient.updatedAt) ?? safeDate(patient.preferredDate);
}
function matchesDateRange(date, filters) {
	if (!filters.from && !filters.to) return true;
	if (!date) return false;
	const from = filters.from ? safeDayRange(filters.from, false) : null;
	const to = filters.to ? safeDayRange(filters.to, true) : null;
	if (from && date.getTime() < from.getTime()) return false;
	if (to && date.getTime() > to.getTime()) return false;
	return true;
}
function matchesTextFilter(value, filter) {
	const normalizedFilter = normalizeText(filter);
	if (!normalizedFilter) return true;
	return normalizeText(value).includes(normalizedFilter);
}
function filterLeadOperations(leadOperations, filters) {
	return leadOperations.filter((item) => {
		if (!matchesDateRange(getLeadReportDate(item), filters)) return false;
		if (filters.status && item.operationalStatus !== filters.status) return false;
		if (filters.priority && item.priority !== filters.priority) return false;
		if (!matchesTextFilter(item.lead.treatment, filters.service)) return false;
		if (!matchesTextFilter(item.lead.source, filters.source)) return false;
		return true;
	});
}
function filterPatients(patients, filters) {
	return patients.filter((patient) => {
		if (!matchesDateRange(getPatientReportDate(patient), filters)) return false;
		if (filters.patientStatus && patient.administrativeStatus !== filters.patientStatus) return false;
		if (!matchesTextFilter(patient.treatmentInterest, filters.service)) return false;
		if (!matchesTextFilter(patient.source, filters.source)) return false;
		return true;
	});
}
function ensureDateFilter(value, field) {
	if (!value) return;
	if (!safeDate(value)) throw new InvalidOperationalReportFiltersError(`El filtro ${field} debe tener una fecha válida.`);
}
function ensureEnumFilter(value, allowed, field) {
	if (!value) return void 0;
	if (!allowed.includes(value)) throw new InvalidOperationalReportFiltersError(`El filtro ${field} debe ser uno de: ${allowed.join(", ")}.`);
	return value;
}
function ensureTextFilter(value, field) {
	const normalized = normalizeValue(value);
	if (!normalized) return void 0;
	if (normalized.length > 80) throw new InvalidOperationalReportFiltersError(`El filtro ${field} no puede exceder 80 caracteres.`);
	return normalized;
}
function parseOperationalReportFilters(request) {
	const searchParams = new URL(request.url).searchParams;
	const from = normalizeValue(searchParams.get("from"));
	const to = normalizeValue(searchParams.get("to"));
	ensureDateFilter(from, "from");
	ensureDateFilter(to, "to");
	const fromDate = from ? safeDayRange(from, false) : null;
	const toDate = to ? safeDayRange(to, true) : null;
	if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) throw new InvalidOperationalReportFiltersError("El filtro from no puede ser posterior al filtro to.");
	const exportFormat = ensureEnumFilter(normalizeValue(searchParams.get("export")), OPERATIONAL_REPORT_EXPORT_FORMATS, "export");
	return {
		...from ? { from } : {},
		...to ? { to } : {},
		status: ensureEnumFilter(normalizeValue(searchParams.get("status")), LEAD_OPERATIONAL_STATUSES, "status"),
		priority: ensureEnumFilter(normalizeValue(searchParams.get("priority")), LEAD_OPERATION_PRIORITIES, "priority"),
		patientStatus: ensureEnumFilter(normalizeValue(searchParams.get("patientStatus")), PATIENT_ADMINISTRATIVE_STATUSES, "patientStatus"),
		service: ensureTextFilter(searchParams.get("service") ?? void 0, "service"),
		source: ensureTextFilter(searchParams.get("source") ?? void 0, "source"),
		export: exportFormat
	};
}
function toAppliedFilters(filters) {
	const { export: _export, ...appliedFilters } = filters;
	return appliedFilters;
}
function buildOperationalAnalyticsReport(params) {
	const filters = params.filters ?? {};
	const leadOperations = filterLeadOperations(params.leadOperations, filters);
	const patients = filterPatients(params.patients, filters);
	const totalLeads = leadOperations.length;
	const contacted = leadOperations.filter((item) => item.operationalStatus === "contactado").length;
	const followUp = leadOperations.filter((item) => item.operationalStatus === "seguimiento").length;
	const discarded = leadOperations.filter((item) => item.operationalStatus === "descartado").length;
	const highPriority = leadOperations.filter((item) => item.priority === "alta").length;
	const dueFollowUps = leadOperations.filter((item) => item.operationalStatus === "seguimiento" && isDueFollowUp$1(item.nextFollowUpAt)).length;
	const scheduled = leadOperations.filter((item) => {
		const status = leadAppointmentStatus(item);
		return status === "agendada" || status === "confirmada" || status === "completada";
	}).length;
	const verifiedPatients = patients.filter((patient) => patient.administrativeStatus === "verified").length;
	const pendingVerification = patients.filter((patient) => patient.administrativeStatus === "pending-verification").length;
	const incompletePatients = patients.filter((patient) => patient.administrativeStatus === "incomplete").length;
	const averageCompletion = patients.length ? Math.round(patients.reduce((sum, patient) => sum + patient.completionPercentage, 0) / patients.length) : 0;
	const recommendation = buildRecommendationSummary({
		dueFollowUps,
		pendingVerification,
		highPriority
	});
	return {
		generatedAt: params.generatedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
		scope: "administrative-operational",
		filters,
		limits: [
			"No crea citas.",
			"No modifica Calendar.",
			"No envía Gmail.",
			"No usa información clínica.",
			"No contiene métricas financieras."
		],
		totals: {
			totalLeads,
			activeLeads: totalLeads - discarded,
			contacted,
			followUp,
			discarded,
			highPriority,
			dueFollowUps,
			scheduled,
			totalPatients: patients.length,
			verifiedPatients,
			pendingVerification,
			incompletePatients,
			averageCompletion
		},
		rates: {
			contactRate: percentage$1(contacted, totalLeads),
			schedulingRate: percentage$1(scheduled, totalLeads),
			activeRate: percentage$1(totalLeads - discarded, totalLeads),
			verificationRate: percentage$1(verifiedPatients, patients.length)
		},
		statusBuckets: buildStatusBuckets(leadOperations),
		serviceBuckets: buildServiceBuckets(leadOperations),
		recommendation,
		source: {
			leadOperations: leadOperations.length,
			patientAdministrativeProfiles: patients.length,
			...params.sourceDiagnostics ? {
				mode: params.sourceDiagnostics.mode,
				usedReadModel: params.sourceDiagnostics.usedReadModel,
				...params.sourceDiagnostics.fallbackReason ? { fallbackReason: params.sourceDiagnostics.fallbackReason } : {},
				checkedReadModelPatients: params.sourceDiagnostics.checkedReadModelPatients
			} : {}
		}
	};
}
function buildOperationalReportCsv(report) {
	return [
		["Métrica", "Valor"],
		["Generado", report.generatedAt],
		["Desde", report.filters.from ?? ""],
		["Hasta", report.filters.to ?? ""],
		["Estado operativo", report.filters.status ?? ""],
		["Prioridad", report.filters.priority ?? ""],
		["Estado administrativo paciente", report.filters.patientStatus ?? ""],
		["Servicio", report.filters.service ?? ""],
		["Fuente", report.filters.source ?? ""],
		["Leads activos", String(report.totals.activeLeads)],
		["Leads totales", String(report.totals.totalLeads)],
		["Tasa de contacto", `${report.rates.contactRate}%`],
		["Seguimientos vencidos", String(report.totals.dueFollowUps)],
		["Verificación administrativa", `${report.rates.verificationRate}%`],
		["Pacientes verificados", String(report.totals.verifiedPatients)],
		["Perfiles pendientes de verificación", String(report.totals.pendingVerification)],
		["Recomendación", report.recommendation]
	].map((row) => row.map((cell) => `"${cell.replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
}
async function getOperationalAnalyticsReport(filters = {}) {
	const source = await getReportingReadSource();
	return buildOperationalAnalyticsReport({
		leadOperations: source.leadOperations,
		patients: source.patients,
		filters: toAppliedFilters(filters),
		sourceDiagnostics: {
			mode: source.mode,
			usedReadModel: source.diagnostics.usedReadModel,
			...source.diagnostics.fallbackReason ? { fallbackReason: source.diagnostics.fallbackReason } : {},
			checkedReadModelPatients: source.diagnostics.checkedReadModelPatients
		}
	});
}
//#endregion
//#region src/routes/api/reports/operational.ts
async function GET$4(request) {
	try {
		const session = requirePermission(request, "reports:read");
		const filters = parseOperationalReportFilters(request);
		const report = await getOperationalAnalyticsReport(filters);
		if (filters.export === "csv") {
			recordOperationalAuditEventSafely({
				action: "report.operational.exported",
				resourceType: "report",
				resourceId: "operational",
				metadata: { format: "csv" }
			}, session);
			return new Response(`${buildOperationalReportCsv(report)}\n`, { headers: {
				"Content-Type": "text/csv; charset=utf-8",
				"Content-Disposition": "attachment; filename=\"dentaloperix-reporte-operativo.csv\""
			} });
		}
		recordOperationalAuditEventSafely({
			action: "report.operational.viewed",
			resourceType: "report",
			resourceId: "operational",
			metadata: { format: "json" }
		}, session);
		return jsonResponse({
			success: true,
			report
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		if (error instanceof InvalidOperationalReportFiltersError) return jsonResponse({
			success: false,
			error: error.message
		}, 400);
		console.error("Failed to build operational report:", error);
		return jsonResponse({
			success: false,
			error: "No se pudo generar el reporte operativo."
		}, 500);
	}
}
//#endregion
//#region src/routes/api/audit/operational.ts
async function GET$3(request) {
	try {
		requirePermission(request, "audit:read");
		const filters = parseOperationalAuditFilters(request);
		return jsonResponse({
			success: true,
			events: await listOperationalAuditEvents(filters),
			filters
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		if (error instanceof InvalidOperationalAuditFiltersError) return jsonResponse({
			success: false,
			error: error.message
		}, 400);
		console.error("Failed to read operational audit trail:", error);
		return jsonResponse({
			success: false,
			error: "No se pudo cargar la auditoría operativa."
		}, 500);
	}
}
//#endregion
//#region src/server/notifications/operational-notifications.ts
var DEFAULT_LIMIT = 20;
var MAX_LIMIT = 50;
var InvalidOperationalNotificationFiltersError = class extends Error {};
function isOperationalNotificationSeverity(value) {
	return value === "info" || value === "attention" || value === "warning";
}
function parseOperationalNotificationFilters(request) {
	const url = new URL(request.url);
	const limitParam = url.searchParams.get("limit")?.trim();
	const severity = url.searchParams.get("severity")?.trim();
	const filters = { limit: DEFAULT_LIMIT };
	if (limitParam) {
		const parsedLimit = Number.parseInt(limitParam, 10);
		if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > MAX_LIMIT) throw new InvalidOperationalNotificationFiltersError(`Invalid limit filter. Use 1-${MAX_LIMIT}.`);
		filters.limit = parsedLimit;
	}
	if (severity) {
		if (!isOperationalNotificationSeverity(severity)) throw new InvalidOperationalNotificationFiltersError("Invalid severity filter.");
		filters.severity = severity;
	}
	return filters;
}
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function getLeadDisplayName(leadOperations) {
	return leadOperations.lead.name || `Lead ${leadOperations.leadId}`;
}
function shouldFollowUp(leadOperations) {
	if (leadOperations.operationalStatus !== "seguimiento") return false;
	if (!leadOperations.nextFollowUpAt) return true;
	const followUpTime = Date.parse(leadOperations.nextFollowUpAt);
	if (Number.isNaN(followUpTime)) return true;
	return followUpTime <= Date.now();
}
function buildLeadNotifications(leadOperations, createdAt) {
	const pendingFollowUps = leadOperations.filter(shouldFollowUp).slice(0, 8).map((item) => ({
		id: `lead-follow-up-${item.leadId}`,
		type: "lead.follow_up.pending",
		severity: "attention",
		title: "Seguimiento operativo pendiente",
		description: `${getLeadDisplayName(item)} requiere acompañamiento administrativo sin presión comercial.`,
		createdAt,
		resourceType: "lead",
		resourceId: item.leadId,
		audience: ["admin", "assistant"],
		metadata: {
			status: item.operationalStatus,
			priority: item.priority,
			nextFollowUpAt: item.nextFollowUpAt || null
		}
	}));
	const highPriority = leadOperations.filter((item) => item.priority === "alta" && item.operationalStatus !== "descartado").slice(0, 5).map((item) => ({
		id: `lead-high-priority-${item.leadId}`,
		type: "lead.priority.high",
		severity: "warning",
		title: "Lead marcado como prioridad alta",
		description: `${getLeadDisplayName(item)} está marcado para atención cuidadosa del equipo operativo.`,
		createdAt,
		resourceType: "lead",
		resourceId: item.leadId,
		audience: ["admin", "assistant"],
		metadata: {
			status: item.operationalStatus,
			nextFollowUpAt: item.nextFollowUpAt || null
		}
	}));
	return [...pendingFollowUps, ...highPriority];
}
function buildPatientNotifications(patients, createdAt) {
	const incompleteProfiles = patients.filter((patient) => patient.missingFields.length > 0).slice(0, 8).map((patient) => ({
		id: `patient-incomplete-${patient.id}`,
		type: "patient.admin_profile.incomplete",
		severity: "attention",
		title: "Perfil administrativo incompleto",
		description: `${patient.displayName} tiene datos administrativos pendientes de completar.`,
		createdAt,
		resourceType: "patient",
		resourceId: patient.id,
		audience: ["admin", "assistant"],
		metadata: {
			completionPercentage: patient.completionPercentage,
			missingFields: patient.missingFields.join(", ")
		}
	}));
	const pendingVerification = patients.filter((patient) => patient.administrativeStatus === "pending-verification").slice(0, 8).map((patient) => ({
		id: `patient-verification-${patient.id}`,
		type: "patient.profile.verification.pending",
		severity: "info",
		title: "Perfil pendiente de verificación",
		description: `${patient.displayName} está listo para revisión administrativa.`,
		createdAt,
		resourceType: "patient",
		resourceId: patient.id,
		audience: ["admin", "assistant"],
		metadata: { completionPercentage: patient.completionPercentage }
	}));
	return [...incompleteProfiles, ...pendingVerification];
}
async function buildAuditNotifications(createdAt) {
	return (await listOperationalAuditEvents({ limit: 5 })).map((event) => ({
		id: `audit-recent-${event.id}`,
		type: event.resourceType === "report" ? "report.activity.recent" : "audit.activity.recent",
		severity: "info",
		title: event.resourceType === "report" ? "Actividad reciente de reportes" : "Actividad operativa reciente",
		description: `${event.actorName || event.actorEmail || event.actorRole} registró ${event.action}.`,
		createdAt: event.timestamp || createdAt,
		resourceType: event.resourceType === "report" ? "report" : "audit",
		resourceId: event.resourceId,
		audience: ["admin"],
		metadata: {
			action: event.action,
			actorRole: event.actorRole
		}
	}));
}
function priorityRank(notification) {
	if (notification.severity === "warning") return 0;
	if (notification.severity === "attention") return 1;
	return 2;
}
async function getOperationalNotifications(filters, role) {
	const generatedAt = nowIso();
	const [leadOperations, patients, auditNotifications] = await Promise.all([
		listLeadOperationsProfiles(),
		listPatientAdministrativeProfiles(),
		buildAuditNotifications(generatedAt)
	]);
	const notifications = [
		...buildLeadNotifications(leadOperations, generatedAt),
		...buildPatientNotifications(patients, generatedAt),
		...auditNotifications
	].filter((notification) => notification.audience.includes(role)).filter((notification) => !filters.severity || notification.severity === filters.severity).sort((a, b) => priorityRank(a) - priorityRank(b) || b.createdAt.localeCompare(a.createdAt)).slice(0, filters.limit);
	return {
		notifications,
		summary: {
			total: notifications.length,
			attention: notifications.filter((item) => item.severity === "attention").length,
			warnings: notifications.filter((item) => item.severity === "warning").length,
			generatedAt
		}
	};
}
//#endregion
//#region src/routes/api/notifications/operational.ts
async function GET$2(request) {
	try {
		const session = requirePermission(request, "notifications:read");
		return jsonResponse({
			success: true,
			...await getOperationalNotifications(parseOperationalNotificationFilters(request), session.role)
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		if (error instanceof InvalidOperationalNotificationFiltersError) return jsonResponse({
			success: false,
			error: error.message
		}, 400);
		console.error("Failed to build operational notifications:", error);
		return jsonResponse({
			success: false,
			error: "No se pudieron cargar las notificaciones operativas."
		}, 500);
	}
}
//#endregion
//#region src/server/kpis/read-source.ts
async function getOperationalKpisReadSource() {
	return await getReadModelSource({ consumerName: "Operational Analytics" });
}
//#endregion
//#region src/server/kpis/operational-kpis.ts
function percentage(part, total) {
	if (!total) return 0;
	return Math.round(part / total * 100);
}
function isScheduledStatus(value) {
	const normalized = (value ?? "").toLowerCase().trim();
	return normalized === "agendada" || normalized === "confirmada" || normalized === "completada";
}
function isDueFollowUp(leadOperations) {
	if (leadOperations.operationalStatus !== "seguimiento") return false;
	if (!leadOperations.nextFollowUpAt) return true;
	const followUpTime = Date.parse(leadOperations.nextFollowUpAt);
	return Number.isNaN(followUpTime) || followUpTime <= Date.now();
}
function countPatientsByStatus(patients, status) {
	return patients.filter((patient) => patient.administrativeStatus === status).length;
}
function buildHealthSummary(params) {
	const risks = [
		params.dueFollowUps,
		params.pendingVerification,
		params.incompletePatients
	].filter((value) => value > 0).length;
	const score = Math.max(0, Math.min(100, 70 + Math.round(params.verificationRate * .15) + Math.round(params.conversionRate * .15) - params.dueFollowUps * 4 - params.pendingVerification * 2 - params.incompletePatients * 2));
	const status = score >= 80 && risks === 0 ? "stable" : score >= 60 ? "attention" : "watch";
	const recommendations = [];
	if (params.dueFollowUps > 0) recommendations.push("Revisar seguimientos vencidos con acompañamiento claro y sin presión comercial.");
	if (params.pendingVerification > 0) recommendations.push("Priorizar verificación administrativa de perfiles listos para revisión.");
	if (params.incompletePatients > 0) recommendations.push("Completar datos administrativos faltantes antes de escalar nuevos procesos.");
	if (!recommendations.length) recommendations.push("Mantener monitoreo operativo y revisar tendencias antes de abrir nuevas fases.");
	return {
		score,
		status,
		summary: status === "stable" ? "La operación muestra estabilidad administrativa y trazabilidad suficiente." : "La operación requiere seguimiento administrativo focalizado en pendientes internos.",
		recommendations
	};
}
function buildOperationalExecutiveKpis(params) {
	const leadOperations = params.leadOperations;
	const patients = params.patients;
	const auditEvents = params.auditEvents;
	const totalLeads = leadOperations.length;
	const closedLeads = leadOperations.filter((lead) => lead.operationalStatus === "descartado").length;
	const activeLeads = totalLeads - closedLeads;
	const pendingLeads = leadOperations.filter((lead) => lead.operationalStatus === "nuevo" || lead.operationalStatus === "seguimiento").length;
	const highPriority = leadOperations.filter((lead) => lead.priority === "alta" && lead.operationalStatus !== "descartado").length;
	const dueFollowUps = leadOperations.filter(isDueFollowUp).length;
	const scheduled = leadOperations.filter((lead) => isScheduledStatus(lead.lead.status)).length;
	const verifiedPatients = countPatientsByStatus(patients, "verified");
	const pendingVerification = countPatientsByStatus(patients, "pending-verification");
	const incompletePatients = countPatientsByStatus(patients, "incomplete");
	const averageCompletion = patients.length ? Math.round(patients.reduce((sum, patient) => sum + patient.completionPercentage, 0) / patients.length) : 0;
	const patientUpdates = auditEvents.filter((event) => event.action === "patient.admin_profile.updated" || event.action === "patient.profile.verified").length;
	const leadUpdates = auditEvents.filter((event) => event.action === "lead.operations.updated").length;
	const reportViews = auditEvents.filter((event) => event.action === "report.operational.viewed").length;
	const reportExports = auditEvents.filter((event) => event.action === "report.operational.exported").length;
	const conversionRate = percentage(scheduled, totalLeads);
	const verificationRate = percentage(verifiedPatients, patients.length);
	const health = buildHealthSummary({
		dueFollowUps,
		pendingVerification,
		incompletePatients,
		verificationRate,
		conversionRate
	});
	return {
		generatedAt: params.generatedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
		scope: "administrative-operational",
		limits: [
			"No crea citas.",
			"No modifica Calendar.",
			"No envía Gmail.",
			"No usa información clínica.",
			"No contiene diagnósticos ni tratamientos clínicos."
		],
		leads: {
			total: totalLeads,
			active: activeLeads,
			pending: pendingLeads,
			closed: closedLeads,
			highPriority,
			dueFollowUps,
			conversionRate
		},
		patients: {
			total: patients.length,
			verified: verifiedPatients,
			pendingVerification,
			incomplete: incompletePatients,
			verificationRate,
			averageCompletion
		},
		audit: {
			eventsLast30Days: auditEvents.length,
			patientUpdates,
			leadUpdates,
			reportViews,
			reportExports
		},
		reports: {
			generated: reportViews + reportExports,
			csvExports: reportExports,
			jsonViews: reportViews
		},
		health,
		source: {
			leadOperations: leadOperations.length,
			patientAdministrativeProfiles: patients.length,
			...params.sourceDiagnostics ? {
				mode: params.sourceDiagnostics.mode,
				usedReadModel: params.sourceDiagnostics.usedReadModel,
				...params.sourceDiagnostics.fallbackReason ? { fallbackReason: params.sourceDiagnostics.fallbackReason } : {},
				checkedReadModelPatients: params.sourceDiagnostics.checkedReadModelPatients
			} : {}
		},
		trends: {
			leadStatus: [
				{
					label: "Activos",
					value: activeLeads,
					percentage: percentage(activeLeads, totalLeads)
				},
				{
					label: "Pendientes",
					value: pendingLeads,
					percentage: percentage(pendingLeads, totalLeads)
				},
				{
					label: "Cerrados",
					value: closedLeads,
					percentage: percentage(closedLeads, totalLeads)
				}
			],
			patientStatus: [
				{
					label: "Verificados",
					value: verifiedPatients,
					percentage: verificationRate
				},
				{
					label: "Pendientes",
					value: pendingVerification,
					percentage: percentage(pendingVerification, patients.length)
				},
				{
					label: "Incompletos",
					value: incompletePatients,
					percentage: percentage(incompletePatients, patients.length)
				}
			],
			activity: [
				{
					label: "Pacientes",
					value: patientUpdates,
					percentage: percentage(patientUpdates, auditEvents.length)
				},
				{
					label: "Leads",
					value: leadUpdates,
					percentage: percentage(leadUpdates, auditEvents.length)
				},
				{
					label: "Reportes",
					value: reportViews + reportExports,
					percentage: percentage(reportViews + reportExports, auditEvents.length)
				}
			]
		}
	};
}
function thirtyDaysAgoIso() {
	const date = /* @__PURE__ */ new Date();
	date.setDate(date.getDate() - 30);
	return date.toISOString();
}
async function getOperationalExecutiveKpis() {
	const [source, auditEvents] = await Promise.all([getOperationalKpisReadSource(), listOperationalAuditEvents({
		limit: 250,
		from: thirtyDaysAgoIso()
	})]);
	return buildOperationalExecutiveKpis({
		leadOperations: source.leadOperations,
		patients: source.patients,
		auditEvents,
		sourceDiagnostics: {
			mode: source.mode,
			usedReadModel: source.diagnostics.usedReadModel,
			...source.diagnostics.fallbackReason ? { fallbackReason: source.diagnostics.fallbackReason } : {},
			checkedReadModelPatients: source.diagnostics.checkedReadModelPatients
		}
	});
}
//#endregion
//#region src/routes/api/kpis/operational.ts
async function GET$1(request) {
	try {
		requirePermission(request, "kpis:read");
		return jsonResponse({
			success: true,
			kpis: await getOperationalExecutiveKpis()
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		console.error("Failed to build operational KPIs:", error);
		return jsonResponse({
			success: false,
			error: "No se pudieron cargar los KPIs operativos."
		}, 500);
	}
}
//#endregion
//#region src/server/data-quality/read-source.ts
async function getDataQualityReadSource() {
	return await getReadModelSource({ consumerName: "Data Quality" });
}
//#endregion
//#region src/server/data-quality/operational-data-quality.ts
var PLACEHOLDER_VALUES = new Set([
	"correo no registrado",
	"telefono no registrado",
	"teléfono no registrado",
	"paciente sin nombre",
	"servicio por definir",
	"sin canal",
	"sin folio"
]);
function normalizeComparable(value) {
	return (value ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ");
}
function isPlaceholderValue(value) {
	return PLACEHOLDER_VALUES.has(normalizeComparable(value));
}
function hasValue(value) {
	const normalized = (value ?? "").trim();
	return Boolean(normalized) && !isPlaceholderValue(normalized);
}
function isValidEmail(value) {
	const normalized = (value ?? "").trim();
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}
function hasValidEmail(value) {
	return hasValue(value) && isValidEmail(value);
}
function looksLikeMisplacedService(value) {
	const normalized = normalizeComparable(value);
	return /odontologia|ortodoncia|diseno|diseño|sonrisa|implante|odontopediatria|blanqueamiento|limpieza|consulta|servicio|tratamiento/.test(normalized);
}
function normalizeEmail(value) {
	const normalized = (value ?? "").trim().toLowerCase();
	return isValidEmail(normalized) ? normalized : "";
}
function normalizePhone(value) {
	const digits = (value ?? "").replace(/\D+/g, "");
	return digits.length >= 7 ? digits : "";
}
function normalizeName(value) {
	const normalized = (value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
	if (!hasValue(normalized) || normalized.includes("@")) return "";
	return normalized;
}
function createIssue(input) {
	const resourceId = input.resourceId ? `-${input.resourceId}` : "";
	return {
		id: `${input.type}-${input.resourceType}${resourceId}`,
		...input
	};
}
function buildPatientIssues(patients) {
	const issues = [];
	for (const patient of patients) {
		if (!hasValue(patient.email)) issues.push(createIssue({
			type: "patient.email.missing",
			severity: "warning",
			resourceType: "patient",
			resourceId: patient.id,
			title: "Paciente sin email administrativo",
			description: `${patient.displayName} no tiene email administrativo registrado.`,
			recommendation: "Solicitar y registrar el correo en el perfil administrativo cuando el paciente lo comparta."
		}));
		else if (!hasValidEmail(patient.email)) issues.push(createIssue({
			type: "patient.email.invalid",
			severity: "warning",
			resourceType: "patient",
			resourceId: patient.id,
			title: "Email administrativo inválido",
			description: `${patient.displayName} tiene un valor que no parece correo válido en el campo email.`,
			recommendation: "Revisar el origen del dato antes de usarlo para seguimiento o deduplicación."
		}));
		if (!hasValue(patient.phone)) issues.push(createIssue({
			type: "patient.phone.missing",
			severity: "critical",
			resourceType: "patient",
			resourceId: patient.id,
			title: "Paciente sin teléfono administrativo",
			description: `${patient.displayName} no tiene teléfono registrado para seguimiento operativo.`,
			recommendation: "Completar el teléfono administrativo antes de coordinar nuevos pasos operativos."
		}));
		if (!hasValue(patient.firstName) || !hasValue(patient.lastName)) issues.push(createIssue({
			type: "patient.name.incomplete",
			severity: "info",
			resourceType: "patient",
			resourceId: patient.id,
			title: "Nombre administrativo incompleto",
			description: `${patient.displayName} requiere separación de nombre y apellidos.`,
			recommendation: "Completar nombre y apellidos con claridad para evitar duplicados administrativos."
		}));
		if (!hasValue(patient.birthDate)) issues.push(createIssue({
			type: "patient.birth_date.missing",
			severity: "info",
			resourceType: "patient",
			resourceId: patient.id,
			title: "Fecha de nacimiento faltante",
			description: `${patient.displayName} no tiene fecha de nacimiento administrativa registrada.`,
			recommendation: "Completar la fecha de nacimiento únicamente cuando el paciente la proporcione en un contexto administrativo apropiado."
		}));
		if (!hasValue(patient.address)) issues.push(createIssue({
			type: "patient.address.missing",
			severity: "info",
			resourceType: "patient",
			resourceId: patient.id,
			title: "Dirección administrativa faltante",
			description: `${patient.displayName} no tiene dirección administrativa registrada.`,
			recommendation: "Registrar la dirección solo cuando sea necesaria para la operación y el paciente la comparta voluntariamente."
		}));
		if (!hasValue(patient.emergencyContact)) issues.push(createIssue({
			type: "patient.emergency_contact.missing",
			severity: "info",
			resourceType: "patient",
			resourceId: patient.id,
			title: "Contacto de emergencia faltante",
			description: `${patient.displayName} no tiene contacto de emergencia administrativo.`,
			recommendation: "Solicitar el contacto de emergencia en un momento apropiado y sin presionar al paciente."
		}));
		if (!hasValue(patient.preferredContactMethod)) issues.push(createIssue({
			type: "patient.preferred_contact_method.missing",
			severity: "info",
			resourceType: "patient",
			resourceId: patient.id,
			title: "Método de contacto preferido faltante",
			description: `${patient.displayName} no tiene método de contacto preferido registrado.`,
			recommendation: "Definir el método preferido de contacto para mejorar el seguimiento operativo sin generar presión comercial."
		}));
		if (patient.administrativeStatus !== "verified") issues.push(createIssue({
			type: "patient.verification.pending",
			severity: patient.administrativeStatus === "incomplete" ? "warning" : "info",
			resourceType: "patient",
			resourceId: patient.id,
			title: "Perfil pendiente de verificación",
			description: `${patient.displayName} aún no está verificado administrativamente.`,
			recommendation: "Revisar los campos administrativos faltantes y verificar el perfil cuando esté completo.",
			metadata: { completionPercentage: patient.completionPercentage }
		}));
	}
	return issues;
}
function buildLeadIssues(leadOperations) {
	const issues = [];
	for (const profile of leadOperations) {
		const name = profile.lead.name || "Lead sin nombre";
		if (profile.operationalStatus === "seguimiento" && !hasValue(profile.nextFollowUpAt)) issues.push(createIssue({
			type: "lead.followup.missing",
			severity: "warning",
			resourceType: "lead",
			resourceId: profile.leadId,
			title: "Lead en seguimiento sin próxima fecha",
			description: `${name} está en seguimiento pero no tiene próxima fecha definida.`,
			recommendation: "Definir una próxima fecha de contacto clara, respetuosa y sin presión comercial."
		}));
		if (!hasValue(profile.lead.phone)) issues.push(createIssue({
			type: "lead.phone.missing",
			severity: "critical",
			resourceType: "lead",
			resourceId: profile.leadId,
			title: "Lead sin teléfono",
			description: `${name} no tiene teléfono para seguimiento operativo.`,
			recommendation: "Completar el teléfono desde una fuente administrativa válida antes de intentar seguimiento."
		}));
		if (!hasValue(profile.lead.email)) issues.push(createIssue({
			type: "lead.email.missing",
			severity: "info",
			resourceType: "lead",
			resourceId: profile.leadId,
			title: "Lead sin email",
			description: `${name} no tiene email registrado.`,
			recommendation: "Registrar email solo si el paciente lo proporciona o si ya consta en una fuente administrativa confiable."
		}));
		else if (!hasValidEmail(profile.lead.email)) issues.push(createIssue({
			type: "lead.email.invalid",
			severity: "warning",
			resourceType: "lead",
			resourceId: profile.leadId,
			title: "Email de lead inválido",
			description: `${name} tiene un valor no compatible con email en el campo de correo.`,
			recommendation: "Revisar la fila origen; puede existir un dato desplazado desde tratamiento o interés.",
			metadata: { looksLikeService: looksLikeMisplacedService(profile.lead.email) }
		}));
		if (looksLikeMisplacedService(profile.lead.email) && !hasValue(profile.lead.treatment)) issues.push(createIssue({
			type: "consistency.source_mapping.suspect",
			severity: "warning",
			resourceType: "consistency",
			resourceId: `lead-${profile.leadId}`,
			title: "Posible columna CRM desalineada",
			description: `${name} tiene un posible servicio o interés en el campo email.`,
			recommendation: "Revisar la fila en la fuente CRM antes de editar el perfil administrativo. Esta revisión no corrige datos automáticamente."
		}));
		if (!hasValue(profile.operationalStatus)) issues.push(createIssue({
			type: "lead.operational_status.missing",
			severity: "warning",
			resourceType: "lead",
			resourceId: profile.leadId,
			title: "Lead sin estado operativo",
			description: `${name} no tiene estado operativo interpretable.`,
			recommendation: "Clasificar el lead como nuevo, contactado, seguimiento o descartado según corresponda."
		}));
	}
	return issues;
}
function groupByNormalizedValue(items, getValue) {
	const groups = /* @__PURE__ */ new Map();
	for (const item of items) {
		const value = getValue(item);
		if (!value) continue;
		groups.set(value, [...groups.get(value) ?? [], item]);
	}
	return [...groups.entries()].filter(([, group]) => group.length > 1);
}
function buildConsistencyIssues(patients) {
	const issues = [];
	const emailGroups = groupByNormalizedValue(patients, (patient) => normalizeEmail(patient.email));
	const phoneGroups = groupByNormalizedValue(patients, (patient) => normalizePhone(patient.phone));
	const nameGroups = groupByNormalizedValue(patients, (patient) => normalizeName(patient.displayName));
	for (const [email, group] of emailGroups) issues.push(createIssue({
		type: "consistency.email.duplicate",
		severity: "warning",
		resourceType: "consistency",
		resourceId: `email-${email}`,
		title: "Email duplicado en perfiles administrativos",
		description: `${group.length} perfiles comparten el email ${email}.`,
		recommendation: "Revisar si corresponden al mismo paciente antes de realizar nuevas actualizaciones administrativas.",
		metadata: { duplicateCount: group.length }
	}));
	for (const [phone, group] of phoneGroups) issues.push(createIssue({
		type: "consistency.phone.duplicate",
		severity: "warning",
		resourceType: "consistency",
		resourceId: `phone-${phone}`,
		title: "Teléfono duplicado en perfiles administrativos",
		description: `${group.length} perfiles comparten el teléfono terminado en ${phone.slice(-4) || "N/D"}.`,
		recommendation: "Confirmar si se trata del mismo paciente o de un contacto compartido antes de fusionar información.",
		metadata: { duplicateCount: group.length }
	}));
	for (const [name, group] of nameGroups) {
		if (name === "paciente sin nombre") continue;
		issues.push(createIssue({
			type: "consistency.patient.duplicate_candidate",
			severity: "info",
			resourceType: "consistency",
			resourceId: `name-${name}`,
			title: "Posible paciente duplicado por nombre",
			description: `${group.length} perfiles comparten el nombre ${name}.`,
			recommendation: "Comparar email, teléfono y fuente antes de decidir si existe duplicidad administrativa.",
			metadata: { duplicateCount: group.length }
		}));
	}
	return issues;
}
function summarize(issues, checkedPatients, checkedLeads, readSource = {
	mode: "legacy-leads",
	usedReadModel: false,
	checkedReadModelPatients: 0
}) {
	const critical = issues.filter((issue) => issue.severity === "critical").length;
	const warnings = issues.filter((issue) => issue.severity === "warning").length;
	const info = issues.filter((issue) => issue.severity === "info").length;
	const duplicateGroups = issues.filter((issue) => issue.resourceType === "consistency").length;
	const score = Math.max(0, Math.min(100, 100 - critical * 12 - warnings * 6 - info * 2));
	const status = score >= 85 ? "healthy" : score >= 60 ? "attention" : "risk";
	const recommendations = [];
	if (critical > 0) recommendations.push("Resolver primero datos críticos de contacto: teléfonos faltantes en leads o pacientes.");
	if (warnings > 0) recommendations.push("Revisar seguimientos, verificación administrativa y duplicados antes de escalar nuevas operaciones.");
	if (duplicateGroups > 0) recommendations.push("Validar posibles duplicados manualmente; esta fase no fusiona ni corrige registros automáticamente.");
	if (issues.some((issue) => issue.type === "consistency.source_mapping.suspect" || issue.type === "lead.email.invalid" || issue.type === "patient.email.invalid")) recommendations.push("Revisar filas fuente con valores no compatibles antes de confiar en deduplicación por email.");
	if (!recommendations.length) recommendations.push("Mantener revisión periódica de calidad operativa antes de abrir flujos clínicos.");
	return {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		scope: "administrative-operational",
		limits: [
			"Solo revisa datos administrativos y operativos.",
			"No modifica registros automáticamente.",
			"No incluye historia clínica, diagnóstico, tratamientos, odontograma ni radiografías."
		],
		score,
		status,
		totals: {
			issues: issues.length,
			critical,
			warnings,
			info,
			checkedPatients,
			checkedLeads,
			duplicateGroups
		},
		issues: issues.slice(0, 50),
		recommendations,
		readSource
	};
}
function buildOperationalDataQualitySummary(params) {
	return summarize([
		...buildPatientIssues(params.patients),
		...buildLeadIssues(params.leadOperations),
		...buildConsistencyIssues(params.patients)
	], params.patients.length, params.leadOperations.length);
}
async function getOperationalDataQualitySummary() {
	const source = await getDataQualityReadSource();
	return {
		...buildOperationalDataQualitySummary({
			patients: source.patients,
			leadOperations: source.leadOperations
		}),
		readSource: {
			mode: source.mode,
			usedReadModel: source.diagnostics.usedReadModel,
			fallbackReason: source.diagnostics.fallbackReason,
			checkedReadModelPatients: source.diagnostics.checkedReadModelPatients
		}
	};
}
//#endregion
//#region src/routes/api/data-quality/operational.ts
async function GET(request) {
	try {
		requirePermission(request, "dataQuality:read");
		return jsonResponse({
			success: true,
			quality: await getOperationalDataQualitySummary()
		});
	} catch (error) {
		if (error instanceof UnauthorizedError) return createUnauthorizedResponse();
		if (error instanceof ForbiddenError) return createForbiddenResponse();
		console.error("Failed to build operational data quality summary:", error);
		return jsonResponse({
			success: false,
			error: "No se pudo cargar la calidad de datos operativa."
		}, 500);
	}
}
//#endregion
//#region src/server.ts
var DASHBOARD_ROUTE_POLICIES = [
	{
		prefix: "/admin",
		allowedRoles: ["admin"]
	},
	{
		prefix: "/assistant",
		allowedRoles: ["assistant"]
	},
	{
		prefix: "/doctor",
		allowedRoles: ["doctor"]
	},
	{
		prefix: "/patient",
		allowedRoles: ["patient"]
	}
];
function getProtectedDashboardPolicy(pathname) {
	if (pathname === "/admin/login") return null;
	return DASHBOARD_ROUTE_POLICIES.find((policy) => pathname === policy.prefix || pathname.startsWith(`${policy.prefix}/`)) ?? null;
}
function createDashboardLoginRedirect(request) {
	const url = new URL(request.url);
	const loginUrl = new URL("/admin/login", url.origin);
	loginUrl.searchParams.set("redirect", `${url.pathname}${url.search}`);
	return Response.redirect(loginUrl.toString(), 302);
}
function createDashboardForbiddenResponse(allowedRoles) {
	return new Response(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Acceso restringido — DentalOperix</title></head><body style="font-family:system-ui,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#f7f4ef;color:#1f2933"><main style="max-width:560px;margin:24px;padding:32px;border:1px solid #e5e7eb;border-radius:24px;background:white;text-align:center;box-shadow:0 20px 45px rgba(15,23,42,.08)"><p style="margin:0 0 12px;text-transform:uppercase;letter-spacing:.18em;color:#64748b;font-size:12px">Acceso restringido</p><h1 style="margin:0 0 16px;font-size:28px">No tienes permiso para ver esta área</h1><p style="margin:0;color:#64748b;line-height:1.6">Esta sección está disponible únicamente para los roles autorizados: ${allowedRoles.join(", ")}.</p><a href="/" style="display:inline-block;margin-top:24px;padding:10px 18px;border-radius:999px;background:#0f766e;color:white;text-decoration:none;font-weight:600">Volver al inicio</a></main></body></html>`, {
		status: 403,
		headers: { "Content-Type": "text/html; charset=utf-8" }
	});
}
function enforceProtectedDashboardAccess(request) {
	const policy = getProtectedDashboardPolicy(new URL(request.url).pathname);
	if (!policy) return null;
	const session = getAuthSessionFromRequest(request);
	if (!session) return createDashboardLoginRedirect(request);
	if (!isRoleAllowed(session.role, policy.allowedRoles)) return createDashboardForbiddenResponse(policy.allowedRoles);
	return null;
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./assets/server-BJtKKphm.js").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!body.includes("\"unhandled\":true") || !body.includes("\"message\":\"HTTPError\"")) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
var server_default = { async fetch(request, env, ctx) {
	try {
		const url = new URL(request.url);
		const config = getServerConfig();
		const isProd = config.nodeEnv === "production";
		const dashboardAccessResponse = enforceProtectedDashboardAccess(request);
		if (dashboardAccessResponse) return dashboardAccessResponse;
		if (isProd && !config.googleRefreshToken) {
			if (url.pathname === "/dashboard") return new Response("Dashboard is unavailable in production without a configured Google refresh token.", {
				status: 403,
				headers: { "Content-Type": "text/plain; charset=utf-8" }
			});
			if (url.pathname === "/api/leads/list" || url.pathname === "/api/crm/metrics") return new Response(JSON.stringify({
				success: false,
				error: "Leads access is restricted in production."
			}), {
				status: 403,
				headers: { "Content-Type": "application/json" }
			});
		}
		if (url.pathname === "/api/admin/login" && request.method === "POST") return await POST$3(request);
		if (url.pathname === "/api/admin/logout" && request.method === "POST") return await POST$2();
		if (url.pathname === "/api/admin/session" && request.method === "GET") return await GET$10(request);
		if (url.pathname === "/api/google/login" && request.method === "GET") return await GET$15(request);
		if (url.pathname === "/api/google/callback" && request.method === "GET") return await GET$14(request);
		if (url.pathname === "/api/leads/create" && request.method === "POST") return await POST$7(request);
		if (url.pathname === "/api/leads/list" && request.method === "GET") return await GET$13(request);
		if (url.pathname === "/api/crm/metrics" && request.method === "GET") return await GET$12(request);
		if (url.pathname === "/api/goals/get" && request.method === "GET") return await GET$9(request);
		if (url.pathname === "/api/goals/save" && request.method === "POST") return await POST$1(request);
		if (url.pathname === "/api/calendar/create-event" && request.method === "POST") return await POST$6(request);
		if (url.pathname === "/api/gmail/send-confirmation" && request.method === "POST") return await POST$5(request);
		if (url.pathname === "/api/followups/run" && request.method === "POST") return await POST$4(request);
		if (url.pathname === "/api/followups/history" && request.method === "GET") return await GET$11(request);
		if (url.pathname === "/api/patients/list" && request.method === "GET") return await GET$8(request);
		const patientAdminProfileMatch = url.pathname.match(/^\/api\/patients\/([^/]+)\/admin-profile$/);
		if (patientAdminProfileMatch && request.method === "PATCH") {
			const nextUrl = new URL(request.url);
			nextUrl.searchParams.set("id", decodeURIComponent(patientAdminProfileMatch[1]));
			return await PATCH$1(new Request(nextUrl.toString(), request));
		}
		const patientVerifyProfileMatch = url.pathname.match(/^\/api\/patients\/([^/]+)\/verify-profile$/);
		if (patientVerifyProfileMatch && request.method === "POST") {
			const nextUrl = new URL(request.url);
			nextUrl.searchParams.set("id", decodeURIComponent(patientVerifyProfileMatch[1]));
			return await POST(new Request(nextUrl.toString(), request));
		}
		const patientDetailMatch = url.pathname.match(/^\/api\/patients\/([^/]+)$/);
		if (patientDetailMatch && request.method === "GET") {
			const nextUrl = new URL(request.url);
			nextUrl.searchParams.set("id", decodeURIComponent(patientDetailMatch[1]));
			return await GET$7(new Request(nextUrl.toString(), request));
		}
		if (url.pathname === "/api/leads/operations" && request.method === "GET") return await GET$6(request);
		const leadOperationsMatch = url.pathname.match(/^\/api\/leads\/([^/]+)\/operations$/);
		if (leadOperationsMatch) {
			const nextUrl = new URL(request.url);
			nextUrl.searchParams.set("id", decodeURIComponent(leadOperationsMatch[1]));
			const nextRequest = new Request(nextUrl.toString(), request);
			if (request.method === "GET") return await GET$5(nextRequest);
			if (request.method === "PATCH") return await PATCH(nextRequest);
		}
		if (url.pathname === "/api/reports/operational" && request.method === "GET") return await GET$4(request);
		if (url.pathname === "/api/audit/operational" && request.method === "GET") return await GET$3(request);
		if (url.pathname === "/api/notifications/operational" && request.method === "GET") return await GET$2(request);
		if (url.pathname === "/api/kpis/operational" && request.method === "GET") return await GET$1(request);
		if (url.pathname === "/api/data-quality/operational" && request.method === "GET") return await GET(request);
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { validateGoalSettings as a, dental_server_exports as c, findDentalService as d, server_default as default, getDentalServiceById as f, saveGoalSettings as i, formatDateMX as l, renderErrorPage as m, getDefaultGoals as n, getPeriodLabel as o, isRoleAllowed as p, loadGoalSettings as r, mockLeads as s, derivePatientAdministrativeProfiles as t, DENTAL_SERVICES as u };
