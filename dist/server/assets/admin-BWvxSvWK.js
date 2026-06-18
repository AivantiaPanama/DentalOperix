import { n as getDefaultGoals, r as loadGoalSettings } from "../server.js";
import { t as Button } from "./button-BLeLDVKM.js";
import { t as AdminLayout } from "./AdminLayout-DppqpWwN.js";
import { t as RoleRouteGuard } from "./RoleRouteGuard-CK45NeIZ.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BATy6eNr.js";
import { o as fetchCRMmetrics, t as currencyFormatter } from "./dashboard-insights-rz6eolrX.js";
import { t as Badge } from "./badge-BT5ORwAW.js";
import { n as OperationalKpisPanel, r as OperationalNotificationsPanel, t as OperationalDataQualityPanel } from "./OperationalDataQualityPanel-Bk93eULm.js";
import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import { Activity, ArrowRight, CalendarDays, ClipboardList, LineChart, RefreshCcw, Settings, Target, Users, Workflow } from "lucide-react";
//#region src/components/admin/AdminHomeDashboard.tsx
var _jsxFileName$1 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/AdminHomeDashboard.tsx";
var emptyState = {
	metrics: null,
	leads: [],
	goals: getDefaultGoals(),
	automationMetrics: null,
	fallbackLeads: false
};
var moduleCards = [
	{
		title: "Dashboard CRM",
		description: "Métricas, tendencias, objetivos y análisis comercial completo.",
		to: "/admin/dashboard",
		icon: LineChart
	},
	{
		title: "Leads y CRM",
		description: "Consulta el pipeline desde Google Sheets y estado operativo de pacientes.",
		to: "/admin/dashboard",
		icon: Users
	},
	{
		title: "Automatizaciones",
		description: "Ejecuta followups, revisa historial y audita envíos automatizados.",
		to: "/admin/automation",
		icon: Workflow
	},
	{
		title: "Configuración",
		description: "Preparado para metas, usuarios, permisos y parámetros administrativos.",
		to: "/admin/dashboard",
		icon: Settings
	}
];
function percent(value) {
	return `${Number(value ?? 0).toFixed(1)}%`;
}
function formatDate(value) {
	if (!value) return "Pendiente";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("es-PA", { dateStyle: "medium" }).format(date);
}
function statusTone(status) {
	if (status === "agendada" || status === "completada") return "bg-emerald-50 text-emerald-700";
	if (status === "cancelada" || status === "no asistió") return "bg-red-50 text-red-700";
	return "bg-amber-50 text-amber-700";
}
function calculateAutomationMetrics(records = []) {
	return records.reduce((metrics, record) => {
		metrics.totalRuns += 1;
		if (record.dryRun) metrics.dryRuns += 1;
		else metrics.realRuns += 1;
		if (record.status === "success") metrics.successfulRuns += 1;
		else if (record.status === "partial") metrics.partialRuns += 1;
		else metrics.failedRuns += 1;
		metrics.generated += record.generated;
		metrics.sent += record.sent;
		metrics.skipped += record.skipped;
		metrics.failed += record.failed;
		return metrics;
	}, {
		totalRuns: 0,
		dryRuns: 0,
		realRuns: 0,
		successfulRuns: 0,
		partialRuns: 0,
		failedRuns: 0,
		generated: 0,
		sent: 0,
		skipped: 0,
		failed: 0
	});
}
function AdminHomeDashboard() {
	const [state, setState] = useState(emptyState);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const loadDashboard = async () => {
		setLoading(true);
		setError(null);
		try {
			const [metricsResult, leadsResult, goalsResult, automationResult] = await Promise.allSettled([
				fetchCRMmetrics("thisMonth"),
				fetch("/api/leads/list", { credentials: "same-origin" }).then(async (response) => {
					const payload = await response.json();
					if (!response.ok) throw new Error(payload.error ?? "No se pudieron cargar leads.");
					return payload;
				}),
				loadGoalSettings(),
				fetch("/api/followups/history", { credentials: "same-origin" }).then(async (response) => {
					const payload = await response.json();
					if (!response.ok || !payload.success) throw new Error(payload.error ?? "No se pudo cargar automatización.");
					return payload;
				})
			]);
			const metrics = metricsResult.status === "fulfilled" ? metricsResult.value : null;
			const leadsPayload = leadsResult.status === "fulfilled" ? leadsResult.value : null;
			const goals = goalsResult.status === "fulfilled" ? goalsResult.value : getDefaultGoals();
			const automation = automationResult.status === "fulfilled" ? automationResult.value : null;
			setState({
				metrics,
				leads: leadsPayload?.leads ?? [],
				fallbackLeads: Boolean(leadsPayload?.fallback),
				goals,
				automationMetrics: automation ? calculateAutomationMetrics(automation.records ?? []) : null
			});
			setError([
				metricsResult,
				leadsResult,
				goalsResult,
				automationResult
			].filter((result) => result.status === "rejected").length ? "Algunos módulos no pudieron cargar datos en este momento." : null);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadDashboard();
	}, []);
	const recentLeads = useMemo(() => state.leads.slice(0, 5), [state.leads]);
	const scheduledToday = useMemo(() => {
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		return state.leads.filter((lead) => lead.preferredDate?.startsWith(today)).length;
	}, [state.leads]);
	const metrics = state.metrics;
	const conversionGoalProgress = metrics ? Math.min(100, Math.round(metrics.conversionRate / state.goals.conversionGoal * 100)) : 0;
	return /* @__PURE__ */ jsxDEV("div", {
		className: "mx-auto max-w-7xl px-6 py-10",
		children: [
			/* @__PURE__ */ jsxDEV("div", {
				className: "mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
				children: [/* @__PURE__ */ jsxDEV("div", { children: [
					/* @__PURE__ */ jsxDEV("p", {
						className: "text-sm uppercase tracking-[0.2em] text-muted-foreground",
						children: "Administración"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 224,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV("h1", {
						className: "mt-3 text-4xl font-bold tracking-tight text-deep",
						children: "Dashboard administrativo"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 225,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV("p", {
						className: "mt-3 max-w-3xl text-muted-foreground",
						children: "Vista ejecutiva para operación, CRM, objetivos y automatizaciones. Esta pantalla usa APIs ya protegidas por permisos RBAC."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 228,
						columnNumber: 11
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 223,
					columnNumber: 9
				}, this), /* @__PURE__ */ jsxDEV("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ jsxDEV(Button, {
						type: "button",
						variant: "outline",
						onClick: () => void loadDashboard(),
						disabled: loading,
						children: [/* @__PURE__ */ jsxDEV(RefreshCcw, { className: "mr-2 h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 235,
							columnNumber: 13
						}, this), "Actualizar"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 234,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(Button, {
						asChild: true,
						children: /* @__PURE__ */ jsxDEV(Link, {
							to: "/admin/dashboard",
							children: ["Ver análisis completo ", /* @__PURE__ */ jsxDEV(ArrowRight, { className: "ml-2 h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 240,
								columnNumber: 37
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 239,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 238,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 233,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 222,
				columnNumber: 7
			}, this),
			error ? /* @__PURE__ */ jsxDEV("div", {
				className: "mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800",
				children: [error, " La navegación administrativa sigue disponible."]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 247,
				columnNumber: 9
			}, this) : null,
			loading ? /* @__PURE__ */ jsxDEV("div", {
				className: "rounded-3xl border border-border bg-white p-10 text-center text-lg font-medium text-muted-foreground shadow-soft",
				children: "Cargando resumen administrativo..."
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 253,
				columnNumber: 9
			}, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
				/* @__PURE__ */ jsxDEV(OperationalNotificationsPanel, {}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 258,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV(OperationalKpisPanel, {}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 259,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV(OperationalDataQualityPanel, {}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 260,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("section", {
					className: "mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4",
					children: [
						/* @__PURE__ */ jsxDEV(Card, {
							className: "shadow-soft",
							children: [/* @__PURE__ */ jsxDEV(CardHeader, {
								className: "flex flex-row items-center justify-between space-y-0 pb-2",
								children: [/* @__PURE__ */ jsxDEV(CardTitle, {
									className: "text-sm font-medium text-muted-foreground",
									children: "Leads del mes"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 265,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV(Users, { className: "h-4 w-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 266,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 264,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(CardContent, { children: [/* @__PURE__ */ jsxDEV("div", {
								className: "text-3xl font-bold text-deep",
								children: metrics?.totals.leads ?? state.leads.length
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 269,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"Meta mensual: ",
									state.goals.monthlyLeadsGoal,
									" leads"
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 270,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 268,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 263,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(Card, {
							className: "shadow-soft",
							children: [/* @__PURE__ */ jsxDEV(CardHeader, {
								className: "flex flex-row items-center justify-between space-y-0 pb-2",
								children: [/* @__PURE__ */ jsxDEV(CardTitle, {
									className: "text-sm font-medium text-muted-foreground",
									children: "Conversión"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 278,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV(Activity, { className: "h-4 w-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 279,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 277,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(CardContent, { children: [/* @__PURE__ */ jsxDEV("div", {
								className: "text-3xl font-bold text-deep",
								children: percent(metrics?.conversionRate)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 282,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [conversionGoalProgress, "% de la meta configurada"]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 283,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 281,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 276,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(Card, {
							className: "shadow-soft",
							children: [/* @__PURE__ */ jsxDEV(CardHeader, {
								className: "flex flex-row items-center justify-between space-y-0 pb-2",
								children: [/* @__PURE__ */ jsxDEV(CardTitle, {
									className: "text-sm font-medium text-muted-foreground",
									children: "Pipeline"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 291,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV(Target, { className: "h-4 w-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 292,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 290,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(CardContent, { children: [/* @__PURE__ */ jsxDEV("div", {
								className: "text-3xl font-bold text-deep",
								children: currencyFormatter.format(metrics?.pipelineValue ?? 0)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 295,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["Meta: ", currencyFormatter.format(state.goals.pipelineValueGoal)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 298,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 294,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 289,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(Card, {
							className: "shadow-soft",
							children: [/* @__PURE__ */ jsxDEV(CardHeader, {
								className: "flex flex-row items-center justify-between space-y-0 pb-2",
								children: [/* @__PURE__ */ jsxDEV(CardTitle, {
									className: "text-sm font-medium text-muted-foreground",
									children: "Agenda hoy"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 306,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV(CalendarDays, { className: "h-4 w-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 307,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 305,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(CardContent, { children: [/* @__PURE__ */ jsxDEV("div", {
								className: "text-3xl font-bold text-deep",
								children: scheduledToday
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 310,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Basado en fecha preferida de leads disponibles"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 311,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 309,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 304,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 262,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("section", {
					id: "leads",
					className: "mt-6 scroll-mt-24 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]",
					children: [/* @__PURE__ */ jsxDEV(Card, {
						className: "shadow-soft",
						children: [/* @__PURE__ */ jsxDEV(CardHeader, {
							className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Leads recientes" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 322,
								columnNumber: 19
							}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Últimos registros disponibles para seguimiento administrativo." }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 323,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 321,
								columnNumber: 17
							}, this), state.fallbackLeads ? /* @__PURE__ */ jsxDEV(Badge, {
								variant: "secondary",
								children: "Datos demo"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 327,
								columnNumber: 40
							}, this) : null]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 320,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV(CardContent, { children: recentLeads.length ? /* @__PURE__ */ jsxDEV("div", {
							className: "divide-y divide-border rounded-2xl border border-border",
							children: recentLeads.map((lead) => /* @__PURE__ */ jsxDEV("div", {
								className: "grid gap-3 p-4 md:grid-cols-[1.2fr_1fr_auto] md:items-center",
								children: [
									/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
										className: "font-semibold text-deep",
										children: lead.name
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 335,
										columnNumber: 27
									}, this), /* @__PURE__ */ jsxDEV("p", {
										className: "text-sm text-muted-foreground",
										children: [
											lead.email,
											" · ",
											lead.phone
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 336,
										columnNumber: 27
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 334,
										columnNumber: 25
									}, this),
									/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
										className: "text-sm font-medium text-deep",
										children: lead.treatment
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 339,
										columnNumber: 27
									}, this), /* @__PURE__ */ jsxDEV("p", {
										className: "text-xs text-muted-foreground",
										children: ["Preferencia: ", formatDate(lead.preferredDate)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 340,
										columnNumber: 27
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 338,
										columnNumber: 25
									}, this),
									/* @__PURE__ */ jsxDEV("span", {
										className: `rounded-full px-3 py-1 text-xs font-semibold ${statusTone(lead.status)}`,
										children: lead.status
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 342,
										columnNumber: 25
									}, this)
								]
							}, lead.id, true, {
								fileName: _jsxFileName$1,
								lineNumber: 333,
								columnNumber: 23
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 331,
							columnNumber: 19
						}, this) : /* @__PURE__ */ jsxDEV("p", {
							className: "rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground",
							children: "Aún no hay leads disponibles para mostrar."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 349,
							columnNumber: 19
						}, this) }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 329,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 319,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV("div", {
						className: "grid gap-6",
						children: [/* @__PURE__ */ jsxDEV(Card, {
							className: "shadow-soft",
							children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Automatizaciones" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 359,
								columnNumber: 19
							}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Estado operativo del módulo de followups." }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 360,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 358,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV(CardContent, {
								className: "space-y-4",
								children: [/* @__PURE__ */ jsxDEV("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ jsxDEV("div", {
										className: "rounded-2xl bg-secondary/50 p-4",
										children: [/* @__PURE__ */ jsxDEV("p", {
											className: "text-xs text-muted-foreground",
											children: "Ejecuciones"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 365,
											columnNumber: 23
										}, this), /* @__PURE__ */ jsxDEV("p", {
											className: "mt-1 text-2xl font-bold text-deep",
											children: state.automationMetrics?.totalRuns ?? 0
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 366,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 364,
										columnNumber: 21
									}, this), /* @__PURE__ */ jsxDEV("div", {
										className: "rounded-2xl bg-secondary/50 p-4",
										children: [/* @__PURE__ */ jsxDEV("p", {
											className: "text-xs text-muted-foreground",
											children: "Enviados"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 371,
											columnNumber: 23
										}, this), /* @__PURE__ */ jsxDEV("p", {
											className: "mt-1 text-2xl font-bold text-deep",
											children: state.automationMetrics?.sent ?? 0
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 372,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 370,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 363,
									columnNumber: 19
								}, this), /* @__PURE__ */ jsxDEV(Button, {
									asChild: true,
									variant: "outline",
									className: "w-full",
									children: /* @__PURE__ */ jsxDEV(Link, {
										to: "/admin/automation",
										children: "Abrir automatizaciones"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 378,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 377,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 362,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 357,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV(Card, {
							className: "shadow-soft",
							children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Módulos administrativos" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 385,
								columnNumber: 19
							}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Accesos preparados para operación administrativa." }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 386,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 384,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV(CardContent, {
								className: "space-y-3",
								children: moduleCards.map((item) => {
									const Icon = item.icon;
									return /* @__PURE__ */ jsxDEV(Link, {
										to: item.to,
										className: "flex items-start gap-3 rounded-2xl border border-border p-4 transition hover:border-primary hover:bg-secondary/30",
										children: [/* @__PURE__ */ jsxDEV("span", {
											className: "mt-1 grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary",
											children: /* @__PURE__ */ jsxDEV(Icon, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 398,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 397,
											columnNumber: 25
										}, this), /* @__PURE__ */ jsxDEV("span", { children: [/* @__PURE__ */ jsxDEV("span", {
											className: "block font-semibold text-deep",
											children: item.title
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 401,
											columnNumber: 27
										}, this), /* @__PURE__ */ jsxDEV("span", {
											className: "mt-1 block text-sm leading-5 text-muted-foreground",
											children: item.description
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 402,
											columnNumber: 27
										}, this)] }, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 400,
											columnNumber: 25
										}, this)]
									}, item.title, true, {
										fileName: _jsxFileName$1,
										lineNumber: 392,
										columnNumber: 23
									}, this);
								})
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 388,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 383,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 356,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 318,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("section", {
					id: "objetivos",
					className: "mt-6 scroll-mt-24 grid gap-6 lg:grid-cols-3",
					children: [/* @__PURE__ */ jsxDEV(Card, {
						className: "shadow-soft lg:col-span-2",
						children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Estado de objetivos" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 417,
							columnNumber: 17
						}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Lectura rápida de metas configuradas para administración." }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 418,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 416,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV(CardContent, {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "rounded-2xl border border-border p-4",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "text-sm text-muted-foreground",
										children: "Leads mensuales"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 422,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("p", {
										className: "mt-1 text-xl font-bold text-deep",
										children: state.goals.monthlyLeadsGoal
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 423,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 421,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "rounded-2xl border border-border p-4",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "text-sm text-muted-foreground",
										children: "Conversión objetivo"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 426,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("p", {
										className: "mt-1 text-xl font-bold text-deep",
										children: percent(state.goals.conversionGoal)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 427,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 425,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "rounded-2xl border border-border p-4",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "text-sm text-muted-foreground",
										children: "Asistencia objetivo"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 430,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("p", {
										className: "mt-1 text-xl font-bold text-deep",
										children: percent(state.goals.attendanceGoal)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 431,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 429,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "rounded-2xl border border-border p-4",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "text-sm text-muted-foreground",
										children: "Pipeline objetivo"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 434,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("p", {
										className: "mt-1 text-xl font-bold text-deep",
										children: currencyFormatter.format(state.goals.pipelineValueGoal)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 435,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 433,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 420,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 415,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV(Card, {
						id: "configuracion",
						className: "scroll-mt-24 shadow-soft",
						children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Arquitectura protegida" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 444,
							columnNumber: 17
						}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Recordatorio operativo de FASE 14." }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 445,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 443,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV(CardContent, {
							className: "space-y-3 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ jsxDEV("div", {
								className: "flex gap-3 rounded-2xl bg-secondary/40 p-4",
								children: [/* @__PURE__ */ jsxDEV(ClipboardList, { className: "mt-0.5 h-4 w-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 449,
									columnNumber: 19
								}, this), /* @__PURE__ */ jsxDEV("p", { children: "BookingDialog sigue siendo el único flujo público autorizado para citas." }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 450,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 448,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "flex gap-3 rounded-2xl bg-secondary/40 p-4",
								children: [/* @__PURE__ */ jsxDEV(Workflow, { className: "mt-0.5 h-4 w-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 453,
									columnNumber: 19
								}, this), /* @__PURE__ */ jsxDEV("p", { children: "CRM, Calendar y Gmail permanecen sin cambios en esta iteración." }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 454,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 452,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 447,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 442,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 414,
					columnNumber: 11
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 257,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 221,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/routes/admin.tsx?tsr-split=component
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/admin.tsx?tsr-split=component";
function AdminRouteShell() {
	const { pathname } = useLocation();
	if ((pathname.replace(/\/+$/, "") || "/") !== "/admin") return /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 11,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ jsxDEV(RoleRouteGuard, {
		allowedRoles: ["admin"],
		checkingLabel: "Validando acceso administrativo...",
		children: /* @__PURE__ */ jsxDEV(AdminLayout, { children: /* @__PURE__ */ jsxDEV(AdminHomeDashboard, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 15,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 14,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 13,
		columnNumber: 10
	}, this);
}
//#endregion
export { AdminRouteShell as component };
