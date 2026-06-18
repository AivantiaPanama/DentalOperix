import { n as cn } from "./button-BLeLDVKM.js";
import * as React from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
import * as ProgressPrimitive from "@radix-ui/react-progress";
//#region src/components/ui/progress.tsx
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/ui/progress.tsx";
var Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsxDEV(ProgressPrimitive.Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ jsxDEV(ProgressPrimitive.Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 17,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 12,
	columnNumber: 3
}, void 0));
Progress.displayName = ProgressPrimitive.Root.displayName;
//#endregion
export { Progress as t };
