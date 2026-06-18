import { t as Button } from "./button-BLeLDVKM.js";
import { t as AdminLayout } from "./AdminLayout-DppqpWwN.js";
import { t as AdminRouteGuard } from "./AdminRouteGuard-DblhNB_g.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BATy6eNr.js";
import { n as Input, t as Label } from "./label-DBNUsIZD.js";
import { t as Badge } from "./badge-BT5ORwAW.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsxDEV } from "react/jsx-dev-runtime";
import { AlertTriangle, CheckCircle2, History, PlayCircle, RefreshCcw, ShieldCheck } from "lucide-react";
//#region src/components/admin/AutomationPanel.tsx
var _jsxFileName$1 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/AutomationPanel.tsx";
var emptyMetrics = {
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
};
function statusLabel(status) {
	if (status === "success") return "Exitosa";
	if (status === "partial") return "Parcial";
	return "Fallida";
}
function formatDate(value) {
	if (!value) return "-";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("es-PA", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(date);
}
function AutomationPanel() {
	const [executedBy, setExecutedBy] = useState("admin");
	const [runs, setRuns] = useState([]);
	const [metrics, setMetrics] = useState(emptyMetrics);
	const [loading, setLoading] = useState(false);
	const [running, setRunning] = useState(null);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);
	const latestRuns = useMemo(() => runs.slice(0, 10), [runs]);
	const loadHistory = async () => {
		setLoading(true);
		setError(null);
		setMessage(null);
		try {
			const response = await fetch("/api/followups/run", {
				method: "GET",
				credentials: "same-origin"
			});
			const payload = await response.json();
			if (!response.ok || !payload.success) throw new Error(payload.error ?? "No se pudo cargar el historial de automatizaciones.");
			setRuns(payload.runs ?? []);
			setMetrics(payload.metrics ?? emptyMetrics);
		} catch (historyError) {
			setError(historyError instanceof Error ? historyError.message : "Error inesperado al cargar historial.");
		} finally {
			setLoading(false);
		}
	};
	const runFollowups = async (dryRun) => {
		if (!dryRun) {
			if (!window.confirm("Esta ejecución real puede enviar correos de seguimiento. Confirma que deseas continuar.")) return;
		}
		setRunning(dryRun ? "dryRun" : "real");
		setError(null);
		setMessage(null);
		try {
			const response = await fetch("/api/followups/run", {
				method: "POST",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					dryRun,
					confirmExecution: !dryRun,
					executedBy
				})
			});
			const payload = await response.json();
			if (!response.ok || payload.success === false) throw new Error(payload.error ?? "No se pudo ejecutar la automatización.");
			setMessage(dryRun ? `Dry run completado: ${payload.generated ?? 0} acciones generadas.` : `Ejecución real completada: ${payload.sent ?? 0} correos enviados, ${payload.failed ?? 0} fallidos.`);
			await loadHistory();
		} catch (runError) {
			setError(runError instanceof Error ? runError.message : "Error inesperado al ejecutar automatización.");
		} finally {
			setRunning(null);
		}
	};
	return /* @__PURE__ */ jsxDEV("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxDEV(Card, { children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: /* @__PURE__ */ jsxDEV("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ jsxDEV("span", {
					className: "rounded-2xl bg-primary/10 p-3 text-primary",
					children: /* @__PURE__ */ jsxDEV(ShieldCheck, { className: "h-5 w-5" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 179,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 178,
					columnNumber: 13
				}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Panel de Automatizaciones" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 182,
					columnNumber: 15
				}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Ejecuta seguimientos en dry run o modo real sin exponer secretos en el cliente." }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 183,
					columnNumber: 15
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 181,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 177,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 176,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV(CardContent, {
				className: "grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,auto)]",
				children: [/* @__PURE__ */ jsxDEV("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [/* @__PURE__ */ jsxDEV("div", {
						className: "rounded-2xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground",
						children: "Sesión administrativa activa. Las automatizaciones se ejecutan sin exponer INTERNAL_API_KEY en el navegador."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 191,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsxDEV(Label, {
							htmlFor: "automation-executed-by",
							children: "Ejecutado por"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 196,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV(Input, {
							id: "automation-executed-by",
							value: executedBy,
							onChange: (event) => setExecutedBy(event.target.value),
							placeholder: "admin"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 197,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 195,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 190,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV("div", {
					className: "flex flex-col gap-2 md:items-end md:justify-end",
					children: [
						/* @__PURE__ */ jsxDEV(Button, {
							type: "button",
							variant: "outline",
							onClick: loadHistory,
							disabled: loading,
							children: [/* @__PURE__ */ jsxDEV(RefreshCcw, { className: "mr-2 h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 207,
								columnNumber: 15
							}, this), loading ? "Cargando..." : "Actualizar historial"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 206,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => runFollowups(true),
							disabled: !!running,
							children: [/* @__PURE__ */ jsxDEV(PlayCircle, { className: "mr-2 h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 216,
								columnNumber: 15
							}, this), running === "dryRun" ? "Ejecutando..." : "Ejecutar dry run"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 210,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(Button, {
							type: "button",
							onClick: () => runFollowups(false),
							disabled: !!running,
							children: [/* @__PURE__ */ jsxDEV(AlertTriangle, { className: "mr-2 h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 220,
								columnNumber: 15
							}, this), running === "real" ? "Ejecutando..." : "Ejecutar real"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 219,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 205,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 189,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 175,
				columnNumber: 7
			}, this),
			message ? /* @__PURE__ */ jsxDEV("div", {
				className: "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800",
				children: [/* @__PURE__ */ jsxDEV(CheckCircle2, { className: "mr-2 inline h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 229,
					columnNumber: 11
				}, this), message]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 228,
				columnNumber: 9
			}, this) : null,
			error ? /* @__PURE__ */ jsxDEV("div", {
				className: "rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive",
				children: [/* @__PURE__ */ jsxDEV(AlertTriangle, { className: "mr-2 inline h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 235,
					columnNumber: 11
				}, this), error]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 234,
				columnNumber: 9
			}, this) : null,
			/* @__PURE__ */ jsxDEV("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ jsxDEV(Card, { children: /* @__PURE__ */ jsxDEV(CardHeader, {
						className: "pb-2",
						children: [/* @__PURE__ */ jsxDEV(CardDescription, { children: "Ejecuciones" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 243,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardTitle, { children: metrics.totalRuns }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 244,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 242,
						columnNumber: 11
					}, this) }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 241,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ jsxDEV(Card, { children: /* @__PURE__ */ jsxDEV(CardHeader, {
						className: "pb-2",
						children: [/* @__PURE__ */ jsxDEV(CardDescription, { children: "Dry runs" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 249,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardTitle, { children: metrics.dryRuns }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 250,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 248,
						columnNumber: 11
					}, this) }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 247,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ jsxDEV(Card, { children: /* @__PURE__ */ jsxDEV(CardHeader, {
						className: "pb-2",
						children: [/* @__PURE__ */ jsxDEV(CardDescription, { children: "Reales" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 255,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardTitle, { children: metrics.realRuns }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 256,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 254,
						columnNumber: 11
					}, this) }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 253,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ jsxDEV(Card, { children: /* @__PURE__ */ jsxDEV(CardHeader, {
						className: "pb-2",
						children: [/* @__PURE__ */ jsxDEV(CardDescription, { children: "Correos enviados" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 261,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardTitle, { children: metrics.sent }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 262,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 260,
						columnNumber: 11
					}, this) }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 259,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 240,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(Card, { children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsxDEV(History, { className: "h-5 w-5 text-primary" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 270,
					columnNumber: 13
				}, this), /* @__PURE__ */ jsxDEV(CardTitle, { children: "Historial de ejecuciones" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 271,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 269,
				columnNumber: 11
			}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Últimas 10 ejecuciones registradas en AutomationRuns." }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 273,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 268,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV(CardContent, { children: latestRuns.length === 0 ? /* @__PURE__ */ jsxDEV("p", {
				className: "rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
				children: "No hay ejecuciones cargadas todavía."
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 277,
				columnNumber: 13
			}, this) : /* @__PURE__ */ jsxDEV("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxDEV("table", {
					className: "w-full min-w-[760px] text-sm",
					children: [/* @__PURE__ */ jsxDEV("thead", {
						className: "text-left text-muted-foreground",
						children: /* @__PURE__ */ jsxDEV("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ jsxDEV("th", {
									className: "py-3 pr-4",
									children: "Fecha"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 285,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ jsxDEV("th", {
									className: "py-3 pr-4",
									children: "Tipo"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 286,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ jsxDEV("th", {
									className: "py-3 pr-4",
									children: "Estado"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 287,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ jsxDEV("th", {
									className: "py-3 pr-4",
									children: "Generados"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 288,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ jsxDEV("th", {
									className: "py-3 pr-4",
									children: "Enviados"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 289,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ jsxDEV("th", {
									className: "py-3 pr-4",
									children: "Fallidos"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 290,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ jsxDEV("th", {
									className: "py-3 pr-4",
									children: "Duración"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 291,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ jsxDEV("th", {
									className: "py-3 pr-4",
									children: "Usuario"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 292,
									columnNumber: 21
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 284,
							columnNumber: 19
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 283,
						columnNumber: 17
					}, this), /* @__PURE__ */ jsxDEV("tbody", { children: latestRuns.map((run) => /* @__PURE__ */ jsxDEV("tr", {
						className: "border-b border-border/70",
						children: [
							/* @__PURE__ */ jsxDEV("td", {
								className: "py-3 pr-4",
								children: formatDate(run.timestamp)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 298,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ jsxDEV("td", {
								className: "py-3 pr-4",
								children: run.dryRun ? "Dry run" : "Real"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 299,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ jsxDEV("td", {
								className: "py-3 pr-4",
								children: /* @__PURE__ */ jsxDEV(Badge, {
									variant: run.status === "success" ? "default" : run.status === "partial" ? "secondary" : "destructive",
									children: statusLabel(run.status)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 301,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 300,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ jsxDEV("td", {
								className: "py-3 pr-4",
								children: run.generated
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 313,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ jsxDEV("td", {
								className: "py-3 pr-4",
								children: run.sent
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 314,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ jsxDEV("td", {
								className: "py-3 pr-4",
								children: run.failed
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 315,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ jsxDEV("td", {
								className: "py-3 pr-4",
								children: [run.durationMs ?? 0, " ms"]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 316,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ jsxDEV("td", {
								className: "py-3 pr-4",
								children: run.executedBy ?? "system"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 317,
								columnNumber: 23
							}, this)
						]
					}, run.id, true, {
						fileName: _jsxFileName$1,
						lineNumber: 297,
						columnNumber: 21
					}, this)) }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 295,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 282,
					columnNumber: 15
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 281,
				columnNumber: 13
			}, this) }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 275,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 267,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 174,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/routes/admin/automation.tsx?tsr-split=component
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/admin/automation.tsx?tsr-split=component";
function AutomationPage() {
	return /* @__PURE__ */ jsxDEV(AdminRouteGuard, { children: /* @__PURE__ */ jsxDEV(AdminLayout, { children: /* @__PURE__ */ jsxDEV("div", {
		className: "mx-auto max-w-7xl px-6 py-10",
		children: [/* @__PURE__ */ jsxDEV("div", {
			className: "mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
			children: [/* @__PURE__ */ jsxDEV("div", { children: [
				/* @__PURE__ */ jsxDEV("p", {
					className: "text-sm uppercase tracking-[0.2em] text-muted-foreground",
					children: "Admin CRM"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 11,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ jsxDEV("h1", {
					className: "mt-3 text-4xl font-bold tracking-tight text-deep",
					children: "Automatizaciones"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 12,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ jsxDEV("p", {
					className: "mt-3 max-w-2xl text-muted-foreground",
					children: "Ejecuta followups, consulta historial y revisa métricas de automatización."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 13,
					columnNumber: 15
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 10,
				columnNumber: 13
			}, this), /* @__PURE__ */ jsxDEV(Link, {
				to: "/admin/dashboard",
				className: "rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-deep",
				children: "Volver al dashboard"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 17,
				columnNumber: 13
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 9,
			columnNumber: 11
		}, this), /* @__PURE__ */ jsxDEV(AutomationPanel, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 21,
			columnNumber: 11
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 8,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 7,
		columnNumber: 7
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 6,
		columnNumber: 10
	}, this);
}
//#endregion
export { AutomationPage as component };
