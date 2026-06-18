import { t as Button } from "./button-BLeLDVKM.js";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { jsxDEV } from "react/jsx-dev-runtime";
import { BarChart3, Bot, ClipboardList, Flag, Home, Settings, ShieldCheck, Target } from "lucide-react";
//#region src/components/admin/AdminLayout.tsx
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/AdminLayout.tsx";
var adminLinks = [
	{
		to: "/admin",
		label: "Inicio",
		icon: Home
	},
	{
		to: "/admin/dashboard",
		label: "Métricas",
		icon: BarChart3
	},
	{
		to: "/admin",
		label: "Leads",
		icon: ClipboardList,
		sectionId: "leads"
	},
	{
		to: "/admin/dashboard",
		label: "Objetivos",
		icon: Target,
		sectionId: "objetivos"
	},
	{
		to: "/admin/automation",
		label: "Automatizaciones",
		icon: Bot
	},
	{
		to: "/admin",
		label: "Configuración",
		icon: Settings,
		sectionId: "configuracion"
	}
];
function getPageTitle(pathname) {
	if (pathname === "/admin/dashboard") return "Métricas";
	if (pathname === "/admin/automation") return "Automatizaciones";
	if (pathname === "/dashboard") return "Mi Portal legacy";
	return "Inicio";
}
function AdminLayout({ children }) {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const pageTitle = getPageTitle(pathname);
	const logout = async () => {
		await fetch("/api/admin/logout", {
			method: "POST",
			credentials: "same-origin"
		});
		navigate({
			to: "/",
			replace: true
		});
	};
	return /* @__PURE__ */ jsxDEV("div", {
		className: "min-h-screen bg-secondary/25",
		children: [/* @__PURE__ */ jsxDEV("aside", {
			className: "fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border/70 bg-white/90 px-5 py-6 shadow-soft backdrop-blur-xl lg:block",
			children: [/* @__PURE__ */ jsxDEV(Link, {
				to: "/admin",
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsxDEV("span", {
					className: "grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ jsxDEV(ShieldCheck, { className: "h-5 w-5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 43,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 42,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV("span", { children: [/* @__PURE__ */ jsxDEV("span", {
					className: "block font-display text-lg font-bold tracking-tight text-deep",
					children: "DentalOperix"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 46,
					columnNumber: 13
				}, this), /* @__PURE__ */ jsxDEV("span", {
					className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
					children: "Administración"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 49,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 45,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 41,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV("nav", {
				className: "mt-8 space-y-2",
				"aria-label": "Navegación administrativa",
				children: adminLinks.map((link) => {
					const Icon = link.icon;
					const active = pathname === link.to && !("sectionId" in link);
					const href = "sectionId" in link ? `${link.to}#${link.sectionId}` : link.to;
					return /* @__PURE__ */ jsxDEV("a", {
						href,
						className: `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary hover:text-deep"}`,
						children: [/* @__PURE__ */ jsxDEV(Icon, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 70,
							columnNumber: 17
						}, this), link.label]
					}, `${link.label}-${href}`, true, {
						fileName: _jsxFileName,
						lineNumber: 61,
						columnNumber: 15
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 55,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 40,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("div", {
			className: "lg:pl-72",
			children: [/* @__PURE__ */ jsxDEV("header", {
				className: "sticky top-0 z-20 border-b border-border/70 bg-white/85 backdrop-blur-xl",
				children: /* @__PURE__ */ jsxDEV("div", {
					className: "flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6",
					children: [
						/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
							children: [
								/* @__PURE__ */ jsxDEV(Flag, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 83,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("span", { children: "Admin" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 84,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("span", { children: "/" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 85,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("span", { children: pageTitle }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 86,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 82,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("h1", {
							className: "mt-1 text-xl font-bold tracking-tight text-deep",
							children: pageTitle
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 81,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("nav", {
							className: "hidden items-center gap-2 xl:flex",
							"aria-label": "Accesos rápidos admin",
							children: adminLinks.slice(0, 3).map((link) => /* @__PURE__ */ jsxDEV(Link, {
								to: link.to,
								className: `rounded-full px-4 py-2 text-sm font-medium transition-colors ${pathname === link.to ? "bg-secondary text-deep" : "text-muted-foreground hover:text-deep"}`,
								children: link.label
							}, link.label, false, {
								fileName: _jsxFileName,
								lineNumber: 93,
								columnNumber: 17
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 91,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(Button, {
							type: "button",
							variant: "outline",
							onClick: logout,
							children: "Cerrar sesión"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 107,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 80,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 79,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV("main", { children }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 112,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 78,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 39,
		columnNumber: 5
	}, this);
}
//#endregion
export { AdminLayout as t };
