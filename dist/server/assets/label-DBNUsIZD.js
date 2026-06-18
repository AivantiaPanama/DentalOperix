import { n as cn } from "./button-BLeLDVKM.js";
import * as React from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
import { cva } from "class-variance-authority";
import * as LabelPrimitive from "@radix-ui/react-label";
//#region src/components/ui/input.tsx
var _jsxFileName$1 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/ui/input.tsx";
var Input = React.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ jsxDEV("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 8,
		columnNumber: 7
	}, void 0);
});
Input.displayName = "Input";
//#endregion
//#region src/components/ui/label.tsx
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/ui/label.tsx";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV(LabelPrimitive.Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 17,
	columnNumber: 3
}, void 0));
Label.displayName = LabelPrimitive.Root.displayName;
//#endregion
export { Input as n, Label as t };
