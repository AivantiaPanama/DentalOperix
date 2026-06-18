import { n as cn } from "./button-BLeLDVKM.js";
import * as React from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
//#region src/data/userPortals.ts
var userPortals = [
	{
		id: "patient",
		title: "Portal del Paciente",
		footerLabel: "Paciente",
		path: "/portal/paciente",
		audience: "Pacientes DentalOperix",
		description: "Espacio pensado para consultar próximas citas, indicaciones compartidas e información personal de atención cuando el portal esté disponible.",
		available: false,
		visibleNotes: ["Acceso limitado exclusivamente a la información propia del paciente.", "No mostrará datos de otros pacientes, agenda global ni información administrativa."]
	},
	{
		id: "doctor",
		title: "Portal Doctor",
		footerLabel: "Doctor",
		path: "/portal/doctor",
		audience: "Odontólogos y especialistas",
		description: "Dashboard clínico proyectado para revisar agenda profesional, pacientes asignados, tratamientos e indicaciones clínicas.",
		available: false,
		visibleNotes: ["No incluirá ingresos, métricas comerciales ni estrategia de negocio.", "El acceso requerirá autenticación y rol clínico autorizado."]
	},
	{
		id: "assistant",
		title: "Portal Asistente",
		footerLabel: "Asistente / Secretaria",
		path: "/portal/asistente",
		audience: "Asistentes y equipo de recepción",
		description: "Espacio operativo proyectado para apoyo de agenda, confirmaciones, seguimiento de pacientes y tareas administrativas no financieras.",
		available: false,
		visibleNotes: ["No incluirá ingresos, reportes comerciales ni configuración estratégica.", "El acceso requerirá autenticación y rol operativo autorizado."]
	},
	{
		id: "admin",
		title: "Portal Administración",
		footerLabel: "Administración",
		path: "/portal/administracion",
		audience: "Administración de la clínica",
		description: "Acceso reservado para dirección y administración. Este perfil concentra métricas internas, configuración, CRM y reportes de negocio.",
		available: false,
		visibleNotes: ["El enlace operativo de administración no se expone en el encabezado público.", "El acceso real permanecerá protegido por sesión, cookies seguras y permisos internos."]
	}
];
function getUserPortalByPublicSlug(slug) {
	const normalized = slug.toLowerCase();
	if (normalized === "administracion") return userPortals.find((portal) => portal.id === "admin");
	if (normalized === "asistente" || normalized === "secretaria") return userPortals.find((portal) => portal.id === "assistant");
	return userPortals.find((portal) => portal.id === normalized);
}
//#endregion
//#region src/components/ui/dialog.tsx
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/ui/dialog.tsx";
var Dialog = DialogPrimitive.Root;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV(DialogPrimitive.Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 21,
	columnNumber: 3
}, void 0));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxDEV(DialogPortal, { children: [/* @__PURE__ */ jsxDEV(DialogOverlay, {}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 37,
	columnNumber: 5
}, void 0), /* @__PURE__ */ jsxDEV(DialogPrimitive.Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ jsxDEV(DialogPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ jsxDEV(X, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 48,
			columnNumber: 9
		}, void 0), /* @__PURE__ */ jsxDEV("span", {
			className: "sr-only",
			children: "Close"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 49,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 47,
		columnNumber: 7
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName,
	lineNumber: 38,
	columnNumber: 5
}, void 0)] }, void 0, true, {
	fileName: _jsxFileName,
	lineNumber: 36,
	columnNumber: 3
}, void 0));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxDEV("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 57,
	columnNumber: 3
}, void 0);
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxDEV("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 62,
	columnNumber: 3
}, void 0);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV(DialogPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 73,
	columnNumber: 3
}, void 0));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDEV(DialogPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 85,
	columnNumber: 3
}, void 0));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
//#endregion
export { DialogHeader as a, userPortals as c, DialogFooter as i, DialogContent as n, DialogTitle as o, DialogDescription as r, getUserPortalByPublicSlug as s, Dialog as t };
