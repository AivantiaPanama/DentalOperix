import { l as formatDateMX, s as mockLeads } from "../server.js";
import { n as cn, t as Button } from "./button-BLeLDVKM.js";
import { t as AdminLayout } from "./AdminLayout-DppqpWwN.js";
import { t as AdminRouteGuard } from "./AdminRouteGuard-DblhNB_g.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BATy6eNr.js";
import { a as TableHead, i as TableCell, n as TableBody, o as TableHeader, s as TableRow, t as Table } from "./table-DCs_mAww.js";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import { Briefcase, Calendar, CheckCircle2, ClipboardList, Sparkles, Users } from "lucide-react";
import * as RechartsPrimitive from "recharts";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
//#region src/components/ui/chart.tsx
var _jsxFileName$3 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/ui/chart.tsx";
var THEMES = {
	light: "",
	dark: ".dark"
};
var ChartContext = React.createContext(null);
function useChart() {
	const context = React.useContext(ChartContext);
	if (!context) throw new Error("useChart must be used within a <ChartContainer />");
	return context;
}
var ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
	const uniqueId = React.useId();
	const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
	return /* @__PURE__ */ jsxDEV(ChartContext.Provider, {
		value: { config },
		children: /* @__PURE__ */ jsxDEV("div", {
			"data-chart": chartId,
			ref,
			className: cn("flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none", className),
			...props,
			children: [/* @__PURE__ */ jsxDEV(ChartStyle, {
				id: chartId,
				config
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 56,
				columnNumber: 9
			}, void 0), /* @__PURE__ */ jsxDEV(RechartsPrimitive.ResponsiveContainer, { children }, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 57,
				columnNumber: 9
			}, void 0)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 47,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 46,
		columnNumber: 5
	}, void 0);
});
ChartContainer.displayName = "Chart";
var ChartStyle = ({ id, config }) => {
	const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color);
	if (!colorConfig.length) return null;
	return /* @__PURE__ */ jsxDEV("style", { dangerouslySetInnerHTML: { __html: Object.entries(THEMES).map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
		const color = itemConfig.theme?.[theme] || itemConfig.color;
		return color ? `  --color-${key}: ${color};` : null;
	}).join("\n")}
}
`).join("\n") } }, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 72,
		columnNumber: 5
	}, void 0);
};
var ChartTooltipContent = React.forwardRef(({ active, payload, className, indicator = "dot", hideLabel = false, hideIndicator = false, label, labelFormatter, labelClassName, formatter, color, nameKey, labelKey }, ref) => {
	const { config } = useChart();
	const tooltipLabel = React.useMemo(() => {
		if (hideLabel || !payload?.length) return null;
		const [item] = payload;
		const itemConfig = getPayloadConfigFromPayload(config, item, `${labelKey || item?.dataKey || item?.name || "value"}`);
		const value = !labelKey && typeof label === "string" ? config[label]?.label || label : itemConfig?.label;
		if (labelFormatter) return /* @__PURE__ */ jsxDEV("div", {
			className: cn("font-medium", labelClassName),
			children: labelFormatter(value, payload)
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 141,
			columnNumber: 11
		}, void 0);
		if (!value) return null;
		return /* @__PURE__ */ jsxDEV("div", {
			className: cn("font-medium", labelClassName),
			children: value
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 149,
			columnNumber: 14
		}, void 0);
	}, [
		label,
		labelFormatter,
		payload,
		hideLabel,
		labelClassName,
		config,
		labelKey
	]);
	if (!active || !payload?.length) return null;
	const nestLabel = payload.length === 1 && indicator !== "dot";
	return /* @__PURE__ */ jsxDEV("div", {
		ref,
		className: cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl", className),
		children: [!nestLabel ? tooltipLabel : null, /* @__PURE__ */ jsxDEV("div", {
			className: "grid gap-1.5",
			children: payload.filter((item) => item.type !== "none").map((item, index) => {
				const itemConfig = getPayloadConfigFromPayload(config, item, `${nameKey || item.name || item.dataKey || "value"}`);
				const indicatorColor = color || item.payload.fill || item.color;
				return /* @__PURE__ */ jsxDEV("div", {
					className: cn("flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground", indicator === "dot" && "items-center"),
					children: formatter && item?.value !== void 0 && item.name ? formatter(item.value, item.name, item, index, item.payload) : /* @__PURE__ */ jsxDEV(Fragment, { children: [itemConfig?.icon ? /* @__PURE__ */ jsxDEV(itemConfig.icon, {}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 188,
						columnNumber: 25
					}, void 0) : !hideIndicator && /* @__PURE__ */ jsxDEV("div", {
						className: cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
							"h-2.5 w-2.5": indicator === "dot",
							"w-1": indicator === "line",
							"w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
							"my-0.5": nestLabel && indicator === "dashed"
						}),
						style: {
							"--color-bg": indicatorColor,
							"--color-border": indicatorColor
						}
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 191,
						columnNumber: 27
					}, void 0), /* @__PURE__ */ jsxDEV("div", {
						className: cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center"),
						children: [/* @__PURE__ */ jsxDEV("div", {
							className: "grid gap-1.5",
							children: [nestLabel ? tooltipLabel : null, /* @__PURE__ */ jsxDEV("span", {
								className: "text-muted-foreground",
								children: itemConfig?.label || item.name
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 219,
								columnNumber: 27
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 217,
							columnNumber: 25
						}, void 0), item.value && /* @__PURE__ */ jsxDEV("span", {
							className: "font-mono font-medium tabular-nums text-foreground",
							children: item.value.toLocaleString()
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 224,
							columnNumber: 27
						}, void 0)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 211,
						columnNumber: 23
					}, void 0)] }, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 186,
						columnNumber: 21
					}, void 0)
				}, item.dataKey, false, {
					fileName: _jsxFileName$3,
					lineNumber: 176,
					columnNumber: 17
				}, void 0);
			})
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 167,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 159,
		columnNumber: 7
	}, void 0);
});
ChartTooltipContent.displayName = "ChartTooltip";
var ChartLegendContent = React.forwardRef(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
	const { config } = useChart();
	if (!payload?.length) return null;
	return /* @__PURE__ */ jsxDEV("div", {
		ref,
		className: cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className),
		children: payload.filter((item) => item.type !== "none").map((item) => {
			const itemConfig = getPayloadConfigFromPayload(config, item, `${nameKey || item.dataKey || "value"}`);
			return /* @__PURE__ */ jsxDEV("div", {
				className: cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"),
				children: [itemConfig?.icon && !hideIcon ? /* @__PURE__ */ jsxDEV(itemConfig.icon, {}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 280,
					columnNumber: 17
				}, void 0) : /* @__PURE__ */ jsxDEV("div", {
					className: "h-2 w-2 shrink-0 rounded-[2px]",
					style: { backgroundColor: item.color }
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 282,
					columnNumber: 17
				}, void 0), itemConfig?.label]
			}, item.value, true, {
				fileName: _jsxFileName$3,
				lineNumber: 273,
				columnNumber: 13
			}, void 0);
		})
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 258,
		columnNumber: 5
	}, void 0);
});
ChartLegendContent.displayName = "ChartLegend";
function getPayloadConfigFromPayload(config, payload, key) {
	if (typeof payload !== "object" || payload === null) return;
	const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : void 0;
	let configLabelKey = key;
	if (key in payload && typeof payload[key] === "string") configLabelKey = payload[key];
	else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") configLabelKey = payloadPayload[key];
	return configLabelKey in config ? config[configLabelKey] : config[key];
}
//#endregion
//#region src/components/site/SmallDashboard.tsx
var _jsxFileName$2 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/site/SmallDashboard.tsx";
function SmallDashboard({ totalLeads, scheduledAppointments, uniqueTreatments, topTreatments, loading }) {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "mb-6 rounded-3xl border border-border bg-white p-5 shadow-soft",
		children: [
			/* @__PURE__ */ jsxDEV("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ jsxDEV("div", { children: [
					/* @__PURE__ */ jsxDEV("p", {
						className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
						children: "Dashboard compacto"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 24,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV("h2", {
						className: "mt-2 text-2xl font-semibold text-deep",
						children: "Resumen rápido"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 27,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Una vista condensada de leads, citas y tratamientos."
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 28,
						columnNumber: 11
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 23,
					columnNumber: 9
				}, this), /* @__PURE__ */ jsxDEV("span", {
					className: "rounded-full border border-border bg-slate-100 px-3 py-1 text-sm font-semibold text-muted-foreground",
					children: loading ? "Actualizando..." : "Actualizado"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 32,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 22,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ jsxDEV(Card, {
						className: "rounded-3xl border border-border bg-slate-50 p-4",
						children: /* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center gap-2 text-slate-900",
							children: [/* @__PURE__ */ jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 41,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(CardTitle, {
								className: "text-sm",
								children: "Leads"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 42,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 40,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardDescription, {
							className: "mt-2 text-3xl font-semibold text-deep",
							children: totalLeads
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 44,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 39,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 38,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ jsxDEV(Card, {
						className: "rounded-3xl border border-border bg-slate-50 p-4",
						children: /* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center gap-2 text-emerald-600",
							children: [/* @__PURE__ */ jsxDEV(CheckCircle2, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 53,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(CardTitle, {
								className: "text-sm",
								children: "Citas agendadas"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 54,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 52,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardDescription, {
							className: "mt-2 text-3xl font-semibold text-deep",
							children: scheduledAppointments
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 56,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 51,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 50,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ jsxDEV(Card, {
						className: "rounded-3xl border border-border bg-slate-50 p-4",
						children: /* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center gap-2 text-sky-600",
							children: [/* @__PURE__ */ jsxDEV(Calendar, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 65,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(CardTitle, {
								className: "text-sm",
								children: "Tratamientos"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 66,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 64,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardDescription, {
							className: "mt-2 text-3xl font-semibold text-deep",
							children: uniqueTreatments
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 68,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 63,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 62,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ jsxDEV(Card, {
						className: "rounded-3xl border border-border bg-slate-50 p-4",
						children: /* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center gap-2 text-deep",
							children: [/* @__PURE__ */ jsxDEV(Users, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 77,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(CardTitle, {
								className: "text-sm",
								children: "Top servicios"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 78,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 76,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardDescription, {
							className: "mt-2 text-3xl font-semibold text-deep",
							children: topTreatments.length
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 80,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 75,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 74,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 37,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: topTreatments.length > 0 ? topTreatments.map((item) => /* @__PURE__ */ jsxDEV("div", {
					className: "rounded-3xl border border-border/80 bg-white p-4",
					children: [
						/* @__PURE__ */ jsxDEV("p", {
							className: "text-sm font-semibold text-deep",
							children: item.treatment
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 91,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ jsxDEV("p", {
							className: "mt-2 text-2xl font-bold text-deep",
							children: item.value
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 92,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ jsxDEV("p", {
							className: "text-xs text-muted-foreground",
							children: "Leads registrados"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 93,
							columnNumber: 15
						}, this)
					]
				}, item.treatment, true, {
					fileName: _jsxFileName$2,
					lineNumber: 90,
					columnNumber: 13
				}, this)) : /* @__PURE__ */ jsxDEV("div", {
					className: "rounded-3xl border border-border/80 bg-white p-4 text-sm text-muted-foreground",
					children: "No hay suficientes datos para mostrar los tratamientos principales."
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 97,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 87,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 21,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/site/PatientDashboard.tsx
var _jsxFileName$1 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/site/PatientDashboard.tsx";
var defaultLeadData = mockLeads;
function useLeadData() {
	const [leads, setLeads] = useState(defaultLeadData);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(void 0);
	useEffect(() => {
		let mounted = true;
		async function fetchLeads() {
			try {
				const response = await fetch("/api/leads/list");
				if (!response.ok) throw new Error("Fallo al cargar leads");
				const json = await response.json();
				if (mounted && Array.isArray(json.leads)) {
					setLeads(json.leads);
					if (json.fallback) setError(json.message ?? "Mostrando datos demo.");
				}
			} catch (error) {
				console.warn("Usando datos mock para leads:", error);
				if (mounted) {
					setError("No se pudo cargar los leads reales. Usando datos demo.");
					setLeads(defaultLeadData);
				}
			} finally {
				if (mounted) setLoading(false);
			}
		}
		fetchLeads();
		return () => {
			mounted = false;
		};
	}, []);
	return {
		leads,
		loading,
		error
	};
}
function computeSummary(leads) {
	const totalLeads = leads.length;
	const scheduledAppointments = leads.filter((lead) => lead.status === "agendada").length;
	const treatmentCounts = leads.reduce((acc, lead) => {
		acc[lead.treatment] = (acc[lead.treatment] ?? 0) + 1;
		return acc;
	}, {});
	return {
		totalLeads,
		scheduledAppointments,
		leadsByTreatment: treatmentCounts,
		treatmentChartData: Object.entries(treatmentCounts).map(([treatment, value]) => ({
			treatment,
			value
		})),
		topTreatments: Object.entries(treatmentCounts).sort(([, a], [, b]) => b - a).slice(0, 4).map(([treatment, value]) => ({
			treatment,
			value
		}))
	};
}
var COMPACT_DASHBOARD_STORAGE_KEY = "dentaloperix.showCompactDashboard";
function PatientDashboard() {
	const { leads, loading, error } = useLeadData();
	const [showCompactDashboard, setShowCompactDashboard] = useState(() => {
		if (typeof window === "undefined") return true;
		const stored = window.localStorage.getItem(COMPACT_DASHBOARD_STORAGE_KEY);
		return stored === null ? true : stored === "true";
	});
	useEffect(() => {
		window.localStorage.setItem(COMPACT_DASHBOARD_STORAGE_KEY, showCompactDashboard ? "true" : "false");
	}, [showCompactDashboard]);
	const { totalLeads, scheduledAppointments, leadsByTreatment, treatmentChartData, topTreatments } = useMemo(() => computeSummary(leads), [leads]);
	const downloadReport = () => {
		const csv = [[
			"Fecha",
			"Nombre",
			"Tratamiento",
			"Estado",
			"Email",
			"Origen"
		], ...leads.map((lead) => [
			formatDateMX(lead.createdAt),
			lead.name,
			lead.treatment,
			lead.status,
			lead.email,
			lead.source
		])].map((row) => row.map((value) => `"${String(value).replace(/"/g, "\"\"")}"`).join(",")).join("\r\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `reporte-leads-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ jsxDEV("div", {
		className: "mx-auto max-w-7xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ jsxDEV("div", {
				className: "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ jsxDEV("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ jsxDEV("span", {
							className: "chip",
							children: "CRM demo"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 136,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("h1", {
							className: "mt-2 text-3xl font-bold tracking-tight text-deep sm:text-4xl",
							children: "Panel CRM de DentalOperix"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 137,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("p", {
							className: "mt-1 text-muted-foreground",
							children: "Resumen de leads, tratamientos y citas agendadas con datos de ejemplo."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 140,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 135,
					columnNumber: 9
				}, this), /* @__PURE__ */ jsxDEV("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ jsxDEV(Button, {
						disabled: loading,
						onClick: () => setShowCompactDashboard((current) => !current),
						variant: "outline",
						className: "rounded-full",
						children: showCompactDashboard ? "Ocultar resumen rápido" : "Mostrar resumen rápido"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 145,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(Button, {
						disabled: loading,
						onClick: downloadReport,
						className: "shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90",
						children: "Exportar reporte"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 153,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 144,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 134,
				columnNumber: 7
			}, this),
			loading ? /* @__PURE__ */ jsxDEV("div", {
				className: "mb-6 rounded-3xl border border-dashed border-border bg-slate-50 px-4 py-3 text-sm text-slate-600",
				children: "Cargando leads desde el endpoint... Usando datos mock mientras se resuelve."
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 164,
				columnNumber: 9
			}, this) : null,
			/* @__PURE__ */ jsxDEV("div", {
				className: `mb-6 overflow-hidden rounded-3xl transition-all duration-300 ease-out ${showCompactDashboard ? "max-h-[2000px] opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"}`,
				"aria-hidden": !showCompactDashboard,
				children: /* @__PURE__ */ jsxDEV(SmallDashboard, {
					totalLeads,
					scheduledAppointments,
					uniqueTreatments: Object.keys(leadsByTreatment).length,
					topTreatments,
					loading
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 177,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 169,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ jsxDEV(Card, {
						className: "rounded-3xl border border-border bg-white shadow-soft",
						children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center gap-3 text-primary",
							children: [/* @__PURE__ */ jsxDEV(Sparkles, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 190,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(CardTitle, { children: "Total de leads" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 191,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 189,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Leads registrados en el CRM demo." }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 193,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 188,
							columnNumber: 11
						}, this), /* @__PURE__ */ jsxDEV(CardContent, {
							className: "pt-0 text-4xl font-semibold text-deep",
							children: totalLeads
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 195,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 187,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ jsxDEV(Card, {
						className: "rounded-3xl border border-border bg-white shadow-soft",
						children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center gap-3 text-emerald-600",
							children: [/* @__PURE__ */ jsxDEV(CheckCircle2, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 201,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(CardTitle, { children: "Citas agendadas" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 202,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 200,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Leads que ya tienen cita programada." }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 204,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 199,
							columnNumber: 11
						}, this), /* @__PURE__ */ jsxDEV(CardContent, {
							className: "pt-0 text-4xl font-semibold text-deep",
							children: scheduledAppointments
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 206,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 198,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ jsxDEV(Card, {
						className: "rounded-3xl border border-border bg-white shadow-soft",
						children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center gap-3 text-sky-600",
							children: [/* @__PURE__ */ jsxDEV(Calendar, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 214,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(CardTitle, { children: "Tratamientos únicos" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 215,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 213,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Tipos de tratamientos en el CRM." }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 217,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 212,
							columnNumber: 11
						}, this), /* @__PURE__ */ jsxDEV(CardContent, {
							className: "pt-0 text-4xl font-semibold text-deep",
							children: Object.keys(leadsByTreatment).length
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 219,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 211,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 186,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-8 grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]",
				children: [/* @__PURE__ */ jsxDEV(Card, {
					className: "rounded-3xl border border-border bg-white shadow-soft",
					children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ jsxDEV("div", {
								className: "flex items-center gap-3 text-deep",
								children: [/* @__PURE__ */ jsxDEV(Briefcase, { className: "h-5 w-5" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 230,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV(CardTitle, { children: "Leads por tratamiento" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 231,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 229,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("span", {
								className: "rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary",
								children: "Modelo mock"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 233,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 228,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(CardDescription, { children: "Gráfico que muestra los tratamientos más solicitados." }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 237,
							columnNumber: 13
						}, this),
						error ? /* @__PURE__ */ jsxDEV("p", {
							className: "mt-2 text-sm text-amber-700",
							children: error
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 238,
							columnNumber: 22
						}, this) : null
					] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 227,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(CardContent, {
						className: "pt-0",
						children: /* @__PURE__ */ jsxDEV("div", {
							className: "h-[320px]",
							children: /* @__PURE__ */ jsxDEV(ChartContainer, {
								config: { treatment: {
									label: "Leads",
									color: "#22c55e"
								} },
								children: /* @__PURE__ */ jsxDEV(BarChart, {
									data: treatmentChartData,
									margin: {
										top: 20,
										right: 8,
										left: 0,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ jsxDEV(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "#e2e8f0",
											vertical: false
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 247,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV(XAxis, {
											dataKey: "treatment",
											stroke: "#64748b",
											tickLine: false,
											axisLine: false
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 248,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV(YAxis, {
											stroke: "#64748b",
											tickLine: false,
											axisLine: false
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 249,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV(Tooltip, { content: /* @__PURE__ */ jsxDEV(ChartTooltipContent, {}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 250,
											columnNumber: 37
										}, this) }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 250,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV(Legend, {
											verticalAlign: "top",
											height: 36
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 251,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV(Bar, {
											dataKey: "value",
											name: "Leads",
											fill: "#22c55e",
											radius: [
												12,
												12,
												0,
												0
											]
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 252,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 243,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 242,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 241,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 240,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 226,
					columnNumber: 9
				}, this), /* @__PURE__ */ jsxDEV(Card, {
					className: "rounded-3xl border border-border bg-white shadow-soft",
					children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV("div", {
						className: "flex items-center gap-3 text-deep",
						children: [/* @__PURE__ */ jsxDEV(Users, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 262,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV(CardTitle, { children: "Visión general" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 263,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 261,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Datos de leads y estado del pipeline." }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 265,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 260,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(CardContent, {
						className: "pt-0",
						children: /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-3",
							children: Object.entries(leadsByTreatment).map(([treatment, count]) => /* @__PURE__ */ jsxDEV("div", {
								className: "flex items-center justify-between gap-4 rounded-3xl border border-border/80 bg-slate-50 px-4 py-3",
								children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
									className: "text-sm font-semibold text-deep",
									children: treatment
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 275,
									columnNumber: 21
								}, this), /* @__PURE__ */ jsxDEV("p", {
									className: "text-xs text-muted-foreground",
									children: "Leads registrados"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 276,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 274,
									columnNumber: 19
								}, this), /* @__PURE__ */ jsxDEV("span", {
									className: "rounded-full bg-white px-3 py-1 text-sm font-semibold text-deep shadow-sm",
									children: count
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 278,
									columnNumber: 19
								}, this)]
							}, treatment, true, {
								fileName: _jsxFileName$1,
								lineNumber: 270,
								columnNumber: 17
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 268,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 267,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 259,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 225,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-8 grid gap-4",
				children: /* @__PURE__ */ jsxDEV(Card, {
					className: "rounded-3xl border border-border bg-white shadow-soft",
					children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV("div", {
						className: "flex items-center gap-3 text-deep",
						children: [/* @__PURE__ */ jsxDEV(ClipboardList, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 292,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV(CardTitle, { children: "Leads recientes" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 293,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 291,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Últimos leads registrados en el demo." }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 295,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 290,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(CardContent, {
						className: "pt-0",
						children: /* @__PURE__ */ jsxDEV("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ jsxDEV(Table, { children: [/* @__PURE__ */ jsxDEV(TableHeader, { children: /* @__PURE__ */ jsxDEV(TableRow, { children: [
								/* @__PURE__ */ jsxDEV(TableHead, { children: "Fecha" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 302,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ jsxDEV(TableHead, { children: "Nombre" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 303,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ jsxDEV(TableHead, { children: "Tratamiento" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 304,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ jsxDEV(TableHead, { children: "Estado" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 305,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ jsxDEV(TableHead, { children: "Email" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 306,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ jsxDEV(TableHead, { children: "Origen" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 307,
									columnNumber: 21
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 301,
								columnNumber: 19
							}, this) }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 300,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV(TableBody, { children: loading ? /* @__PURE__ */ jsxDEV(TableRow, { children: /* @__PURE__ */ jsxDEV(TableCell, {
								colSpan: 6,
								className: "py-8 text-center text-sm text-slate-500",
								children: "Cargando leads desde el endpoint... usando datos demo mientras se obtiene la información."
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 313,
								columnNumber: 23
							}, this) }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 312,
								columnNumber: 21
							}, this) : leads.map((lead) => /* @__PURE__ */ jsxDEV(TableRow, { children: [
								/* @__PURE__ */ jsxDEV(TableCell, { children: formatDateMX(lead.createdAt) }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 321,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ jsxDEV(TableCell, { children: lead.name }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 322,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ jsxDEV(TableCell, { children: lead.treatment }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 323,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ jsxDEV(TableCell, { children: /* @__PURE__ */ jsxDEV("span", {
									className: `inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusBadgeColor(lead.status)}`,
									children: lead.status
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 325,
									columnNumber: 27
								}, this) }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 324,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ jsxDEV(TableCell, { children: lead.email }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 331,
									columnNumber: 25
								}, this),
								/* @__PURE__ */ jsxDEV(TableCell, { children: lead.source }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 332,
									columnNumber: 25
								}, this)
							] }, lead.id, true, {
								fileName: _jsxFileName$1,
								lineNumber: 320,
								columnNumber: 23
							}, this)) }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 310,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 299,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 298,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 297,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 289,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 288,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 133,
		columnNumber: 5
	}, this);
}
function statusBadgeColor(status) {
	switch (status) {
		case "agendada": return "bg-emerald-50 text-emerald-700";
		case "completada": return "bg-slate-100 text-slate-900";
		case "cancelada": return "bg-rose-50 text-rose-700";
		case "no asistió": return "bg-orange-50 text-orange-700";
		case "nuevo": return "bg-sky-50 text-sky-700";
		default: return "bg-slate-50 text-slate-700";
	}
}
//#endregion
//#region src/routes/dashboard.tsx?tsr-split=component
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/dashboard.tsx?tsr-split=component";
function DashboardPage() {
	return /* @__PURE__ */ jsxDEV(AdminRouteGuard, { children: /* @__PURE__ */ jsxDEV(AdminLayout, { children: /* @__PURE__ */ jsxDEV(PatientDashboard, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 7,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 6,
		columnNumber: 7
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 5,
		columnNumber: 10
	}, this);
}
//#endregion
export { DashboardPage as component };
