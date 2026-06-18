import { a as validateGoalSettings, i as saveGoalSettings, n as getDefaultGoals, o as getPeriodLabel, r as loadGoalSettings } from "../server.js";
import { t as Route$12 } from "./servicios._serviceId-HxbGw1ZC.js";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DrreS9S0.js";
import { t as Route$13 } from "./_profile-DgADW_Nn.js";
import { t as Button } from "./button-BLeLDVKM.js";
import { t as AdminLayout } from "./AdminLayout-DppqpWwN.js";
import { t as AdminRouteGuard } from "./AdminRouteGuard-DblhNB_g.js";
import { i as CardHeader, n as CardContent, t as Card } from "./card-BATy6eNr.js";
import { a as TableHead, i as TableCell, n as TableBody, o as TableHeader, r as TableCaption, s as TableRow, t as Table } from "./table-DCs_mAww.js";
import { n as Input, t as Label } from "./label-DBNUsIZD.js";
import { a as getHighestValueService, i as getFastestGrowingService, n as getBestConvertingService, o as fetchCRMmetrics, r as getBestConvertingSource, t as currencyFormatter$1 } from "./dashboard-insights-rz6eolrX.js";
import { useEffect, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/styles.css?url
var styles_default = "/assets/styles-BqsmLN8w.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
//#endregion
//#region src/routes/__root.tsx
var _jsxFileName$18 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxDEV("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsxDEV("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName$18,
					lineNumber: 19,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Página no encontrada"
				}, void 0, false, {
					fileName: _jsxFileName$18,
					lineNumber: 20,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "La página que buscas no existe o fue movida."
				}, void 0, false, {
					fileName: _jsxFileName$18,
					lineNumber: 21,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsxDEV(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Volver al inicio"
					}, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 25,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$18,
					lineNumber: 24,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$18,
			lineNumber: 18,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$18,
		lineNumber: 17,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsxDEV("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxDEV("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsxDEV("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "No se pudo cargar esta página"
				}, void 0, false, {
					fileName: _jsxFileName$18,
					lineNumber: 47,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Ocurrió un error en el servidor. Intenta actualizar o regresa al inicio."
				}, void 0, false, {
					fileName: _jsxFileName$18,
					lineNumber: 50,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsxDEV("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Reintentar"
					}, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 54,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Volver al inicio"
					}, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 63,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$18,
					lineNumber: 53,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$18,
			lineNumber: 46,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$18,
		lineNumber: 45,
		columnNumber: 5
	}, this);
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "DentalOperix — Atención dental profesional en Panamá" },
			{
				name: "description",
				content: "Atención dental profesional en Panamá."
			},
			{
				name: "author",
				content: "DentalOperix"
			},
			{
				property: "og:title",
				content: "DentalOperix — Atención dental profesional"
			},
			{
				property: "og:description",
				content: "Atención dental profesional en Panamá."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@DentalOperix"
			},
			{
				name: "robots",
				content: "index,follow"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxDEV("html", {
		lang: "es",
		children: [/* @__PURE__ */ jsxDEV("head", { children: /* @__PURE__ */ jsxDEV(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName$18,
			lineNumber: 107,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName$18,
			lineNumber: 106,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("body", { children: [children, /* @__PURE__ */ jsxDEV(Scripts, {}, void 0, false, {
			fileName: _jsxFileName$18,
			lineNumber: 111,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName$18,
			lineNumber: 109,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$18,
		lineNumber: 105,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	return /* @__PURE__ */ jsxDEV(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
			fileName: _jsxFileName$18,
			lineNumber: 123,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$18,
		lineNumber: 121,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/routes/servicios.tsx
var $$splitComponentImporter$9 = () => import("./servicios-vUNM3-dy.js");
var Route$10 = createFileRoute("/servicios")({
	head: () => ({ meta: [
		{ title: "Servicios dentales — DentalOperix" },
		{
			name: "description",
			content: "Conoce las cinco áreas de atención dental de DentalOperix y agenda una consulta cuando necesites orientación."
		},
		{
			property: "og:title",
			content: "Servicios dentales — DentalOperix"
		},
		{
			property: "og:description",
			content: "Odontología preventiva, ortodoncia, diseño de sonrisa, implantes dentales y odontopediatría."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/patient.tsx
var $$splitComponentImporter$8 = () => import("./patient-ByJJsF_P.js");
var Route$9 = createFileRoute("/patient")({
	head: () => ({ meta: [
		{ title: "Paciente — DentalOperix" },
		{
			name: "description",
			content: "Portal protegido para pacientes DentalOperix."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/nuestra-filosofia.tsx
var $$splitComponentImporter$7 = () => import("./nuestra-filosofia-CiXv-TWw.js");
var Route$8 = createFileRoute("/nuestra-filosofia")({
	head: () => ({ meta: [
		{ title: "Nuestra Filosofía — DentalOperix" },
		{
			name: "description",
			content: "Conoce la filosofía de atención de DentalOperix."
		},
		{
			property: "og:title",
			content: "Nuestra Filosofía — DentalOperix"
		},
		{
			property: "og:description",
			content: "Atención dental profesional, respetuosa y organizada."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/doctor.tsx
var $$splitComponentImporter$6 = () => import("./doctor-BFivg3Sz.js");
var Route$7 = createFileRoute("/doctor")({
	head: () => ({ meta: [
		{ title: "Doctor — DentalOperix" },
		{
			name: "description",
			content: "Dashboard clínico protegido para doctores DentalOperix."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/dashboard.tsx
var $$splitComponentImporter$5 = () => import("./dashboard-DfOEkXpT.js");
var Route$6 = createFileRoute("/dashboard")({
	head: () => ({ meta: [
		{ title: "Mi Portal legacy — DentalOperix" },
		{
			name: "description",
			content: "Panel administrativo legacy de DentalOperix."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/assistant.tsx
var $$splitComponentImporter$4 = () => import("./assistant-D8LNZpbS.js");
var Route$5 = createFileRoute("/assistant")({
	head: () => ({ meta: [
		{ title: "Asistente — DentalOperix" },
		{
			name: "description",
			content: "Dashboard operativo protegido para asistentes DentalOperix."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/admin.tsx
var $$splitComponentImporter$3 = () => import("./admin-BWvxSvWK.js");
var Route$4 = createFileRoute("/admin")({
	head: () => ({ meta: [
		{ title: "Administración — DentalOperix" },
		{
			name: "description",
			content: "Dashboard administrativo protegido de DentalOperix."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$2 = () => import("./routes-Dtf7KM7C.js");
var Route$3 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "DentalOperix — Atención dental profesional en Panamá" },
		{
			name: "description",
			content: "Solicita una cita, consulta nuestros servicios o comunícate con la clínica."
		},
		{
			property: "og:title",
			content: "DentalOperix — Atención dental profesional"
		},
		{
			property: "og:description",
			content: "Solicita una cita, consulta nuestros servicios o comunícate con la clínica."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/admin/login.tsx
var $$splitComponentImporter$1 = () => import("./login-CZiod1Ec.js");
var Route$2 = createFileRoute("/admin/login")({
	head: () => ({ meta: [
		{ title: "Login Admin — DentalOperix" },
		{
			name: "description",
			content: "Acceso administrativo privado de DentalOperix."
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/components/admin/KpiCard.tsx
var _jsxFileName$17 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/KpiCard.tsx";
function KpiCard({ label, value, footer }) {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [
			/* @__PURE__ */ jsxDEV("p", {
				className: "text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground",
				children: label
			}, void 0, false, {
				fileName: _jsxFileName$17,
				lineNumber: 10,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("p", {
				className: "mt-4 text-4xl font-bold tracking-tight text-deep",
				children: value
			}, void 0, false, {
				fileName: _jsxFileName$17,
				lineNumber: 13,
				columnNumber: 7
			}, this),
			footer ? /* @__PURE__ */ jsxDEV("div", {
				className: "mt-4",
				children: footer
			}, void 0, false, {
				fileName: _jsxFileName$17,
				lineNumber: 14,
				columnNumber: 17
			}, this) : null
		]
	}, void 0, true, {
		fileName: _jsxFileName$17,
		lineNumber: 9,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/TrendChart.tsx
var _jsxFileName$16 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/TrendChart.tsx";
function TrendChart({ data, title }) {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [/* @__PURE__ */ jsxDEV("div", {
			className: "mb-4 flex items-center justify-between",
			children: /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h2", {
				className: "text-xl font-semibold text-deep",
				children: title ?? "Tendencia"
			}, void 0, false, {
				fileName: _jsxFileName$16,
				lineNumber: 23,
				columnNumber: 11
			}, this), /* @__PURE__ */ jsxDEV("p", {
				className: "text-sm text-muted-foreground",
				children: "Leads, agendadas y completadas"
			}, void 0, false, {
				fileName: _jsxFileName$16,
				lineNumber: 24,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$16,
				lineNumber: 22,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$16,
			lineNumber: 21,
			columnNumber: 7
		}, this), data.length === 0 ? /* @__PURE__ */ jsxDEV("div", {
			className: "rounded-3xl border border-dashed border-border/80 bg-slate-50 p-8 text-center text-sm text-muted-foreground",
			children: "No hay datos disponibles para esta tendencia."
		}, void 0, false, {
			fileName: _jsxFileName$16,
			lineNumber: 28,
			columnNumber: 9
		}, this) : /* @__PURE__ */ jsxDEV("div", {
			className: "h-80",
			children: /* @__PURE__ */ jsxDEV(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ jsxDEV(LineChart, {
					data,
					margin: {
						top: 10,
						right: 24,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ jsxDEV(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "#e2e8f0",
							vertical: false
						}, void 0, false, {
							fileName: _jsxFileName$16,
							lineNumber: 35,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ jsxDEV(XAxis, {
							dataKey: "label",
							stroke: "#64748b",
							tickLine: false,
							axisLine: false
						}, void 0, false, {
							fileName: _jsxFileName$16,
							lineNumber: 36,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ jsxDEV(YAxis, {
							stroke: "#64748b",
							tickLine: false,
							axisLine: false
						}, void 0, false, {
							fileName: _jsxFileName$16,
							lineNumber: 37,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ jsxDEV(Tooltip, { formatter: (value) => [value, ""] }, void 0, false, {
							fileName: _jsxFileName$16,
							lineNumber: 38,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ jsxDEV(Legend, {
							verticalAlign: "top",
							height: 36
						}, void 0, false, {
							fileName: _jsxFileName$16,
							lineNumber: 39,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ jsxDEV(Line, {
							type: "monotone",
							dataKey: "leads",
							stroke: "#2563eb",
							strokeWidth: 2,
							dot: false
						}, void 0, false, {
							fileName: _jsxFileName$16,
							lineNumber: 40,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ jsxDEV(Line, {
							type: "monotone",
							dataKey: "agendadas",
							stroke: "#14b8a6",
							strokeWidth: 2,
							dot: false
						}, void 0, false, {
							fileName: _jsxFileName$16,
							lineNumber: 41,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ jsxDEV(Line, {
							type: "monotone",
							dataKey: "completadas",
							stroke: "#059669",
							strokeWidth: 2,
							dot: false
						}, void 0, false, {
							fileName: _jsxFileName$16,
							lineNumber: 48,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$16,
					lineNumber: 34,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$16,
				lineNumber: 33,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$16,
			lineNumber: 32,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$16,
		lineNumber: 20,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/ComparisonBadge.tsx
var _jsxFileName$15 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/ComparisonBadge.tsx";
function ComparisonBadge({ label, changePercent }) {
	const isPositive = changePercent >= 0;
	const display = `${isPositive ? "+" : ""}${changePercent}%`;
	return /* @__PURE__ */ jsxDEV("div", {
		className: "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium",
		role: "status",
		children: [/* @__PURE__ */ jsxDEV("span", {
			className: isPositive ? "text-emerald-700 bg-emerald-100" : "text-destructive bg-destructive/10",
			children: display
		}, void 0, false, {
			fileName: _jsxFileName$15,
			lineNumber: 18,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("span", {
			className: "text-muted-foreground",
			children: label
		}, void 0, false, {
			fileName: _jsxFileName$15,
			lineNumber: 19,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$15,
		lineNumber: 14,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/PipelineValueCard.tsx
var _jsxFileName$14 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/PipelineValueCard.tsx";
var currencyFormatter = new Intl.NumberFormat("es-PA", {
	style: "currency",
	currency: "USD"
});
function PipelineValueCard({ totalValue }) {
	return /* @__PURE__ */ jsxDEV(Card, {
		className: "rounded-3xl border border-border bg-white shadow-soft",
		children: [/* @__PURE__ */ jsxDEV(CardHeader, {
			className: "p-6",
			children: [/* @__PURE__ */ jsxDEV("p", {
				className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
				children: "Valor potencial estimado"
			}, void 0, false, {
				fileName: _jsxFileName$14,
				lineNumber: 16,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV("p", {
				className: "mt-4 text-3xl font-semibold tracking-tight text-deep",
				children: currencyFormatter.format(totalValue)
			}, void 0, false, {
				fileName: _jsxFileName$14,
				lineNumber: 19,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$14,
			lineNumber: 15,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV(CardContent, {
			className: "border-t border-border/80 p-6 pt-4 text-sm text-muted-foreground",
			children: "Este valor representa el pipeline estimado de servicios activos, sin incluir cancelados o no asistidos."
		}, void 0, false, {
			fileName: _jsxFileName$14,
			lineNumber: 23,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$14,
		lineNumber: 14,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/ServiceConversionTable.tsx
var _jsxFileName$13 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/ServiceConversionTable.tsx";
function formatPercent$2(value) {
	return `${Number(value.toFixed(1)).toLocaleString("es-PA")} %`;
}
function ServiceConversionTable({ items }) {
	const sorted = [...items].sort((a, b) => b.conversionRate - a.conversionRate);
	if (sorted.length === 0) return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 text-center text-sm text-muted-foreground shadow-soft",
		children: "Sin datos disponibles todavía."
	}, void 0, false, {
		fileName: _jsxFileName$13,
		lineNumber: 25,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [/* @__PURE__ */ jsxDEV("h3", {
			className: "mb-4 text-lg font-semibold text-deep",
			children: "Conversión por servicio"
		}, void 0, false, {
			fileName: _jsxFileName$13,
			lineNumber: 33,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV(Table, { children: [
			/* @__PURE__ */ jsxDEV(TableCaption, { children: "Servicios ordenados por mayor conversión." }, void 0, false, {
				fileName: _jsxFileName$13,
				lineNumber: 35,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ jsxDEV(TableHeader, { children: /* @__PURE__ */ jsxDEV(TableRow, { children: [
				/* @__PURE__ */ jsxDEV(TableHead, { children: "Servicio" }, void 0, false, {
					fileName: _jsxFileName$13,
					lineNumber: 38,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ jsxDEV(TableHead, { children: "Leads" }, void 0, false, {
					fileName: _jsxFileName$13,
					lineNumber: 39,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ jsxDEV(TableHead, { children: "Convertidos" }, void 0, false, {
					fileName: _jsxFileName$13,
					lineNumber: 40,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ jsxDEV(TableHead, { children: "Conversión %" }, void 0, false, {
					fileName: _jsxFileName$13,
					lineNumber: 41,
					columnNumber: 13
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName$13,
				lineNumber: 37,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName$13,
				lineNumber: 36,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ jsxDEV(TableBody, { children: sorted.map((item) => /* @__PURE__ */ jsxDEV(TableRow, { children: [
				/* @__PURE__ */ jsxDEV(TableCell, { children: item.service }, void 0, false, {
					fileName: _jsxFileName$13,
					lineNumber: 47,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ jsxDEV(TableCell, { children: item.leads }, void 0, false, {
					fileName: _jsxFileName$13,
					lineNumber: 48,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ jsxDEV(TableCell, { children: item.completed }, void 0, false, {
					fileName: _jsxFileName$13,
					lineNumber: 49,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ jsxDEV(TableCell, { children: formatPercent$2(item.conversionRate) }, void 0, false, {
					fileName: _jsxFileName$13,
					lineNumber: 50,
					columnNumber: 15
				}, this)
			] }, item.service, true, {
				fileName: _jsxFileName$13,
				lineNumber: 46,
				columnNumber: 13
			}, this)) }, void 0, false, {
				fileName: _jsxFileName$13,
				lineNumber: 44,
				columnNumber: 9
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName$13,
			lineNumber: 34,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$13,
		lineNumber: 32,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/ServiceTrendChart.tsx
var _jsxFileName$12 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/ServiceTrendChart.tsx";
function ServiceTrendChart({ data }) {
	const sorted = [...data].sort((a, b) => b.leads - a.leads).slice(0, 5);
	if (sorted.length === 0) return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 text-center text-sm text-muted-foreground shadow-soft",
		children: "Sin datos disponibles todavía."
	}, void 0, false, {
		fileName: _jsxFileName$12,
		lineNumber: 22,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [/* @__PURE__ */ jsxDEV("div", {
			className: "mb-4",
			children: [/* @__PURE__ */ jsxDEV("h3", {
				className: "text-lg font-semibold text-deep",
				children: "Tendencia de servicios"
			}, void 0, false, {
				fileName: _jsxFileName$12,
				lineNumber: 31,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV("p", {
				className: "text-sm text-muted-foreground",
				children: "Top 5 servicios con mayor volumen de leads."
			}, void 0, false, {
				fileName: _jsxFileName$12,
				lineNumber: 32,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$12,
			lineNumber: 30,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("div", {
			className: "h-80",
			children: /* @__PURE__ */ jsxDEV(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ jsxDEV(BarChart, {
					data: sorted,
					margin: {
						top: 10,
						right: 24,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ jsxDEV(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "#e2e8f0",
							vertical: false
						}, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 37,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(XAxis, {
							dataKey: "service",
							stroke: "#64748b",
							tickLine: false,
							axisLine: false
						}, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 38,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(YAxis, {
							stroke: "#64748b",
							tickLine: false,
							axisLine: false
						}, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 39,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(Tooltip, { formatter: (value) => [value, "Leads"] }, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 40,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(Legend, {
							verticalAlign: "top",
							height: 36
						}, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 41,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(Bar, {
							dataKey: "leads",
							fill: "#2563eb"
						}, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 42,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$12,
					lineNumber: 36,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$12,
				lineNumber: 35,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$12,
			lineNumber: 34,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$12,
		lineNumber: 29,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/SourceConversionTable.tsx
var _jsxFileName$11 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/SourceConversionTable.tsx";
function formatPercent$1(value) {
	return `${Number(value.toFixed(1)).toLocaleString("es-PA")} %`;
}
function SourceConversionTable({ items }) {
	const sorted = [...items].sort((a, b) => b.conversionRate - a.conversionRate);
	if (sorted.length === 0) return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 text-center text-sm text-muted-foreground shadow-soft",
		children: "Sin datos disponibles todavía."
	}, void 0, false, {
		fileName: _jsxFileName$11,
		lineNumber: 25,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [/* @__PURE__ */ jsxDEV("h3", {
			className: "mb-4 text-lg font-semibold text-deep",
			children: "Conversión por fuente"
		}, void 0, false, {
			fileName: _jsxFileName$11,
			lineNumber: 33,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV(Table, { children: [
			/* @__PURE__ */ jsxDEV(TableCaption, { children: "Fuentes ordenadas por mayor conversión." }, void 0, false, {
				fileName: _jsxFileName$11,
				lineNumber: 35,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ jsxDEV(TableHeader, { children: /* @__PURE__ */ jsxDEV(TableRow, { children: [
				/* @__PURE__ */ jsxDEV(TableHead, { children: "Fuente" }, void 0, false, {
					fileName: _jsxFileName$11,
					lineNumber: 38,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ jsxDEV(TableHead, { children: "Leads" }, void 0, false, {
					fileName: _jsxFileName$11,
					lineNumber: 39,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ jsxDEV(TableHead, { children: "Convertidos" }, void 0, false, {
					fileName: _jsxFileName$11,
					lineNumber: 40,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ jsxDEV(TableHead, { children: "Conversión %" }, void 0, false, {
					fileName: _jsxFileName$11,
					lineNumber: 41,
					columnNumber: 13
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName$11,
				lineNumber: 37,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName$11,
				lineNumber: 36,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ jsxDEV(TableBody, { children: sorted.map((item) => /* @__PURE__ */ jsxDEV(TableRow, { children: [
				/* @__PURE__ */ jsxDEV(TableCell, { children: item.source }, void 0, false, {
					fileName: _jsxFileName$11,
					lineNumber: 47,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ jsxDEV(TableCell, { children: item.leads }, void 0, false, {
					fileName: _jsxFileName$11,
					lineNumber: 48,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ jsxDEV(TableCell, { children: item.completed }, void 0, false, {
					fileName: _jsxFileName$11,
					lineNumber: 49,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ jsxDEV(TableCell, { children: formatPercent$1(item.conversionRate) }, void 0, false, {
					fileName: _jsxFileName$11,
					lineNumber: 50,
					columnNumber: 15
				}, this)
			] }, item.source, true, {
				fileName: _jsxFileName$11,
				lineNumber: 46,
				columnNumber: 13
			}, this)) }, void 0, false, {
				fileName: _jsxFileName$11,
				lineNumber: 44,
				columnNumber: 9
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName$11,
			lineNumber: 34,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$11,
		lineNumber: 32,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/InsightsPanel.tsx
var _jsxFileName$10 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/InsightsPanel.tsx";
function getInsightIcon(type) {
	switch (type) {
		case "success": return "✅";
		case "warning": return "⚠️";
		case "info": return "ℹ️";
		default: return "💡";
	}
}
function InsightsPanel({ insights }) {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [/* @__PURE__ */ jsxDEV("div", {
			className: "mb-6 flex items-center justify-between gap-3",
			children: /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
				className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
				children: "Insights ejecutivos"
			}, void 0, false, {
				fileName: _jsxFileName$10,
				lineNumber: 25,
				columnNumber: 11
			}, this), /* @__PURE__ */ jsxDEV("h2", {
				className: "text-2xl font-semibold text-deep",
				children: "Observaciones automáticas"
			}, void 0, false, {
				fileName: _jsxFileName$10,
				lineNumber: 28,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$10,
				lineNumber: 24,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$10,
			lineNumber: 23,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
			children: insights.map((insight, index) => /* @__PURE__ */ jsxDEV("div", {
				className: "rounded-3xl border border-border/80 bg-slate-50 p-5",
				children: /* @__PURE__ */ jsxDEV("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ jsxDEV("span", {
						className: "text-3xl leading-none",
						children: getInsightIcon(insight.type)
					}, void 0, false, {
						fileName: _jsxFileName$10,
						lineNumber: 38,
						columnNumber: 15
					}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
						className: "text-sm font-semibold text-deep",
						children: insight.title
					}, void 0, false, {
						fileName: _jsxFileName$10,
						lineNumber: 40,
						columnNumber: 17
					}, this), /* @__PURE__ */ jsxDEV("p", {
						className: "mt-3 text-sm leading-6 text-muted-foreground",
						children: insight.message
					}, void 0, false, {
						fileName: _jsxFileName$10,
						lineNumber: 41,
						columnNumber: 17
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$10,
						lineNumber: 39,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$10,
					lineNumber: 37,
					columnNumber: 13
				}, this)
			}, `${insight.title}-${index}`, false, {
				fileName: _jsxFileName$10,
				lineNumber: 33,
				columnNumber: 11
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName$10,
			lineNumber: 31,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$10,
		lineNumber: 22,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/RecommendationsPanel.tsx
var _jsxFileName$9 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/RecommendationsPanel.tsx";
function getPriorityBadge(priority) {
	switch (priority) {
		case "high": return "🔴 Alta";
		case "medium": return "🟡 Media";
		case "low": return "🔵 Baja";
		default: return "🔵 Baja";
	}
}
function RecommendationsPanel({ recommendations }) {
	if (recommendations.length === 0) return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [/* @__PURE__ */ jsxDEV("h2", {
			className: "text-2xl font-semibold text-deep",
			children: "Recomendaciones operativas"
		}, void 0, false, {
			fileName: _jsxFileName$9,
			lineNumber: 24,
			columnNumber: 9
		}, this), /* @__PURE__ */ jsxDEV("p", {
			className: "mt-4 text-sm text-muted-foreground",
			children: "No hay recomendaciones disponibles con los datos actuales."
		}, void 0, false, {
			fileName: _jsxFileName$9,
			lineNumber: 25,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$9,
		lineNumber: 23,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [/* @__PURE__ */ jsxDEV("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ jsxDEV("p", {
				className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
				children: "Recomendaciones operativas"
			}, void 0, false, {
				fileName: _jsxFileName$9,
				lineNumber: 35,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV("h2", {
				className: "text-2xl font-semibold text-deep",
				children: "Acciones recomendadas"
			}, void 0, false, {
				fileName: _jsxFileName$9,
				lineNumber: 38,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$9,
			lineNumber: 34,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("div", {
			className: "space-y-4",
			children: recommendations.map((recommendation) => /* @__PURE__ */ jsxDEV("div", {
				className: "rounded-3xl border border-border/80 bg-slate-50 p-5",
				children: [
					/* @__PURE__ */ jsxDEV("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxDEV("p", {
							className: "text-sm font-semibold text-deep",
							children: recommendation.title
						}, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 47,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("span", {
							className: "rounded-full bg-white px-3 py-1 text-sm font-semibold text-muted-foreground",
							children: getPriorityBadge(recommendation.priority)
						}, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 48,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$9,
						lineNumber: 46,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ jsxDEV("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: recommendation.description
					}, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 52,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ jsxDEV("p", {
						className: "mt-3 text-sm font-medium text-deep",
						children: ["Acción: ", recommendation.action]
					}, void 0, true, {
						fileName: _jsxFileName$9,
						lineNumber: 53,
						columnNumber: 13
					}, this)
				]
			}, recommendation.id, true, {
				fileName: _jsxFileName$9,
				lineNumber: 42,
				columnNumber: 11
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName$9,
			lineNumber: 40,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$9,
		lineNumber: 33,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/BusinessHealthCard.tsx
var _jsxFileName$8 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/BusinessHealthCard.tsx";
var statusLabels = {
	excellent: "Excelente",
	good: "Bueno",
	warning: "Advertencia",
	critical: "Crítico"
};
function BusinessHealthCard({ health }) {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [
			/* @__PURE__ */ jsxDEV("p", {
				className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
				children: "Health score comercial"
			}, void 0, false, {
				fileName: _jsxFileName$8,
				lineNumber: 17,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-5 flex items-end gap-4",
				children: [/* @__PURE__ */ jsxDEV("p", {
					className: "text-5xl font-bold tracking-tight text-deep",
					children: health.score
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 21,
					columnNumber: 9
				}, this), /* @__PURE__ */ jsxDEV("span", {
					className: "rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-deep",
					children: statusLabels[health.status]
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 22,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$8,
				lineNumber: 20,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: [
					"El estado actual es ",
					statusLabels[health.status].toLowerCase(),
					" según conversión, asistencia, cancelaciones y crecimiento."
				]
			}, void 0, true, {
				fileName: _jsxFileName$8,
				lineNumber: 26,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$8,
		lineNumber: 16,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/BusinessSignals.tsx
var _jsxFileName$7 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/BusinessSignals.tsx";
function getSignalLabel(status) {
	switch (status) {
		case "green": return "Verde";
		case "yellow": return "Amarillo";
		case "red": return "Rojo";
		default: return "Desconocido";
	}
}
function BusinessSignals({ signals }) {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [/* @__PURE__ */ jsxDEV("p", {
			className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
			children: "Semáforo ejecutivo"
		}, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 23,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("div", {
			className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: signals.map((signal) => /* @__PURE__ */ jsxDEV("div", {
				className: "rounded-3xl border border-border/80 bg-slate-50 p-4",
				children: [/* @__PURE__ */ jsxDEV("p", {
					className: "text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground",
					children: signal.category
				}, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 32,
					columnNumber: 13
				}, this), /* @__PURE__ */ jsxDEV("p", {
					className: "mt-3 text-2xl font-semibold text-deep",
					children: getSignalLabel(signal.status)
				}, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 35,
					columnNumber: 13
				}, this)]
			}, signal.category, true, {
				fileName: _jsxFileName$7,
				lineNumber: 28,
				columnNumber: 11
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 26,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$7,
		lineNumber: 22,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/ExecutiveSummary.tsx
var _jsxFileName$6 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/ExecutiveSummary.tsx";
function ExecutiveSummary({ summary }) {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [/* @__PURE__ */ jsxDEV("p", {
			className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
			children: "Resumen ejecutivo"
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 8,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("div", {
			className: "mt-4 space-y-3 text-sm leading-6 text-muted-foreground",
			children: summary.length > 0 ? summary.map((line, index) => /* @__PURE__ */ jsxDEV("p", { children: line }, `${index}-${line}`, false, {
				fileName: _jsxFileName$6,
				lineNumber: 11,
				columnNumber: 40
			}, this)) : /* @__PURE__ */ jsxDEV("p", { children: "Sin resumen disponible todavía." }, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 13,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 9,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 7,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/GoalInsights.tsx
var _jsxFileName$5 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/GoalInsights.tsx";
function GoalInsights({ insights }) {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [/* @__PURE__ */ jsxDEV("p", {
			className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
			children: "Insight de objetivos"
		}, void 0, false, {
			fileName: _jsxFileName$5,
			lineNumber: 8,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("div", {
			className: "mt-5 space-y-3 text-sm leading-6 text-muted-foreground",
			children: insights.length > 0 ? insights.map((insight, index) => /* @__PURE__ */ jsxDEV("p", { children: insight }, `${index}-${insight}`, false, {
				fileName: _jsxFileName$5,
				lineNumber: 13,
				columnNumber: 44
			}, this)) : /* @__PURE__ */ jsxDEV("p", { children: "No hay insights disponibles para los objetivos actualmente." }, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 15,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$5,
			lineNumber: 11,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 7,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/GoalRiskPanel.tsx
var _jsxFileName$4 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/GoalRiskPanel.tsx";
var riskLabels = {
	leads: {
		title: "Leads",
		detail: "La proyección de leads no alcanza la meta mensual y puede requerir más captación."
	},
	conversion: {
		title: "Conversión",
		detail: "La tasa de conversión actual está por debajo de la meta y limita el volumen de citas."
	},
	attendance: {
		title: "Asistencia",
		detail: "La asistencia está por debajo del objetivo y puede reducir el cierre de tratamientos."
	},
	pipelineValue: {
		title: "Valor potencial",
		detail: "El pipeline proyectado no alcanza el objetivo mensual y necesita mejorar la calidad de leads."
	}
};
function GoalRiskPanel({ risk }) {
	const riskEntries = Object.keys(risk).filter((key) => risk[key]);
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [/* @__PURE__ */ jsxDEV("div", {
			className: "flex items-center justify-between gap-4",
			children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
				className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
				children: "Riesgos de objetivo"
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 34,
				columnNumber: 11
			}, this), /* @__PURE__ */ jsxDEV("h2", {
				className: "mt-3 text-2xl font-semibold text-deep",
				children: "Visibilidad de riesgo"
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 37,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 33,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV("span", {
				className: "rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-rose-50",
				children: riskEntries.length === 0 ? "0 riesgos" : `${riskEntries.length} riesgo${riskEntries.length > 1 ? "s" : ""}`
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 39,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 32,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("div", {
			className: "mt-5 space-y-4 text-sm leading-6 text-muted-foreground",
			children: riskEntries.length === 0 ? /* @__PURE__ */ jsxDEV("div", {
				className: "rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900",
				children: "✅ Todos los objetivos están en buen camino según la proyección y las tasas actuales."
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 48,
				columnNumber: 11
			}, this) : riskEntries.map((key) => /* @__PURE__ */ jsxDEV("div", {
				className: "rounded-2xl border border-rose-100 bg-rose-50 p-4",
				children: [/* @__PURE__ */ jsxDEV("p", {
					className: "text-sm font-semibold text-rose-900",
					children: ["🔴 ", riskLabels[key].title]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 54,
					columnNumber: 15
				}, this), /* @__PURE__ */ jsxDEV("p", {
					className: "mt-2 text-sm text-rose-800",
					children: riskLabels[key].detail
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 55,
					columnNumber: 15
				}, this)]
			}, key, true, {
				fileName: _jsxFileName$4,
				lineNumber: 53,
				columnNumber: 13
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 46,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 31,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/GoalSettingsPanel.tsx
var _jsxFileName$3 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/GoalSettingsPanel.tsx";
var toFormState = (settings) => ({
	monthlyLeadsGoal: settings.monthlyLeadsGoal.toString(),
	conversionGoal: settings.conversionGoal.toString(),
	attendanceGoal: settings.attendanceGoal.toString(),
	pipelineValueGoal: settings.pipelineValueGoal.toString()
});
var toGoalSettings = (state) => ({
	monthlyLeadsGoal: Number(state.monthlyLeadsGoal),
	conversionGoal: Number(state.conversionGoal),
	attendanceGoal: Number(state.attendanceGoal),
	pipelineValueGoal: Number(state.pipelineValueGoal)
});
function GoalSettingsPanel({ open, settings, onOpenChange, onSave }) {
	const [form, setForm] = useState(toFormState(settings));
	const [errors, setErrors] = useState({});
	useEffect(() => {
		setForm(toFormState(settings));
		setErrors({});
	}, [settings, open]);
	const handleChange = (field, value) => {
		setForm((current) => ({
			...current,
			[field]: value
		}));
		setErrors((current) => ({
			...current,
			[field]: void 0
		}));
	};
	const handleSave = () => {
		const nextSettings = toGoalSettings(form);
		const validationErrors = validateGoalSettings(nextSettings);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		onSave(nextSettings);
		onOpenChange(false);
	};
	return /* @__PURE__ */ jsxDEV(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxDEV(DialogContent, {
			className: "max-w-2xl rounded-3xl p-6",
			children: [
				/* @__PURE__ */ jsxDEV(DialogHeader, { children: [/* @__PURE__ */ jsxDEV(DialogTitle, { children: "Configurar metas del negocio" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 78,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV(DialogDescription, { children: "Actualiza los objetivos mensuales para ver el progreso y los riesgos en tiempo real." }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 79,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 77,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "mt-6 grid gap-6",
					children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "grid gap-2",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsxDEV(Label, {
										htmlFor: "monthlyLeadsGoal",
										children: "Meta mensual de leads"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 87,
										columnNumber: 15
									}, this), /* @__PURE__ */ jsxDEV("span", {
										className: "text-sm text-muted-foreground",
										children: "Cantidad"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 88,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 86,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV(Input, {
									id: "monthlyLeadsGoal",
									type: "number",
									min: 1,
									step: 1,
									value: form.monthlyLeadsGoal,
									onChange: (event) => handleChange("monthlyLeadsGoal", event.target.value),
									placeholder: "50"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 90,
									columnNumber: 13
								}, this),
								errors.monthlyLeadsGoal ? /* @__PURE__ */ jsxDEV("p", {
									className: "text-sm text-destructive",
									children: errors.monthlyLeadsGoal
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 100,
									columnNumber: 15
								}, this) : null
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 85,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "grid gap-2",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsxDEV(Label, {
										htmlFor: "conversionGoal",
										children: "Meta de conversión"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 106,
										columnNumber: 15
									}, this), /* @__PURE__ */ jsxDEV("span", {
										className: "text-sm text-muted-foreground",
										children: "%"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 107,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 105,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV(Input, {
									id: "conversionGoal",
									type: "number",
									min: 1,
									step: 1,
									value: form.conversionGoal,
									onChange: (event) => handleChange("conversionGoal", event.target.value),
									placeholder: "40"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 109,
									columnNumber: 13
								}, this),
								errors.conversionGoal ? /* @__PURE__ */ jsxDEV("p", {
									className: "text-sm text-destructive",
									children: errors.conversionGoal
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 119,
									columnNumber: 15
								}, this) : null
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 104,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "grid gap-2",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsxDEV(Label, {
										htmlFor: "attendanceGoal",
										children: "Meta de asistencia"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 125,
										columnNumber: 15
									}, this), /* @__PURE__ */ jsxDEV("span", {
										className: "text-sm text-muted-foreground",
										children: "%"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 126,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 124,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV(Input, {
									id: "attendanceGoal",
									type: "number",
									min: 1,
									step: 1,
									value: form.attendanceGoal,
									onChange: (event) => handleChange("attendanceGoal", event.target.value),
									placeholder: "85"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 128,
									columnNumber: 13
								}, this),
								errors.attendanceGoal ? /* @__PURE__ */ jsxDEV("p", {
									className: "text-sm text-destructive",
									children: errors.attendanceGoal
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 138,
									columnNumber: 15
								}, this) : null
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 123,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "grid gap-2",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsxDEV(Label, {
										htmlFor: "pipelineValueGoal",
										children: "Meta de valor potencial"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 144,
										columnNumber: 15
									}, this), /* @__PURE__ */ jsxDEV("span", {
										className: "text-sm text-muted-foreground",
										children: "USD"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 145,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 143,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV(Input, {
									id: "pipelineValueGoal",
									type: "number",
									min: 1,
									step: 100,
									value: form.pipelineValueGoal,
									onChange: (event) => handleChange("pipelineValueGoal", event.target.value),
									placeholder: "25000"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 147,
									columnNumber: 13
								}, this),
								errors.pipelineValueGoal ? /* @__PURE__ */ jsxDEV("p", {
									className: "text-sm text-destructive",
									children: errors.pipelineValueGoal
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 157,
									columnNumber: 15
								}, this) : null
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 142,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 84,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end",
					children: [/* @__PURE__ */ jsxDEV(Button, {
						variant: "secondary",
						onClick: () => onOpenChange(false),
						type: "button",
						children: "Cancelar"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 163,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(Button, {
						onClick: handleSave,
						type: "button",
						children: "Guardar metas"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 166,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 162,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 76,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 75,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/GoalCard.tsx
var _jsxFileName$2 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/GoalCard.tsx";
var statusClasses = {
	"on-track": "bg-emerald-500 text-emerald-50",
	warning: "bg-amber-500 text-amber-50",
	"at-risk": "bg-rose-500 text-rose-50"
};
function GoalCard({ label, progress, detail, unit }) {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [
			/* @__PURE__ */ jsxDEV("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
					className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
					children: label
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 21,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV("p", {
					className: "mt-3 text-3xl font-semibold text-deep",
					children: [
						progress.current.toLocaleString(),
						unit ?? "",
						" / ",
						progress.target.toLocaleString(),
						unit ?? ""
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 22,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 20,
					columnNumber: 9
				}, this), /* @__PURE__ */ jsxDEV("span", {
					className: `rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[progress.status]}`,
					children: progress.status === "on-track" ? "🟢 on-track" : progress.status === "warning" ? "🟡 warning" : "🔴 at-risk"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 28,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 19,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-4 flex items-center justify-between gap-4 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ jsxDEV("span", { children: [progress.progressPercent.toFixed(0), "%"] }, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 39,
					columnNumber: 9
				}, this), /* @__PURE__ */ jsxDEV("span", { children: [progress.remaining.toLocaleString(), " restantes"] }, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 40,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 38,
				columnNumber: 7
			}, this),
			detail ? /* @__PURE__ */ jsxDEV("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: detail
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 42,
				columnNumber: 17
			}, this) : null
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 18,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/admin/GoalsOverview.tsx
var _jsxFileName$1 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/GoalsOverview.tsx";
function GoalsOverview({ leads, conversion, attendance, pipelineValue }) {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "grid gap-4 xl:grid-cols-4",
		children: [
			/* @__PURE__ */ jsxDEV(GoalCard, {
				label: "Leads",
				progress: leads
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 14,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(GoalCard, {
				label: "Conversión",
				progress: conversion
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 15,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(GoalCard, {
				label: "Asistencia",
				progress: attendance
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 16,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(GoalCard, {
				label: "Valor potencial",
				progress: pipelineValue
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 17,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 13,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/lib/dashboard-export.ts
function escapeCsvCell(value) {
	return `"${(value == null ? "" : String(value)).replace(/"/g, "\"\"")}"`;
}
function formatDate(value) {
	return value.toISOString().slice(0, 10);
}
function exportDashboardMetricsToCsv(metrics) {
	const rows = [];
	const row = (cells) => rows.push(cells.map(escapeCsvCell).join(","));
	row(["Dashboard DentalOperix"]);
	row(["Fecha", formatDate(/* @__PURE__ */ new Date())]);
	row([]);
	row(["KPIs"]);
	row(["Métrica", "Valor"]);
	row(["Leads nuevos", metrics.totals.leads]);
	row(["Citas agendadas", metrics.totals.agendadas]);
	row(["Citas completadas", metrics.totals.completadas]);
	row(["Canceladas", metrics.totals.canceladas]);
	row(["No asistió", metrics.totals.noAsistio]);
	row(["Tasa de conversión (%)", metrics.conversionRate]);
	row(["Tasa de asistencia (%)", metrics.attendanceRate]);
	row(["Pipeline estimado (USD)", metrics.pipelineValue]);
	row([]);
	row(["Fuente de conversión"]);
	row([
		"Fuente",
		"Leads",
		"Convertidos",
		"Conversión %"
	]);
	metrics.sourceConversions.forEach((item) => {
		row([
			item.source,
			item.leads,
			item.completed,
			item.conversionRate
		]);
	});
	row([]);
	row(["Servicio de conversión"]);
	row([
		"Servicio",
		"Leads",
		"Convertidos",
		"Conversión %",
		"Valor potencial estimado"
	]);
	metrics.serviceConversions.forEach((item) => {
		row([
			item.service,
			item.leads,
			item.completed,
			item.conversionRate,
			item.estimatedPipelineValue
		]);
	});
	row([]);
	row(["Tendencia de servicios"]);
	row([
		"Período",
		"Servicio",
		"Leads"
	]);
	metrics.serviceTrend.forEach((item) => {
		row([
			item.period ?? "Actual",
			item.service,
			item.leads
		]);
	});
	const csv = "﻿" + rows.join("\r\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `dentaloperix-dashboard-${formatDate(/* @__PURE__ */ new Date())}.csv`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
//#endregion
//#region src/lib/business-insights.ts
function generateBusinessInsights(metrics) {
	const insights = [];
	const bestService = getBestConvertingService(metrics.serviceConversions);
	const bestSource = getBestConvertingSource(metrics.sourceConversions);
	const fastestGrowing = getFastestGrowingService(metrics.serviceTrend);
	const conversionDeclined = metrics.comparison.conversionRate.changePercent < -10;
	if (metrics.comparison.canceladas.current > metrics.comparison.canceladas.previous) insights.push({
		type: "warning",
		title: "Cancelaciones en aumento",
		message: "⚠️ Las cancelaciones aumentaron respecto al período anterior."
	});
	if (conversionDeclined) insights.push({
		type: "warning",
		title: "Conversión en descenso",
		message: "⚠️ La conversión disminuyó respecto al periodo anterior. Optimiza el embudo para recuperar rendimiento."
	});
	if (bestService && bestSource) {
		insights.push({
			type: "success",
			title: "Servicio con mejor conversión",
			message: `⭐ ${bestService.service} es el servicio con mejor conversión.`
		});
		insights.push({
			type: "success",
			title: "Fuente con mejor conversión",
			message: `⭐ ${bestSource.source} es la fuente con mejor conversión.`
		});
	} else insights.push({
		type: "info",
		title: "Muestra insuficiente",
		message: "Aún no existe suficiente información para determinar tendencias confiables."
	});
	if (fastestGrowing) insights.push({
		type: "info",
		title: "Servicio con mayor crecimiento",
		message: `📈 ${fastestGrowing.service} muestra la mayor tendencia de crecimiento.`
	});
	return insights;
}
//#endregion
//#region src/lib/commercial-insights.ts
var MIN_SAMPLE_SIZE$1 = 5;
function generateCommercialInsights(metrics) {
	const insights = [];
	getBestConvertingSource(metrics.sourceConversions);
	const bestService = getBestConvertingService(metrics.serviceConversions);
	const strongSources = metrics.sourceConversions.filter((item) => item.leads >= MIN_SAMPLE_SIZE$1 && item.conversionRate >= 60).sort((a, b) => b.conversionRate - a.conversionRate).slice(0, 2);
	const weakSources = metrics.sourceConversions.filter((item) => item.leads >= MIN_SAMPLE_SIZE$1 && item.conversionRate <= 30).sort((a, b) => a.conversionRate - b.conversionRate).slice(0, 2);
	if (strongSources.length > 0) strongSources.forEach((source) => {
		insights.push({
			type: "success",
			title: `Fuente fuerte: ${source.source}`,
			message: `La fuente ${source.source} tiene una conversión de ${source.conversionRate}% con ${source.leads} leads.`
		});
	});
	if (weakSources.length > 0) weakSources.forEach((source) => {
		insights.push({
			type: "warning",
			title: `Fuente débil: ${source.source}`,
			message: `La fuente ${source.source} tiene una conversión baja de ${source.conversionRate}% y puede requerir ajustes.`
		});
	});
	if (bestService && bestService.leads >= MIN_SAMPLE_SIZE$1) insights.push({
		type: "success",
		title: `Servicio con potencial: ${bestService.service}`,
		message: `El servicio ${bestService.service} ofrece una combinación sólida de leads y conversión.`
	});
	const weakService = metrics.serviceConversions.filter((item) => item.leads >= MIN_SAMPLE_SIZE$1 && item.conversionRate <= 30).sort((a, b) => a.conversionRate - b.conversionRate)[0];
	if (weakService) insights.push({
		type: "warning",
		title: `Servicio en retroceso: ${weakService.service}`,
		message: `El servicio ${weakService.service} muestra baja conversión (${weakService.conversionRate}%) con suficiente tráfico.`
	});
	if (!insights.length) insights.push({
		type: "info",
		title: "Insuficiente información comercial",
		message: "No hay una muestra comercial robusta para generar insights comerciales adicionales."
	});
	return insights;
}
//#endregion
//#region src/lib/forecast-engine.ts
var MIN_SAMPLE_SIZE = 5;
function calculateForecast(metrics) {
	const monthlyTrend = metrics.trend.monthly.filter((point) => typeof point.leads === "number");
	const sampleSize = monthlyTrend.length;
	if (sampleSize < MIN_SAMPLE_SIZE) return {
		expectedLeads: 0,
		expectedAppointments: 0,
		expectedConversions: 0,
		expectedRevenue: 0,
		reliable: false,
		sampleSize
	};
	const recentMonths = monthlyTrend.slice(-Math.min(3, sampleSize));
	const averageLeads = Math.round(recentMonths.reduce((sum, point) => sum + point.leads, 0) / recentMonths.length);
	const expectedAppointments = Math.round(averageLeads * metrics.conversionRate / 100);
	const expectedConversions = Math.round(expectedAppointments * metrics.attendanceRate / 100);
	const averageCompletedValue = metrics.totals.completadas > 0 ? metrics.pipelineValue / metrics.totals.completadas : metrics.totals.agendadas > 0 ? metrics.pipelineValue / metrics.totals.agendadas : metrics.pipelineValue;
	return {
		expectedLeads: averageLeads,
		expectedAppointments,
		expectedConversions,
		expectedRevenue: Math.round(averageCompletedValue * expectedConversions),
		reliable: true,
		sampleSize
	};
}
//#endregion
//#region src/lib/business-health.ts
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
function mapScoreToStatus(score) {
	if (score >= 90) return "excellent";
	if (score >= 75) return "good";
	if (score >= 50) return "warning";
	return "critical";
}
function calculateTrendScore(metrics) {
	const trend = metrics.trend.monthly;
	if (trend.length < 2) return 50;
	const last = trend[trend.length - 1];
	const previous = trend[trend.length - 2];
	return clamp(50 + (previous.leads === 0 ? last.leads > 0 ? 100 : 0 : (last.leads - previous.leads) / previous.leads * 100) / 2, 0, 100);
}
function calculateVolumeScore(leads) {
	return clamp(Math.min(100, Math.sqrt(leads) * 20), 0, 100);
}
function calculateCancelationsScore(metrics) {
	const totalLeads = Math.max(metrics.totals.leads, 1);
	return clamp(100 - metrics.totals.canceladas / totalLeads * 200, 0, 100);
}
function calculateBusinessHealthScore(metrics) {
	const conversionScore = clamp(metrics.conversionRate, 0, 100);
	const attendanceScore = clamp(metrics.attendanceRate, 0, 100);
	const cancelationsScore = calculateCancelationsScore(metrics);
	const growthScore = calculateTrendScore(metrics);
	const volumeScore = calculateVolumeScore(metrics.totals.leads);
	const weightedScore = conversionScore * .3 + attendanceScore * .25 + cancelationsScore * .2 + growthScore * .15 + volumeScore * .1;
	const score = Math.round(clamp(weightedScore, 0, 100));
	return {
		score,
		status: mapScoreToStatus(score)
	};
}
function calculateBusinessSignals(metrics) {
	const signals = [];
	const conversionStatus = metrics.conversionRate >= 75 ? "green" : metrics.conversionRate >= 50 ? "yellow" : "red";
	signals.push({
		category: "conversion",
		status: conversionStatus
	});
	const attendanceStatus = metrics.attendanceRate >= 80 ? "green" : metrics.attendanceRate >= 60 ? "yellow" : "red";
	signals.push({
		category: "attendance",
		status: attendanceStatus
	});
	const cancelationsChanged = metrics.comparison.canceladas.current > metrics.comparison.canceladas.previous ? metrics.comparison.canceladas.changePercent > 10 ? "red" : "yellow" : "green";
	signals.push({
		category: "cancelations",
		status: cancelationsChanged
	});
	const growth = calculateTrendScore(metrics);
	const growthStatus = growth >= 60 ? "green" : growth >= 45 ? "yellow" : "red";
	signals.push({
		category: "growth",
		status: growthStatus
	});
	return signals;
}
function formatPercent(value) {
	if (value === 0) return "0%";
	return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}
function generateExecutiveSummary(metrics) {
	const lines = [];
	if (metrics.totals.leads === 0) return ["No se registraron leads durante este período."];
	lines.push(`Durante este período se registraron ${metrics.totals.leads} leads.`);
	const conversionChange = metrics.comparison.conversionRate.changePercent;
	if (conversionChange > 0) lines.push(`La conversión aumentó ${formatPercent(conversionChange)}.`);
	else if (conversionChange < 0) lines.push(`La conversión disminuyó ${formatPercent(conversionChange)}.`);
	else lines.push("La conversión se mantuvo estable.");
	const bestSource = getBestConvertingSource(metrics.sourceConversions);
	if (bestSource) lines.push(`${bestSource.source} fue la fuente con mejor desempeño.`);
	else lines.push("No hay una fuente líder con muestra suficiente.");
	const highestValueService = getHighestValueService(metrics.serviceConversions);
	if (highestValueService) lines.push(`${highestValueService.service} representó la mayor oportunidad económica.`);
	else lines.push("No hay un servicio con suficiente valor para destacar.");
	const cancelationsChange = metrics.comparison.canceladas.current - metrics.comparison.canceladas.previous;
	if (cancelationsChange > 0) lines.push("Las cancelaciones aumentaron respecto al periodo anterior.");
	else if (cancelationsChange < 0) lines.push("Las cancelaciones disminuyeron respecto al periodo anterior.");
	else lines.push("Las cancelaciones se mantuvieron estables.");
	return lines;
}
//#endregion
//#region src/lib/recommendation-engine.ts
var PRIORITY_ORDER = {
	high: 0,
	medium: 1,
	low: 2
};
function generateBusinessRecommendations(metrics) {
	const recommendations = [];
	const bestService = getBestConvertingService(metrics.serviceConversions);
	const bestSource = getBestConvertingSource(metrics.sourceConversions);
	const highestValueService = getHighestValueService(metrics.serviceConversions);
	const fastestGrowingService = getFastestGrowingService(metrics.serviceTrend);
	if (metrics.comparison.canceladas.current > metrics.comparison.canceladas.previous || metrics.comparison.canceladas.changePercent > 10) recommendations.push({
		id: "cancelations-increase",
		priority: "high",
		category: "attendance",
		title: "Las cancelaciones aumentaron",
		description: "Las cancelaciones aumentaron respecto al período anterior.",
		action: "Revisar recordatorios y confirmaciones de cita."
	});
	if (bestSource) recommendations.push({
		id: "best-converting-source",
		priority: "medium",
		category: "marketing",
		title: `${bestSource.source} es la fuente con mejor conversión`,
		description: `${bestSource.source} es actualmente la fuente con mejor conversión.`,
		action: `Incrementar inversión y visibilidad en ${bestSource.source}.`
	});
	if (bestService) recommendations.push({
		id: "best-converting-service",
		priority: "medium",
		category: "services",
		title: `${bestService.service} presenta la mejor conversión`,
		description: `${bestService.service} presenta la mejor conversión.`,
		action: "Destacar este servicio en campañas y contenido comercial."
	});
	if (highestValueService) recommendations.push({
		id: "highest-value-service",
		priority: "medium",
		category: "services",
		title: `${highestValueService.service} representa la mayor oportunidad económica`,
		description: `${highestValueService.service} representa la mayor oportunidad económica.`,
		action: "Priorizar seguimiento de estos leads."
	});
	if (metrics.urgency.alta > 0 && metrics.conversionRate < 80) recommendations.push({
		id: "hot-leads-recovery",
		priority: "high",
		category: "commercial",
		title: "Recuperar leads calientes sin seguimiento",
		description: `Hay ${metrics.urgency.alta} leads de alta urgencia con potencial de conversión.`,
		action: "Priorizar seguimiento manual para estos leads calientes."
	});
	if (metrics.comparison.conversionRate.changePercent < 0) recommendations.push({
		id: "conversion-decline",
		priority: "high",
		category: "commercial",
		title: "Atacar caída de conversión",
		description: "La conversión muestra una tendencia negativa respecto al periodo anterior.",
		action: "Revisar campañas y procesos de calificación para recuperar la efectividad."
	});
	if (fastestGrowingService) recommendations.push({
		id: "fastest-growing-service",
		priority: "low",
		category: "marketing",
		title: `${fastestGrowingService.service} muestra crecimiento sostenido`,
		description: `${fastestGrowingService.service} muestra crecimiento sostenido.`,
		action: `Evaluar aumentar visibilidad y promoción de ${fastestGrowingService.service}.`
	});
	return recommendations.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}
//#endregion
//#region src/lib/commercial-pipeline.ts
function calculatePipelineValue(metrics) {
	return metrics.pipelineValue;
}
function calculateExpectedRevenue(metrics) {
	const rate = Math.max(0, Math.min(100, metrics.conversionRate)) / 100;
	return Math.round(metrics.pipelineValue * rate);
}
function calculateConversionForecast(metrics) {
	const changePercent = metrics.comparison.conversionRate.changePercent;
	const forecast = metrics.conversionRate + changePercent * .25;
	return Number(Math.min(100, Math.max(0, forecast)).toFixed(1));
}
//#endregion
//#region src/lib/goal-engine.ts
function getStatusFromProgress(progressPercent) {
	if (progressPercent >= 90) return "on-track";
	if (progressPercent >= 70) return "warning";
	return "at-risk";
}
function calculateGoalProgress(current, target) {
	const progressPercent = Math.min(100, Math.max(0, current / Math.max(target, 1) * 100));
	return {
		current,
		target,
		progressPercent,
		remaining: Math.max(0, target - current),
		status: getStatusFromProgress(progressPercent)
	};
}
function calculateMonthlyProjection(currentLeads, currentAppointments, currentPipelineValue, daysElapsed, daysInMonth) {
	const growthFactor = daysInMonth / Math.max(daysElapsed, 1);
	return {
		projectedLeads: Math.round(currentLeads * growthFactor),
		projectedAppointments: Math.round(currentAppointments * growthFactor),
		projectedPipelineValue: Math.round(currentPipelineValue * growthFactor)
	};
}
function calculateGoalRisk(projection, goals, currentConversion, currentAttendance) {
	return {
		leads: projection.projectedLeads < goals.monthlyLeadsGoal,
		conversion: currentConversion < goals.conversionGoal,
		attendance: currentAttendance < goals.attendanceGoal,
		pipelineValue: projection.projectedPipelineValue < goals.pipelineValueGoal
	};
}
function generateGoalInsights(progress, projection, goals) {
	const insights = [];
	if (progress.leads.status === "on-track") insights.push("✅ La meta mensual de leads se alcanzará si se mantiene la tendencia actual.");
	else if (progress.leads.status === "warning") insights.push("⚠️ La meta mensual de leads está en advertencia; conviene mantener la intensidad comercial.");
	else insights.push("🔴 La meta mensual de leads está en riesgo si no se ajusta la captación.");
	if (progress.conversion.status === "on-track") insights.push("✅ La conversión actual está alineada con la meta establecida.");
	else if (progress.conversion.status === "warning") insights.push("⚠️ La conversión proyectada está por debajo de la meta establecida.");
	else insights.push("🔴 La conversión está en riesgo y requiere atención inmediata.");
	if (progress.attendance.status === "on-track") insights.push("✅ La asistencia se mantiene dentro de los márgenes esperados.");
	else if (progress.attendance.status === "warning") insights.push("⚠️ La asistencia está en advertencia; mejora el recordatorio de citas.");
	else insights.push("🔴 La asistencia está en riesgo y puede afectar el cierre de tratamientos.");
	if (progress.pipelineValue.status === "on-track") insights.push("✅ El valor potencial proyectado está camino a la meta mensual.");
	else if (progress.pipelineValue.status === "warning") insights.push("⚠️ El valor potencial proyectado no alcanzará el objetivo mensual.");
	else insights.push("🔴 El valor potencial proyectado está en riesgo de no cumplir el objetivo mensual.");
	if (projection.projectedLeads < goals.monthlyLeadsGoal) insights.push(`⚠️ Proyección de leads para fin de mes: ${projection.projectedLeads}. Objetivo: ${goals.monthlyLeadsGoal}.`);
	if (projection.projectedPipelineValue < goals.pipelineValueGoal) insights.push(`⚠️ Proyección de valor potencial para fin de mes: ${currencyFormatter$1.format(projection.projectedPipelineValue)}. Objetivo: ${currencyFormatter$1.format(goals.pipelineValueGoal)}.`);
	return insights;
}
//#endregion
//#region src/routes/admin/dashboard.tsx
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/admin/dashboard.tsx";
var PERIODS = [
	{
		value: "today",
		label: "Hoy"
	},
	{
		value: "last7days",
		label: "Últimos 7 días"
	},
	{
		value: "last30days",
		label: "Últimos 30 días"
	},
	{
		value: "thisMonth",
		label: "Este mes"
	},
	{
		value: "previousMonth",
		label: "Mes anterior"
	},
	{
		value: "all",
		label: "Todo"
	}
];
var Route$1 = createFileRoute("/admin/dashboard")({
	head: () => ({ meta: [{ title: "Admin Dashboard — DentalOperix" }, {
		name: "description",
		content: "Dashboard administrativo inicial para métricas CRM y conversión."
	}] }),
	component: DashboardPage
});
function DashboardPage() {
	const [metrics, setMetrics] = useState(null);
	const [period, setPeriod] = useState("all");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [goalSettings, setGoalSettings] = useState(getDefaultGoals());
	const [settingsOpen, setSettingsOpen] = useState(false);
	const loadMetrics = (selectedPeriod) => {
		setLoading(true);
		fetchCRMmetrics(selectedPeriod).then((data) => {
			setMetrics(data);
			setError(null);
		}).catch((fetchError) => {
			console.error(fetchError);
			setError(fetchError instanceof Error ? fetchError.message : "Error al cargar métricas CRM.");
		}).finally(() => setLoading(false));
	};
	const selectedTrend = metrics ? period === "all" ? metrics.trend.monthly : period === "thisMonth" || period === "previousMonth" ? metrics.trend.weekly : metrics.trend.daily : [];
	useEffect(() => {
		loadMetrics(period);
	}, [period]);
	useEffect(() => {
		let isMounted = true;
		const loadSettings = async () => {
			const settings = await loadGoalSettings();
			if (isMounted) setGoalSettings(settings);
		};
		loadSettings();
		return () => {
			isMounted = false;
		};
	}, []);
	const formatCurrency = (value) => currencyFormatter$1.format(value);
	const today = /* @__PURE__ */ new Date();
	const daysElapsed = today.getDate();
	const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
	const bestService = metrics ? getBestConvertingService(metrics.serviceConversions) : null;
	const bestSource = metrics ? getBestConvertingSource(metrics.sourceConversions) : null;
	metrics && getHighestValueService(metrics.serviceConversions);
	const fastestGrowingService = metrics ? getFastestGrowingService(metrics.serviceTrend) : null;
	const businessInsights = metrics ? generateBusinessInsights(metrics) : [];
	const commercialInsights = metrics ? generateCommercialInsights(metrics) : [];
	const businessRecommendations = metrics ? generateBusinessRecommendations(metrics) : [];
	const businessHealth = metrics ? calculateBusinessHealthScore(metrics) : null;
	const businessSignals = metrics ? calculateBusinessSignals(metrics) : [];
	const executiveSummary = metrics ? generateExecutiveSummary(metrics) : [];
	const forecast = metrics ? calculateForecast(metrics) : null;
	const commercialPipelineValue = metrics ? calculatePipelineValue(metrics) : 0;
	const projectedRevenue = metrics ? calculateExpectedRevenue(metrics) : 0;
	const conversionForecast = metrics ? calculateConversionForecast(metrics) : 0;
	const goals = goalSettings;
	const handleSaveGoals = async (nextSettings) => {
		setGoalSettings(nextSettings);
		await saveGoalSettings(nextSettings);
	};
	const goalProjection = metrics ? calculateMonthlyProjection(metrics.totals.leads, metrics.totals.agendadas, metrics.pipelineValue, daysElapsed, daysInMonth) : null;
	const goalProgress = metrics ? {
		leads: calculateGoalProgress(metrics.totals.leads, goals.monthlyLeadsGoal),
		conversion: calculateGoalProgress(metrics.conversionRate, goals.conversionGoal),
		attendance: calculateGoalProgress(metrics.attendanceRate, goals.attendanceGoal),
		pipelineValue: calculateGoalProgress(metrics.pipelineValue, goals.pipelineValueGoal)
	} : null;
	const goalRisk = metrics && goalProjection ? calculateGoalRisk(goalProjection, goals, metrics.conversionRate, metrics.attendanceRate) : null;
	const goalInsights = metrics && goalProgress && goalProjection ? generateGoalInsights(goalProgress, goalProjection, goals) : [];
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
					lineNumber: 195,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ jsxDEV("h1", {
					className: "mt-3 text-4xl font-bold tracking-tight text-deep",
					children: "Dashboard de métricas"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 196,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ jsxDEV("p", {
					className: "mt-3 max-w-2xl text-muted-foreground",
					children: "Visión en tiempo real del CRM desde Google Sheets."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 199,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ jsxDEV("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: ["Periodo actual: ", getPeriodLabel(period)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 202,
					columnNumber: 15
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 194,
				columnNumber: 13
			}, this), /* @__PURE__ */ jsxDEV("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					PERIODS.map((item) => /* @__PURE__ */ jsxDEV("button", {
						type: "button",
						onClick: () => setPeriod(item.value),
						className: `rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${period === item.value ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-border bg-white text-muted-foreground hover:border-primary hover:text-deep"}`,
						children: item.label
					}, item.value, false, {
						fileName: _jsxFileName,
						lineNumber: 208,
						columnNumber: 17
					}, this)),
					/* @__PURE__ */ jsxDEV("button", {
						type: "button",
						onClick: () => metrics && exportDashboardMetricsToCsv(metrics),
						className: "rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
						children: "Exportar CSV"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 221,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ jsxDEV("button", {
						type: "button",
						onClick: () => setSettingsOpen(true),
						className: "rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
						children: "Configurar Metas"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 228,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ jsxDEV("a", {
						href: "/admin/automation",
						"aria-label": "Ir a Automatizaciones",
						className: "rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
						children: "Automatizaciones"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 235,
						columnNumber: 15
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 206,
				columnNumber: 13
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 193,
			columnNumber: 11
		}, this), loading ? /* @__PURE__ */ jsxDEV("div", {
			className: "rounded-3xl border border-border bg-white p-10 text-center text-lg font-medium text-muted-foreground shadow-soft",
			children: "Cargando métricas del CRM..."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 246,
			columnNumber: 13
		}, this) : error ? /* @__PURE__ */ jsxDEV("div", {
			className: "rounded-3xl border border-destructive bg-destructive/10 p-10 text-center text-lg font-medium text-destructive shadow-soft",
			children: error
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 250,
			columnNumber: 13
		}, this) : metrics ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
			metrics.emptyCRM ? /* @__PURE__ */ jsxDEV("div", {
				className: "rounded-3xl border border-border bg-slate-50 p-6 text-center text-sm font-medium text-muted-foreground shadow-soft",
				children: [/* @__PURE__ */ jsxDEV("p", { children: "Aún no existen registros en el CRM." }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 257,
					columnNumber: 19
				}, this), /* @__PURE__ */ jsxDEV("p", {
					className: "mt-2 text-base text-deep",
					children: "Las métricas aparecerán cuando se registren pacientes."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 258,
					columnNumber: 19
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 256,
				columnNumber: 17
			}, this) : null,
			businessInsights.length > 0 ? /* @__PURE__ */ jsxDEV("div", {
				className: "mb-6",
				children: /* @__PURE__ */ jsxDEV(InsightsPanel, { insights: businessInsights }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 266,
					columnNumber: 19
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 265,
				columnNumber: 17
			}, this) : null,
			commercialInsights.length > 0 ? /* @__PURE__ */ jsxDEV("div", {
				className: "mb-6",
				children: /* @__PURE__ */ jsxDEV(InsightsPanel, { insights: commercialInsights }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 272,
					columnNumber: 19
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 271,
				columnNumber: 17
			}, this) : null,
			/* @__PURE__ */ jsxDEV("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ jsxDEV("div", {
					className: "mb-5 flex items-center justify-between",
					children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
						className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
						children: "Objetivos del Mes"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 279,
						columnNumber: 21
					}, this), /* @__PURE__ */ jsxDEV("h2", {
						className: "text-2xl font-semibold text-deep",
						children: "Gestión por objetivos"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 282,
						columnNumber: 21
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 278,
						columnNumber: 19
					}, this), /* @__PURE__ */ jsxDEV("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Proyección final para ",
							daysInMonth,
							" días."
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 284,
						columnNumber: 19
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 277,
					columnNumber: 17
				}, this), goalProgress ? /* @__PURE__ */ jsxDEV(GoalsOverview, {
					leads: goalProgress.leads,
					conversion: goalProgress.conversion,
					attendance: goalProgress.attendance,
					pipelineValue: goalProgress.pipelineValue
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 289,
					columnNumber: 19
				}, this) : null]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 276,
				columnNumber: 15
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mb-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ jsxDEV("div", {
					className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
					children: [/* @__PURE__ */ jsxDEV("p", {
						className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
						children: "Proyección Fin de Mes"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 300,
						columnNumber: 19
					}, this), /* @__PURE__ */ jsxDEV("div", {
						className: "mt-5 space-y-4 text-sm text-muted-foreground",
						children: goalProjection ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
							/* @__PURE__ */ jsxDEV("p", { children: [
								"Leads proyectados:",
								" ",
								/* @__PURE__ */ jsxDEV("span", {
									className: "font-semibold text-deep",
									children: goalProjection.projectedLeads.toLocaleString()
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 308,
									columnNumber: 27
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 306,
								columnNumber: 25
							}, this),
							/* @__PURE__ */ jsxDEV("p", { children: [
								"Citas proyectadas:",
								" ",
								/* @__PURE__ */ jsxDEV("span", {
									className: "font-semibold text-deep",
									children: goalProjection.projectedAppointments.toLocaleString()
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 314,
									columnNumber: 27
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 312,
								columnNumber: 25
							}, this),
							/* @__PURE__ */ jsxDEV("p", { children: [
								"Valor potencial proyectado:",
								" ",
								/* @__PURE__ */ jsxDEV("span", {
									className: "font-semibold text-deep",
									children: formatCurrency(goalProjection.projectedPipelineValue)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 320,
									columnNumber: 27
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 318,
								columnNumber: 25
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 305,
							columnNumber: 23
						}, this) : /* @__PURE__ */ jsxDEV("p", { children: "No hay datos suficientes para proyectar el fin de mes." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 326,
							columnNumber: 23
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 303,
						columnNumber: 19
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 299,
					columnNumber: 17
				}, this), /* @__PURE__ */ jsxDEV(GoalInsights, { insights: goalInsights }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 330,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 298,
				columnNumber: 15
			}, this),
			goalRisk ? /* @__PURE__ */ jsxDEV("div", {
				className: "mb-6",
				children: /* @__PURE__ */ jsxDEV(GoalRiskPanel, { risk: goalRisk }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 335,
					columnNumber: 19
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 334,
				columnNumber: 17
			}, this) : null,
			/* @__PURE__ */ jsxDEV(GoalSettingsPanel, {
				open: settingsOpen,
				settings: goalSettings,
				onOpenChange: setSettingsOpen,
				onSave: handleSaveGoals
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 339,
				columnNumber: 15
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mb-6 grid gap-6 xl:grid-cols-3",
				children: [
					businessHealth ? /* @__PURE__ */ jsxDEV(BusinessHealthCard, { health: businessHealth }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 347,
						columnNumber: 35
					}, this) : null,
					/* @__PURE__ */ jsxDEV(BusinessSignals, { signals: businessSignals }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 348,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV(ExecutiveSummary, { summary: executiveSummary }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 349,
						columnNumber: 17
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 346,
				columnNumber: 15
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mb-6",
				children: /* @__PURE__ */ jsxDEV(RecommendationsPanel, { recommendations: businessRecommendations }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 353,
					columnNumber: 17
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 352,
				columnNumber: 15
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
				children: [/* @__PURE__ */ jsxDEV("div", {
					className: "mb-5 flex items-center justify-between",
					children: /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
						className: "text-sm uppercase tracking-[0.18em] text-muted-foreground",
						children: "Resumen rápido"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 359,
						columnNumber: 21
					}, this), /* @__PURE__ */ jsxDEV("h2", {
						className: "text-2xl font-semibold text-deep",
						children: "Métricas clave"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 362,
						columnNumber: 21
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 358,
						columnNumber: 19
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 357,
					columnNumber: 17
				}, this), /* @__PURE__ */ jsxDEV("div", {
					className: "grid gap-4 md:grid-cols-4",
					children: [
						/* @__PURE__ */ jsxDEV(KpiCard, {
							label: "Leads nuevos",
							value: metrics.totals.leads.toString()
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 366,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ jsxDEV(KpiCard, {
							label: "Conversión total",
							value: `${metrics.conversionRate}%`,
							footer: /* @__PURE__ */ jsxDEV(ComparisonBadge, {
								label: "vs período anterior",
								changePercent: metrics.comparison.conversionRate?.changePercent ?? 0
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 371,
								columnNumber: 23
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 367,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ jsxDEV(KpiCard, {
							label: "Puntaje medio de lead",
							value: `${metrics.averageLeadScore}%`
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 377,
							columnNumber: 19
						}, this),
						/* @__PURE__ */ jsxDEV(PipelineValueCard, { totalValue: metrics.pipelineValue }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 378,
							columnNumber: 19
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 365,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 356,
				columnNumber: 15
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-6 grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ jsxDEV(KpiCard, {
						label: "Servicio con mayor conversión",
						value: bestService ? `${bestService.service} (${bestService.conversionRate}%)` : "Sin datos disponibles"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 383,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV(KpiCard, {
						label: "Fuente con mayor conversión",
						value: bestSource ? `${bestSource.source} (${bestSource.conversionRate}%)` : "Sin datos disponibles"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 391,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV(KpiCard, {
						label: "Pipeline comercial",
						value: formatCurrency(commercialPipelineValue),
						footer: /* @__PURE__ */ jsxDEV("span", {
							className: "text-sm text-muted-foreground",
							children: "Valor actual de oportunidades"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 403,
							columnNumber: 21
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 399,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV(KpiCard, {
						label: "Forecast de conversión",
						value: `${conversionForecast}%`,
						footer: /* @__PURE__ */ jsxDEV("span", {
							className: "text-sm text-muted-foreground",
							children: "Proyección ajustada de conversión"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 412,
							columnNumber: 21
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 408,
						columnNumber: 17
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 382,
				columnNumber: 15
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-6 grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ jsxDEV(KpiCard, {
						label: "Ingresos proyectados",
						value: formatCurrency(projectedRevenue),
						footer: /* @__PURE__ */ jsxDEV("span", {
							className: "text-sm text-muted-foreground",
							children: "Pipeline x conversión actual"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 423,
							columnNumber: 21
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 419,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV(KpiCard, {
						label: "Leads esperados",
						value: forecast?.expectedLeads.toString() ?? "0"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 428,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV(KpiCard, {
						label: "Conversiones esperadas",
						value: forecast?.expectedConversions.toString() ?? "0"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 432,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV(KpiCard, {
						label: "Ingresos esperados",
						value: formatCurrency(forecast?.expectedRevenue ?? 0)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 436,
						columnNumber: 17
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 418,
				columnNumber: 15
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-6 grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ jsxDEV(KpiCard, {
						label: "Servicio con mayor crecimiento",
						value: fastestGrowingService ? `${fastestGrowingService.service}` : "Sin datos disponibles",
						footer: fastestGrowingService ? /* @__PURE__ */ jsxDEV("span", {
							className: "text-sm text-muted-foreground",
							children: [
								fastestGrowingService.growthPercent >= 0 ? "+" : "",
								fastestGrowingService.growthPercent.toFixed(1),
								"%"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 451,
							columnNumber: 23
						}, this) : null
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 442,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV(KpiCard, {
						label: "Puntaje de lead caliente",
						value: `${metrics.leadScoreDistribution.hot}%`,
						footer: /* @__PURE__ */ jsxDEV("span", {
							className: "text-sm text-muted-foreground",
							children: "Leads hot en CRM"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 461,
							columnNumber: 27
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 458,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV(KpiCard, {
						label: "Puntaje de lead templado",
						value: `${metrics.leadScoreDistribution.warm}%`,
						footer: /* @__PURE__ */ jsxDEV("span", {
							className: "text-sm text-muted-foreground",
							children: "Leads warm en CRM"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 466,
							columnNumber: 27
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 463,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV(KpiCard, {
						label: "Puntaje de lead frío",
						value: `${metrics.leadScoreDistribution.cold}%`,
						footer: /* @__PURE__ */ jsxDEV("span", {
							className: "text-sm text-muted-foreground",
							children: "Leads cold en CRM"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 471,
							columnNumber: 27
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 468,
						columnNumber: 17
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 441,
				columnNumber: 15
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-10 grid gap-6 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ jsxDEV(ServiceConversionTable, { items: metrics.serviceConversions }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 476,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV(SourceConversionTable, { items: metrics.sourceConversions }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 477,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV(ServiceTrendChart, { data: metrics.serviceTrend }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 478,
						columnNumber: 17
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 475,
				columnNumber: 15
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-10 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxDEV(TrendChart, {
					data: selectedTrend,
					title: "Tendencia de leads"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 482,
					columnNumber: 17
				}, this), /* @__PURE__ */ jsxDEV("div", {
					className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
					children: [/* @__PURE__ */ jsxDEV("h2", {
						className: "text-xl font-semibold text-deep",
						children: "Comparativo vs periodo anterior"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 484,
						columnNumber: 19
					}, this), /* @__PURE__ */ jsxDEV("div", {
						className: "mt-6 space-y-4",
						children: [
							/* @__PURE__ */ jsxDEV(KpiCard, {
								label: "Leads nuevos",
								value: metrics.totals.leads.toString(),
								footer: /* @__PURE__ */ jsxDEV(ComparisonBadge, {
									label: "vs período anterior",
									changePercent: metrics.comparison.leads.changePercent
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 492,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 488,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ jsxDEV(KpiCard, {
								label: "Citas agendadas",
								value: metrics.totals.agendadas.toString(),
								footer: /* @__PURE__ */ jsxDEV(ComparisonBadge, {
									label: "vs período anterior",
									changePercent: metrics.comparison.agendadas.changePercent
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 502,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 498,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ jsxDEV(KpiCard, {
								label: "Citas completadas",
								value: metrics.totals.completadas.toString(),
								footer: /* @__PURE__ */ jsxDEV(ComparisonBadge, {
									label: "vs período anterior",
									changePercent: metrics.comparison.completadas.changePercent
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 512,
									columnNumber: 25
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 508,
								columnNumber: 21
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 487,
						columnNumber: 19
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 483,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 481,
				columnNumber: 15
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-10 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxDEV("div", {
					className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
					children: [/* @__PURE__ */ jsxDEV("h2", {
						className: "text-xl font-semibold text-deep",
						children: "Conversión por fuente"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 524,
						columnNumber: 19
					}, this), /* @__PURE__ */ jsxDEV("div", {
						className: "mt-6 space-y-4",
						children: metrics.sourceConversions.slice(0, 5).map((source) => /* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center justify-between rounded-2xl border border-border/80 p-4",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
								className: "font-medium text-deep",
								children: source.source
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 532,
								columnNumber: 27
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "text-sm text-muted-foreground",
								children: [source.leads, " leads"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 533,
								columnNumber: 27
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 531,
								columnNumber: 25
							}, this), /* @__PURE__ */ jsxDEV("span", {
								className: "rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-deep",
								children: [source.conversionRate, "%"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 535,
								columnNumber: 25
							}, this)]
						}, source.source, true, {
							fileName: _jsxFileName,
							lineNumber: 527,
							columnNumber: 23
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 525,
						columnNumber: 19
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 523,
					columnNumber: 17
				}, this), /* @__PURE__ */ jsxDEV("div", {
					className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
					children: [/* @__PURE__ */ jsxDEV("h2", {
						className: "text-xl font-semibold text-deep",
						children: "Top servicios por pipeline"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 544,
						columnNumber: 19
					}, this), /* @__PURE__ */ jsxDEV("div", {
						className: "mt-6 space-y-4",
						children: metrics.serviceConversions.slice(0, 5).map((service) => /* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border/80 p-4",
							children: [/* @__PURE__ */ jsxDEV("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
									className: "font-medium text-deep",
									children: service.service
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 553,
									columnNumber: 29
								}, this), /* @__PURE__ */ jsxDEV("p", {
									className: "text-sm text-muted-foreground",
									children: [
										service.leads,
										" leads • ",
										service.conversionRate,
										"% conversión"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 554,
									columnNumber: 29
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 552,
									columnNumber: 27
								}, this), /* @__PURE__ */ jsxDEV("span", {
									className: "rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-deep",
									children: formatCurrency(service.estimatedPipelineValue)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 558,
									columnNumber: 27
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 551,
								columnNumber: 25
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "mt-3 h-2 overflow-hidden rounded-full bg-slate-100",
								children: /* @__PURE__ */ jsxDEV("div", {
									className: "h-full rounded-full bg-emerald-500",
									style: { width: `${Math.min(service.conversionRate, 100)}%` }
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 563,
									columnNumber: 27
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 562,
								columnNumber: 25
							}, this)]
						}, service.service, true, {
							fileName: _jsxFileName,
							lineNumber: 547,
							columnNumber: 23
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 545,
						columnNumber: 19
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 543,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 522,
				columnNumber: 15
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-6 rounded-3xl border border-border bg-white p-6 shadow-soft",
				children: [/* @__PURE__ */ jsxDEV("h2", {
					className: "text-xl font-semibold text-deep",
					children: "Servicios con más leads"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 575,
					columnNumber: 17
				}, this), /* @__PURE__ */ jsxDEV("div", {
					className: "mt-6 space-y-4",
					children: metrics.serviceTrend.map((item) => /* @__PURE__ */ jsxDEV("div", {
						className: "flex items-center justify-between rounded-2xl border border-border/80 p-4",
						children: /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
							className: "font-medium text-deep",
							children: item.service
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 583,
							columnNumber: 25
						}, this), /* @__PURE__ */ jsxDEV("p", {
							className: "text-sm text-muted-foreground",
							children: ["Leads: ", item.leads]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 584,
							columnNumber: 25
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 582,
							columnNumber: 23
						}, this)
					}, item.service, false, {
						fileName: _jsxFileName,
						lineNumber: 578,
						columnNumber: 21
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 576,
					columnNumber: 17
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 574,
				columnNumber: 15
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 254,
			columnNumber: 13
		}, this) : null]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 192,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 191,
		columnNumber: 7
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 190,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/routes/admin/automation.tsx
var $$splitComponentImporter = () => import("./automation-B1v6FzTF.js");
var Route = createFileRoute("/admin/automation")({
	head: () => ({ meta: [{ title: "Automatizaciones — DentalOperix" }, {
		name: "description",
		content: "Panel operativo para ejecutar y auditar automatizaciones DentalOperix."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var ServiciosRoute = Route$10.update({
	id: "/servicios",
	path: "/servicios",
	getParentRoute: () => Route$11
});
var PatientRoute = Route$9.update({
	id: "/patient",
	path: "/patient",
	getParentRoute: () => Route$11
});
var NuestraFilosofiaRoute = Route$8.update({
	id: "/nuestra-filosofia",
	path: "/nuestra-filosofia",
	getParentRoute: () => Route$11
});
var DoctorRoute = Route$7.update({
	id: "/doctor",
	path: "/doctor",
	getParentRoute: () => Route$11
});
var DashboardRoute = Route$6.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$11
});
var AssistantRoute = Route$5.update({
	id: "/assistant",
	path: "/assistant",
	getParentRoute: () => Route$11
});
var AdminRoute = Route$4.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$11
});
var IndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var ServiciosServiceIdRoute = Route$12.update({
	id: "/$serviceId",
	path: "/$serviceId",
	getParentRoute: () => ServiciosRoute
});
var PortalProfileRoute = Route$13.update({
	id: "/portal/$profile",
	path: "/portal/$profile",
	getParentRoute: () => Route$11
});
var AdminLoginRoute = Route$2.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AdminRoute
});
var AdminDashboardRoute = Route$1.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AdminRoute
});
var AdminRouteChildren = {
	AdminAutomationRoute: Route.update({
		id: "/automation",
		path: "/automation",
		getParentRoute: () => AdminRoute
	}),
	AdminDashboardRoute,
	AdminLoginRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var ServiciosRouteChildren = { ServiciosServiceIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRouteWithChildren,
	AssistantRoute,
	DashboardRoute,
	DoctorRoute,
	NuestraFilosofiaRoute,
	PatientRoute,
	ServiciosRoute: ServiciosRoute._addFileChildren(ServiciosRouteChildren),
	PortalProfileRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
