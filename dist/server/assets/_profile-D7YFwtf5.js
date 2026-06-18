import { s as getUserPortalByPublicSlug } from "./dialog-DrreS9S0.js";
import { t as Route } from "./_profile-DgADW_Nn.js";
import { t as Button } from "./button-BLeLDVKM.js";
import { t as SiteLayout } from "./SiteLayout-BE2vGC_Q.js";
import { Link } from "@tanstack/react-router";
import { jsxDEV } from "react/jsx-dev-runtime";
import { LockKeyhole, ShieldCheck } from "lucide-react";
//#region src/routes/portal/$profile.tsx?tsr-split=component
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/portal/$profile.tsx?tsr-split=component";
function PortalProfilePage() {
	const { profile } = Route.useParams();
	const portal = getUserPortalByPublicSlug(profile);
	if (!portal) return /* @__PURE__ */ jsxDEV(SiteLayout, { children: /* @__PURE__ */ jsxDEV("section", {
		className: "mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center",
		children: [
			/* @__PURE__ */ jsxDEV("p", {
				className: "text-sm font-semibold uppercase tracking-[0.24em] text-primary",
				children: "Portal"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 15,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ jsxDEV("h1", {
				className: "mt-4 font-display text-4xl font-bold text-deep md:text-5xl",
				children: "Perfil no disponible"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 16,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ jsxDEV("p", {
				className: "mt-4 text-base text-muted-foreground",
				children: "Este acceso no corresponde a un perfil publicado de DentalOperix."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 19,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ jsxDEV(Button, {
				asChild: true,
				className: "mt-8 rounded-full bg-primary text-primary-foreground",
				children: /* @__PURE__ */ jsxDEV(Link, {
					to: "/",
					children: "Volver al inicio"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 23,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 22,
				columnNumber: 11
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 14,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 13,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ jsxDEV(SiteLayout, { children: /* @__PURE__ */ jsxDEV("section", {
		className: "mx-auto max-w-5xl px-6 py-20 md:py-28",
		children: /* @__PURE__ */ jsxDEV("div", {
			className: "rounded-[2rem] border border-border bg-background p-8 shadow-soft md:p-12",
			children: [
				/* @__PURE__ */ jsxDEV("div", {
					className: "flex flex-col gap-6 md:flex-row md:items-start md:justify-between",
					children: [/* @__PURE__ */ jsxDEV("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ jsxDEV("span", {
								className: "inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-deep",
								children: [/* @__PURE__ */ jsxDEV(LockKeyhole, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 34,
									columnNumber: 17
								}, this), " Acceso por perfil"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 33,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ jsxDEV("h1", {
								className: "mt-6 font-display text-4xl font-bold tracking-tight text-deep md:text-5xl",
								children: portal.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 36,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ jsxDEV("p", {
								className: "mt-3 text-sm font-semibold text-primary",
								children: portal.audience
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 39,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ jsxDEV("p", {
								className: "mt-5 text-base leading-7 text-muted-foreground md:text-lg",
								children: portal.description
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 40,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 32,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV("div", {
						className: "rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm font-medium text-deep",
						children: "En preparación"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 45,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 31,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "mt-10 grid gap-4 md:grid-cols-2",
					children: portal.visibleNotes.map((note) => /* @__PURE__ */ jsxDEV("div", {
						className: "rounded-2xl border border-border bg-secondary/40 p-5",
						children: [/* @__PURE__ */ jsxDEV(ShieldCheck, { className: "h-5 w-5 text-primary" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 52,
							columnNumber: 17
						}, this), /* @__PURE__ */ jsxDEV("p", {
							className: "mt-3 text-sm leading-6 text-muted-foreground",
							children: note
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 53,
							columnNumber: 17
						}, this)]
					}, note, true, {
						fileName: _jsxFileName,
						lineNumber: 51,
						columnNumber: 46
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 50,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "mt-10 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ jsxDEV(Button, {
						asChild: true,
						className: "rounded-full bg-primary text-primary-foreground",
						children: /* @__PURE__ */ jsxDEV(Link, {
							to: "/",
							children: "Volver al inicio"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 59,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 58,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV(Button, {
						asChild: true,
						variant: "outline",
						className: "rounded-full",
						children: /* @__PURE__ */ jsxDEV(Link, {
							to: "/servicios",
							children: "Ver servicios"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 62,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 61,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 57,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 30,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 29,
		columnNumber: 7
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 28,
		columnNumber: 10
	}, this);
}
//#endregion
export { PortalProfilePage as component };
