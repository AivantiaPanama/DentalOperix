import { Link } from "@tanstack/react-router";
import { jsxDEV } from "react/jsx-dev-runtime";
import { CalendarDays, FileText, HeartHandshake, Home, LogIn, ShieldCheck, UserRound } from "lucide-react";
//#region src/components/admin/RoleWorkspaceLayout.tsx
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/RoleWorkspaceLayout.tsx";
var roleLabels = {
	admin: "Administración",
	doctor: "Doctor",
	assistant: "Asistente",
	patient: "Paciente"
};
var roleDescriptions = {
	admin: "Vista administrativa protegida para operación, métricas y configuración.",
	doctor: "Espacio clínico preparado para agenda, pacientes, tratamientos y notas clínicas.",
	assistant: "Espacio operativo preparado para agenda, confirmaciones, check-in y check-out.",
	patient: "Portal preparado para próximas citas, indicaciones, documentos y solicitudes propias."
};
var roleNavigation = {
	admin: [
		{
			label: "Resumen",
			icon: Home
		},
		{
			label: "Métricas",
			icon: FileText
		},
		{
			label: "Configuración",
			icon: ShieldCheck
		}
	],
	doctor: [
		{
			label: "Agenda",
			icon: CalendarDays
		},
		{
			label: "Pacientes",
			icon: UserRound
		},
		{
			label: "Notas clínicas",
			icon: FileText
		}
	],
	assistant: [
		{
			label: "Agenda diaria",
			icon: CalendarDays
		},
		{
			label: "Confirmaciones",
			icon: HeartHandshake
		},
		{
			label: "Check-in / Check-out",
			icon: LogIn
		},
		{
			label: "Pacientes",
			icon: UserRound
		}
	],
	patient: [
		{
			label: "Mis citas",
			icon: CalendarDays
		},
		{
			label: "Indicaciones",
			icon: FileText
		},
		{
			label: "Solicitudes",
			icon: HeartHandshake
		}
	]
};
function RoleWorkspaceLayout({ role, title, children }) {
	const label = title ?? roleLabels[role];
	const navigation = roleNavigation[role];
	return /* @__PURE__ */ jsxDEV("main", {
		className: "min-h-screen bg-secondary/30 px-6 py-10",
		children: /* @__PURE__ */ jsxDEV("section", {
			className: "mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)]",
			children: [/* @__PURE__ */ jsxDEV("aside", {
				className: "rounded-3xl border border-border bg-white p-5 shadow-soft",
				children: [/* @__PURE__ */ jsxDEV("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsxDEV("span", {
						className: "grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ jsxDEV(ShieldCheck, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 62,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 61,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
						className: "font-semibold text-deep",
						children: "DentalOperix"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 65,
						columnNumber: 15
					}, this), /* @__PURE__ */ jsxDEV("p", {
						className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
						children: label
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 66,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 64,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 60,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV("nav", {
					className: "mt-6 space-y-2",
					"aria-label": `Navegación ${label}`,
					children: navigation.map((item) => {
						const Icon = item.icon;
						return /* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3 text-sm font-medium text-muted-foreground",
							children: [/* @__PURE__ */ jsxDEV(Icon, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 77,
								columnNumber: 19
							}, this), item.label]
						}, item.label, true, {
							fileName: _jsxFileName,
							lineNumber: 73,
							columnNumber: 17
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 69,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 59,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV("section", {
				className: "rounded-3xl border border-border bg-white p-8 shadow-soft",
				children: [
					/* @__PURE__ */ jsxDEV("p", {
						className: "text-sm uppercase tracking-[0.2em] text-muted-foreground",
						children: "Dashboard protegido"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 86,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV("h1", {
						className: "mt-3 text-4xl font-bold tracking-tight text-deep",
						children: label
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 87,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV("p", {
						className: "mt-4 max-w-2xl text-muted-foreground",
						children: roleDescriptions[role]
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 88,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV("div", {
						className: "mt-8",
						children
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 89,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ jsxDEV(Link, {
							to: "/",
							className: "rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-deep",
							children: "Volver al sitio público"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 91,
							columnNumber: 13
						}, this), role === "admin" ? /* @__PURE__ */ jsxDEV(Link, {
							to: "/admin/dashboard",
							className: "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90",
							children: "Ir a métricas"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 98,
							columnNumber: 15
						}, this) : null]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 90,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 85,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 58,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 57,
		columnNumber: 5
	}, this);
}
//#endregion
export { RoleWorkspaceLayout as t };
