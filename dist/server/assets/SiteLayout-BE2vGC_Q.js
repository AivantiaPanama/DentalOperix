import { d as findDentalService, f as getDentalServiceById, u as DENTAL_SERVICES } from "../server.js";
import { t as getServerFnById } from "./__23tanstack-start-server-fn-resolver-C8tcQZdy.js";
import { a as createServerFn, m as TSS_SERVER_FUNCTION } from "./esm-vQsjfqSA.js";
import { a as DialogHeader, c as userPortals, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DrreS9S0.js";
import { n as cn, t as Button } from "./button-BLeLDVKM.js";
import { n as Input, t as Label } from "./label-DBNUsIZD.js";
import { t as Progress } from "./progress-CBPak1Ip.js";
import { z } from "zod";
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import { ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Circle, Clock, Info, Loader2, Mail, MapPin, Menu, MessageCircle, Phone, RefreshCw, Send, Sparkles, Tag, X } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Toaster, toast } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
//#region src/components/site/Navbar.tsx
var _jsxFileName$9 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/site/Navbar.tsx";
var links = [
	{
		to: "/",
		label: "Inicio"
	},
	{
		to: "/servicios",
		label: "Servicios"
	},
	{
		to: "/nuestra-filosofia",
		label: "Nuestra Filosofía"
	}
];
function Navbar({ onBook }) {
	const [open, setOpen] = useState(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ jsxDEV("header", {
		className: "sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl",
		children: [/* @__PURE__ */ jsxDEV("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6",
			children: [
				/* @__PURE__ */ jsxDEV(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxDEV("span", {
						className: "grid h-9 w-9 place-items-center rounded-xl gradient-deep text-white shadow-soft",
						children: /* @__PURE__ */ jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 21,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 20,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV("span", {
						className: "font-display text-lg font-bold tracking-tight text-deep",
						children: "DentalOperix"
					}, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 23,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$9,
					lineNumber: 19,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("nav", {
					className: "hidden items-center gap-2 md:flex",
					children: links.map((l) => /* @__PURE__ */ jsxDEV(Link, {
						to: l.to,
						className: `rounded-full px-4 py-2 text-sm font-medium transition-colors ${pathname === l.to ? "bg-secondary text-deep" : "text-muted-foreground hover:text-deep"}`,
						children: l.label
					}, l.to, false, {
						fileName: _jsxFileName$9,
						lineNumber: 30,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$9,
					lineNumber: 28,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxDEV(Button, {
						onClick: onBook,
						className: "hidden rounded-full bg-primary text-primary-foreground shadow-glow hover:bg-primary/90 sm:inline-flex",
						children: "Solicitar Atención"
					}, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 45,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV("button", {
						onClick: () => setOpen((v) => !v),
						className: "grid h-10 w-10 place-items-center rounded-full border border-border md:hidden",
						"aria-label": "Menú",
						"aria-expanded": open,
						"aria-controls": "mobile-menu",
						children: open ? /* @__PURE__ */ jsxDEV(X, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 58,
							columnNumber: 21
						}, this) : /* @__PURE__ */ jsxDEV(Menu, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 58,
							columnNumber: 49
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 51,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$9,
					lineNumber: 44,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$9,
			lineNumber: 18,
			columnNumber: 7
		}, this), open && /* @__PURE__ */ jsxDEV("div", {
			id: "mobile-menu",
			role: "menu",
			className: "border-t border-border bg-background md:hidden",
			children: /* @__PURE__ */ jsxDEV("div", {
				className: "flex flex-col p-3",
				children: [links.map((l) => /* @__PURE__ */ jsxDEV(Link, {
					to: l.to,
					onClick: () => setOpen(false),
					className: "rounded-lg px-4 py-3 text-sm font-medium text-deep hover:bg-secondary",
					children: l.label
				}, l.to, false, {
					fileName: _jsxFileName$9,
					lineNumber: 71,
					columnNumber: 15
				}, this)), /* @__PURE__ */ jsxDEV(Button, {
					onClick: () => {
						setOpen(false);
						onBook();
					},
					className: "mt-2 rounded-full bg-primary text-primary-foreground",
					children: "Solicitar Atención"
				}, void 0, false, {
					fileName: _jsxFileName$9,
					lineNumber: 80,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$9,
				lineNumber: 69,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$9,
			lineNumber: 64,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$9,
		lineNumber: 17,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/data/siteServices.ts
var siteServices = [
	{
		id: "odontologia-preventiva",
		slug: "odontologia-preventiva",
		title: "Odontología Preventiva",
		message: "La prevención ayuda a mantener la salud oral a lo largo del tiempo.",
		shortDescription: "Revisiones, limpieza y orientación personalizada para cuidar la salud oral antes de que aparezcan molestias.",
		image: "/assets/preventiva-ZgDXtzjl.png",
		alt: "Atención preventiva en DentalOperix",
		overview: "La odontología preventiva se enfoca en revisar el estado de dientes y encías, identificar señales tempranas y acompañarte con recomendaciones claras para mantener una boca saludable.",
		includes: [
			"Evaluación general de dientes, encías y hábitos de higiene.",
			"Limpieza dental profesional cuando el caso lo requiere.",
			"Orientación sobre prevención de caries, inflamación y sensibilidad."
		],
		process: [
			"Escuchamos tus antecedentes y cualquier molestia reciente.",
			"Realizamos una revisión clínica cuidadosa.",
			"Te explicamos hallazgos y próximos pasos de manera sencilla."
		],
		benefits: [
			"Ayuda a detectar problemas antes de que avancen.",
			"Favorece hábitos de cuidado sostenibles.",
			"Reduce la necesidad de tratamientos más complejos en el futuro."
		],
		modalDescription: "Consulta preventiva orientada a revisar dientes y encías, identificar señales tempranas y definir recomendaciones de cuidado o limpieza profesional según el caso.",
		suggestedPrice: "B/.40 – B/.80",
		priceNote: "Rango referencial para evaluación y limpieza preventiva básica en Panamá."
	},
	{
		id: "ortodoncia",
		slug: "ortodoncia",
		title: "Ortodoncia",
		message: "Cada tratamiento comienza con una explicación clara y una planificación cuidadosa.",
		shortDescription: "Evaluación y planificación para mejorar la posición dental, la mordida y la armonía de la sonrisa.",
		image: "/assets/ortodoncia-KhIYihLj.png",
		alt: "Planificación de ortodoncia en DentalOperix",
		overview: "La ortodoncia ayuda a alinear dientes y mordida mediante un plan progresivo. Antes de iniciar, se revisan tus necesidades, expectativas y las opciones disponibles para tu caso.",
		includes: [
			"Valoración de alineación dental, mordida y espacio disponible.",
			"Explicación de alternativas como brackets o alineadores, según disponibilidad clínica.",
			"Plan de seguimiento para acompañar la evolución del tratamiento."
		],
		process: [
			"Analizamos tu situación actual y tus objetivos.",
			"Definimos una ruta de tratamiento comprensible.",
			"Damos seguimiento a los cambios con controles periódicos."
		],
		benefits: [
			"Mejora la función de la mordida.",
			"Puede facilitar la higiene diaria.",
			"Contribuye a una sonrisa más equilibrada."
		],
		modalDescription: "Valoración para revisar alineación dental, mordida y alternativas de tratamiento. El plan puede variar según estudios, aparatología y controles necesarios.",
		suggestedPrice: "Evaluación desde B/.40 · tratamiento desde B/.1,500",
		priceNote: "Referencia para consulta inicial y tratamientos de ortodoncia con brackets o alternativas similares."
	},
	{
		id: "diseno-de-sonrisa",
		slug: "diseno-sonrisa",
		legacySlugs: ["diseno-de-sonrisa"],
		title: "Diseño de Sonrisa",
		message: "Escuchamos tus expectativas y te ayudamos a comprender las opciones disponibles.",
		shortDescription: "Un enfoque estético y funcional para valorar forma, color, proporción y armonía de la sonrisa.",
		image: "/assets/diseno-sonrisa-BDArpC8-.png",
		alt: "Conversación sobre diseño de sonrisa en DentalOperix",
		overview: "El diseño de sonrisa parte de una conversación honesta sobre tus expectativas. Evaluamos la estética dental en conjunto con la salud oral para proponer opciones realistas y cuidadosas.",
		includes: [
			"Evaluación de forma, color, proporciones y línea de sonrisa.",
			"Revisión de salud dental antes de cualquier mejora estética.",
			"Orientación sobre alternativas como restauraciones estéticas, blanqueamiento o carillas, cuando aplique."
		],
		process: [
			"Conversamos sobre lo que deseas mejorar.",
			"Revisamos si tu salud oral permite avanzar con seguridad.",
			"Te presentamos opciones con ventajas, límites y cuidados necesarios."
		],
		benefits: [
			"Ayuda a alinear expectativas con posibilidades reales.",
			"Integra estética, función y salud oral.",
			"Permite tomar decisiones informadas antes de iniciar."
		],
		modalDescription: "Evaluación estética y funcional para valorar forma, color, proporción y armonía de la sonrisa antes de proponer alternativas como blanqueamiento, restauraciones o carillas.",
		suggestedPrice: "B/.1,000 – B/.5,000",
		priceNote: "Rango referencial para planes de diseño de sonrisa en Panamá, según procedimientos incluidos."
	},
	{
		id: "implantes-dentales",
		slug: "implantes-dentales",
		title: "Implantes Dentales",
		message: "Recuperar función y comodidad comienza con una conversación informada.",
		shortDescription: "Evaluación para reemplazar piezas dentales ausentes con una alternativa fija y planificada.",
		image: "/assets/implantes-8OmA5uSF.png",
		alt: "Orientación sobre implantes dentales en DentalOperix",
		overview: "Los implantes dentales pueden ayudar a recuperar función, estabilidad y comodidad cuando falta una o más piezas. El proceso requiere diagnóstico, planificación y seguimiento cuidadoso.",
		includes: [
			"Valoración de encías, hueso disponible y piezas vecinas.",
			"Explicación de etapas, tiempos aproximados y cuidados posteriores.",
			"Planificación de la restauración final según la necesidad del paciente."
		],
		process: [
			"Evaluamos si eres candidato para implantes.",
			"Definimos una planificación clínica clara.",
			"Acompañamos la recuperación y la rehabilitación final."
		],
		benefits: [
			"Puede recuperar estabilidad al masticar.",
			"Ayuda a conservar dientes vecinos sanos.",
			"Ofrece una solución fija cuando el caso lo permite."
		],
		modalDescription: "Valoración para reemplazar piezas ausentes mediante una solución fija planificada. Requiere revisar encías, hueso disponible, estudios y restauración final.",
		suggestedPrice: "B/.1,500 – B/.3,000 por implante",
		priceNote: "Referencia de mercado por implante unitario; puede variar por corona, injertos, estudios o complejidad clínica."
	},
	{
		id: "odontopediatria",
		slug: "odontopediatria",
		title: "Odontopediatría",
		message: "Las experiencias positivas construyen confianza desde la infancia.",
		shortDescription: "Atención dental infantil con paciencia, lenguaje claro y acompañamiento para la familia.",
		image: "/assets/odontopediatria-CFvgFq75.png",
		alt: "Atención odontopediátrica amable en DentalOperix",
		overview: "La odontopediatría busca que niñas y niños vivan la consulta dental con tranquilidad. El objetivo es prevenir, educar y crear confianza desde las primeras visitas.",
		includes: [
			"Primera revisión dental infantil y orientación familiar.",
			"Prevención de caries y seguimiento del crecimiento dental.",
			"Educación sobre higiene oral adaptada a cada edad."
		],
		process: [
			"Recibimos al niño con calma y explicaciones simples.",
			"Revisamos su salud oral respetando su ritmo.",
			"Guiamos a la familia con recomendaciones prácticas."
		],
		benefits: [
			"Favorece una relación positiva con el dentista.",
			"Permite detectar riesgos desde temprano.",
			"Apoya hábitos saludables en casa."
		],
		modalDescription: "Consulta infantil enfocada en revisar la salud oral con calma, orientar a la familia y prevenir caries o molestias desde una experiencia respetuosa.",
		suggestedPrice: "Evaluación desde B/.50",
		priceNote: "Referencia para valoración odontopediátrica inicial en Panamá."
	}
];
function getSiteServiceBySlug(slug) {
	if (!slug) return void 0;
	return siteServices.find((service) => service.slug === slug || service.legacySlugs?.includes(slug));
}
//#endregion
//#region src/components/site/Footer.tsx
var _jsxFileName$8 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/site/Footer.tsx";
function Footer({ onServiceInfo }) {
	return /* @__PURE__ */ jsxDEV("footer", {
		className: "mt-20 border-t border-border bg-secondary/40",
		children: [/* @__PURE__ */ jsxDEV("div", {
			className: "mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-5",
			children: [
				/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxDEV("span", {
						className: "grid h-9 w-9 place-items-center rounded-xl gradient-deep text-white",
						children: /* @__PURE__ */ jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$8,
							lineNumber: 12,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 11,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV("span", {
						className: "font-display text-lg font-bold text-deep",
						children: "DentalOperix"
					}, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 14,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 10,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Acompañamiento dental profesional, claro y respetuoso."
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 16,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 9,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h4", {
					className: "text-sm font-semibold text-deep",
					children: "Clínica"
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 21,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV("ul", {
					className: "mt-3 space-y-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("a", {
						href: "/nuestra-filosofia",
						className: "text-inherit hover:text-deep",
						children: "Nuestra Filosofía"
					}, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 24,
						columnNumber: 15
					}, this) }, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 23,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("a", {
						href: "/servicios",
						className: "text-inherit hover:text-deep",
						children: "Servicios"
					}, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 29,
						columnNumber: 15
					}, this) }, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 28,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 22,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 20,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h4", {
					className: "text-sm font-semibold text-deep",
					children: "Servicios"
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 36,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV("ul", {
					className: "mt-3 space-y-2 text-sm text-muted-foreground",
					children: siteServices.map((service) => /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("a", {
						href: `/servicios/${service.slug}`,
						className: "text-inherit hover:text-deep",
						onClick: (event) => {
							if (!onServiceInfo) return;
							event.preventDefault();
							onServiceInfo(service.id);
						},
						children: service.title
					}, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 40,
						columnNumber: 17
					}, this) }, service.id, false, {
						fileName: _jsxFileName$8,
						lineNumber: 39,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 37,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 35,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h4", {
					className: "text-sm font-semibold text-deep",
					children: "Portales"
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 57,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV("ul", {
					className: "mt-3 space-y-2 text-sm text-muted-foreground",
					children: userPortals.map((portal) => /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("a", {
						href: portal.path,
						className: "text-inherit hover:text-deep",
						children: portal.footerLabel
					}, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 61,
						columnNumber: 17
					}, this) }, portal.id, false, {
						fileName: _jsxFileName$8,
						lineNumber: 60,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 58,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 56,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("h4", {
					className: "text-sm font-semibold text-deep",
					children: "Contacto"
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 69,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV("ul", {
					className: "mt-3 space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ jsxDEV("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxDEV(MapPin, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName$8,
								lineNumber: 72,
								columnNumber: 15
							}, this), " Av. Domingo Díaz, Rufina Alfaro"]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 71,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("li", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsxDEV(Phone, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 75,
									columnNumber: 15
								}, this),
								" ",
								/* @__PURE__ */ jsxDEV("a", {
									href: "tel:+50745061624",
									className: "text-inherit hover:text-deep",
									children: "+507 4506 1624"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 76,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 74,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("li", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsxDEV(Mail, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 81,
									columnNumber: 15
								}, this),
								" ",
								/* @__PURE__ */ jsxDEV("a", {
									href: "mailto:DentalOperix@gmail.com",
									className: "text-inherit hover:text-deep",
									children: "DentalOperix@gmail.com"
								}, void 0, false, {
									fileName: _jsxFileName$8,
									lineNumber: 82,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 80,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 70,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$8,
					lineNumber: 68,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$8,
			lineNumber: 8,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("div", {
			className: "border-t border-border py-4 text-center text-xs text-muted-foreground",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" DentalOperix — Todos los derechos reservados."
			]
		}, void 0, true, {
			fileName: _jsxFileName$8,
			lineNumber: 89,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$8,
		lineNumber: 7,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/ui/select.tsx
var _jsxFileName$7 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/ui/select.tsx";
var Select = SelectPrimitive.Root;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxDEV(SelectPrimitive.Trigger, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ jsxDEV(SelectPrimitive.Icon, {
		asChild: true,
		children: /* @__PURE__ */ jsxDEV(ChevronDown, { className: "h-4 w-4 opacity-50" }, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 29,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$7,
		lineNumber: 28,
		columnNumber: 5
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName$7,
	lineNumber: 19,
	columnNumber: 3
}, void 0));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV(SelectPrimitive.ScrollUpButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsxDEV(ChevronUp, { className: "h-4 w-4" }, void 0, false, {
		fileName: _jsxFileName$7,
		lineNumber: 44,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 39,
	columnNumber: 3
}, void 0));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV(SelectPrimitive.ScrollDownButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsxDEV(ChevronDown, { className: "h-4 w-4" }, void 0, false, {
		fileName: _jsxFileName$7,
		lineNumber: 58,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 53,
	columnNumber: 3
}, void 0));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxDEV(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxDEV(SelectPrimitive.Content, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ jsxDEV(SelectScrollUpButton, {}, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 79,
			columnNumber: 7
		}, void 0),
		/* @__PURE__ */ jsxDEV(SelectPrimitive.Viewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 80,
			columnNumber: 7
		}, void 0),
		/* @__PURE__ */ jsxDEV(SelectScrollDownButton, {}, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 89,
			columnNumber: 7
		}, void 0)
	]
}, void 0, true, {
	fileName: _jsxFileName$7,
	lineNumber: 68,
	columnNumber: 5
}, void 0) }, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 67,
	columnNumber: 3
}, void 0));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV(SelectPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 99,
	columnNumber: 3
}, void 0));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxDEV(SelectPrimitive.Item, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsxDEV("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsxDEV(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsxDEV(Check, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 121,
			columnNumber: 9
		}, void 0) }, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 120,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$7,
		lineNumber: 119,
		columnNumber: 5
	}, void 0), /* @__PURE__ */ jsxDEV(SelectPrimitive.ItemText, { children }, void 0, false, {
		fileName: _jsxFileName$7,
		lineNumber: 124,
		columnNumber: 5
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName$7,
	lineNumber: 111,
	columnNumber: 3
}, void 0));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV(SelectPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 133,
	columnNumber: 3
}, void 0));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
//#endregion
//#region src/components/ui/radio-group.tsx
var _jsxFileName$6 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/ui/radio-group.tsx";
var RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsxDEV(RadioGroupPrimitive.Root, {
		className: cn("grid gap-2", className),
		...props,
		ref
	}, void 0, false, {
		fileName: _jsxFileName$6,
		lineNumber: 11,
		columnNumber: 10
	}, void 0);
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
var RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsxDEV(RadioGroupPrimitive.Item, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ jsxDEV(RadioGroupPrimitive.Indicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ jsxDEV(Circle, { className: "h-3.5 w-3.5 fill-primary" }, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 29,
				columnNumber: 9
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 28,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$6,
		lineNumber: 20,
		columnNumber: 5
	}, void 0);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
//#endregion
//#region src/lib/clinic-data.ts
var timeSlots = [
	"09:00",
	"10:00",
	"11:00",
	"12:00",
	"15:00",
	"16:00",
	"17:00",
	"18:00"
];
var today = /* @__PURE__ */ new Date();
var fmt = (d) => d.toISOString().slice(0, 10);
var plus = (n) => {
	const d = new Date(today);
	d.setDate(d.getDate() + n);
	return fmt(d);
};
var initialAppointments = [
	{
		id: "a1",
		name: "María González",
		email: "maria@example.com",
		phone: "987654321",
		service: "Diseño de Sonrisa",
		date: plus(2),
		time: "10:00",
		status: "confirmed"
	},
	{
		id: "a2",
		name: "Carlos Pérez",
		email: "carlos@example.com",
		phone: "912345678",
		service: "Ortodoncia",
		date: plus(2),
		time: "15:00",
		status: "confirmed"
	},
	{
		id: "a3",
		name: "Ana Silva",
		email: "ana@example.com",
		phone: "956781234",
		service: "Odontología Preventiva",
		date: plus(5),
		time: "11:00",
		status: "confirmed"
	},
	{
		id: "a4",
		name: "Tú",
		email: "paciente@demo.cl",
		phone: "987000111",
		service: "Limpieza Dental",
		date: plus(7),
		time: "09:00",
		status: "confirmed",
		notes: "Control semestral"
	}
];
plus(-90), plus(-180), plus(-365);
plus(-3), plus(-1), plus(-30);
//#endregion
//#region src/lib/appointments-store.ts
var KEY = "dentaloperix_appointments_v1";
function read() {
	if (typeof window === "undefined") return initialAppointments;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return initialAppointments;
		return JSON.parse(raw);
	} catch {
		return initialAppointments;
	}
}
function write(list) {
	if (typeof window === "undefined") return;
	localStorage.setItem(KEY, JSON.stringify(list));
	window.dispatchEvent(new CustomEvent("appointments:changed"));
}
function useAppointments() {
	const [list, setList] = useState(() => read());
	useEffect(() => {
		setList(read());
		const handler = () => setList(read());
		window.addEventListener("appointments:changed", handler);
		window.addEventListener("storage", handler);
		return () => {
			window.removeEventListener("appointments:changed", handler);
			window.removeEventListener("storage", handler);
		};
	}, []);
	return {
		appointments: list,
		add: (a) => write([...read(), a]),
		cancel: (id) => write(read().map((x) => x.id === id ? {
			...x,
			status: "cancelled"
		} : x)),
		remove: (id) => write(read().filter((x) => x.id !== id))
	};
}
function getBookedSlots(date) {
	return read().filter((a) => a.date === date && a.status !== "cancelled").map((a) => a.time);
}
//#endregion
//#region node_modules/@tanstack/start-server-core/dist/esm/createSsrRpc.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/lib/api/dental.functions.ts
var appointmentSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	phone: z.string().min(8).max(15),
	service: z.string().min(1),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	time: z.string().regex(/^\d{2}:\d{2}$/),
	notes: z.string().optional()
});
var createDentalAppointment = createServerFn({ method: "POST" }).validator(appointmentSchema).handler(createSsrRpc("e902254f03c951b9b3f90cb3c328e544d02b3f695eb8e1ffcd219cf02a0d3602"));
//#endregion
//#region src/lib/api/dental-hook.ts
function useCreateDentalAppointment() {
	return useMutation({ mutationFn: (data) => createDentalAppointment({ data }) });
}
//#endregion
//#region src/lib/analytics.ts
function track(event, payload) {
	try {
		console.info("[analytics]", event, payload ?? {});
		if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("dentaloperix:analytics", { detail: {
			event,
			payload: payload ?? {},
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		} }));
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region src/components/site/BookingDialog.tsx
var _jsxFileName$5 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/site/BookingDialog.tsx";
var empty = {
	name: "",
	email: "",
	phone: "",
	service: "",
	date: "",
	time: ""
};
function buildBookingDialogData(initialData) {
	const serviceMatch = initialData?.serviceId ? getDentalServiceById(initialData.serviceId) : initialData?.service ? findDentalService(initialData.service) : void 0;
	const predefinedService = serviceMatch?.label ?? initialData?.service ?? "";
	return {
		...empty,
		name: initialData?.name ?? "",
		email: initialData?.email ?? "",
		phone: initialData?.phone ?? "",
		serviceId: initialData?.serviceId ?? serviceMatch?.id,
		service: predefinedService,
		notes: initialData?.notes ?? "",
		urgency: initialData?.urgency,
		source: initialData?.source ?? "web-form",
		aiSummary: initialData?.aiSummary,
		date: initialData?.date ?? "",
		time: initialData?.time ?? ""
	};
}
function BookingDialog({ open, onOpenChange, initialData }) {
	const [step, setStep] = useState(1);
	const [data, setData] = useState(buildBookingDialogData(initialData));
	const [errors, setErrors] = useState({});
	const [done, setDone] = useState(false);
	const [successMessage, setSuccessMessage] = useState(null);
	const [serverError, setServerError] = useState(null);
	const [submitting, setSubmitting] = useState(null);
	const { add } = useAppointments();
	const mutation = useCreateDentalAppointment();
	useEffect(() => {
		if (open) {
			setStep(1);
			setErrors({});
			setSubmitting(null);
			setDone(false);
			setSuccessMessage(null);
			setData(buildBookingDialogData(initialData));
		}
	}, [open, initialData]);
	const validateStep1 = () => {
		const e = {};
		if (data.name.trim().length < 2) e.name = "Nombre mínimo 2 caracteres";
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Email inválido";
		const phone = data.phone.replace(/\D/g, "");
		if (phone.length < 8 || phone.length > 10) e.phone = "Teléfono de 8 a 10 dígitos";
		setErrors(e);
		return Object.keys(e).length === 0;
	};
	const validateStep2 = () => {
		const e = {};
		if (!data.serviceId) e.service = "Selecciona un servicio";
		setErrors(e);
		return Object.keys(e).length === 0;
	};
	const validateStep3 = () => {
		const e = {};
		if (!data.date) e.date = "Selecciona una fecha";
		if (!data.time) e.time = "Selecciona una hora";
		setErrors(e);
		return Object.keys(e).length === 0;
	};
	const next = () => {
		if (step === 1 && validateStep1()) setStep(2);
		else if (step === 2 && validateStep2()) setStep(3);
	};
	const back = () => setStep((s) => Math.max(1, s - 1));
	const submit = async () => {
		if (!validateStep3()) return;
		setServerError(null);
		setSubmitting("saving");
		const selectedServiceLabel = data.serviceId ? getDentalServiceById(data.serviceId)?.label ?? data.service : data.service;
		const notesFromExtras = data.orthoType ? `Tipo: ${data.orthoType}` : data.sensitivity ? `Sensibilidad: ${data.sensitivity}` : void 0;
		const combinedNotes = [
			data.urgency ? `Urgencia: ${data.urgency}` : void 0,
			data.notes?.trim(),
			notesFromExtras
		].filter(Boolean).join(" | ") || void 0;
		const appointmentInput = {
			name: data.name,
			email: data.email,
			phone: data.phone,
			service: selectedServiceLabel,
			date: data.date,
			time: data.time,
			notes: combinedNotes,
			urgency: data.urgency,
			source: data.source ?? "web-form",
			aiSummary: data.aiSummary
		};
		try {
			const result = await mutation.mutateAsync(appointmentInput);
			add({
				id: `a_${Date.now()}`,
				name: data.name,
				email: data.email,
				phone: data.phone,
				service: data.service,
				date: data.date,
				time: data.time,
				status: result?.calendarCreated ? "confirmed" : "pending",
				notes: appointmentInput.notes
			});
			track("booking_completed", {
				source: data.source,
				serviceId: data.serviceId,
				urgency: data.urgency
			});
			setSuccessMessage(result?.message ?? "Tu cita fue registrada.");
			setDone(true);
		} catch (error) {
			track("booking_failed", {
				source: data.source,
				serviceId: data.serviceId,
				urgency: data.urgency,
				error: error instanceof Error ? error.message : "unknown"
			});
			setServerError(error instanceof Error ? error.message : "Ocurrió un error creando tu cita. Intenta nuevamente.");
		} finally {
			setSubmitting(null);
		}
	};
	const progress = done ? 100 : step / 3 * 100;
	return /* @__PURE__ */ jsxDEV(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxDEV(DialogContent, {
			className: "max-w-2xl rounded-3xl p-0 overflow-hidden",
			children: [
				/* @__PURE__ */ jsxDEV(DialogDescription, {
					className: "sr-only",
					children: "Formulario para agendar una cita dental."
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 230,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "gradient-deep px-6 py-5 text-white",
					children: [
						/* @__PURE__ */ jsxDEV(DialogHeader, { children: /* @__PURE__ */ jsxDEV(DialogTitle, {
							className: "font-display text-xl",
							children: "Agenda tu cita"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 235,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 234,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("p", {
							className: "mt-1 text-sm text-white/70",
							children: [
								"Paso ",
								done ? 3 : step,
								" de 3 ·",
								" ",
								done ? "Confirmada" : step === 1 ? "Datos personales" : step === 2 ? "Servicio" : "Fecha y hora"
							]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 237,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "mt-3",
							children: /* @__PURE__ */ jsxDEV(Progress, {
								value: progress,
								className: "h-1.5 bg-white/15"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 248,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 247,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 233,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "max-h-[70vh] overflow-y-auto px-6 py-6",
					children: [done ? /* @__PURE__ */ jsxDEV(SuccessView, {
						successMessage,
						data,
						onClose: () => onOpenChange(false)
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 254,
						columnNumber: 13
					}, this) : submitting ? /* @__PURE__ */ jsxDEV(LoadingView, { state: submitting }, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 260,
						columnNumber: 13
					}, this) : step === 1 ? /* @__PURE__ */ jsxDEV(Step1, {
						data,
						setData,
						errors
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 262,
						columnNumber: 13
					}, this) : step === 2 ? /* @__PURE__ */ jsxDEV(Step2, {
						data,
						setData,
						errors
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 264,
						columnNumber: 13
					}, this) : /* @__PURE__ */ jsxDEV(Step3, {
						data,
						setData,
						errors
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 266,
						columnNumber: 13
					}, this), serverError && /* @__PURE__ */ jsxDEV("p", {
						className: "mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive",
						children: serverError
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 269,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 252,
					columnNumber: 9
				}, this),
				!done && !submitting && /* @__PURE__ */ jsxDEV("div", {
					className: "flex items-center justify-between border-t border-border px-6 py-4",
					children: [/* @__PURE__ */ jsxDEV(Button, {
						variant: "ghost",
						onClick: back,
						disabled: step === 1,
						className: "rounded-full",
						children: [/* @__PURE__ */ jsxDEV(ChevronLeft, { className: "mr-1 h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 278,
							columnNumber: 15
						}, this), " Atrás"]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 277,
						columnNumber: 13
					}, this), step < 3 ? /* @__PURE__ */ jsxDEV(Button, {
						onClick: next,
						className: "rounded-full bg-primary text-primary-foreground hover:bg-primary/90",
						children: ["Continuar ", /* @__PURE__ */ jsxDEV(ChevronRight, { className: "ml-1 h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 285,
							columnNumber: 27
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 281,
						columnNumber: 15
					}, this) : /* @__PURE__ */ jsxDEV(Button, {
						onClick: submit,
						className: "rounded-full bg-primary text-primary-foreground hover:bg-primary/90",
						children: ["Confirmar reserva ", /* @__PURE__ */ jsxDEV(Sparkles, { className: "ml-1 h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 292,
							columnNumber: 35
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 288,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 276,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$5,
			lineNumber: 229,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$5,
		lineNumber: 228,
		columnNumber: 5
	}, this);
}
function Step1({ data, setData, errors }) {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "space-y-4 animate-fade-up",
		children: [
			/* @__PURE__ */ jsxDEV("div", { children: [
				/* @__PURE__ */ jsxDEV(Label, {
					htmlFor: "name",
					children: "Nombre completo"
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 312,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV(Input, {
					id: "name",
					value: data.name,
					onChange: (e) => setData({
						...data,
						name: e.target.value
					}),
					placeholder: "María González",
					className: "mt-1.5 rounded-xl"
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 313,
					columnNumber: 9
				}, this),
				errors.name && /* @__PURE__ */ jsxDEV("p", {
					className: "mt-1 text-xs text-destructive",
					children: errors.name
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 320,
					columnNumber: 25
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 311,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("div", { children: [
				/* @__PURE__ */ jsxDEV(Label, {
					htmlFor: "email",
					children: "Correo electrónico"
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 323,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV(Input, {
					id: "email",
					type: "email",
					value: data.email,
					onChange: (e) => setData({
						...data,
						email: e.target.value
					}),
					placeholder: "tu@email.cl",
					className: "mt-1.5 rounded-xl"
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 324,
					columnNumber: 9
				}, this),
				errors.email && /* @__PURE__ */ jsxDEV("p", {
					className: "mt-1 text-xs text-destructive",
					children: errors.email
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 332,
					columnNumber: 26
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 322,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("div", { children: [
				/* @__PURE__ */ jsxDEV(Label, {
					htmlFor: "phone",
					children: "Teléfono"
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 335,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV(Input, {
					id: "phone",
					value: data.phone,
					onChange: (e) => setData({
						...data,
						phone: e.target.value
					}),
					placeholder: "987654321",
					className: "mt-1.5 rounded-xl"
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 336,
					columnNumber: 9
				}, this),
				errors.phone && /* @__PURE__ */ jsxDEV("p", {
					className: "mt-1 text-xs text-destructive",
					children: errors.phone
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 343,
					columnNumber: 26
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 334,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 310,
		columnNumber: 5
	}, this);
}
function Step2({ data, setData, errors }) {
	return /* @__PURE__ */ jsxDEV("div", {
		className: "space-y-5 animate-fade-up",
		children: [
			/* @__PURE__ */ jsxDEV("div", { children: [
				/* @__PURE__ */ jsxDEV(Label, { children: "Servicio" }, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 353,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV(Select, {
					value: data.serviceId ?? "",
					onValueChange: (v) => {
						const service = getDentalServiceById(v);
						setData({
							...data,
							serviceId: v,
							service: service?.label ?? "",
							orthoType: void 0,
							sensitivity: void 0
						});
					},
					children: [/* @__PURE__ */ jsxDEV(SelectTrigger, {
						className: "mt-1.5 rounded-xl",
						children: /* @__PURE__ */ jsxDEV(SelectValue, { placeholder: "Elige el servicio que necesitas" }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 368,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 367,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(SelectContent, { children: DENTAL_SERVICES.map((service) => /* @__PURE__ */ jsxDEV(SelectItem, {
						value: service.id,
						children: service.label
					}, service.id, false, {
						fileName: _jsxFileName$5,
						lineNumber: 372,
						columnNumber: 15
					}, this)) }, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 370,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 354,
					columnNumber: 9
				}, this),
				errors.service && /* @__PURE__ */ jsxDEV("p", {
					className: "mt-1 text-xs text-destructive",
					children: errors.service
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 378,
					columnNumber: 28
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 352,
				columnNumber: 7
			}, this),
			data.service === "Ortodoncia" && /* @__PURE__ */ jsxDEV("div", {
				className: "rounded-2xl border border-border bg-secondary/40 p-4 animate-fade-up",
				children: [/* @__PURE__ */ jsxDEV(Label, { children: "¿Prefieres Brackets convencionales o Alineadores Invisibles?" }, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 383,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV(RadioGroup, {
					value: data.orthoType ?? "",
					onValueChange: (v) => setData({
						...data,
						orthoType: v
					}),
					className: "mt-3 grid grid-cols-2 gap-3",
					children: [{
						v: "brackets",
						l: "Brackets"
					}, {
						v: "alineadores",
						l: "Alineadores Invisibles"
					}].map((o) => /* @__PURE__ */ jsxDEV("label", {
						className: `flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${data.orthoType === o.v ? "border-primary bg-primary/5" : "border-border bg-white"}`,
						children: [
							/* @__PURE__ */ jsxDEV(RadioGroupItem, { value: o.v }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 397,
								columnNumber: 17
							}, this),
							" ",
							o.l
						]
					}, o.v, true, {
						fileName: _jsxFileName$5,
						lineNumber: 393,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 384,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 382,
				columnNumber: 9
			}, this),
			data.service === "Diseño de Sonrisa" && /* @__PURE__ */ jsxDEV("div", {
				className: "rounded-2xl border border-border bg-secondary/40 p-4 animate-fade-up",
				children: [/* @__PURE__ */ jsxDEV(Label, { children: "¿Has tenido sensibilidad dental antes?" }, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 406,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV(RadioGroup, {
					value: data.sensitivity ?? "",
					onValueChange: (v) => setData({
						...data,
						sensitivity: v
					}),
					className: "mt-3 grid grid-cols-2 gap-3",
					children: [{
						v: "si",
						l: "Sí"
					}, {
						v: "no",
						l: "No"
					}].map((o) => /* @__PURE__ */ jsxDEV("label", {
						className: `flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${data.sensitivity === o.v ? "border-primary bg-primary/5" : "border-border bg-white"}`,
						children: [
							/* @__PURE__ */ jsxDEV(RadioGroupItem, { value: o.v }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 420,
								columnNumber: 17
							}, this),
							" ",
							o.l
						]
					}, o.v, true, {
						fileName: _jsxFileName$5,
						lineNumber: 416,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 407,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 405,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 351,
		columnNumber: 5
	}, this);
}
function Step3({ data, setData, errors }) {
	const [month, setMonth] = useState(() => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(1);
		return d;
	});
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const days = useMemo(() => {
		const first = new Date(month.getFullYear(), month.getMonth(), 1);
		const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
		const startOffset = (first.getDay() + 6) % 7;
		const cells = [];
		for (let i = 0; i < startOffset; i++) cells.push(null);
		for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));
		return cells;
	}, [month]);
	const fmt = (d) => d.toISOString().slice(0, 10);
	const booked = data.date ? getBookedSlots(data.date) : [];
	const now = /* @__PURE__ */ new Date();
	const isToday = data.date === fmt(now);
	return /* @__PURE__ */ jsxDEV("div", {
		className: "space-y-5 animate-fade-up",
		children: [/* @__PURE__ */ jsxDEV("div", {
			className: "rounded-2xl border border-border p-4",
			children: [
				/* @__PURE__ */ jsxDEV("div", {
					className: "mb-3 flex items-center justify-between",
					children: [
						/* @__PURE__ */ jsxDEV("button", {
							onClick: () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1)),
							className: "rounded-full p-1.5 hover:bg-secondary",
							children: /* @__PURE__ */ jsxDEV(ChevronLeft, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 463,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 459,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("p", {
							className: "text-sm font-semibold text-deep capitalize",
							children: month.toLocaleDateString("es-CL", {
								month: "long",
								year: "numeric"
							})
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 465,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("button", {
							onClick: () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1)),
							className: "rounded-full p-1.5 hover:bg-secondary",
							children: /* @__PURE__ */ jsxDEV(ChevronRight, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 472,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 468,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 458,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-muted-foreground",
					children: [
						"L",
						"M",
						"M",
						"J",
						"V",
						"S",
						"D"
					].map((d, i) => /* @__PURE__ */ jsxDEV("div", { children: d }, i, false, {
						fileName: _jsxFileName$5,
						lineNumber: 477,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 475,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "mt-1 grid grid-cols-7 gap-1",
					children: days.map((d, i) => {
						if (!d) return /* @__PURE__ */ jsxDEV("div", {}, i, false, {
							fileName: _jsxFileName$5,
							lineNumber: 482,
							columnNumber: 28
						}, this);
						const past = d < today;
						const selected = data.date === fmt(d);
						return /* @__PURE__ */ jsxDEV("button", {
							disabled: past,
							onClick: () => setData({
								...data,
								date: fmt(d),
								time: ""
							}),
							className: `aspect-square rounded-lg text-sm transition ${past ? "text-muted-foreground/40 cursor-not-allowed" : selected ? "bg-primary text-primary-foreground shadow-soft" : "hover:bg-secondary text-deep"}`,
							children: d.getDate()
						}, i, false, {
							fileName: _jsxFileName$5,
							lineNumber: 486,
							columnNumber: 15
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 480,
					columnNumber: 9
				}, this),
				errors.date && /* @__PURE__ */ jsxDEV("p", {
					className: "mt-2 text-xs text-destructive",
					children: errors.date
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 503,
					columnNumber: 25
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$5,
			lineNumber: 457,
			columnNumber: 7
		}, this), data.date && /* @__PURE__ */ jsxDEV("div", {
			className: "animate-fade-up",
			children: [
				/* @__PURE__ */ jsxDEV("p", {
					className: "mb-2 flex items-center gap-2 text-sm font-semibold text-deep",
					children: [/* @__PURE__ */ jsxDEV(Clock, { className: "h-4 w-4 text-primary" }, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 509,
						columnNumber: 13
					}, this), " Horarios disponibles"]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 508,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "grid grid-cols-4 gap-2",
					children: timeSlots.map((t) => {
						const isBooked = booked.includes(t);
						const isPast = isToday && Number(t.split(":")[0]) <= now.getHours();
						const disabled = isBooked || isPast;
						const selected = data.time === t;
						return /* @__PURE__ */ jsxDEV("button", {
							disabled,
							onClick: () => setData({
								...data,
								time: t
							}),
							className: `rounded-xl border px-2 py-2.5 text-sm font-medium transition ${disabled ? "border-border bg-secondary/50 text-muted-foreground/50 line-through cursor-not-allowed" : selected ? "border-primary bg-primary text-primary-foreground shadow-soft" : "border-border bg-white text-deep hover:border-primary hover:text-primary"}`,
							children: t
						}, t, false, {
							fileName: _jsxFileName$5,
							lineNumber: 518,
							columnNumber: 17
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 511,
					columnNumber: 11
				}, this),
				errors.time && /* @__PURE__ */ jsxDEV("p", {
					className: "mt-2 text-xs text-destructive",
					children: errors.time
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 535,
					columnNumber: 27
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$5,
			lineNumber: 507,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 456,
		columnNumber: 5
	}, this);
}
function LoadingView({ state }) {
	const text = state === "saving" ? "Confirmando tu cita y guardando el lead..." : "Procesando...";
	return /* @__PURE__ */ jsxDEV("div", {
		className: "flex flex-col items-center justify-center py-12 text-center",
		children: [
			/* @__PURE__ */ jsxDEV("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 animate-pulse-ring rounded-full" }, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 547,
					columnNumber: 9
				}, this), /* @__PURE__ */ jsxDEV("div", {
					className: "grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary",
					children: /* @__PURE__ */ jsxDEV(Loader2, { className: "h-7 w-7 animate-spin" }, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 549,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 548,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 546,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("p", {
				className: "mt-5 font-semibold text-deep",
				children: text
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 552,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Esto solo toma unos segundos"
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 553,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 545,
		columnNumber: 5
	}, this);
}
function SuccessView({ successMessage, data, onClose }) {
	const displayMessage = successMessage ?? "Tu cita fue registrada correctamente. Te contactaremos para confirmar los detalles.";
	return /* @__PURE__ */ jsxDEV("div", {
		className: "flex flex-col items-center justify-center py-8 text-center animate-fade-up",
		children: [
			/* @__PURE__ */ jsxDEV("div", {
				className: "grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary",
				children: /* @__PURE__ */ jsxDEV(CheckCircle2, { className: "h-10 w-10" }, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 574,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 573,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("h3", {
				className: "mt-5 text-2xl font-bold text-deep",
				children: "Cita Agendada"
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 576,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("p", {
				className: "mt-2 max-w-md text-sm text-muted-foreground",
				children: displayMessage
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 577,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "mt-6 w-full max-w-md rounded-2xl border border-border bg-secondary/40 p-4 text-left",
				children: [/* @__PURE__ */ jsxDEV("p", {
					className: "text-xs text-muted-foreground",
					children: "Detalles de tu cita"
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 579,
					columnNumber: 9
				}, this), /* @__PURE__ */ jsxDEV("div", {
					className: "mt-2 space-y-1.5 text-sm",
					children: [/* @__PURE__ */ jsxDEV("p", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsxDEV(Sparkles, { className: "h-4 w-4 text-primary" }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 582,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV("span", {
							className: "font-semibold text-deep",
							children: data.service
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 583,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 581,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV("p", {
						className: "flex items-center gap-2 text-deep",
						children: [
							/* @__PURE__ */ jsxDEV(CalendarDays, { className: "h-4 w-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 586,
								columnNumber: 13
							}, this),
							data.date,
							" · ",
							data.time,
							" hrs"
						]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 585,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 580,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 578,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(Button, {
				onClick: onClose,
				className: "mt-6 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90",
				children: "Listo"
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 591,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 572,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/ui/tooltip.tsx
var _jsxFileName$4 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/ui/tooltip.tsx";
var TooltipProvider = TooltipPrimitive.Provider;
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxDEV(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxDEV(TooltipPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 19,
	columnNumber: 5
}, void 0) }, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 18,
	columnNumber: 3
}, void 0));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
//#endregion
//#region src/components/site/WhatsAppIcon.tsx
var _jsxFileName$3 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/site/WhatsAppIcon.tsx";
function WhatsAppIcon(props) {
	return /* @__PURE__ */ jsxDEV("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": "true",
		...props,
		children: [/* @__PURE__ */ jsxDEV("circle", {
			cx: "12",
			cy: "12",
			r: "11",
			fill: "#25D366"
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 4,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV("path", {
			fill: "#fff",
			d: "M17.472 14.382c-.297-.148-1.758-.868-2.03-.967-.273-.098-.472-.148-.671.148-.198.297-.767.967-.94 1.165-.173.198-.346.223-.643.074-.297-.148-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.148-.173.198-.297.297-.495.1-.198.05-.372-.025-.52-.074-.148-.671-1.618-.92-2.215-.242-.583-.487-.503-.671-.513l-.573-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.148.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.273-.198-.57-.346zm-5.49 7.009h-.001c-4.633 0-8.395-3.757-8.395-8.386 0-4.63 3.762-8.387 8.395-8.387 4.63 0 8.396 3.757 8.396 8.387 0 4.629-3.767 8.386-8.396 8.386zm0-18.776c-5.729 0-10.391 4.663-10.391 10.39 0 1.829.49 2.888 1.326 3.904l-1.397 5.099 5.244-1.378c.994.543 2.152.827 3.24.827 5.729 0 10.392-4.662 10.392-10.39 0-5.727-4.663-10.39-10.392-10.39z"
		}, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 5,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 3,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/site/FloatingDentalAIChat.tsx
var _jsxFileName$2 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/site/FloatingDentalAIChat.tsx";
var GREETING_MESSAGE = "Hola, soy el asistente virtual de DentalOperix.\n\nAntes de continuar, ¿tu consulta es una urgencia dental o una consulta general?";
var GREETING_QUESTION = "¿Se trata de una urgencia dental o de una consulta general?";
var FALLBACK_MESSAGE = "No quiero darte información incorrecta. Puedo orientarte sobre:\n• Odontología Preventiva\n• Ortodoncia\n• Diseño de Sonrisa\n• Implantes Dentales\n• Odontopediatría\n• Blanqueamiento Dental\n• Endodoncia\n• Urgencias Dentales\n• Revisión Dental\n¿Cuál se parece más a tu caso?";
var UNKNOWN_ATTEMPTS_MESSAGE = "No estoy entendiendo correctamente tu consulta.\n\nSi lo prefieres, puedo abrir el formulario para que nuestro equipo revise tu caso.";
var CONTACT_TEAM_BUTTON = "Contactar al equipo";
var CONTACT_TEAM_URL = "https://wa.me/56923456789?text=Hola%20DentalOperix.%20Necesito%20ayuda%20con%20mi%20consulta";
var URGENCY_RESPONSE = "Entiendo. No puedo diagnosticar por chat, pero los síntomas que describes requieren atención prioritaria. ¿Quieres que abra el formulario para agendar una cita de urgencia?";
var SERVICE_DISCOVERY_PROMPT = "Entiendo. Cuéntame brevemente qué te preocupa o qué te gustaría mejorar y te orientaré con el servicio más adecuado.";
var HIGH_URGENCY_TERMS = [
	"absceso",
	"sangrado",
	"fiebre",
	"infeccion",
	"fractura",
	"diente roto",
	"muela rota",
	"traumatismo",
	"se me cayo un diente"
];
var MODERATE_URGENCY_TERMS = [
	"dolor fuerte",
	"dolor intenso",
	"mucho dolor",
	"duele muchisimo",
	"no puedo dormir",
	"cara inflamada",
	"hinchazon",
	"inflamacion severa"
];
var URGENCY_TERMS = [
	...HIGH_URGENCY_TERMS,
	...MODERATE_URGENCY_TERMS,
	"urgencias dentales",
	"urgencia dental"
];
var BOOKING_INTENT_TERMS = [
	"quiero agendar",
	"quiero reservar",
	"agendar cita",
	"reservar cita",
	"abrir formulario",
	"hacer una cita",
	"programar una cita",
	"agendar valoracion",
	"quiero una cita",
	"quiero hacer cita"
];
var PRICE_PATTERN = /\b(precio|cuánto cuesta|costo|valor|tarifa|cotiza|cuesta)\b/;
var GENERAL_CONSULTATION_PATTERN = /\b(consulta general|consulta general dental|consulta dental|consulta|informaci[oó]n general|tratamiento general)\b/;
var VIEW_SERVICES_PATTERN = /\b(ver servicios|mostrar servicios|mostrar el catálogo|ver el catálogo)\b/;
var GREETING_PATTERN = /^(hola|buenas|buenos días|buenas tardes|buenas noches|qué tal|buen día)(\W|$)/i;
var NO_PATTERN = /^(no|no gracias|prefiero|más adelante|no quiero|no, gracias)\b/;
var MAX_UNKNOWN_ATTEMPTS = 3;
function normalizeText(text) {
	return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
}
function isUrgencyMessage(input) {
	const normalized = normalizeText(input);
	return URGENCY_TERMS.some((term) => normalized.includes(term));
}
function isBookingIntent(input) {
	const normalized = normalizeText(input);
	return BOOKING_INTENT_TERMS.some((term) => normalized.includes(term));
}
function isViewServicesMessage(input) {
	return VIEW_SERVICES_PATTERN.test(normalizeText(input));
}
function isPriceQuestion(input) {
	return PRICE_PATTERN.test(normalizeText(input));
}
function isGeneralConsultationMessage(input) {
	return GENERAL_CONSULTATION_PATTERN.test(normalizeText(input));
}
function isGreetingMessage(input) {
	return GREETING_PATTERN.test(input);
}
function isNoMessage(input) {
	return NO_PATTERN.test(normalizeText(input));
}
function isNegativeMessage(input) {
	return isNoMessage(input);
}
function getPriceQuestionResponse() {
	return "No puedo dar un precio exacto sin una valoración profesional. Cada caso es diferente y el costo se define en consulta.";
}
function getServiceInfoText(service) {
	return `${service.label}: ${service.shortDescription}\n\n${service.patientExplanation}\n\nBeneficios:\n- ${service.benefits.join("\n- ")}\n\nIdeal para:\n- ${service.idealFor.join("\n- ")}\n\n${service.cta}`;
}
function getUrgencyLevel(text) {
	const normalized = normalizeText(text);
	if (HIGH_URGENCY_TERMS.some((term) => normalized.includes(term))) return "alta";
	if (MODERATE_URGENCY_TERMS.some((term) => normalized.includes(term))) return "media";
	return null;
}
function getQuickRepliesForStage(stage) {
	switch (stage) {
		case "greeting": return [
			"Urgencia Dental",
			"Ortodoncia",
			"Implantes Dentales",
			"Diseño de Sonrisa",
			"Revisión Dental"
		];
		case "urgency_check": return ["Urgencia Dental", "Consulta General"];
		case "service_discovery": return [
			"Ortodoncia",
			"Diseño de Sonrisa",
			"Implantes Dentales",
			"Revisión Dental"
		];
		case "service_info": return [
			"Sí, agendar valoración",
			"No, gracias",
			"Ver servicios"
		];
		case "fallback": return [
			"Abrir formulario",
			"Ver servicios",
			"Urgencias Dentales"
		];
		default: return [];
	}
}
function getFallbackResponseForUnknownAttempts(attempts) {
	if (attempts >= MAX_UNKNOWN_ATTEMPTS) return "No estoy logrando identificar correctamente tu consulta.\n\nTe recomiendo abrir el formulario para que nuestro equipo pueda ayudarte, o contactarnos directamente si prefieres una respuesta más rápida.";
	return attempts >= 2 ? UNKNOWN_ATTEMPTS_MESSAGE : FALLBACK_MESSAGE;
}
function getFallbackQuickRepliesForUnknownAttempts(attempts) {
	if (attempts >= MAX_UNKNOWN_ATTEMPTS) return ["Abrir formulario", CONTACT_TEAM_BUTTON];
	return getQuickRepliesForStage("fallback");
}
function getAssistantTransition(rawValue, stage) {
	const value = rawValue.trim();
	const normalized = normalizeText(value);
	const service = findDentalService(value);
	const effectiveStage = stage === "fallback" ? "greeting" : stage;
	if (effectiveStage === "greeting") {
		if (isGreetingMessage(normalized)) return {
			nextStage: "greeting",
			botMessage: GREETING_QUESTION
		};
		if (isPriceQuestion(normalized)) return {
			nextStage: "fallback",
			botMessage: getPriceQuestionResponse()
		};
		if (isUrgencyMessage(normalized) && isBookingIntent(normalized)) return {
			nextStage: "ready_to_book",
			botMessage: "Perfecto. Abro el formulario de urgencias dentales para que completes fecha y hora."
		};
		if (isUrgencyMessage(normalized)) return {
			nextStage: "urgency_check",
			botMessage: URGENCY_RESPONSE
		};
		if (isGeneralConsultationMessage(normalized) || isViewServicesMessage(normalized)) return {
			nextStage: "service_discovery",
			botMessage: SERVICE_DISCOVERY_PROMPT
		};
		if (service && isBookingIntent(normalized)) return {
			nextStage: "ready_to_book",
			botMessage: "Perfecto. Abro el formulario para que completes fecha y hora de este servicio.",
			service
		};
		if (service) return {
			nextStage: "service_info",
			botMessage: getServiceInfoText(service),
			service
		};
		if (isBookingIntent(normalized)) return {
			nextStage: "ready_to_book",
			botMessage: "Perfecto. Abro el formulario para que completes fecha y hora de tu cita."
		};
		return {
			nextStage: "fallback",
			botMessage: FALLBACK_MESSAGE
		};
	}
	if (effectiveStage === "urgency_check") {
		if (isBookingIntent(normalized) || isUrgencyMessage(normalized)) return {
			nextStage: "ready_to_book",
			botMessage: "Perfecto. Abro el formulario de urgencias dentales para que completes fecha y hora."
		};
		if (isNegativeMessage(normalized) || isGeneralConsultationMessage(normalized)) return {
			nextStage: "service_discovery",
			botMessage: SERVICE_DISCOVERY_PROMPT
		};
		return {
			nextStage: "fallback",
			botMessage: "Quiero asegurarme de tu intención. Responde si quieres agendar cita de urgencia o si necesitas información sobre un tratamiento."
		};
	}
	if (effectiveStage === "service_discovery") {
		if (isPriceQuestion(normalized)) return {
			nextStage: "fallback",
			botMessage: getPriceQuestionResponse()
		};
		if (service) return {
			nextStage: "service_info",
			botMessage: getServiceInfoText(service),
			service
		};
		return {
			nextStage: "fallback",
			botMessage: FALLBACK_MESSAGE
		};
	}
	if (effectiveStage === "service_info") {
		if (isBookingIntent(normalized)) return {
			nextStage: "ready_to_book",
			botMessage: "Perfecto. Abro el formulario para que completes fecha y hora de este servicio."
		};
		if (isNegativeMessage(normalized)) return {
			nextStage: "done",
			botMessage: "Entiendo. Si quieres consultar otro tratamiento o agendar más adelante, aquí estaré para ayudarte."
		};
		return {
			nextStage: "fallback",
			botMessage: "No quiero darte información incorrecta. Puedes decir 'Sí, agendar valoración' o elegir otro servicio del catálogo."
		};
	}
	return {
		nextStage: "fallback",
		botMessage: FALLBACK_MESSAGE
	};
}
function createMessage(role, text, quickReplies) {
	return {
		id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
		role,
		text,
		quickReplies
	};
}
function createUrgencyBookingData(notes) {
	const payload = {
		serviceId: "urgencias-dentales",
		service: "Urgencias Dentales",
		urgency: notes ? getUrgencyLevel(notes) ?? "alta" : "alta",
		source: "chat-widget",
		notes
	};
	return {
		...payload,
		aiSummary: createAiSummary(payload)
	};
}
function createReviewDentalBookingData() {
	return {
		serviceId: "revision-dental",
		service: "Revisión Dental",
		urgency: "media",
		source: "chat-widget",
		notes: "Paciente solicita valoración desde el asistente dental.",
		aiSummary: "El asistente no pudo clasificar la consulta. Se sugiere revisión dental."
	};
}
function createAiSummary(payload) {
	return `${payload.service ?? "consulta dental"}. ${payload.urgency === "alta" ? "Se detecta urgencia." : "Se sugiere valoración."}${payload.notes ? ` ${payload.notes}` : ""}`;
}
function FloatingDentalAIChat({ onBook }) {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState([]);
	const [stage, setStage] = useState("greeting");
	const [conversationHistory, setConversationHistory] = useState([]);
	const [bookingData, setBookingData] = useState({
		source: "chat-widget",
		urgency: "media"
	});
	const [unknownAttempts, setUnknownAttempts] = useState(0);
	const [inputValue, setInputValue] = useState("");
	const [inputError, setInputError] = useState(null);
	const [sending, setSending] = useState(false);
	const [status, setStatus] = useState("idle");
	const [serverError, setServerError] = useState(null);
	const panelRef = useRef(null);
	useEffect(() => {
		if (!open) return;
		if (messages.length === 0) {
			setMessages([createMessage("bot", GREETING_MESSAGE, getQuickRepliesForStage("greeting"))]);
			setConversationHistory([{
				stage: "greeting",
				bot: GREETING_MESSAGE
			}]);
			setStage("greeting");
			setBookingData({
				source: "chat-widget",
				urgency: "media"
			});
		}
	}, [open, messages.length]);
	useEffect(() => {
		if (!open) return;
		panelRef.current?.scrollTo({
			top: panelRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [
		messages,
		open,
		sending
	]);
	const appendMessage = (message) => {
		setMessages((prev) => [...prev.slice(-11), message]);
	};
	const recordHistory = (item) => {
		setConversationHistory((prev) => [...prev.slice(-7), item]);
	};
	const appendBot = (text, quickReplies, messageStage) => {
		appendMessage(createMessage("bot", text, quickReplies));
		recordHistory({
			stage: messageStage ?? stage,
			bot: text
		});
	};
	const appendUser = (text) => {
		appendMessage(createMessage("user", text));
		recordHistory({
			stage,
			user: text,
			bot: ""
		});
	};
	const processUserMessage = (rawValue) => {
		const value = rawValue.trim();
		if (!value) return;
		if (stage === "done") {
			setInputError("La conversación ya finalizó. Reinicia si deseas comenzar de nuevo.");
			return;
		}
		const { nextStage, botMessage, service } = getAssistantTransition(value, stage);
		let nextData = bookingData;
		if (service) {
			track("service_detected", {
				serviceId: service.id,
				service: service.label
			});
			nextData = {
				...nextData,
				serviceId: service.id,
				service: service.label,
				source: "chat-widget"
			};
			setUnknownAttempts(0);
		}
		if (nextStage === "ready_to_book") {
			track("booking_intent", { query: value });
			if (stage === "urgency_check" || isUrgencyMessage(value)) {
				track("urgency_detected", { urgency: getUrgencyLevel(value) });
				nextData = createUrgencyBookingData(value);
			} else if (normalizeText(value).includes("abrir formulario")) nextData = createReviewDentalBookingData();
			else nextData = {
				serviceId: nextData.serviceId,
				service: nextData.service,
				urgency: nextData.urgency ?? "media",
				source: "chat-widget",
				notes: nextData.notes ? nextData.notes : value
			};
			setUnknownAttempts(0);
			setBookingData(nextData);
			setStage(nextStage);
			appendBot(botMessage, void 0, nextStage);
			openBooking(nextData);
			return;
		}
		if (nextStage === "fallback" && !service && !isPriceQuestion(value) && !isBookingIntent(value) && !isUrgencyMessage(value) && !isViewServicesMessage(value)) {
			const nextUnknownAttempts = unknownAttempts + 1;
			setUnknownAttempts(nextUnknownAttempts);
			const fallbackMessage = getFallbackResponseForUnknownAttempts(nextUnknownAttempts);
			const quickReplies = getFallbackQuickRepliesForUnknownAttempts(nextUnknownAttempts);
			setStage("fallback");
			appendBot(fallbackMessage, quickReplies, "fallback");
			return;
		}
		if (nextStage !== "fallback") setUnknownAttempts(0);
		setBookingData(nextData);
		setStage(nextStage);
		appendBot(botMessage, getQuickRepliesForStage(nextStage), nextStage);
	};
	const resetConversation = () => {
		const startMessage = createMessage("bot", GREETING_MESSAGE, getQuickRepliesForStage("greeting"));
		setBookingData({
			source: "chat-widget",
			urgency: "media"
		});
		setStage("greeting");
		setInputValue("");
		setInputError(null);
		setSending(false);
		setStatus("idle");
		setServerError(null);
		setMessages([startMessage]);
		setConversationHistory([{
			stage: "greeting",
			bot: GREETING_MESSAGE
		}]);
	};
	const openBooking = (payload) => {
		const finalPayload = {
			serviceId: payload.serviceId,
			service: payload.service,
			urgency: payload.urgency ?? "media",
			source: "chat-widget",
			notes: payload.notes,
			aiSummary: createAiSummary(payload)
		};
		console.log("ASSISTANT BOOKING DATA:", finalPayload);
		if (onBook) {
			track("booking_dialog_opened", {
				serviceId: finalPayload.serviceId,
				service: finalPayload.service,
				urgency: finalPayload.urgency
			});
			onBook(finalPayload);
			appendBot("Ingresa tus datos para agendar la cita. Ajusta fecha, hora y confirma tu cita allí.");
			setStage("done");
			setStatus("sent");
			toast.success("Formulario listo para confirmar");
		} else {
			appendBot("No pude abrir el formulario de reserva. Usa el botón de Agendar cita en la página.");
			setStatus("error");
			setServerError("No fue posible abrir el formulario de agenda. Intenta nuevamente.");
		}
	};
	const handleTextSubmit = () => {
		const value = inputValue.trim();
		if (!value) {
			setInputError("Por favor escribe tu respuesta.");
			return;
		}
		setInputError(null);
		appendUser(value);
		setInputValue("");
		processUserMessage(value);
	};
	const handleQuickReply = (value) => {
		appendUser(value);
		if (value === "Contactar al equipo") {
			track("whatsapp_clicked", { source: "whatsapp" });
			if (typeof window !== "undefined") window.open(CONTACT_TEAM_URL, "_blank");
			appendBot("Te dirijo a WhatsApp para que puedas contactar al equipo directamente. Si necesitas, también puedes volver a este chat.");
			setStage("done");
			return;
		}
		processUserMessage(value);
	};
	const renderInputArea = () => {
		if (status !== "idle" || stage === "done") return null;
		return /* @__PURE__ */ jsxDEV("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ jsxDEV("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ jsxDEV(Input, {
						value: inputValue,
						onChange: (event) => {
							setInputValue(event.target.value);
							setInputError(null);
						},
						placeholder: "Escribe aquí...",
						className: "mt-1 pr-10",
						"aria-label": "Campo de respuesta del asistente",
						onKeyDown: (event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								handleTextSubmit();
							}
						}
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 673,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV("button", {
						type: "button",
						"aria-label": "Reiniciar conversación",
						onClick: resetConversation,
						className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 hover:bg-slate-100",
						children: /* @__PURE__ */ jsxDEV(RefreshCw, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 695,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 689,
						columnNumber: 11
					}, this),
					inputError && /* @__PURE__ */ jsxDEV("p", {
						className: "mt-1 text-xs text-destructive",
						children: inputError
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 697,
						columnNumber: 26
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 672,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV(Button, {
				className: "w-full",
				onClick: handleTextSubmit,
				disabled: sending,
				children: ["Continuar", /* @__PURE__ */ jsxDEV(Send, { className: "ml-2 h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 701,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 699,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 671,
			columnNumber: 7
		}, this);
	};
	return /* @__PURE__ */ jsxDEV(Fragment, { children: [
		/* @__PURE__ */ jsxDEV(Toaster, { position: "bottom-right" }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 709,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ jsxDEV("button", {
			"aria-label": "Abrir asistente dental",
			className: "fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform hover:scale-105",
			onClick: () => setOpen((value) => {
				if (!value) track("chat_started");
				return !value;
			}),
			children: /* @__PURE__ */ jsxDEV(MessageCircle, { className: "h-6 w-6" }, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 721,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 711,
			columnNumber: 7
		}, this),
		open && /* @__PURE__ */ jsxDEV("div", {
			className: "fixed bottom-24 right-5 z-50 flex h-[38rem] w-[24rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[2rem] border border-border bg-white shadow-2xl",
			children: [
				/* @__PURE__ */ jsxDEV("div", {
					className: "flex items-center justify-between gap-3 bg-gradient-to-r from-primary to-emerald-500 px-4 py-4 text-white",
					children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
						className: "font-semibold",
						children: "Asistente DentalOperix"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 728,
						columnNumber: 15
					}, this), /* @__PURE__ */ jsxDEV("p", {
						className: "text-xs text-white/80",
						children: "Orientación rápida y pre-captura de reserva"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 729,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 727,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV("button", {
						onClick: () => setOpen(false),
						className: "rounded-full border border-white/20 p-2 text-white transition hover:bg-white/10",
						"aria-label": "Cerrar chat",
						children: /* @__PURE__ */ jsxDEV(X, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 736,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 731,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 726,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					ref: panelRef,
					className: "flex-1 space-y-3 overflow-y-auto p-4 bg-slate-50",
					children: messages.map((message) => /* @__PURE__ */ jsxDEV("div", {
						className: `flex ${message.role === "user" ? "justify-end" : "justify-start"}`,
						children: /* @__PURE__ */ jsxDEV("div", {
							className: `max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "bg-primary text-white rounded-br-none" : "bg-white text-slate-900 shadow-sm rounded-bl-none"}`,
							children: [message.text.split("\n").map((line, index) => /* @__PURE__ */ jsxDEV("p", {
								className: index > 0 ? "mt-1" : void 0,
								children: line
							}, index, false, {
								fileName: _jsxFileName$2,
								lineNumber: 754,
								columnNumber: 21
							}, this)), message.role === "bot" && message.quickReplies?.length ? /* @__PURE__ */ jsxDEV("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: message.quickReplies.map((reply) => {
									const button = /* @__PURE__ */ jsxDEV(Button, {
										type: "button",
										variant: reply === "Contactar al equipo" ? "default" : reply === "Abrir formulario" ? "default" : "outline",
										size: "sm",
										className: reply === "Contactar al equipo" ? "rounded-full px-3 py-1 text-xs bg-emerald-100 text-emerald-900 border-emerald-200 hover:bg-emerald-200" : reply === "Abrir formulario" ? "rounded-full px-3 py-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90" : "rounded-full px-3 py-1 text-xs",
										onClick: () => handleQuickReply(reply),
										children: [reply === "Contactar al equipo" ? /* @__PURE__ */ jsxDEV(WhatsAppIcon, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 784,
											columnNumber: 31
										}, this) : null, reply]
									}, reply, true, {
										fileName: _jsxFileName$2,
										lineNumber: 763,
										columnNumber: 27
									}, this);
									return reply === "Contactar al equipo" ? /* @__PURE__ */ jsxDEV(TooltipProvider, { children: /* @__PURE__ */ jsxDEV(Tooltip, {
										delayDuration: 0,
										children: [/* @__PURE__ */ jsxDEV(TooltipTrigger, {
											asChild: true,
											children: button
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 793,
											columnNumber: 31
										}, this), /* @__PURE__ */ jsxDEV(TooltipContent, {
											side: "top",
											children: "Contacta al equipo por WhatsApp"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 794,
											columnNumber: 31
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 792,
										columnNumber: 29
									}, this) }, reply, false, {
										fileName: _jsxFileName$2,
										lineNumber: 791,
										columnNumber: 27
									}, this) : button;
								})
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 760,
								columnNumber: 21
							}, this) : null]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 746,
							columnNumber: 17
						}, this)
					}, message.id, false, {
						fileName: _jsxFileName$2,
						lineNumber: 742,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 740,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "space-y-3 border-t border-border bg-white p-4",
					children: [
						status === "sent" && /* @__PURE__ */ jsxDEV("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-sm text-slate-600",
								children: "Formulario abierto. Completa la fecha y confirma tu reserva."
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 813,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV(Button, {
								variant: "ghost",
								className: "w-full",
								onClick: resetConversation,
								children: /* @__PURE__ */ jsxDEV(RefreshCw, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 817,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 816,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 812,
							columnNumber: 15
						}, this),
						status === "error" && /* @__PURE__ */ jsxDEV("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-sm text-destructive",
								children: serverError || "Hubo un problema con el asistente."
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 824,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV(Button, {
								className: "w-full",
								onClick: resetConversation,
								children: "Reiniciar conversación"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 827,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 823,
							columnNumber: 15
						}, this),
						status === "idle" && renderInputArea()
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 810,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 725,
			columnNumber: 9
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 708,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/site/ServiceInfoDialog.tsx
var _jsxFileName$1 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/site/ServiceInfoDialog.tsx";
function ServiceInfoDialog({ service, open, onOpenChange, onBook }) {
	if (!service) return null;
	const handleBook = () => {
		onOpenChange(false);
		window.setTimeout(() => onBook(service.id), 150);
	};
	return /* @__PURE__ */ jsxDEV(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxDEV(DialogContent, {
			className: "max-h-[92vh] overflow-y-auto rounded-3xl border-white/20 bg-white p-0 shadow-2xl sm:max-w-2xl",
			children: [
				/* @__PURE__ */ jsxDEV("div", {
					className: "relative min-h-56 overflow-hidden rounded-t-3xl",
					children: [
						/* @__PURE__ */ jsxDEV("img", {
							src: service.image,
							alt: service.alt,
							className: "absolute inset-0 h-full w-full object-cover"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 37,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 38,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV(DialogHeader, {
							className: "relative z-10 justify-end p-6 text-left text-white sm:p-8",
							children: [/* @__PURE__ */ jsxDEV(DialogDescription, {
								className: "text-sm font-medium uppercase tracking-[0.24em] text-white/75",
								children: "Servicio DentalOperix"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 40,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV(DialogTitle, {
								className: "mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl",
								children: service.title
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 43,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 39,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 36,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "space-y-6 p-6 sm:p-8",
					children: [
						/* @__PURE__ */ jsxDEV("p", {
							className: "text-base leading-7 text-muted-foreground",
							children: service.modalDescription
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 50,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-primary/15 bg-primary/5 p-5",
							children: /* @__PURE__ */ jsxDEV("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ jsxDEV("span", {
									className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-primary shadow-sm",
									children: /* @__PURE__ */ jsxDEV(Tag, { className: "h-5 w-5" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 55,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 54,
									columnNumber: 15
								}, this), /* @__PURE__ */ jsxDEV("div", { children: [
									/* @__PURE__ */ jsxDEV("h3", {
										className: "text-sm font-semibold uppercase tracking-[0.18em] text-primary",
										children: "Precio sugerido"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 58,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("p", {
										className: "mt-1 text-2xl font-bold text-deep",
										children: service.suggestedPrice
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 61,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("p", {
										className: "mt-2 text-sm leading-6 text-muted-foreground",
										children: service.priceNote
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 62,
										columnNumber: 17
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 57,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 53,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 52,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "flex gap-3 rounded-2xl bg-secondary/60 p-4 text-sm leading-6 text-muted-foreground",
							children: [/* @__PURE__ */ jsxDEV(Info, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 68,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("p", { children: "Precio referencial. El valor final depende de la evaluación clínica, diagnóstico, materiales, estudios requeridos y plan indicado por el especialista." }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 69,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 67,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 49,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV(DialogFooter, {
					className: "gap-3 border-t border-border px-6 py-5 sm:px-8",
					children: [/* @__PURE__ */ jsxDEV(Button, {
						type: "button",
						variant: "outline",
						className: "rounded-full",
						onClick: () => onOpenChange(false),
						children: "Cerrar"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 77,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(Button, {
						type: "button",
						className: "rounded-full bg-deep px-7 text-white hover:bg-primary",
						onClick: handleBook,
						children: ["Agendar consulta ", /* @__PURE__ */ jsxDEV(ArrowRight, { className: "ml-2 h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 81,
							columnNumber: 30
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 80,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 76,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 35,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 34,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/site/SiteLayout.tsx
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/site/SiteLayout.tsx";
function SiteLayout({ children }) {
	const [bookingOpen, setBookingOpen] = useState(false);
	const [bookingInitialData, setBookingInitialData] = useState(void 0);
	const [selectedService, setSelectedService] = useState(void 0);
	const [serviceInfoOpen, setServiceInfoOpen] = useState(false);
	const openBooking = (serviceId) => {
		setBookingInitialData(serviceId ? { serviceId } : void 0);
		setBookingOpen(true);
	};
	const openBookingWithData = (data) => {
		setBookingInitialData(data);
		setBookingOpen(true);
	};
	const openServiceInfo = (serviceIdOrSlug) => {
		const service = siteServices.find((item) => item.id === serviceIdOrSlug) ?? getSiteServiceBySlug(serviceIdOrSlug);
		if (!service) return;
		setSelectedService(service);
		setServiceInfoOpen(true);
	};
	useEffect(() => {
		if (!bookingOpen) setBookingInitialData(void 0);
	}, [bookingOpen]);
	return /* @__PURE__ */ jsxDEV("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ jsxDEV(Navbar, { onBook: () => openBooking() }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 55,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("main", {
				className: "flex-1",
				children: typeof children === "function" ? children(openBooking, openServiceInfo) : children
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 56,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(Footer, { onServiceInfo: openServiceInfo }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 59,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(FloatingDentalAIChat, { onBook: openBookingWithData }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 60,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(ServiceInfoDialog, {
				service: selectedService,
				open: serviceInfoOpen,
				onOpenChange: setServiceInfoOpen,
				onBook: openBooking
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 61,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(BookingDialog, {
				open: bookingOpen,
				onOpenChange: setBookingOpen,
				initialData: bookingInitialData
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 67,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 54,
		columnNumber: 5
	}, this);
}
//#endregion
export { getSiteServiceBySlug as n, siteServices as r, SiteLayout as t };
