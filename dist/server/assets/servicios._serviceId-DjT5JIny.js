import { t as Route } from "./servicios._serviceId-HxbGw1ZC.js";
import { t as Button } from "./button-BLeLDVKM.js";
import { n as getSiteServiceBySlug, r as siteServices, t as SiteLayout } from "./SiteLayout-BE2vGC_Q.js";
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import { ArrowLeft, ArrowRight, CheckCircle2, Info, Tag } from "lucide-react";
//#region src/routes/servicios.$serviceId.tsx?tsr-split=component
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/servicios.$serviceId.tsx?tsr-split=component";
function ServiceDetailPage() {
	const { serviceId } = Route.useParams();
	const service = getSiteServiceBySlug(serviceId);
	if (!service) return /* @__PURE__ */ jsxDEV(SiteLayout, { children: /* @__PURE__ */ jsxDEV("section", {
		className: "mx-auto max-w-3xl px-6 py-24 text-center",
		children: [
			/* @__PURE__ */ jsxDEV("h1", {
				className: "text-4xl font-bold text-deep",
				children: "Servicio no encontrado"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 14,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ jsxDEV("p", {
				className: "mt-4 text-muted-foreground",
				children: "La página solicitada no corresponde a uno de los servicios principales de DentalOperix."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 15,
				columnNumber: 11
			}, this),
			/* @__PURE__ */ jsxDEV(Button, {
				asChild: true,
				className: "mt-8 rounded-full",
				children: /* @__PURE__ */ jsxDEV("a", {
					href: "/servicios",
					children: "Ver servicios"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 19,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 18,
				columnNumber: 11
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 13,
		columnNumber: 9
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 12,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ jsxDEV(SiteLayout, { children: (openBooking, openServiceInfo) => /* @__PURE__ */ jsxDEV(Fragment, { children: [
		/* @__PURE__ */ jsxDEV("section", {
			className: "relative min-h-[72vh] overflow-hidden",
			children: [
				/* @__PURE__ */ jsxDEV("img", {
					src: service.image,
					alt: service.alt,
					className: "absolute inset-0 h-full w-full object-cover"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 27,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 28,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "relative z-10 mx-auto flex min-h-[72vh] max-w-7xl items-center px-6 py-24",
					children: /* @__PURE__ */ jsxDEV("div", {
						className: "max-w-3xl text-white",
						children: [
							/* @__PURE__ */ jsxDEV("a", {
								href: "/servicios",
								className: "inline-flex items-center gap-2 text-sm text-white/80 hover:text-white",
								children: [/* @__PURE__ */ jsxDEV(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 32,
									columnNumber: 19
								}, this), " Servicios"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 31,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ jsxDEV("h1", {
								className: "mt-6 text-5xl font-bold leading-tight md:text-7xl",
								children: service.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 34,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ jsxDEV("p", {
								className: "mt-6 max-w-2xl text-xl leading-relaxed text-white/90 md:text-2xl",
								children: service.shortDescription
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 35,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ jsxDEV(Button, {
								onClick: () => openBooking(service.id),
								size: "lg",
								className: "mt-8 rounded-full px-8",
								children: ["Agendar consulta ", /* @__PURE__ */ jsxDEV(ArrowRight, { className: "ml-2 h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 39,
									columnNumber: 36
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 38,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 30,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 29,
					columnNumber: 13
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 26,
			columnNumber: 11
		}, this),
		/* @__PURE__ */ jsxDEV("section", {
			className: "mx-auto max-w-7xl px-6 py-16",
			children: [/* @__PURE__ */ jsxDEV("div", {
				className: "grid gap-10 lg:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ jsxDEV("div", { children: [
					/* @__PURE__ */ jsxDEV("span", {
						className: "chip",
						children: "Enfoque del servicio"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 48,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV("h2", {
						className: "mt-4 text-3xl font-bold text-deep md:text-4xl",
						children: "Una consulta para entender tu caso con claridad"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 49,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV("p", {
						className: "mt-5 text-lg leading-8 text-muted-foreground",
						children: service.overview
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 52,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ jsxDEV("div", {
						className: "mt-8 rounded-3xl border border-primary/15 bg-primary/5 p-6",
						children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ jsxDEV("span", {
								className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-primary shadow-sm",
								children: /* @__PURE__ */ jsxDEV(Tag, { className: "h-5 w-5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 56,
									columnNumber: 23
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 55,
								columnNumber: 21
							}, this), /* @__PURE__ */ jsxDEV("div", { children: [
								/* @__PURE__ */ jsxDEV("h3", {
									className: "text-sm font-semibold uppercase tracking-[0.18em] text-primary",
									children: "Precio sugerido"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 59,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-2xl font-bold text-deep",
									children: service.suggestedPrice
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 62,
									columnNumber: 23
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-2 text-sm leading-6 text-muted-foreground",
									children: service.priceNote
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 63,
									columnNumber: 23
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 58,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 54,
							columnNumber: 19
						}, this), /* @__PURE__ */ jsxDEV("div", {
							className: "mt-4 flex gap-3 rounded-2xl bg-white/70 p-4 text-sm leading-6 text-muted-foreground",
							children: [/* @__PURE__ */ jsxDEV(Info, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 69,
								columnNumber: 21
							}, this), /* @__PURE__ */ jsxDEV("p", { children: "Valor referencial. El precio final se confirma después de la evaluación clínica y el plan indicado por el especialista." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 70,
								columnNumber: 21
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 68,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 53,
						columnNumber: 17
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 15
				}, this), /* @__PURE__ */ jsxDEV("div", {
					className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
					children: [/* @__PURE__ */ jsxDEV("h3", {
						className: "text-xl font-bold text-deep",
						children: "¿Qué puede incluir?"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 79,
						columnNumber: 17
					}, this), /* @__PURE__ */ jsxDEV("ul", {
						className: "mt-5 space-y-4 text-sm text-muted-foreground",
						children: service.includes.map((item) => /* @__PURE__ */ jsxDEV("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ jsxDEV(CheckCircle2, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 82,
								columnNumber: 23
							}, this), /* @__PURE__ */ jsxDEV("span", { children: item }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 83,
								columnNumber: 23
							}, this)]
						}, item, true, {
							fileName: _jsxFileName,
							lineNumber: 81,
							columnNumber: 49
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 80,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 78,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 46,
				columnNumber: 13
			}, this), /* @__PURE__ */ jsxDEV("div", {
				className: "mt-12 grid gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ jsxDEV(InfoCard, {
					title: "Proceso de atención",
					items: service.process
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 90,
					columnNumber: 15
				}, this), /* @__PURE__ */ jsxDEV(InfoCard, {
					title: "Beneficios esperados",
					items: service.benefits
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 91,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 89,
				columnNumber: 13
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 45,
			columnNumber: 11
		}, this),
		/* @__PURE__ */ jsxDEV("section", {
			className: "mx-auto max-w-7xl px-6 pb-16",
			children: /* @__PURE__ */ jsxDEV("div", {
				className: "rounded-3xl bg-deep p-8 text-white md:p-10",
				children: /* @__PURE__ */ jsxDEV("div", {
					className: "grid gap-6 md:grid-cols-[1fr_auto] md:items-center",
					children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h2", {
						className: "text-3xl font-bold",
						children: "Conversemos antes de decidir"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 99,
						columnNumber: 19
					}, this), /* @__PURE__ */ jsxDEV("p", {
						className: "mt-3 max-w-2xl text-white/80",
						children: "Agenda una consulta para recibir orientación personalizada y comprender qué opción se adapta mejor a tu caso."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 100,
						columnNumber: 19
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 98,
						columnNumber: 17
					}, this), /* @__PURE__ */ jsxDEV(Button, {
						onClick: () => openBooking(service.id),
						size: "lg",
						className: "rounded-full bg-white px-8 text-deep hover:bg-white/90",
						children: "Agendar consulta"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 104,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 97,
					columnNumber: 15
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 96,
				columnNumber: 13
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 95,
			columnNumber: 11
		}, this),
		/* @__PURE__ */ jsxDEV("section", {
			className: "mx-auto max-w-7xl px-6 pb-20",
			children: [/* @__PURE__ */ jsxDEV("h2", {
				className: "text-2xl font-bold text-deep",
				children: "Otros servicios"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 112,
				columnNumber: 13
			}, this), /* @__PURE__ */ jsxDEV("div", {
				className: "mt-5 flex flex-wrap gap-3",
				children: siteServices.filter((item) => item.id !== service.id).map((item) => /* @__PURE__ */ jsxDEV("a", {
					href: `/servicios/${item.slug}`,
					className: "rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-deep",
					onClick: (event) => {
						event.preventDefault();
						openServiceInfo(item.id);
					},
					children: item.title
				}, item.id, false, {
					fileName: _jsxFileName,
					lineNumber: 114,
					columnNumber: 80
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 113,
				columnNumber: 13
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 111,
			columnNumber: 11
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 25,
		columnNumber: 100
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 24,
		columnNumber: 10
	}, this);
}
function InfoCard({ title, items }) {
	return /* @__PURE__ */ jsxDEV("article", {
		className: "rounded-3xl border border-border bg-white p-6 shadow-soft",
		children: [/* @__PURE__ */ jsxDEV("h3", {
			className: "text-xl font-bold text-deep",
			children: title
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 133,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("ul", {
			className: "mt-5 space-y-4 text-sm text-muted-foreground",
			children: items.map((item) => /* @__PURE__ */ jsxDEV("li", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ jsxDEV("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 136,
					columnNumber: 13
				}, this), /* @__PURE__ */ jsxDEV("span", { children: item }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 137,
					columnNumber: 13
				}, this)]
			}, item, true, {
				fileName: _jsxFileName,
				lineNumber: 135,
				columnNumber: 28
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 134,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 132,
		columnNumber: 10
	}, this);
}
//#endregion
export { ServiceDetailPage as component };
