import { t as Button } from "./button-BLeLDVKM.js";
import { jsxDEV } from "react/jsx-dev-runtime";
import { ArrowRight } from "lucide-react";
//#region src/components/site/BookingCTA.tsx
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/site/BookingCTA.tsx";
function BookingCTA({ onBook }) {
	return /* @__PURE__ */ jsxDEV("section", {
		className: "mx-auto max-w-7xl px-6 py-16",
		children: /* @__PURE__ */ jsxDEV("div", {
			className: "relative overflow-hidden rounded-3xl border border-border bg-white p-8 shadow-soft sm:p-12",
			children: [
				/* @__PURE__ */ jsxDEV("div", { className: "absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 8,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", { className: "absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-deep/10 blur-3xl" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 9,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "relative grid items-center gap-6 md:grid-cols-[1fr_auto]",
					children: [/* @__PURE__ */ jsxDEV("div", { children: [
						/* @__PURE__ */ jsxDEV("span", {
							className: "chip",
							children: "Atención"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 12,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("h3", {
							className: "mt-3 text-2xl font-bold tracking-tight text-deep sm:text-3xl",
							children: "Solicita atención dental"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 13,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV("p", {
							className: "mt-2 max-w-xl text-muted-foreground",
							children: "Tomaremos tus datos para coordinar la cita y confirmar la información necesaria."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 16,
							columnNumber: 13
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 11,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(Button, {
						onClick: onBook,
						size: "lg",
						className: "rounded-full bg-primary px-7 text-primary-foreground shadow-glow hover:bg-primary/90",
						children: ["Solicitar Atención ", /* @__PURE__ */ jsxDEV(ArrowRight, { className: "ml-1 h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 25,
							columnNumber: 32
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 20,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 10,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 7,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 6,
		columnNumber: 5
	}, this);
}
//#endregion
export { BookingCTA as t };
