import { n as cn, t as Button } from "./button-BLeLDVKM.js";
import { r as siteServices, t as SiteLayout } from "./SiteLayout-BE2vGC_Q.js";
import { t as BookingCTA } from "./BookingCTA-B2gnWF8D.js";
import { useEffect, useState } from "react";
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import { ArrowRight } from "lucide-react";
//#region src/data/careJourneyStories.ts
var careJourneyStories = siteServices.map(({ id, slug, title, message, image, alt }) => ({
	id,
	slug,
	title,
	message,
	image,
	alt
}));
//#endregion
//#region src/components/site/Hero.tsx
var _jsxFileName$1 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/site/Hero.tsx";
var STORY_ROTATION_MS = 7e3;
function Hero({ onBook, onServiceInfo }) {
	const [activeStoryIndex, setActiveStoryIndex] = useState(0);
	const activeStory = careJourneyStories[activeStoryIndex];
	useEffect(() => {
		const interval = window.setInterval(() => {
			setActiveStoryIndex((currentIndex) => currentIndex === careJourneyStories.length - 1 ? 0 : currentIndex + 1);
		}, STORY_ROTATION_MS);
		return () => window.clearInterval(interval);
	}, []);
	return /* @__PURE__ */ jsxDEV("section", {
		className: "relative h-[88vh] min-h-[700px] overflow-hidden",
		children: [
			careJourneyStories.map((story, index) => /* @__PURE__ */ jsxDEV("img", {
				src: story.image,
				alt: story.alt,
				className: cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-1000", index === activeStoryIndex ? "opacity-100" : "opacity-0")
			}, story.title, false, {
				fileName: _jsxFileName$1,
				lineNumber: 33,
				columnNumber: 9
			}, this)),
			/* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/20" }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 43,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("div", {
				className: "relative z-10 flex h-full items-center",
				children: /* @__PURE__ */ jsxDEV("div", {
					className: "mx-auto w-full max-w-7xl px-6",
					children: /* @__PURE__ */ jsxDEV("div", {
						className: "max-w-3xl text-white",
						children: [
							/* @__PURE__ */ jsxDEV("div", {
								"aria-hidden": "true",
								className: "h-40 md:h-44"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 47,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("a", {
								href: `/servicios/${activeStory.slug}`,
								className: "inline-block rounded-2xl text-4xl font-bold leading-tight text-white underline-offset-8 transition-colors hover:text-white/85 hover:underline md:text-5xl",
								onClick: (event) => {
									if (!onServiceInfo) return;
									event.preventDefault();
									onServiceInfo(activeStory.id);
								},
								children: activeStory.title
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 50,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-3 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl",
								children: [
									"“",
									activeStory.message,
									"”"
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 61,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 49,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("div", {
								className: "mt-6 flex items-center gap-2",
								children: careJourneyStories.map((story, index) => /* @__PURE__ */ jsxDEV("button", {
									type: "button",
									onClick: () => setActiveStoryIndex(index),
									className: cn("h-2 rounded-full transition-all", index === activeStoryIndex ? "w-8 bg-white" : "w-2 bg-white/40")
								}, story.title, false, {
									fileName: _jsxFileName$1,
									lineNumber: 68,
									columnNumber: 17
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 66,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("div", {
								className: "mt-8",
								children: /* @__PURE__ */ jsxDEV("div", {
									className: "flex flex-col gap-3 sm:flex-row",
									children: [/* @__PURE__ */ jsxDEV(Button, {
										onClick: onBook,
										size: "lg",
										className: "rounded-full px-8",
										children: ["Agendar consulta ", /* @__PURE__ */ jsxDEV(ArrowRight, { className: "ml-2 h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 83,
											columnNumber: 36
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 82,
										columnNumber: 17
									}, this), /* @__PURE__ */ jsxDEV(Button, {
										asChild: true,
										size: "lg",
										variant: "outline",
										className: "rounded-full border-white/40 bg-white/10 px-8 text-white backdrop-blur hover:bg-white/20 hover:text-white",
										children: /* @__PURE__ */ jsxDEV("a", {
											href: `/servicios/${activeStory.slug}`,
											onClick: (event) => {
												if (!onServiceInfo) return;
												event.preventDefault();
												onServiceInfo(activeStory.id);
											},
											children: "Ver servicio"
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 91,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 85,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 81,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 80,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 46,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 45,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 44,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 31,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/index.tsx?tsr-split=component";
function Index() {
	return /* @__PURE__ */ jsxDEV(SiteLayout, { children: (openBooking, openServiceInfo) => /* @__PURE__ */ jsxDEV(Fragment, { children: [/* @__PURE__ */ jsxDEV(Hero, {
		onBook: () => openBooking(),
		onServiceInfo: openServiceInfo
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 7,
		columnNumber: 11
	}, this), /* @__PURE__ */ jsxDEV(BookingCTA, { onBook: () => openBooking() }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 9,
		columnNumber: 11
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 6,
		columnNumber: 100
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 5,
		columnNumber: 10
	}, this);
}
//#endregion
export { Index as component };
