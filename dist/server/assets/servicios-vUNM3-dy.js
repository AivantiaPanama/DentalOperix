import { t as Button } from "./button-BLeLDVKM.js";
import { r as siteServices, t as SiteLayout } from "./SiteLayout-BE2vGC_Q.js";
import { t as BookingCTA } from "./BookingCTA-B2gnWF8D.js";
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import { ArrowRight } from "lucide-react";
//#region src/routes/servicios.tsx?tsr-split=component
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/servicios.tsx?tsr-split=component";
function ServicesPage() {
	return /* @__PURE__ */ jsxDEV(SiteLayout, { children: (openBooking, openServiceInfo) => /* @__PURE__ */ jsxDEV(Fragment, { children: [
		/* @__PURE__ */ jsxDEV("section", {
			className: "gradient-hero",
			children: /* @__PURE__ */ jsxDEV("div", {
				className: "mx-auto max-w-7xl px-6 py-20 text-center",
				children: [
					/* @__PURE__ */ jsxDEV("span", {
						className: "chip",
						children: "Servicios dentales"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 11,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ jsxDEV("h1", {
						className: "mt-4 text-4xl font-bold tracking-tight text-deep sm:text-5xl",
						children: "Cinco caminos de cuidado, una misma forma de acompañarte"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 12,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ jsxDEV("p", {
						className: "mx-auto mt-4 max-w-2xl text-muted-foreground",
						children: "Cada servicio parte de una conversación clara: entender tu caso, explicar opciones y ayudarte a tomar decisiones informadas."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 15,
						columnNumber: 15
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 10,
				columnNumber: 13
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 9,
			columnNumber: 11
		}, this),
		/* @__PURE__ */ jsxDEV("section", {
			className: "mx-auto max-w-7xl px-6 py-16",
			children: /* @__PURE__ */ jsxDEV("div", {
				className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
				children: siteServices.map((service) => /* @__PURE__ */ jsxDEV("article", {
					className: "group overflow-hidden rounded-3xl border border-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow",
					children: [/* @__PURE__ */ jsxDEV("a", {
						href: `/servicios/${service.slug}`,
						className: "block",
						onClick: (event) => {
							event.preventDefault();
							openServiceInfo(service.id);
						},
						children: /* @__PURE__ */ jsxDEV("img", {
							src: service.image,
							alt: service.alt,
							className: "h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 29,
							columnNumber: 21
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 25,
						columnNumber: 19
					}, this), /* @__PURE__ */ jsxDEV("div", {
						className: "p-6",
						children: [
							/* @__PURE__ */ jsxDEV("h2", {
								className: "text-2xl font-bold text-deep",
								children: service.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 32,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ jsxDEV("p", {
								className: "mt-3 text-sm leading-6 text-muted-foreground",
								children: service.shortDescription
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 33,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ jsxDEV("div", {
								className: "mt-6 flex flex-col gap-3 sm:flex-row",
								children: [/* @__PURE__ */ jsxDEV(Button, {
									asChild: true,
									className: "rounded-full bg-deep text-white hover:bg-primary",
									children: /* @__PURE__ */ jsxDEV("a", {
										href: `/servicios/${service.slug}`,
										onClick: (event) => {
											event.preventDefault();
											openServiceInfo(service.id);
										},
										children: ["Ver descripción y precio ", /* @__PURE__ */ jsxDEV(ArrowRight, { className: "ml-2 h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 42,
											columnNumber: 52
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 38,
										columnNumber: 25
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 37,
									columnNumber: 23
								}, this), /* @__PURE__ */ jsxDEV(Button, {
									type: "button",
									variant: "outline",
									className: "rounded-full",
									onClick: () => openBooking(service.id),
									children: "Agendar consulta"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 45,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 36,
								columnNumber: 21
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 31,
						columnNumber: 19
					}, this)]
				}, service.id, true, {
					fileName: _jsxFileName,
					lineNumber: 24,
					columnNumber: 44
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 23,
				columnNumber: 13
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 22,
			columnNumber: 11
		}, this),
		/* @__PURE__ */ jsxDEV(BookingCTA, { onBook: () => openBooking() }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 54,
			columnNumber: 11
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 8,
		columnNumber: 100
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 7,
		columnNumber: 10
	}, this);
}
//#endregion
export { ServicesPage as component };
