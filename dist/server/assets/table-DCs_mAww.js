import { n as cn } from "./button-BLeLDVKM.js";
import * as React from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
//#region src/components/ui/table.tsx
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/ui/table.tsx";
var Table = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ jsxDEV("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 8,
		columnNumber: 7
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 7,
	columnNumber: 5
}, void 0));
Table.displayName = "Table";
var TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 18,
	columnNumber: 3
}, void 0));
TableHeader.displayName = "TableHeader";
var TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 26,
	columnNumber: 3
}, void 0));
TableBody.displayName = "TableBody";
var TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 34,
	columnNumber: 3
}, void 0));
TableFooter.displayName = "TableFooter";
var TableRow = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 44,
	columnNumber: 5
}, void 0));
TableRow.displayName = "TableRow";
var TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 60,
	columnNumber: 3
}, void 0));
TableHead.displayName = "TableHead";
var TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 75,
	columnNumber: 3
}, void 0));
TableCell.displayName = "TableCell";
var TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 90,
	columnNumber: 3
}, void 0));
TableCaption.displayName = "TableCaption";
//#endregion
export { TableHead as a, TableCell as i, TableBody as n, TableHeader as o, TableCaption as r, TableRow as s, Table as t };
