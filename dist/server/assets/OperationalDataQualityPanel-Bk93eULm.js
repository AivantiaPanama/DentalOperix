import { n as cn, t as Button } from "./button-BLeLDVKM.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BATy6eNr.js";
import { t as Badge } from "./badge-BT5ORwAW.js";
import { t as Progress } from "./progress-CBPak1Ip.js";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
import { AlertTriangle, BarChart3, Bell, CheckCircle2, ClipboardCheck, DatabaseZap, RefreshCcw, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import { cva } from "class-variance-authority";
//#region src/components/ui/alert.tsx
var _jsxFileName$3 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/ui/alert.tsx";
var alertVariants = cva("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7", {
	variants: { variant: {
		default: "bg-background text-foreground",
		destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
var Alert = React.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsxDEV("div", {
	ref,
	role: "alert",
	className: cn(alertVariants({ variant }), className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 26,
	columnNumber: 3
}, void 0));
Alert.displayName = "Alert";
var AlertTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV("h5", {
	ref,
	className: cn("mb-1 font-medium leading-none tracking-tight", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 32,
	columnNumber: 5
}, void 0));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV("div", {
	ref,
	className: cn("text-sm [&_p]:leading-relaxed", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 45,
	columnNumber: 3
}, void 0));
AlertDescription.displayName = "AlertDescription";
//#endregion
//#region src/components/operations/OperationalNotificationsPanel.tsx
var _jsxFileName$2 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/operations/OperationalNotificationsPanel.tsx";
var emptyState = {
	notifications: [],
	summary: null
};
function formatDateTime(value) {
	if (!value) return "Sin fecha";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("es-PA", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(date);
}
function severityLabel(severity) {
	if (severity === "warning") return "Prioridad";
	if (severity === "attention") return "Atención";
	return "Informativo";
}
function severityClass(severity) {
	if (severity === "warning") return "border-red-200 bg-red-50 text-red-700";
	if (severity === "attention") return "border-amber-200 bg-amber-50 text-amber-700";
	return "border-blue-200 bg-blue-50 text-blue-700";
}
function resourceIcon(resourceType) {
	if (resourceType === "patient") return ShieldCheck;
	if (resourceType === "audit" || resourceType === "report") return ClipboardCheck;
	return AlertTriangle;
}
function OperationalNotificationsPanel() {
	const [state, setState] = useState(emptyState);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const loadNotifications = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch("/api/notifications/operational", { credentials: "same-origin" });
			const payload = await response.json();
			if (!response.ok || !payload.success) throw new Error(payload.error ?? "No se pudieron cargar las notificaciones operativas.");
			setState({
				notifications: payload.notifications ?? [],
				summary: payload.summary ?? null
			});
		} catch (loadError) {
			setState(emptyState);
			setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las notificaciones operativas.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadNotifications();
	}, []);
	const visibleNotifications = useMemo(() => state.notifications.slice(0, 6), [state.notifications]);
	return /* @__PURE__ */ jsxDEV(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ jsxDEV(CardHeader, {
			className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
			children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV(CardTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsxDEV(Bell, { className: "h-5 w-5 text-primary" }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 114,
					columnNumber: 13
				}, this), "Notificaciones operativas"]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 113,
				columnNumber: 11
			}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Monitoreo interno para administración y asistencia, sin correos, calendario ni automatizaciones externas." }, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 117,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 112,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: () => void loadNotifications(),
				disabled: loading,
				children: [/* @__PURE__ */ jsxDEV(RefreshCcw, { className: "mr-2 h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 122,
					columnNumber: 11
				}, this), "Actualizar"]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 121,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 111,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV(CardContent, {
			className: "space-y-4",
			children: [
				error ? /* @__PURE__ */ jsxDEV(Alert, {
					variant: "destructive",
					children: [/* @__PURE__ */ jsxDEV(AlertTitle, { children: "No se pudo cargar el monitoreo" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 130,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV(AlertDescription, { children: error }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 131,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 129,
					columnNumber: 11
				}, this) : null,
				/* @__PURE__ */ jsxDEV("section", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-xs text-muted-foreground",
								children: "Total"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 137,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-1 text-2xl font-bold text-deep",
								children: loading ? "..." : state.summary?.total ?? 0
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 138,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 136,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-xs text-muted-foreground",
								children: "Atención"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 141,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-1 text-2xl font-bold text-deep",
								children: loading ? "..." : state.summary?.attention ?? 0
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 142,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 140,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-xs text-muted-foreground",
								children: "Prioridad"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 145,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-1 text-2xl font-bold text-deep",
								children: loading ? "..." : state.summary?.warnings ?? 0
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 146,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 144,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 135,
					columnNumber: 9
				}, this),
				loading ? /* @__PURE__ */ jsxDEV("div", {
					className: "rounded-2xl border border-dashed border-border bg-background/70 p-5 text-sm text-muted-foreground",
					children: "Cargando notificaciones internas..."
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 151,
					columnNumber: 11
				}, this) : null,
				!loading && !visibleNotifications.length ? /* @__PURE__ */ jsxDEV("div", {
					className: "rounded-2xl border border-dashed border-border bg-background/70 p-5 text-sm text-muted-foreground",
					children: "No hay notificaciones operativas pendientes con la información actual."
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 157,
					columnNumber: 11
				}, this) : null,
				visibleNotifications.length ? /* @__PURE__ */ jsxDEV("div", {
					className: "divide-y divide-border rounded-2xl border border-border",
					children: visibleNotifications.map((notification) => {
						return /* @__PURE__ */ jsxDEV("article", {
							className: "grid gap-3 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-start",
							children: [
								/* @__PURE__ */ jsxDEV("span", {
									className: "grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary",
									children: /* @__PURE__ */ jsxDEV(resourceIcon(notification.resourceType), { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 170,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 169,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ jsxDEV("div", { children: [
									/* @__PURE__ */ jsxDEV("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ jsxDEV("h3", {
											className: "font-semibold text-deep",
											children: notification.title
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 174,
											columnNumber: 23
										}, this), /* @__PURE__ */ jsxDEV(Badge, {
											variant: "outline",
											className: severityClass(notification.severity),
											children: severityLabel(notification.severity)
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 175,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 173,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ jsxDEV("p", {
										className: "mt-1 text-sm leading-6 text-muted-foreground",
										children: notification.description
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 179,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ jsxDEV("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: formatDateTime(notification.createdAt)
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 180,
										columnNumber: 21
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 172,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ jsxDEV(Badge, {
									variant: "secondary",
									children: notification.resourceType
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 182,
									columnNumber: 19
								}, this)
							]
						}, notification.id, true, {
							fileName: _jsxFileName$2,
							lineNumber: 168,
							columnNumber: 17
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 163,
					columnNumber: 11
				}, this) : null
			]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 127,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 110,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/operations/OperationalKpisPanel.tsx
var _jsxFileName$1 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/operations/OperationalKpisPanel.tsx";
function formatGeneratedAt$1(value) {
	if (!value) return "Pendiente";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("es-PA", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(date);
}
function healthTone(status) {
	if (status === "stable") return "border-emerald-200 bg-emerald-50 text-emerald-700";
	if (status === "attention") return "border-amber-200 bg-amber-50 text-amber-700";
	return "border-red-200 bg-red-50 text-red-700";
}
function healthLabel(status) {
	if (status === "stable") return "Estable";
	if (status === "attention") return "Atención";
	return "Vigilar";
}
function KpiTile({ title, value, description, icon: Icon }) {
	return /* @__PURE__ */ jsxDEV(Card, {
		className: "border-muted bg-background/80 shadow-none",
		children: /* @__PURE__ */ jsxDEV(CardContent, {
			className: "flex gap-3 p-4",
			children: [/* @__PURE__ */ jsxDEV("span", {
				className: "mt-1 rounded-full bg-primary/10 p-2 text-primary",
				children: /* @__PURE__ */ jsxDEV(Icon, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 90,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 89,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV("div", { children: [
				/* @__PURE__ */ jsxDEV("p", {
					className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
					children: title
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 93,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("p", {
					className: "mt-1 text-2xl font-semibold text-foreground",
					children: value
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 94,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("p", {
					className: "mt-1 text-xs leading-relaxed text-muted-foreground",
					children: description
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 95,
					columnNumber: 11
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 92,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 88,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 87,
		columnNumber: 5
	}, this);
}
function OperationalKpisPanel() {
	const [kpis, setKpis] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const loadKpis = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch("/api/kpis/operational", { credentials: "same-origin" });
			const payload = await response.json();
			if (!response.ok || !payload.success || !payload.kpis) throw new Error(payload.error ?? "No se pudieron cargar los KPIs operativos.");
			setKpis(payload.kpis);
		} catch (loadError) {
			setKpis(null);
			setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los KPIs operativos.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadKpis();
	}, []);
	const recommendations = useMemo(() => kpis?.health.recommendations.slice(0, 3) ?? [], [kpis]);
	return /* @__PURE__ */ jsxDEV(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ jsxDEV(CardHeader, {
			className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
			children: [/* @__PURE__ */ jsxDEV("div", { children: [
				/* @__PURE__ */ jsxDEV("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Executive Dashboard operativo" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 139,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV(Badge, {
						variant: "outline",
						className: "border-primary/20 bg-primary/5 text-primary",
						children: "FASE 14.4-F"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 140,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 138,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV(CardDescription, { children: "KPIs agregados de leads, pacientes administrativos, auditoría y reportes. No incluye información clínica." }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 144,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: ["Generado: ", formatGeneratedAt$1(kpis?.generatedAt)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 147,
					columnNumber: 11
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 137,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: loadKpis,
				disabled: loading,
				children: [/* @__PURE__ */ jsxDEV(RefreshCcw, { className: `mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}` }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 150,
					columnNumber: 11
				}, this), "Actualizar"]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 149,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 136,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV(CardContent, {
			className: "space-y-5",
			children: [
				error ? /* @__PURE__ */ jsxDEV("div", {
					className: "rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800",
					children: error
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 156,
					columnNumber: 11
				}, this) : null,
				/* @__PURE__ */ jsxDEV("div", {
					className: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
					children: [
						/* @__PURE__ */ jsxDEV(KpiTile, {
							title: "Leads activos",
							value: loading ? "..." : kpis?.leads.active ?? 0,
							description: `${kpis?.leads.pending ?? 0} pendientes · ${kpis?.leads.conversionRate ?? 0}% conversión operativa`,
							icon: BarChart3
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 160,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV(KpiTile, {
							title: "Pacientes verificados",
							value: loading ? "..." : kpis?.patients.verified ?? 0,
							description: `${kpis?.patients.verificationRate ?? 0}% verificación · ${kpis?.patients.pendingVerification ?? 0} pendientes`,
							icon: Users
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 166,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV(KpiTile, {
							title: "Actividad auditada",
							value: loading ? "..." : kpis?.audit.eventsLast30Days ?? 0,
							description: "eventos operativos registrados en los últimos 30 días",
							icon: ShieldCheck
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 172,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV(KpiTile, {
							title: "Reportes",
							value: loading ? "..." : kpis?.reports.generated ?? 0,
							description: `${kpis?.reports.csvExports ?? 0} CSV · ${kpis?.reports.jsonViews ?? 0} vistas JSON`,
							icon: ClipboardCheck
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 178,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 159,
					columnNumber: 9
				}, this),
				kpis ? /* @__PURE__ */ jsxDEV("div", {
					className: "grid gap-4 lg:grid-cols-[1.1fr_.9fr]",
					children: [/* @__PURE__ */ jsxDEV("div", {
						className: "rounded-2xl border bg-muted/30 p-4",
						children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Salud operativa"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 191,
								columnNumber: 19
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "text-sm text-muted-foreground",
								children: kpis.health.summary
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 192,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 190,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV(Badge, {
								variant: "outline",
								className: healthTone(kpis.health.status),
								children: [
									healthLabel(kpis.health.status),
									" · ",
									kpis.health.score,
									"/100"
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 194,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 189,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV(Progress, {
							value: kpis.health.score,
							className: "mt-4"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 198,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 188,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV("div", {
						className: "rounded-2xl border bg-background p-4",
						children: [/* @__PURE__ */ jsxDEV("p", {
							className: "text-sm font-semibold text-foreground",
							children: "Recomendaciones ejecutivas"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 201,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("ul", {
							className: "mt-3 space-y-2 text-sm text-muted-foreground",
							children: recommendations.map((recommendation) => /* @__PURE__ */ jsxDEV("li", { children: ["• ", recommendation] }, recommendation, true, {
								fileName: _jsxFileName$1,
								lineNumber: 204,
								columnNumber: 19
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 202,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 200,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 187,
					columnNumber: 11
				}, this) : null
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 154,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 135,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/operations/OperationalDataQualityPanel.tsx
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/operations/OperationalDataQualityPanel.tsx";
function formatGeneratedAt(value) {
	if (!value) return "Pendiente";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("es-PA", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(date);
}
function statusTone(status) {
	if (status === "healthy") return "border-emerald-200 bg-emerald-50 text-emerald-700";
	if (status === "attention") return "border-amber-200 bg-amber-50 text-amber-700";
	return "border-red-200 bg-red-50 text-red-700";
}
function statusLabel(status) {
	if (status === "healthy") return "Saludable";
	if (status === "attention") return "Atención";
	return "Riesgo";
}
function severityTone(severity) {
	if (severity === "critical") return "border-red-200 bg-red-50 text-red-700";
	if (severity === "warning") return "border-amber-200 bg-amber-50 text-amber-700";
	return "border-blue-200 bg-blue-50 text-blue-700";
}
function OperationalDataQualityPanel() {
	const [quality, setQuality] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const loadQuality = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch("/api/data-quality/operational", { credentials: "same-origin" });
			const payload = await response.json();
			if (!response.ok || !payload.success || !payload.quality) throw new Error(payload.error ?? "No se pudo cargar la calidad de datos operativa.");
			setQuality(payload.quality);
		} catch (loadError) {
			setQuality(null);
			setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la calidad de datos operativa.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadQuality();
	}, []);
	const visibleIssues = useMemo(() => quality?.issues.slice(0, 5) ?? [], [quality]);
	const recommendations = useMemo(() => quality?.recommendations.slice(0, 3) ?? [], [quality]);
	return /* @__PURE__ */ jsxDEV(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ jsxDEV(CardHeader, {
			className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
			children: [/* @__PURE__ */ jsxDEV("div", { children: [
				/* @__PURE__ */ jsxDEV("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Calidad de datos operativa" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 104,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV(Badge, {
						variant: "outline",
						className: "border-primary/20 bg-primary/5 text-primary",
						children: "FASE 14.4-G"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 105,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 103,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV(CardDescription, { children: "Verificaciones administrativas y operativas. Solo detecta inconsistencias; no corrige registros ni incluye datos clínicos." }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 109,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: ["Generado: ", formatGeneratedAt(quality?.generatedAt)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 112,
					columnNumber: 11
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 102,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: loadQuality,
				disabled: loading,
				children: [/* @__PURE__ */ jsxDEV(RefreshCcw, { className: `mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}` }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 115,
					columnNumber: 11
				}, this), "Actualizar"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 114,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 101,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV(CardContent, {
			className: "space-y-5",
			children: [
				error ? /* @__PURE__ */ jsxDEV("div", {
					className: "rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800",
					children: error
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 121,
					columnNumber: 11
				}, this) : null,
				/* @__PURE__ */ jsxDEV("div", {
					className: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
					children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border bg-muted/30 p-4",
							children: [/* @__PURE__ */ jsxDEV("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
									className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
									children: "Quality Score"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 128,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-3xl font-semibold text-foreground",
									children: loading ? "..." : `${quality?.score ?? 0}/100`
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 129,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 127,
									columnNumber: 15
								}, this), /* @__PURE__ */ jsxDEV(CheckCircle2, { className: "h-5 w-5 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 131,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV(Progress, {
								value: quality?.score ?? 0,
								className: "mt-4"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 133,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border bg-background p-4",
							children: [
								/* @__PURE__ */ jsxDEV("p", {
									className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
									children: "Incidencias"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 136,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-3xl font-semibold text-foreground",
									children: loading ? "..." : quality?.totals.issues ?? 0
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 137,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										quality?.totals.critical ?? 0,
										" críticas · ",
										quality?.totals.warnings ?? 0,
										" advertencias"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 138,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 135,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border bg-background p-4",
							children: [
								/* @__PURE__ */ jsxDEV("p", {
									className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
									children: "Registros revisados"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 141,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-3xl font-semibold text-foreground",
									children: loading ? "..." : (quality?.totals.checkedPatients ?? 0) + (quality?.totals.checkedLeads ?? 0)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 142,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "pacientes y leads administrativos"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 145,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 140,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border bg-background p-4",
							children: [
								/* @__PURE__ */ jsxDEV("p", {
									className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
									children: "Duplicados potenciales"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 148,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-3xl font-semibold text-foreground",
									children: loading ? "..." : quality?.totals.duplicateGroups ?? 0
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 149,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "requieren revisión manual"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 150,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 147,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 124,
					columnNumber: 9
				}, this),
				quality ? /* @__PURE__ */ jsxDEV("div", {
					className: "grid gap-4 lg:grid-cols-[1fr_1fr]",
					children: [/* @__PURE__ */ jsxDEV("div", {
						className: "rounded-2xl border bg-muted/30 p-4",
						children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Estado de calidad"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 159,
								columnNumber: 19
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "text-sm text-muted-foreground",
								children: "Detección pasiva de datos incompletos, inconsistentes o duplicados."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 160,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 158,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV(Badge, {
								variant: "outline",
								className: statusTone(quality.status),
								children: statusLabel(quality.status)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 162,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 157,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("ul", {
							className: "mt-4 space-y-2 text-sm text-muted-foreground",
							children: recommendations.map((recommendation) => /* @__PURE__ */ jsxDEV("li", { children: ["• ", recommendation] }, recommendation, true, {
								fileName: _jsxFileName,
								lineNumber: 168,
								columnNumber: 19
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 166,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 156,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV("div", {
						className: "rounded-2xl border bg-background p-4",
						children: [/* @__PURE__ */ jsxDEV("div", {
							className: "mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ jsxDEV(ShieldAlert, { className: "h-4 w-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 174,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Principales hallazgos"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 175,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 173,
							columnNumber: 15
						}, this), visibleIssues.length ? /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-2",
							children: visibleIssues.map((issue) => /* @__PURE__ */ jsxDEV("div", {
								className: "rounded-xl border p-3",
								children: [
									/* @__PURE__ */ jsxDEV("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ jsxDEV(Badge, {
											variant: "outline",
											className: severityTone(issue.severity),
											children: issue.severity
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 182,
											columnNumber: 25
										}, this), /* @__PURE__ */ jsxDEV(Badge, {
											variant: "secondary",
											children: issue.resourceType
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 183,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 181,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ jsxDEV("p", {
										className: "mt-2 text-sm font-medium text-foreground",
										children: issue.title
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 185,
										columnNumber: 23
									}, this),
									/* @__PURE__ */ jsxDEV("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: issue.description
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 186,
										columnNumber: 23
									}, this)
								]
							}, issue.id, true, {
								fileName: _jsxFileName,
								lineNumber: 180,
								columnNumber: 21
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 178,
							columnNumber: 17
						}, this) : /* @__PURE__ */ jsxDEV("div", {
							className: "rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800",
							children: "No se detectaron inconsistencias operativas relevantes."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 191,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 172,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 155,
					columnNumber: 11
				}, this) : null,
				/* @__PURE__ */ jsxDEV("div", {
					className: "flex flex-wrap gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ jsxDEV("span", {
						className: "inline-flex items-center gap-1 rounded-full border px-3 py-1",
						children: [/* @__PURE__ */ jsxDEV(DatabaseZap, { className: "h-3 w-3" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 200,
							columnNumber: 90
						}, this), " Solo lectura"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 200,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV("span", {
						className: "inline-flex items-center gap-1 rounded-full border px-3 py-1",
						children: [/* @__PURE__ */ jsxDEV(AlertTriangle, { className: "h-3 w-3" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 201,
							columnNumber: 90
						}, this), " Sin autocorrecciones"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 201,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 199,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 119,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 100,
		columnNumber: 5
	}, this);
}
//#endregion
export { AlertDescription as a, Alert as i, OperationalKpisPanel as n, AlertTitle as o, OperationalNotificationsPanel as r, OperationalDataQualityPanel as t };
