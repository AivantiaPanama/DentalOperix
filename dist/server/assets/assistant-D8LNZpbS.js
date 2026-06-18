import { t as derivePatientAdministrativeProfiles } from "../server.js";
import { n as cn, t as Button } from "./button-BLeLDVKM.js";
import { t as RoleRouteGuard } from "./RoleRouteGuard-CK45NeIZ.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BATy6eNr.js";
import { n as Input, t as Label } from "./label-DBNUsIZD.js";
import { t as Badge } from "./badge-BT5ORwAW.js";
import { a as AlertDescription, i as Alert, n as OperationalKpisPanel, o as AlertTitle, r as OperationalNotificationsPanel, t as OperationalDataQualityPanel } from "./OperationalDataQualityPanel-Bk93eULm.js";
import { t as Progress } from "./progress-CBPak1Ip.js";
import { t as RoleWorkspaceLayout } from "./RoleWorkspaceLayout-DvjYd7cX.js";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
import { AlertTriangle, BarChart3, CalendarClock, CheckCircle2, ClipboardCheck, ClipboardList, Clock3, Download, FilePenLine, FileText, Layers3, LogIn, LogOut, MessageSquareText, PhoneCall, RefreshCcw, Save, Search, ShieldAlert, ShieldCheck, TrendingUp, UserRound, UsersRound } from "lucide-react";
//#region src/components/ui/textarea.tsx
var _jsxFileName$6 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/ui/textarea.tsx";
var Textarea = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsxDEV("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$6,
		lineNumber: 8,
		columnNumber: 7
	}, void 0);
});
Textarea.displayName = "Textarea";
//#endregion
//#region src/components/assistant/LeadOperationsWorkspace.tsx
var _jsxFileName$5 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/assistant/LeadOperationsWorkspace.tsx";
var statusOptions = [
	{
		value: "nuevo",
		label: "Nuevo"
	},
	{
		value: "contactado",
		label: "Contactado"
	},
	{
		value: "seguimiento",
		label: "Seguimiento"
	},
	{
		value: "descartado",
		label: "Descartado"
	}
];
var priorityOptions = [
	{
		value: "baja",
		label: "Baja"
	},
	{
		value: "normal",
		label: "Normal"
	},
	{
		value: "alta",
		label: "Alta"
	}
];
var emptyForm$1 = {
	operationalStatus: "nuevo",
	priority: "normal",
	lastContactAt: "",
	nextFollowUpAt: "",
	contactResult: "",
	internalNote: ""
};
function leadOperationsToForm(leadOperations) {
	if (!leadOperations) return emptyForm$1;
	return {
		operationalStatus: leadOperations.operationalStatus,
		priority: leadOperations.priority,
		lastContactAt: leadOperations.lastContactAt,
		nextFollowUpAt: leadOperations.nextFollowUpAt,
		contactResult: leadOperations.contactResult,
		internalNote: leadOperations.internalNote
	};
}
function statusLabel$1(status) {
	return statusOptions.find((option) => option.value === status)?.label ?? status;
}
function priorityLabel(priority) {
	return priorityOptions.find((option) => option.value === priority)?.label ?? priority;
}
function statusClass$4(status) {
	if (status === "contactado") return "border-emerald-200 bg-emerald-50 text-emerald-700";
	if (status === "seguimiento") return "border-blue-200 bg-blue-50 text-blue-700";
	if (status === "descartado") return "border-slate-200 bg-slate-50 text-slate-700";
	return "border-amber-200 bg-amber-50 text-amber-700";
}
function priorityClass$1(priority) {
	if (priority === "alta") return "border-red-200 bg-red-50 text-red-700";
	if (priority === "baja") return "border-slate-200 bg-slate-50 text-slate-700";
	return "border-primary/20 bg-primary/5 text-primary";
}
function formatLeadDate(value) {
	if (!value) return "Sin fecha";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("es-PA", { dateStyle: "medium" }).format(date);
}
function dateInputValue(value) {
	if (!value) return "";
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toISOString().slice(0, 10);
}
function leadText(lead) {
	return [
		lead.id,
		lead.name,
		lead.phone,
		lead.email,
		lead.treatment,
		lead.status,
		lead.source,
		lead.notes
	].filter(Boolean).join(" ").toLowerCase();
}
function getUpdatePayload$1(form, original) {
	const originalForm = leadOperationsToForm(original);
	return Object.entries(form).reduce((payload, [key, value]) => {
		if (value !== (originalForm[key] ?? "")) payload[key] = value;
		return payload;
	}, {});
}
function LeadOperationsWorkspace() {
	const [leadOperations, setLeadOperations] = useState([]);
	const [selectedLeadId, setSelectedLeadId] = useState(null);
	const [form, setForm] = useState(emptyForm$1);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [notice, setNotice] = useState(null);
	const loadLeadOperations = async () => {
		setLoading(true);
		setError(null);
		setNotice(null);
		try {
			const response = await fetch("/api/leads/operations", { credentials: "same-origin" });
			const payload = await response.json();
			if (!response.ok || !payload.success) throw new Error(payload.error ?? "No se pudo cargar la operación de leads.");
			const nextLeadOperations = payload.leadOperations ?? [];
			setLeadOperations(nextLeadOperations);
			const nextSelected = selectedLeadId && nextLeadOperations.some((item) => item.leadId === selectedLeadId) ? selectedLeadId : nextLeadOperations[0]?.leadId ?? null;
			setSelectedLeadId(nextSelected);
			setForm(leadOperationsToForm(nextLeadOperations.find((item) => item.leadId === nextSelected) ?? null));
		} catch (loadError) {
			setLeadOperations([]);
			setSelectedLeadId(null);
			setForm(emptyForm$1);
			setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la operación de leads.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadLeadOperations();
	}, []);
	const selectedLeadOperations = useMemo(() => leadOperations.find((item) => item.leadId === selectedLeadId) ?? null, [leadOperations, selectedLeadId]);
	const filteredLeadOperations = useMemo(() => {
		const normalizedQuery = query.toLowerCase().trim();
		if (!normalizedQuery) return leadOperations;
		return leadOperations.filter((item) => [
			leadText(item.lead),
			item.operationalStatus,
			item.priority,
			item.contactResult,
			item.internalNote
		].join(" ").toLowerCase().includes(normalizedQuery));
	}, [leadOperations, query]);
	const followUpCount = leadOperations.filter((item) => item.operationalStatus === "seguimiento").length;
	const highPriorityCount = leadOperations.filter((item) => item.priority === "alta").length;
	const contactedCount = leadOperations.filter((item) => item.operationalStatus === "contactado").length;
	const selectLead = (item) => {
		setSelectedLeadId(item.leadId);
		setForm(leadOperationsToForm(item));
		setError(null);
		setNotice(null);
	};
	const updateForm = (field, value) => {
		setForm((current) => ({
			...current,
			[field]: value
		}));
	};
	const saveLeadOperations = async () => {
		if (!selectedLeadOperations) return;
		const payload = getUpdatePayload$1(form, selectedLeadOperations);
		if (Object.keys(payload).length === 0) {
			setNotice("No hay cambios operativos por guardar.");
			return;
		}
		setSaving(true);
		setError(null);
		setNotice(null);
		try {
			const response = await fetch(`/api/leads/${encodeURIComponent(selectedLeadOperations.leadId)}/operations`, {
				method: "PATCH",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});
			const result = await response.json();
			if (!response.ok || !result.success || !result.leadOperations) throw new Error(result.error ?? "No se pudo actualizar la operación del lead.");
			setLeadOperations((current) => current.map((item) => item.leadId === result.leadOperations?.leadId ? result.leadOperations : item));
			setSelectedLeadId(result.leadOperations.leadId);
			setForm(leadOperationsToForm(result.leadOperations));
			setNotice("Seguimiento operativo actualizado con seguridad.");
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "No se pudo actualizar la operación del lead.");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ jsxDEV(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ jsxDEV(CardHeader, {
			className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
			children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Operación de leads" }, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 243,
				columnNumber: 11
			}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Seguimiento administrativo paralelo. No crea citas, no escribe Calendar, no envía Gmail y no modifica datos clínicos." }, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 244,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 242,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: () => void loadLeadOperations(),
				disabled: loading || saving,
				children: [/* @__PURE__ */ jsxDEV(RefreshCcw, { className: "mr-2 h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 249,
					columnNumber: 11
				}, this), "Actualizar leads"]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 248,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$5,
			lineNumber: 241,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV(CardContent, {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ jsxDEV("section", {
					className: "grid gap-3 md:grid-cols-3",
					children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: "En seguimiento"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 256,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-2 text-2xl font-bold text-deep",
								children: loading ? "..." : followUpCount
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 257,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 255,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: "Prioridad alta"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 260,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-2 text-2xl font-bold text-deep",
								children: loading ? "..." : highPriorityCount
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 261,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 259,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: "Contactados"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 264,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-2 text-2xl font-bold text-deep",
								children: loading ? "..." : contactedCount
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 265,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 263,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 254,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV(Alert, {
					className: "border-blue-200 bg-blue-50 text-blue-900",
					children: [
						/* @__PURE__ */ jsxDEV(ShieldAlert, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 270,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV(AlertTitle, { children: "Límite arquitectónico activo" }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 271,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV(AlertDescription, { children: "Esta sección solo registra seguimiento interno. La creación de citas permanece exclusivamente en BookingDialog." }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 272,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 269,
					columnNumber: 9
				}, this),
				error ? /* @__PURE__ */ jsxDEV(Alert, {
					variant: "destructive",
					children: [/* @__PURE__ */ jsxDEV(AlertTitle, { children: "No se pudo completar la operación" }, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 279,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV(AlertDescription, { children: error }, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 280,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 278,
					columnNumber: 11
				}, this) : null,
				notice ? /* @__PURE__ */ jsxDEV(Alert, {
					className: "border-emerald-200 bg-emerald-50 text-emerald-900",
					children: [/* @__PURE__ */ jsxDEV(AlertTitle, { children: "Operación actualizada" }, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 286,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV(AlertDescription, { children: notice }, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 287,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 285,
					columnNumber: 11
				}, this) : null,
				/* @__PURE__ */ jsxDEV("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsxDEV(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 292,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(Input, {
						className: "pl-9",
						placeholder: "Buscar lead, paciente, teléfono, correo, servicio o nota",
						value: query,
						onChange: (event) => setQuery(event.target.value)
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 293,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 291,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("section", {
					className: "grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]",
					children: [/* @__PURE__ */ jsxDEV("div", {
						className: "space-y-3",
						children: [
							loading ? /* @__PURE__ */ jsxDEV("div", {
								className: "rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground",
								children: "Cargando leads operativos..."
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 304,
								columnNumber: 15
							}, this) : null,
							!loading && filteredLeadOperations.length === 0 ? /* @__PURE__ */ jsxDEV("div", {
								className: "rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground",
								children: "No hay leads que coincidan con los filtros actuales."
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 310,
								columnNumber: 15
							}, this) : null,
							filteredLeadOperations.map((item) => /* @__PURE__ */ jsxDEV("button", {
								type: "button",
								onClick: () => selectLead(item),
								className: `w-full rounded-2xl border bg-background/70 p-4 text-left transition hover:border-primary/40 ${item.leadId === selectedLeadId ? "border-primary/50 ring-2 ring-primary/10" : "border-border"}`,
								children: [
									/* @__PURE__ */ jsxDEV("div", {
										className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
										children: [/* @__PURE__ */ jsxDEV("div", { children: [
											/* @__PURE__ */ jsxDEV("div", {
												className: "flex flex-wrap gap-2",
												children: [/* @__PURE__ */ jsxDEV(Badge, {
													variant: "outline",
													className: statusClass$4(item.operationalStatus),
													children: statusLabel$1(item.operationalStatus)
												}, void 0, false, {
													fileName: _jsxFileName$5,
													lineNumber: 327,
													columnNumber: 23
												}, this), /* @__PURE__ */ jsxDEV(Badge, {
													variant: "outline",
													className: priorityClass$1(item.priority),
													children: ["Prioridad ", priorityLabel(item.priority)]
												}, void 0, true, {
													fileName: _jsxFileName$5,
													lineNumber: 330,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$5,
												lineNumber: 326,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ jsxDEV("p", {
												className: "mt-3 font-semibold text-deep",
												children: item.lead.name || "Lead sin nombre"
											}, void 0, false, {
												fileName: _jsxFileName$5,
												lineNumber: 334,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ jsxDEV("p", {
												className: "text-sm text-muted-foreground",
												children: item.lead.treatment || "Servicio por definir"
											}, void 0, false, {
												fileName: _jsxFileName$5,
												lineNumber: 335,
												columnNumber: 21
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName$5,
											lineNumber: 325,
											columnNumber: 19
										}, this), /* @__PURE__ */ jsxDEV("div", {
											className: "text-sm text-muted-foreground md:text-right",
											children: [
												/* @__PURE__ */ jsxDEV("p", { children: item.lead.phone || "Teléfono no registrado" }, void 0, false, {
													fileName: _jsxFileName$5,
													lineNumber: 338,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ jsxDEV("p", { children: item.lead.email || "Correo no registrado" }, void 0, false, {
													fileName: _jsxFileName$5,
													lineNumber: 339,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ jsxDEV("p", {
													className: "mt-1 font-medium text-deep",
													children: item.leadId
												}, void 0, false, {
													fileName: _jsxFileName$5,
													lineNumber: 340,
													columnNumber: 21
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$5,
											lineNumber: 337,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 324,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", {
										className: "mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-2",
										children: [/* @__PURE__ */ jsxDEV("span", { children: ["Último contacto: ", formatLeadDate(item.lastContactAt)] }, void 0, true, {
											fileName: _jsxFileName$5,
											lineNumber: 344,
											columnNumber: 19
										}, this), /* @__PURE__ */ jsxDEV("span", { children: ["Próximo seguimiento: ", formatLeadDate(item.nextFollowUpAt)] }, void 0, true, {
											fileName: _jsxFileName$5,
											lineNumber: 345,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 343,
										columnNumber: 17
									}, this),
									item.internalNote ? /* @__PURE__ */ jsxDEV("p", {
										className: "mt-3 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-muted-foreground",
										children: item.internalNote
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 348,
										columnNumber: 19
									}, this) : null
								]
							}, item.leadId, true, {
								fileName: _jsxFileName$5,
								lineNumber: 316,
								columnNumber: 15
							}, this))
						]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 302,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV("aside", {
						className: "rounded-2xl border border-border bg-background/70 p-4",
						children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsxDEV("span", {
								className: "grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ jsxDEV(ClipboardList, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 359,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 358,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
								className: "font-semibold text-deep",
								children: "Detalle operativo"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 362,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "text-sm text-muted-foreground",
								children: "Solo seguimiento interno de leads."
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 363,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 361,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 357,
							columnNumber: 13
						}, this), !selectedLeadOperations ? /* @__PURE__ */ jsxDEV("div", {
							className: "mt-5 rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground",
							children: "Selecciona un lead para editar su seguimiento operativo."
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 368,
							columnNumber: 15
						}, this) : /* @__PURE__ */ jsxDEV("div", {
							className: "mt-5 space-y-4",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "rounded-2xl bg-white p-4 text-sm leading-6 text-muted-foreground",
									children: [
										/* @__PURE__ */ jsxDEV("p", {
											className: "font-semibold text-deep",
											children: selectedLeadOperations.lead.name
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 374,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("p", { children: selectedLeadOperations.lead.phone }, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 375,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("p", { children: selectedLeadOperations.lead.email }, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 376,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("p", {
											className: "mt-2",
											children: ["Interés: ", selectedLeadOperations.lead.treatment]
										}, void 0, true, {
											fileName: _jsxFileName$5,
											lineNumber: 377,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("p", { children: ["Estado de cita/CRM: ", selectedLeadOperations.lead.status] }, void 0, true, {
											fileName: _jsxFileName$5,
											lineNumber: 378,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 373,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "grid gap-3 md:grid-cols-2 xl:grid-cols-1",
									children: [/* @__PURE__ */ jsxDEV("label", {
										className: "space-y-2",
										children: [/* @__PURE__ */ jsxDEV(Label, {
											htmlFor: "lead-operational-status",
											children: "Estado operativo"
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 383,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("select", {
											id: "lead-operational-status",
											className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
											value: form.operationalStatus,
											onChange: (event) => updateForm("operationalStatus", event.target.value),
											disabled: saving,
											children: statusOptions.map((option) => /* @__PURE__ */ jsxDEV("option", {
												value: option.value,
												children: option.label
											}, option.value, false, {
												fileName: _jsxFileName$5,
												lineNumber: 392,
												columnNumber: 25
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 384,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 382,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("label", {
										className: "space-y-2",
										children: [/* @__PURE__ */ jsxDEV(Label, {
											htmlFor: "lead-priority",
											children: "Prioridad"
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 400,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("select", {
											id: "lead-priority",
											className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
											value: form.priority,
											onChange: (event) => updateForm("priority", event.target.value),
											disabled: saving,
											children: priorityOptions.map((option) => /* @__PURE__ */ jsxDEV("option", {
												value: option.value,
												children: option.label
											}, option.value, false, {
												fileName: _jsxFileName$5,
												lineNumber: 409,
												columnNumber: 25
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 401,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 399,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 381,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "grid gap-3 md:grid-cols-2 xl:grid-cols-1",
									children: [/* @__PURE__ */ jsxDEV("label", {
										className: "space-y-2",
										children: [/* @__PURE__ */ jsxDEV(Label, {
											htmlFor: "lead-last-contact",
											children: "Último contacto"
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 419,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV(Input, {
											id: "lead-last-contact",
											type: "date",
											value: dateInputValue(form.lastContactAt),
											onChange: (event) => updateForm("lastContactAt", event.target.value),
											disabled: saving
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 420,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 418,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("label", {
										className: "space-y-2",
										children: [/* @__PURE__ */ jsxDEV(Label, {
											htmlFor: "lead-next-follow-up",
											children: "Próximo seguimiento"
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 430,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV(Input, {
											id: "lead-next-follow-up",
											type: "date",
											value: dateInputValue(form.nextFollowUpAt),
											onChange: (event) => updateForm("nextFollowUpAt", event.target.value),
											disabled: saving
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 431,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 429,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 417,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("label", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsxDEV(Label, {
										htmlFor: "lead-contact-result",
										children: "Resultado de contacto"
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 442,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV(Input, {
										id: "lead-contact-result",
										value: form.contactResult,
										onChange: (event) => updateForm("contactResult", event.target.value),
										placeholder: "Ej. solicita llamada mañana, sin respuesta, interesado en orientación",
										disabled: saving
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 443,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 441,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("label", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsxDEV(Label, {
										htmlFor: "lead-internal-note",
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsxDEV(MessageSquareText, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 454,
											columnNumber: 21
										}, this), "Nota interna"]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 453,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV(Textarea, {
										id: "lead-internal-note",
										value: form.internalNote,
										onChange: (event) => updateForm("internalNote", event.target.value),
										placeholder: "Registrar contexto administrativo con claridad y respeto. No incluir diagnósticos ni notas clínicas.",
										disabled: saving,
										rows: 5
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 457,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 452,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV(Button, {
									type: "button",
									className: "w-full",
									onClick: () => void saveLeadOperations(),
									disabled: saving,
									children: [/* @__PURE__ */ jsxDEV(Save, { className: "mr-2 h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 468,
										columnNumber: 19
									}, this), saving ? "Guardando..." : "Guardar seguimiento operativo"]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 467,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 372,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 356,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 301,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$5,
			lineNumber: 253,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 240,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/assistant/PatientManagementWorkspace.tsx
var _jsxFileName$4 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/assistant/PatientManagementWorkspace.tsx";
var emptyForm = {
	displayName: "",
	firstName: "",
	lastName: "",
	phone: "",
	email: "",
	birthDate: "",
	address: "",
	emergencyContact: "",
	preferredContactMethod: ""
};
function profileToForm(profile) {
	if (!profile) return emptyForm;
	return {
		displayName: profile.displayName,
		firstName: profile.firstName,
		lastName: profile.lastName,
		phone: profile.phone,
		email: profile.email,
		birthDate: profile.birthDate,
		address: profile.address,
		emergencyContact: profile.emergencyContact,
		preferredContactMethod: profile.preferredContactMethod
	};
}
function statusLabel(status) {
	if (status === "verified") return "Verificado";
	if (status === "pending-verification") return "Pendiente de verificación";
	return "Incompleto";
}
function statusClass$3(status) {
	if (status === "verified") return "border-emerald-200 bg-emerald-50 text-emerald-700";
	if (status === "pending-verification") return "border-blue-200 bg-blue-50 text-blue-700";
	return "border-amber-200 bg-amber-50 text-amber-700";
}
function getUpdatePayload(form, original) {
	const originalForm = profileToForm(original);
	return Object.entries(form).reduce((payload, [key, value]) => {
		const normalizedValue = value.trim();
		if (normalizedValue !== originalForm[key].trim()) payload[key] = normalizedValue;
		return payload;
	}, {});
}
function PatientManagementWorkspace() {
	const [patients, setPatients] = useState([]);
	const [selectedPatientId, setSelectedPatientId] = useState(null);
	const [form, setForm] = useState(emptyForm);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [verifying, setVerifying] = useState(false);
	const [error, setError] = useState(null);
	const [notice, setNotice] = useState(null);
	const selectedPatient = useMemo(() => patients.find((patient) => patient.id === selectedPatientId) ?? patients[0] ?? null, [patients, selectedPatientId]);
	const filteredPatients = useMemo(() => {
		const normalizedQuery = query.toLowerCase().trim();
		if (!normalizedQuery) return patients;
		return patients.filter((patient) => [
			patient.displayName,
			patient.phone,
			patient.email,
			patient.treatmentInterest,
			patient.latestStatus,
			patient.source,
			patient.administrativeStatus,
			...patient.sourceLeadIds
		].join(" ").toLowerCase().includes(normalizedQuery));
	}, [patients, query]);
	const verifiedCount = patients.filter((patient) => patient.administrativeStatus === "verified").length;
	const pendingCount = patients.filter((patient) => patient.administrativeStatus === "pending-verification").length;
	const incompleteCount = patients.filter((patient) => patient.administrativeStatus === "incomplete").length;
	const loadPatients = async () => {
		setLoading(true);
		setError(null);
		setNotice(null);
		try {
			const response = await fetch("/api/patients/list", { credentials: "same-origin" });
			const payload = await response.json();
			if (!response.ok || !payload.success) throw new Error(payload.error ?? "No se pudieron cargar los perfiles administrativos.");
			const nextPatients = payload.patients ?? [];
			setPatients(nextPatients);
			const nextSelected = selectedPatientId ? nextPatients.find((patient) => patient.id === selectedPatientId) : nextPatients[0];
			setSelectedPatientId(nextSelected?.id ?? null);
			setForm(profileToForm(nextSelected ?? null));
		} catch (loadError) {
			setPatients([]);
			setSelectedPatientId(null);
			setForm(emptyForm);
			setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los perfiles administrativos.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadPatients();
	}, []);
	useEffect(() => {
		setForm(profileToForm(selectedPatient));
	}, [selectedPatient?.id]);
	const updateFormField = (field, value) => {
		setForm((current) => ({
			...current,
			[field]: value
		}));
	};
	const selectPatient = (patient) => {
		setSelectedPatientId(patient.id);
		setNotice(null);
		setError(null);
	};
	const saveAdministrativeProfile = async () => {
		if (!selectedPatient) return;
		const payload = getUpdatePayload(form, selectedPatient);
		if (Object.keys(payload).length === 0) {
			setNotice("No hay cambios administrativos por guardar.");
			return;
		}
		setSaving(true);
		setError(null);
		setNotice(null);
		try {
			const response = await fetch(`/api/patients/${encodeURIComponent(selectedPatient.id)}/admin-profile`, {
				method: "PATCH",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});
			const result = await response.json();
			if (!response.ok || !result.success || !result.patient) throw new Error(result.error ?? "No se pudo actualizar el perfil administrativo.");
			setPatients((current) => current.map((patient) => patient.id === result.patient?.id ? result.patient : patient));
			setSelectedPatientId(result.patient.id);
			setForm(profileToForm(result.patient));
			setNotice("Perfil administrativo actualizado con seguridad.");
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "No se pudo actualizar el perfil administrativo.");
		} finally {
			setSaving(false);
		}
	};
	const verifyAdministrativeProfile = async () => {
		if (!selectedPatient) return;
		setVerifying(true);
		setError(null);
		setNotice(null);
		try {
			const response = await fetch(`/api/patients/${encodeURIComponent(selectedPatient.id)}/verify-profile`, {
				method: "POST",
				credentials: "same-origin"
			});
			const result = await response.json();
			if (!response.ok || !result.success || !result.patient) throw new Error(result.error ?? "No se pudo verificar el perfil administrativo.");
			setPatients((current) => current.map((patient) => patient.id === result.patient?.id ? result.patient : patient));
			setSelectedPatientId(result.patient.id);
			setForm(profileToForm(result.patient));
			setNotice("Perfil verificado administrativamente.");
		} catch (verifyError) {
			setError(verifyError instanceof Error ? verifyError.message : "No se pudo verificar el perfil administrativo.");
		} finally {
			setVerifying(false);
		}
	};
	return /* @__PURE__ */ jsxDEV(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ jsxDEV(CardHeader, {
			className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
			children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Gestión administrativa de pacientes" }, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 244,
				columnNumber: 11
			}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Edición segura de datos administrativos. No incluye historia clínica, diagnóstico ni tratamientos médicos." }, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 245,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 243,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: () => void loadPatients(),
				disabled: loading || saving || verifying,
				children: [/* @__PURE__ */ jsxDEV(RefreshCcw, { className: "mr-2 h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 250,
					columnNumber: 11
				}, this), "Actualizar perfiles"]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 249,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 242,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV(CardContent, {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ jsxDEV("section", {
					className: "grid gap-3 md:grid-cols-3",
					children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: "Verificados"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 257,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-2 text-2xl font-bold text-deep",
								children: loading ? "..." : verifiedCount
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 258,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 256,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: "Pendientes"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 261,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-2 text-2xl font-bold text-deep",
								children: loading ? "..." : pendingCount
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 262,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 260,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [/* @__PURE__ */ jsxDEV("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: "Incompletos"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 265,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV("p", {
								className: "mt-2 text-2xl font-bold text-deep",
								children: loading ? "..." : incompleteCount
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 266,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 264,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 255,
					columnNumber: 9
				}, this),
				error ? /* @__PURE__ */ jsxDEV(Alert, {
					variant: "destructive",
					children: [
						/* @__PURE__ */ jsxDEV(ShieldAlert, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 272,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(AlertTitle, { children: "No se pudo completar la operación" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 273,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(AlertDescription, { children: error }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 274,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 271,
					columnNumber: 11
				}, this) : null,
				notice ? /* @__PURE__ */ jsxDEV(Alert, {
					className: "border-emerald-200 bg-emerald-50 text-emerald-900",
					children: [
						/* @__PURE__ */ jsxDEV(CheckCircle2, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 280,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(AlertTitle, { children: "Operación administrativa" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 281,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ jsxDEV(AlertDescription, { children: notice }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 282,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 279,
					columnNumber: 11
				}, this) : null,
				/* @__PURE__ */ jsxDEV("div", {
					className: "grid gap-5 xl:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]",
					children: [/* @__PURE__ */ jsxDEV("section", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxDEV("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsxDEV(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 289,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(Input, {
								className: "pl-9",
								placeholder: "Buscar por nombre, teléfono, correo o servicio",
								value: query,
								onChange: (event) => setQuery(event.target.value)
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 290,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 288,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV("div", {
							className: "max-h-[520px] space-y-3 overflow-auto pr-1",
							children: [
								loading ? /* @__PURE__ */ jsxDEV("div", {
									className: "rounded-2xl border border-dashed border-border bg-background/70 p-5 text-sm text-muted-foreground",
									children: "Cargando perfiles administrativos..."
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 300,
									columnNumber: 17
								}, this) : null,
								!loading && filteredPatients.length === 0 ? /* @__PURE__ */ jsxDEV("div", {
									className: "rounded-2xl border border-dashed border-border bg-background/70 p-5 text-sm text-muted-foreground",
									children: "No hay perfiles administrativos con los filtros actuales."
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 306,
									columnNumber: 17
								}, this) : null,
								filteredPatients.map((patient) => /* @__PURE__ */ jsxDEV("button", {
									type: "button",
									onClick: () => selectPatient(patient),
									className: `w-full rounded-2xl border p-4 text-left transition hover:border-primary/40 ${selectedPatient?.id === patient.id ? "border-primary/50 bg-primary/5" : "border-border bg-background/70"}`,
									children: [
										/* @__PURE__ */ jsxDEV("div", {
											className: "flex items-start justify-between gap-3",
											children: [/* @__PURE__ */ jsxDEV("div", { children: [
												/* @__PURE__ */ jsxDEV("p", {
													className: "font-semibold text-deep",
													children: patient.displayName
												}, void 0, false, {
													fileName: _jsxFileName$4,
													lineNumber: 322,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ jsxDEV("p", {
													className: "text-sm text-muted-foreground",
													children: patient.phone
												}, void 0, false, {
													fileName: _jsxFileName$4,
													lineNumber: 323,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ jsxDEV("p", {
													className: "text-sm text-muted-foreground",
													children: patient.email
												}, void 0, false, {
													fileName: _jsxFileName$4,
													lineNumber: 324,
													columnNumber: 23
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName$4,
												lineNumber: 321,
												columnNumber: 21
											}, this), /* @__PURE__ */ jsxDEV(Badge, {
												variant: "outline",
												className: statusClass$3(patient.administrativeStatus),
												children: statusLabel(patient.administrativeStatus)
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 326,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 320,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("p", {
											className: "mt-3 text-xs text-muted-foreground",
											children: ["Interés: ", patient.treatmentInterest]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 330,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: ["Folio(s): ", patient.sourceLeadIds.join(", ")]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 331,
											columnNumber: 19
										}, this)
									]
								}, patient.id, true, {
									fileName: _jsxFileName$4,
									lineNumber: 312,
									columnNumber: 17
								}, this))
							]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 298,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 287,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV("section", {
						className: "rounded-2xl border border-border bg-background/70 p-5",
						children: selectedPatient ? /* @__PURE__ */ jsxDEV("div", {
							className: "space-y-5",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
									children: [/* @__PURE__ */ jsxDEV("div", { children: [
										/* @__PURE__ */ jsxDEV("div", {
											className: "flex items-center gap-2 text-sm font-medium text-muted-foreground",
											children: [/* @__PURE__ */ jsxDEV(UserRound, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 343,
												columnNumber: 23
											}, this), "Perfil seleccionado"]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 342,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ jsxDEV("h3", {
											className: "mt-2 text-xl font-semibold text-deep",
											children: selectedPatient.displayName
										}, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 346,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ jsxDEV("p", {
											className: "text-sm text-muted-foreground",
											children: ["Origen: ", selectedPatient.source]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 347,
											columnNumber: 21
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName$4,
										lineNumber: 341,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV(Badge, {
										variant: "outline",
										className: statusClass$3(selectedPatient.administrativeStatus),
										children: statusLabel(selectedPatient.administrativeStatus)
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 349,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 340,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "grid gap-4 md:grid-cols-2",
									children: [
										/* @__PURE__ */ jsxDEV("label", {
											className: "space-y-2 text-sm font-medium text-deep",
											children: ["Nombre completo", /* @__PURE__ */ jsxDEV(Input, {
												value: form.displayName,
												onChange: (event) => updateFormField("displayName", event.target.value)
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 357,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 355,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("label", {
											className: "space-y-2 text-sm font-medium text-deep",
											children: ["Nombre(s)", /* @__PURE__ */ jsxDEV(Input, {
												value: form.firstName,
												onChange: (event) => updateFormField("firstName", event.target.value)
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 361,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 359,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("label", {
											className: "space-y-2 text-sm font-medium text-deep",
											children: ["Apellidos", /* @__PURE__ */ jsxDEV(Input, {
												value: form.lastName,
												onChange: (event) => updateFormField("lastName", event.target.value)
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 365,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 363,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("label", {
											className: "space-y-2 text-sm font-medium text-deep",
											children: ["Teléfono", /* @__PURE__ */ jsxDEV(Input, {
												value: form.phone,
												onChange: (event) => updateFormField("phone", event.target.value)
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 369,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 367,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("label", {
											className: "space-y-2 text-sm font-medium text-deep",
											children: ["Email", /* @__PURE__ */ jsxDEV(Input, {
												value: form.email,
												onChange: (event) => updateFormField("email", event.target.value)
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 373,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 371,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("label", {
											className: "space-y-2 text-sm font-medium text-deep",
											children: ["Fecha de nacimiento", /* @__PURE__ */ jsxDEV(Input, {
												value: form.birthDate,
												onChange: (event) => updateFormField("birthDate", event.target.value)
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 377,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 375,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("label", {
											className: "space-y-2 text-sm font-medium text-deep md:col-span-2",
											children: ["Dirección", /* @__PURE__ */ jsxDEV(Input, {
												value: form.address,
												onChange: (event) => updateFormField("address", event.target.value)
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 381,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 379,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("label", {
											className: "space-y-2 text-sm font-medium text-deep",
											children: ["Contacto de emergencia", /* @__PURE__ */ jsxDEV(Input, {
												value: form.emergencyContact,
												onChange: (event) => updateFormField("emergencyContact", event.target.value)
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 385,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 383,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV("label", {
											className: "space-y-2 text-sm font-medium text-deep",
											children: ["Método de contacto preferido", /* @__PURE__ */ jsxDEV(Input, {
												value: form.preferredContactMethod,
												onChange: (event) => updateFormField("preferredContactMethod", event.target.value)
											}, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 389,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 387,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 354,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "rounded-2xl border border-dashed border-border bg-white p-4 text-sm leading-6 text-muted-foreground",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "font-medium text-deep",
										children: "Límite de seguridad"
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 397,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("p", {
										className: "mt-1",
										children: "Esta sección solo guarda datos administrativos. Cualquier dato clínico debe permanecer fuera de este flujo y ser atendido en una fase clínica futura."
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 398,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 396,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex flex-col gap-3 md:flex-row md:justify-end",
									children: [
										/* @__PURE__ */ jsxDEV(Button, {
											type: "button",
											variant: "outline",
											onClick: () => setForm(profileToForm(selectedPatient)),
											disabled: saving || verifying,
											children: "Descartar cambios"
										}, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 405,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV(Button, {
											type: "button",
											variant: "outline",
											onClick: () => void verifyAdministrativeProfile(),
											disabled: saving || verifying,
											children: [/* @__PURE__ */ jsxDEV(ShieldCheck, { className: "mr-2 h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 409,
												columnNumber: 21
											}, this), verifying ? "Verificando..." : "Verificar perfil"]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 408,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ jsxDEV(Button, {
											type: "button",
											onClick: () => void saveAdministrativeProfile(),
											disabled: saving || verifying,
											children: [/* @__PURE__ */ jsxDEV(Save, { className: "mr-2 h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName$4,
												lineNumber: 413,
												columnNumber: 21
											}, this), saving ? "Guardando..." : "Guardar cambios"]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 412,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 404,
									columnNumber: 17
								}, this),
								selectedPatient.updatedAt ? /* @__PURE__ */ jsxDEV("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Última actualización administrativa: ",
										selectedPatient.updatedAt,
										selectedPatient.updatedBy ? ` por ${selectedPatient.updatedBy}` : "",
										"."
									]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 419,
									columnNumber: 19
								}, this) : null
							]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 339,
							columnNumber: 15
						}, this) : /* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground",
							children: /* @__PURE__ */ jsxDEV("div", {
								className: "flex items-center gap-2 font-medium text-deep",
								children: [/* @__PURE__ */ jsxDEV(FilePenLine, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 428,
									columnNumber: 19
								}, this), "Selecciona un perfil para gestionar sus datos administrativos."]
							}, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 427,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 426,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 337,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 286,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 254,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 241,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/assistant/OperationalConsolidationWorkspace.tsx
var _jsxFileName$3 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/assistant/OperationalConsolidationWorkspace.tsx";
function normalize(value) {
	return (value ?? "").toLowerCase().trim();
}
function patientMatchesLead(patient, leadOperations) {
	const lead = leadOperations.lead;
	return (patient.sourceLeadIds ?? []).includes(leadOperations.leadId) || !!patient.email && normalize(patient.email) === normalize(lead.email) || !!patient.phone && normalize(patient.phone) === normalize(lead.phone);
}
function formatDate$1(value) {
	if (!value) return "Sin seguimiento";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("es-PA", { dateStyle: "medium" }).format(date);
}
function operationalStatusLabel(status) {
	if (status === "contactado") return "Contactado";
	if (status === "seguimiento") return "Seguimiento";
	if (status === "descartado") return "Descartado";
	return "Nuevo";
}
function administrativeStatusLabel(status) {
	if (status === "verified") return "Verificado";
	if (status === "pending-verification") return "Pendiente de verificación";
	if (status === "incomplete") return "Incompleto";
	return "Sin perfil";
}
function statusClass$2(status) {
	if (status === "verified" || status === "contactado") return "border-emerald-200 bg-emerald-50 text-emerald-700";
	if (status === "pending-verification" || status === "seguimiento") return "border-blue-200 bg-blue-50 text-blue-700";
	if (status === "descartado") return "border-slate-200 bg-slate-50 text-slate-700";
	return "border-amber-200 bg-amber-50 text-amber-700";
}
function priorityClass(priority) {
	if (priority === "alta") return "border-red-200 bg-red-50 text-red-700";
	if (priority === "baja") return "border-slate-200 bg-slate-50 text-slate-700";
	return "border-primary/20 bg-primary/5 text-primary";
}
function buildConsolidatedRecords(leadOperations, patients) {
	return leadOperations.map((item) => {
		const patient = patients.find((profile) => patientMatchesLead(profile, item));
		const lead = item.lead;
		return {
			id: `${item.leadId}-${patient?.id ?? "sin-perfil"}`,
			displayName: patient?.displayName || lead.name || "Lead sin nombre",
			phone: patient?.phone || lead.phone || "Teléfono no registrado",
			email: patient?.email || lead.email || "Correo no registrado",
			treatmentInterest: patient?.treatmentInterest || lead.treatment || "Servicio por definir",
			operationalStatus: item.operationalStatus,
			priority: item.priority,
			administrativeStatus: patient?.administrativeStatus ?? "sin-perfil",
			completionPercentage: patient?.completionPercentage ?? 0,
			nextFollowUpAt: item.nextFollowUpAt,
			internalNote: item.internalNote,
			sourceLeadId: item.leadId
		};
	});
}
function OperationalConsolidationWorkspace() {
	const [leadOperations, setLeadOperations] = useState([]);
	const [patients, setPatients] = useState([]);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const loadConsolidatedData = async () => {
		setLoading(true);
		setError(null);
		try {
			const [leadOperationsResponse, patientsResponse] = await Promise.all([fetch("/api/leads/operations", { credentials: "same-origin" }), fetch("/api/patients/list", { credentials: "same-origin" })]);
			const [leadOperationsPayload, patientsPayload] = await Promise.all([leadOperationsResponse.json(), patientsResponse.json()]);
			if (!leadOperationsResponse.ok || !leadOperationsPayload.success) throw new Error(leadOperationsPayload.error ?? "No se pudo cargar la operación de leads.");
			if (!patientsResponse.ok || !patientsPayload.success) throw new Error(patientsPayload.error ?? "No se pudo cargar la gestión administrativa de pacientes.");
			setLeadOperations(leadOperationsPayload.leadOperations ?? []);
			setPatients(patientsPayload.patients ?? []);
		} catch (loadError) {
			setLeadOperations([]);
			setPatients([]);
			setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la consolidación operativa.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadConsolidatedData();
	}, []);
	const records = useMemo(() => buildConsolidatedRecords(leadOperations, patients), [leadOperations, patients]);
	const filteredRecords = useMemo(() => {
		const normalizedQuery = normalize(query);
		if (!normalizedQuery) return records;
		return records.filter((record) => [
			record.displayName,
			record.phone,
			record.email,
			record.treatmentInterest,
			record.operationalStatus,
			record.priority,
			record.administrativeStatus,
			record.sourceLeadId
		].join(" ").toLowerCase().includes(normalizedQuery));
	}, [records, query]);
	const pendingFollowUps = records.filter((record) => record.operationalStatus === "seguimiento").length;
	const highPriority = records.filter((record) => record.priority === "alta").length;
	const pendingVerification = records.filter((record) => record.administrativeStatus === "incomplete" || record.administrativeStatus === "pending-verification").length;
	return /* @__PURE__ */ jsxDEV(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ jsxDEV(CardHeader, {
			className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
			children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV(CardTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsxDEV(Layers3, { className: "h-5 w-5 text-primary" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 191,
					columnNumber: 13
				}, this), "Consolidación operativa"]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 190,
				columnNumber: 11
			}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Une leads, seguimiento y perfil administrativo sin crear citas ni exponer información clínica." }, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 194,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 189,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: () => void loadConsolidatedData(),
				disabled: loading,
				children: [/* @__PURE__ */ jsxDEV(RefreshCcw, { className: "mr-2 h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 199,
					columnNumber: 11
				}, this), "Actualizar"]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 198,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 188,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV(CardContent, {
			className: "space-y-5",
			children: [
				error ? /* @__PURE__ */ jsxDEV(Alert, {
					variant: "destructive",
					children: [/* @__PURE__ */ jsxDEV(AlertTitle, { children: "No se pudo cargar la consolidación" }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 207,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV(AlertDescription, { children: error }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 208,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 206,
					columnNumber: 11
				}, this) : null,
				/* @__PURE__ */ jsxDEV("section", {
					className: "grid gap-3 md:grid-cols-3",
					children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "text-sm font-medium text-muted-foreground",
										children: "Seguimientos"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 215,
										columnNumber: 15
									}, this), /* @__PURE__ */ jsxDEV(ClipboardCheck, { className: "h-4 w-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 216,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 214,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-2 text-2xl font-bold text-deep",
									children: loading ? "..." : pendingFollowUps
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 218,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "requieren acompañamiento administrativo."
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 219,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 213,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "text-sm font-medium text-muted-foreground",
										children: "Prioridad alta"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 224,
										columnNumber: 15
									}, this), /* @__PURE__ */ jsxDEV(AlertTriangle, { className: "h-4 w-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 225,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 223,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-2 text-2xl font-bold text-deep",
									children: loading ? "..." : highPriority
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 227,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "sin crear urgencia artificial ni presión comercial."
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 228,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 222,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "text-sm font-medium text-muted-foreground",
										children: "Perfiles por validar"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 233,
										columnNumber: 15
									}, this), /* @__PURE__ */ jsxDEV(ShieldCheck, { className: "h-4 w-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 234,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 232,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-2 text-2xl font-bold text-deep",
									children: loading ? "..." : pendingVerification
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 236,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "solo datos administrativos, no clínicos."
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 237,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 231,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 212,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsxDEV(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 242,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(Input, {
						className: "pl-9",
						placeholder: "Buscar por paciente, lead, teléfono, correo, servicio o estado",
						value: query,
						onChange: (event) => setQuery(event.target.value)
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 243,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 241,
					columnNumber: 9
				}, this),
				loading ? /* @__PURE__ */ jsxDEV("div", {
					className: "rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground",
					children: "Cargando vista consolidada..."
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 252,
					columnNumber: 11
				}, this) : null,
				!loading && filteredRecords.length === 0 ? /* @__PURE__ */ jsxDEV("div", {
					className: "rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground",
					children: "No hay registros consolidados para mostrar con los filtros actuales."
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 258,
					columnNumber: 11
				}, this) : null,
				/* @__PURE__ */ jsxDEV("div", {
					className: "space-y-3",
					children: filteredRecords.map((record) => /* @__PURE__ */ jsxDEV("article", {
						className: "rounded-2xl border border-border bg-background/70 p-4",
						children: [/* @__PURE__ */ jsxDEV("div", {
							className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
							children: [/* @__PURE__ */ jsxDEV("div", { children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ jsxDEV(Badge, {
											variant: "outline",
											className: statusClass$2(record.operationalStatus),
											children: operationalStatusLabel(record.operationalStatus)
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 269,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ jsxDEV(Badge, {
											variant: "outline",
											className: priorityClass(record.priority),
											children: ["Prioridad ", record.priority]
										}, void 0, true, {
											fileName: _jsxFileName$3,
											lineNumber: 272,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ jsxDEV(Badge, {
											variant: "outline",
											className: statusClass$2(record.administrativeStatus),
											children: administrativeStatusLabel(record.administrativeStatus)
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 275,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 268,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ jsxDEV("h3", {
									className: "mt-3 flex items-center gap-2 text-lg font-semibold text-deep",
									children: [/* @__PURE__ */ jsxDEV(UserRound, { className: "h-4 w-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 280,
										columnNumber: 21
									}, this), record.displayName]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 279,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "text-sm text-muted-foreground",
									children: record.treatmentInterest
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 283,
									columnNumber: 19
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 267,
								columnNumber: 17
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "text-sm text-muted-foreground lg:text-right",
								children: [
									/* @__PURE__ */ jsxDEV("p", { children: record.phone }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 286,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ jsxDEV("p", { children: record.email }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 287,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ jsxDEV("p", {
										className: "mt-1 font-medium text-deep",
										children: ["Lead: ", record.sourceLeadId]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 288,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 285,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 266,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("div", {
							className: "mt-4 grid gap-3 md:grid-cols-3",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "rounded-2xl bg-white px-4 py-3 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "font-medium text-deep",
										children: "Perfil administrativo"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 294,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("p", { children: [record.completionPercentage, "% completo"] }, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 295,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 293,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "rounded-2xl bg-white px-4 py-3 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "font-medium text-deep",
										children: "Próximo seguimiento"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 298,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("p", { children: formatDate$1(record.nextFollowUpAt) }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 299,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 297,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ jsxDEV("div", {
									className: "rounded-2xl bg-white px-4 py-3 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "font-medium text-deep",
										children: "Nota operativa"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 302,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("p", { children: record.internalNote || "Sin nota interna registrada" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 303,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 301,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 292,
							columnNumber: 15
						}, this)]
					}, record.id, true, {
						fileName: _jsxFileName$3,
						lineNumber: 265,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 263,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$3,
			lineNumber: 204,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 187,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/assistant/OperationalAnalyticsWorkspace.tsx
var _jsxFileName$2 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/assistant/OperationalAnalyticsWorkspace.tsx";
var emptyFilters = {
	from: "",
	to: "",
	status: "",
	priority: "",
	patientStatus: "",
	service: "",
	source: ""
};
var emptyReport = {
	generatedAt: "",
	scope: "administrative-operational",
	limits: [],
	totals: {
		totalLeads: 0,
		activeLeads: 0,
		contacted: 0,
		followUp: 0,
		discarded: 0,
		highPriority: 0,
		dueFollowUps: 0,
		scheduled: 0,
		totalPatients: 0,
		verifiedPatients: 0,
		pendingVerification: 0,
		incompletePatients: 0,
		averageCompletion: 0
	},
	rates: {
		contactRate: 0,
		schedulingRate: 0,
		activeRate: 0,
		verificationRate: 0
	},
	statusBuckets: [],
	serviceBuckets: [],
	recommendation: "La operación no muestra pendientes críticos administrativos en este momento.",
	filters: {},
	source: {
		leadOperations: 0,
		patientAdministrativeProfiles: 0
	}
};
function statusClass$1(label) {
	const normalized = label.toLowerCase().trim();
	if (normalized === "contactado" || normalized === "verified") return "border-emerald-200 bg-emerald-50 text-emerald-700";
	if (normalized === "seguimiento" || normalized === "pending-verification") return "border-blue-200 bg-blue-50 text-blue-700";
	if (normalized === "descartado") return "border-slate-200 bg-slate-50 text-slate-700";
	return "border-amber-200 bg-amber-50 text-amber-700";
}
function formatGeneratedAt(value) {
	if (!value) return "Pendiente de generación";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("es-PA", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(date);
}
function buildQueryString(filters, extra) {
	const params = new URLSearchParams();
	Object.entries(filters).forEach(([key, value]) => {
		const normalized = value.trim();
		if (normalized) params.set(key, normalized);
	});
	Object.entries(extra ?? {}).forEach(([key, value]) => {
		if (value) params.set(key, value);
	});
	const query = params.toString();
	return query ? `?${query}` : "";
}
function buildCsvReport(report) {
	return [
		["Métrica", "Valor"],
		["Generado", report.generatedAt],
		["Desde", report.filters.from ?? ""],
		["Hasta", report.filters.to ?? ""],
		["Estado operativo", report.filters.status ?? ""],
		["Prioridad", report.filters.priority ?? ""],
		["Estado administrativo paciente", report.filters.patientStatus ?? ""],
		["Servicio", report.filters.service ?? ""],
		["Fuente", report.filters.source ?? ""],
		["Leads activos", String(report.totals.activeLeads)],
		["Leads totales", String(report.totals.totalLeads)],
		["Tasa de contacto", `${report.rates.contactRate}%`],
		["Seguimientos vencidos", String(report.totals.dueFollowUps)],
		["Verificación administrativa", `${report.rates.verificationRate}%`],
		["Pacientes verificados", String(report.totals.verifiedPatients)],
		["Perfiles pendientes de verificación", String(report.totals.pendingVerification)],
		["Recomendación", report.recommendation]
	].map((row) => row.map((cell) => `"${cell.replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
}
function downloadTextFile(filename, content, type) {
	const blob = new Blob([content], { type });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(url);
}
function OperationalAnalyticsWorkspace() {
	const [report, setReport] = useState(emptyReport);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filters, setFilters] = useState(emptyFilters);
	const updateFilter = (key, value) => {
		setFilters((current) => ({
			...current,
			[key]: value
		}));
	};
	const loadAnalyticsData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(`/api/reports/operational${buildQueryString(filters)}`, { credentials: "same-origin" });
			const payload = await response.json();
			if (!response.ok || !payload.success || !payload.report) throw new Error(payload.error ?? "No se pudo cargar el reporte operativo.");
			setReport(payload.report);
		} catch (loadError) {
			setReport(emptyReport);
			setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los indicadores operativos.");
		} finally {
			setLoading(false);
		}
	}, [filters]);
	useEffect(() => {
		loadAnalyticsData();
	}, [loadAnalyticsData]);
	const exportCsv = () => {
		downloadTextFile("dentaloperix-reporte-operativo.csv", buildCsvReport(report), "text/csv;charset=utf-8");
	};
	const exportJson = () => {
		downloadTextFile("dentaloperix-reporte-operativo.json", `${JSON.stringify(report, null, 2)}\n`, "application/json;charset=utf-8");
	};
	const resetFilters = () => {
		setFilters(emptyFilters);
	};
	return /* @__PURE__ */ jsxDEV(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ jsxDEV(CardHeader, {
			className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
			children: [/* @__PURE__ */ jsxDEV("div", { children: [
				/* @__PURE__ */ jsxDEV("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Reporting operativo" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 217,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV(Badge, {
						variant: "outline",
						className: "border-primary/20 bg-primary/5 text-primary",
						children: "FASE 14.4-C"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 218,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 216,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV(CardDescription, { children: "Indicadores administrativos centralizados con filtros operativos y exportación endurecida. No incluye métricas clínicas ni financieras." }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 222,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ jsxDEV("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: ["Generado: ", formatGeneratedAt(report.generatedAt)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 226,
					columnNumber: 11
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 215,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ jsxDEV(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: exportCsv,
						disabled: loading || Boolean(error),
						children: [/* @__PURE__ */ jsxDEV(Download, { className: "mr-2 h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 238,
							columnNumber: 13
						}, this), "CSV"]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 231,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: exportJson,
						disabled: loading || Boolean(error),
						children: [/* @__PURE__ */ jsxDEV(FileText, { className: "mr-2 h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 248,
							columnNumber: 13
						}, this), "JSON"]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 241,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => void loadAnalyticsData(),
						disabled: loading,
						children: [/* @__PURE__ */ jsxDEV(RefreshCcw, { className: "mr-2 h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 258,
							columnNumber: 13
						}, this), "Actualizar"]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 251,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 230,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 214,
			columnNumber: 7
		}, this), /* @__PURE__ */ jsxDEV(CardContent, {
			className: "space-y-6",
			children: [
				error ? /* @__PURE__ */ jsxDEV(Alert, {
					variant: "destructive",
					children: [/* @__PURE__ */ jsxDEV(AlertTitle, { children: "No se pudieron cargar los indicadores" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 266,
						columnNumber: 13
					}, this), /* @__PURE__ */ jsxDEV(AlertDescription, { children: error }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 267,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 265,
					columnNumber: 11
				}, this) : null,
				/* @__PURE__ */ jsxDEV("section", {
					className: "rounded-2xl border border-border bg-background/70 p-4",
					children: [/* @__PURE__ */ jsxDEV("div", {
						className: "mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between",
						children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
							className: "font-semibold text-deep",
							children: "Filtros del reporte"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 274,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV("p", {
							className: "text-sm text-muted-foreground",
							children: "Aplican solo a información administrativa y operativa."
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 275,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 273,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ jsxDEV(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: resetFilters,
								disabled: loading,
								children: "Limpiar"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 280,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV(Button, {
								type: "button",
								size: "sm",
								onClick: () => void loadAnalyticsData(),
								disabled: loading,
								children: "Aplicar filtros"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 289,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 279,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 272,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV("div", {
						className: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
						children: [
							/* @__PURE__ */ jsxDEV("label", {
								className: "space-y-1 text-sm",
								children: [/* @__PURE__ */ jsxDEV("span", {
									className: "font-medium text-deep",
									children: "Desde"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 302,
									columnNumber: 15
								}, this), /* @__PURE__ */ jsxDEV("input", {
									className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
									type: "date",
									value: filters.from,
									onChange: (event) => updateFilter("from", event.target.value)
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 303,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 301,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("label", {
								className: "space-y-1 text-sm",
								children: [/* @__PURE__ */ jsxDEV("span", {
									className: "font-medium text-deep",
									children: "Hasta"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 311,
									columnNumber: 15
								}, this), /* @__PURE__ */ jsxDEV("input", {
									className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
									type: "date",
									value: filters.to,
									onChange: (event) => updateFilter("to", event.target.value)
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 312,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 310,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("label", {
								className: "space-y-1 text-sm",
								children: [/* @__PURE__ */ jsxDEV("span", {
									className: "font-medium text-deep",
									children: "Estado lead"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 320,
									columnNumber: 15
								}, this), /* @__PURE__ */ jsxDEV("select", {
									className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
									value: filters.status,
									onChange: (event) => updateFilter("status", event.target.value),
									children: [
										/* @__PURE__ */ jsxDEV("option", {
											value: "",
											children: "Todos"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 326,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("option", {
											value: "nuevo",
											children: "Nuevo"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 327,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("option", {
											value: "contactado",
											children: "Contactado"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 328,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("option", {
											value: "seguimiento",
											children: "Seguimiento"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 329,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("option", {
											value: "descartado",
											children: "Descartado"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 330,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 321,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 319,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("label", {
								className: "space-y-1 text-sm",
								children: [/* @__PURE__ */ jsxDEV("span", {
									className: "font-medium text-deep",
									children: "Prioridad"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 334,
									columnNumber: 15
								}, this), /* @__PURE__ */ jsxDEV("select", {
									className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
									value: filters.priority,
									onChange: (event) => updateFilter("priority", event.target.value),
									children: [
										/* @__PURE__ */ jsxDEV("option", {
											value: "",
											children: "Todas"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 340,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("option", {
											value: "baja",
											children: "Baja"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 341,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("option", {
											value: "normal",
											children: "Normal"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 342,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("option", {
											value: "alta",
											children: "Alta"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 343,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 335,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 333,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("label", {
								className: "space-y-1 text-sm",
								children: [/* @__PURE__ */ jsxDEV("span", {
									className: "font-medium text-deep",
									children: "Estado paciente"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 347,
									columnNumber: 15
								}, this), /* @__PURE__ */ jsxDEV("select", {
									className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
									value: filters.patientStatus,
									onChange: (event) => updateFilter("patientStatus", event.target.value),
									children: [
										/* @__PURE__ */ jsxDEV("option", {
											value: "",
											children: "Todos"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 353,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("option", {
											value: "incomplete",
											children: "Incompleto"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 354,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("option", {
											value: "pending-verification",
											children: "Pendiente verificación"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 355,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ jsxDEV("option", {
											value: "verified",
											children: "Verificado"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 356,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 348,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 346,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("label", {
								className: "space-y-1 text-sm",
								children: [/* @__PURE__ */ jsxDEV("span", {
									className: "font-medium text-deep",
									children: "Servicio"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 360,
									columnNumber: 15
								}, this), /* @__PURE__ */ jsxDEV("input", {
									className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
									value: filters.service,
									maxLength: 80,
									placeholder: "Ortodoncia",
									onChange: (event) => updateFilter("service", event.target.value)
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 361,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 359,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("label", {
								className: "space-y-1 text-sm",
								children: [/* @__PURE__ */ jsxDEV("span", {
									className: "font-medium text-deep",
									children: "Fuente"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 370,
									columnNumber: 15
								}, this), /* @__PURE__ */ jsxDEV("input", {
									className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
									value: filters.source,
									maxLength: 80,
									placeholder: "web",
									onChange: (event) => updateFilter("source", event.target.value)
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 371,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 369,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 300,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 271,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("section", {
					className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
					children: [
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "text-sm font-medium text-muted-foreground",
										children: "Leads activos"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 385,
										columnNumber: 15
									}, this), /* @__PURE__ */ jsxDEV(UsersRound, { className: "h-4 w-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 386,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 384,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-2 text-3xl font-bold text-deep",
									children: loading ? "..." : report.totals.activeLeads
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 388,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [report.rates.activeRate, "% de leads no descartados."]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 391,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 383,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "text-sm font-medium text-muted-foreground",
										children: "Tasa de contacto"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 398,
										columnNumber: 15
									}, this), /* @__PURE__ */ jsxDEV(TrendingUp, { className: "h-4 w-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 399,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 397,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-2 text-3xl font-bold text-deep",
									children: loading ? "..." : `${report.rates.contactRate}%`
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 401,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [report.totals.contacted, " lead(s) marcados como contactados."]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 404,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 396,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "text-sm font-medium text-muted-foreground",
										children: "Seguimientos vencidos"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 411,
										columnNumber: 15
									}, this), /* @__PURE__ */ jsxDEV(CalendarClock, { className: "h-4 w-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 412,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 410,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-2 text-3xl font-bold text-deep",
									children: loading ? "..." : report.totals.dueFollowUps
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 414,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "revisión amable, sin presión comercial."
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 417,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 409,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [
								/* @__PURE__ */ jsxDEV("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ jsxDEV("p", {
										className: "text-sm font-medium text-muted-foreground",
										children: "Verificación administrativa"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 424,
										columnNumber: 15
									}, this), /* @__PURE__ */ jsxDEV(ShieldCheck, { className: "h-4 w-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 427,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 423,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-2 text-3xl font-bold text-deep",
									children: loading ? "..." : `${report.rates.verificationRate}%`
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 429,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ jsxDEV("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [report.totals.verifiedPatients, " perfil(es) verificados."]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 432,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 422,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 382,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("section", {
					className: "grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]",
					children: [/* @__PURE__ */ jsxDEV("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [/* @__PURE__ */ jsxDEV("div", {
								className: "mb-4 flex items-center gap-3",
								children: [/* @__PURE__ */ jsxDEV("span", {
									className: "grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary",
									children: /* @__PURE__ */ jsxDEV(BarChart3, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 443,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 442,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
									className: "font-semibold text-deep",
									children: "Embudo operativo"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 446,
									columnNumber: 19
								}, this), /* @__PURE__ */ jsxDEV("p", {
									className: "text-sm text-muted-foreground",
									children: "Lectura administrativa, no financiera ni clínica."
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 447,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 445,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 441,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("div", {
										className: "mb-2 flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ jsxDEV("span", {
											className: "font-medium text-deep",
											children: "Leads con cita registrada"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 456,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("span", {
											className: "text-muted-foreground",
											children: [report.rates.schedulingRate, "%"]
										}, void 0, true, {
											fileName: _jsxFileName$2,
											lineNumber: 457,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 455,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV(Progress, { value: report.rates.schedulingRate }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 459,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 454,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("div", {
										className: "mb-2 flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ jsxDEV("span", {
											className: "font-medium text-deep",
											children: "Perfiles completos promedio"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 463,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("span", {
											className: "text-muted-foreground",
											children: [report.totals.averageCompletion, "%"]
										}, void 0, true, {
											fileName: _jsxFileName$2,
											lineNumber: 464,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 462,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV(Progress, { value: report.totals.averageCompletion }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 468,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 461,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("div", {
										className: "mb-2 flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ jsxDEV("span", {
											className: "font-medium text-deep",
											children: "Pacientes verificados"
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 472,
											columnNumber: 21
										}, this), /* @__PURE__ */ jsxDEV("span", {
											className: "text-muted-foreground",
											children: [report.rates.verificationRate, "%"]
										}, void 0, true, {
											fileName: _jsxFileName$2,
											lineNumber: 473,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 471,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV(Progress, { value: report.rates.verificationRate }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 475,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 470,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 453,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 440,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV("div", {
							className: "rounded-2xl border border-border bg-background/70 p-4",
							children: [/* @__PURE__ */ jsxDEV("p", {
								className: "font-semibold text-deep",
								children: "Distribución por estado operativo"
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 481,
								columnNumber: 15
							}, this), /* @__PURE__ */ jsxDEV("div", {
								className: "mt-4 space-y-3",
								children: report.statusBuckets.map((bucket) => /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("div", {
									className: "mb-2 flex items-center justify-between gap-3 text-sm",
									children: [/* @__PURE__ */ jsxDEV(Badge, {
										variant: "outline",
										className: statusClass$1(bucket.label),
										children: bucket.label
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 486,
										columnNumber: 23
									}, this), /* @__PURE__ */ jsxDEV("span", {
										className: "text-muted-foreground",
										children: [
											bucket.value,
											" · ",
											bucket.percentage,
											"%"
										]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 489,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 485,
									columnNumber: 21
								}, this), /* @__PURE__ */ jsxDEV(Progress, { value: bucket.percentage }, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 493,
									columnNumber: 21
								}, this)] }, bucket.label, true, {
									fileName: _jsxFileName$2,
									lineNumber: 484,
									columnNumber: 19
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 482,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 480,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 439,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV("aside", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxDEV("div", {
								className: "rounded-2xl border border-primary/20 bg-primary/5 p-4",
								children: /* @__PURE__ */ jsxDEV("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ jsxDEV(ClipboardCheck, { className: "mt-1 h-4 w-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 503,
										columnNumber: 17
									}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
										className: "font-semibold text-deep",
										children: "Lectura recomendada"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 505,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("p", {
										className: "mt-2 text-sm leading-6 text-muted-foreground",
										children: report.recommendation
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 506,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 504,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 502,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 501,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("div", {
								className: "rounded-2xl border border-border bg-background/70 p-4",
								children: [/* @__PURE__ */ jsxDEV("p", {
									className: "font-semibold text-deep",
									children: "Servicios con más actividad"
								}, void 0, false, {
									fileName: _jsxFileName$2,
									lineNumber: 514,
									columnNumber: 15
								}, this), /* @__PURE__ */ jsxDEV("div", {
									className: "mt-4 space-y-3",
									children: [report.serviceBuckets.length === 0 ? /* @__PURE__ */ jsxDEV("p", {
										className: "text-sm text-muted-foreground",
										children: "No hay actividad suficiente para mostrar distribución."
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 517,
										columnNumber: 19
									}, this) : null, report.serviceBuckets.map((bucket) => /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("div", {
										className: "mb-2 flex items-center justify-between gap-3 text-sm",
										children: [/* @__PURE__ */ jsxDEV("span", {
											className: "line-clamp-1 font-medium text-deep",
											children: bucket.label
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 524,
											columnNumber: 23
										}, this), /* @__PURE__ */ jsxDEV("span", {
											className: "text-muted-foreground",
											children: bucket.value
										}, void 0, false, {
											fileName: _jsxFileName$2,
											lineNumber: 525,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 523,
										columnNumber: 21
									}, this), /* @__PURE__ */ jsxDEV(Progress, { value: bucket.percentage }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 527,
										columnNumber: 21
									}, this)] }, bucket.key, true, {
										fileName: _jsxFileName$2,
										lineNumber: 522,
										columnNumber: 19
									}, this))]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 515,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$2,
								lineNumber: 513,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ jsxDEV("div", {
								className: "rounded-2xl border border-border bg-background/70 p-4",
								children: /* @__PURE__ */ jsxDEV("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ jsxDEV(AlertTriangle, { className: "mt-1 h-4 w-4 text-primary" }, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 535,
										columnNumber: 17
									}, this), /* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV("p", {
										className: "font-semibold text-deep",
										children: "Límites de la fase"
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 537,
										columnNumber: 19
									}, this), /* @__PURE__ */ jsxDEV("p", {
										className: "mt-2 text-sm leading-6 text-muted-foreground",
										children: "Esta vista no crea citas, no modifica Calendar, no envía Gmail y no usa datos clínicos."
									}, void 0, false, {
										fileName: _jsxFileName$2,
										lineNumber: 538,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$2,
										lineNumber: 536,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$2,
									lineNumber: 534,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$2,
								lineNumber: 533,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 500,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 438,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 263,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 213,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/components/assistant/AssistantDashboard.tsx
var _jsxFileName$1 = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/assistant/AssistantDashboard.tsx";
var emptyState = {
	appointments: [],
	patientProfiles: [],
	fallback: false,
	message: null
};
function formatDate(value) {
	if (!value) return "Fecha por coordinar";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("es-PA", { dateStyle: "medium" }).format(date);
}
function formatTime(value) {
	if (!value || /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return "Por definir";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "Por definir";
	return new Intl.DateTimeFormat("es-PA", {
		hour: "2-digit",
		minute: "2-digit"
	}).format(date);
}
function normalizeStatus(status) {
	const normalized = (status ?? "").toLowerCase().trim();
	if (normalized === "agendada") return "Agendada";
	if (normalized === "confirmada") return "Confirmada";
	if (normalized === "completada") return "Completada";
	if (normalized === "cancelada") return "Cancelada";
	if (normalized === "no asistió" || normalized === "no asistio") return "No asistió";
	return "Pendiente";
}
function mapLeadToAppointment(lead) {
	const rawDate = lead.preferredDate || lead.createdAt || "";
	const status = normalizeStatus(lead.status);
	const note = lead.notes || lead.message || lead.aiSummary || "Contacto operativo pendiente de seguimiento amable.";
	return {
		id: lead.id || "Sin folio",
		time: formatTime(rawDate),
		date: formatDate(rawDate),
		patient: lead.name || "Paciente sin nombre",
		treatment: lead.treatment || "Servicio por definir",
		phone: lead.phone || "Teléfono no registrado",
		email: lead.email || "Correo no registrado",
		status,
		source: lead.source || "Sin canal",
		note
	};
}
function statusClass(status) {
	if (status === "Agendada" || status === "Confirmada" || status === "Completada") return "bg-emerald-50 text-emerald-700";
	if (status === "Cancelada" || status === "No asistió") return "bg-red-50 text-red-700";
	return "bg-amber-50 text-amber-700";
}
function compareAppointments(a, b) {
	return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
}
function AssistantDashboard() {
	const [state, setState] = useState(emptyState);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [query, setQuery] = useState("");
	const loadAssistantData = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch("/api/leads/list", { credentials: "same-origin" });
			const payload = await response.json();
			if (!response.ok) throw new Error(payload.error ?? "No se pudo cargar la agenda operativa.");
			const leads = payload.leads ?? [];
			setState({
				appointments: leads.map(mapLeadToAppointment).sort(compareAppointments),
				patientProfiles: derivePatientAdministrativeProfiles(leads),
				fallback: Boolean(payload.fallback),
				message: payload.message ?? null
			});
		} catch (loadError) {
			setState(emptyState);
			setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la agenda operativa.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadAssistantData();
	}, []);
	const filteredAppointments = useMemo(() => {
		const normalizedQuery = query.toLowerCase().trim();
		if (!normalizedQuery) return state.appointments;
		return state.appointments.filter((appointment) => [
			appointment.patient,
			appointment.phone,
			appointment.email,
			appointment.treatment,
			appointment.status,
			appointment.id
		].join(" ").toLowerCase().includes(normalizedQuery));
	}, [query, state.appointments]);
	const filteredPatientProfiles = useMemo(() => {
		const normalizedQuery = query.toLowerCase().trim();
		if (!normalizedQuery) return state.patientProfiles;
		return state.patientProfiles.filter((profile) => [
			profile.displayName,
			profile.phone,
			profile.email,
			profile.treatmentInterest,
			profile.latestStatus,
			profile.source,
			...profile.sourceLeadIds
		].join(" ").toLowerCase().includes(normalizedQuery));
	}, [query, state.patientProfiles]);
	const incompleteProfiles = state.patientProfiles.filter((profile) => profile.missingFields.length > 0).length;
	const pending = state.appointments.filter((appointment) => appointment.status === "Pendiente").length;
	const scheduled = state.appointments.filter((appointment) => appointment.status === "Agendada" || appointment.status === "Confirmada").length;
	const inactive = state.appointments.filter((appointment) => appointment.status === "Cancelada" || appointment.status === "No asistió").length;
	const operationalTasks = [
		{
			title: "Confirmaciones",
			value: String(pending),
			description: "contactos requieren seguimiento amable antes de su cita.",
			icon: PhoneCall
		},
		{
			title: "Check-in",
			value: "Preparado",
			description: "acción visual reservada para una fase operativa posterior.",
			icon: LogIn
		},
		{
			title: "Check-out",
			value: "Preparado",
			description: "cierre operativo pendiente de implementación segura.",
			icon: LogOut
		}
	];
	return /* @__PURE__ */ jsxDEV("div", {
		className: "space-y-6",
		children: [
			state.fallback ? /* @__PURE__ */ jsxDEV(Alert, {
				className: "border-amber-200 bg-amber-50 text-amber-900",
				children: [/* @__PURE__ */ jsxDEV(AlertTitle, { children: "Datos demostrativos" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 227,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV(AlertDescription, { children: state.message ?? "No se pudo leer Google Sheets, por eso se muestran datos de demostración." }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 228,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 226,
				columnNumber: 9
			}, this) : null,
			error ? /* @__PURE__ */ jsxDEV(Alert, {
				variant: "destructive",
				children: [/* @__PURE__ */ jsxDEV(AlertTitle, { children: "No se pudo cargar la agenda" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 236,
					columnNumber: 11
				}, this), /* @__PURE__ */ jsxDEV(AlertDescription, { children: error }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 237,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 235,
				columnNumber: 9
			}, this) : null,
			/* @__PURE__ */ jsxDEV(OperationalNotificationsPanel, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 241,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(OperationalKpisPanel, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 242,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(OperationalDataQualityPanel, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 243,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("section", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ jsxDEV(Card, {
						className: "shadow-soft",
						children: [/* @__PURE__ */ jsxDEV(CardHeader, {
							className: "flex flex-row items-center justify-between space-y-0 pb-2",
							children: [/* @__PURE__ */ jsxDEV(CardTitle, {
								className: "text-sm font-medium text-muted-foreground",
								children: "Agenda operativa"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 248,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV(CalendarClock, { className: "h-4 w-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 249,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 247,
							columnNumber: 11
						}, this), /* @__PURE__ */ jsxDEV(CardContent, { children: [/* @__PURE__ */ jsxDEV("p", {
							className: "text-3xl font-bold text-deep",
							children: loading ? "..." : state.appointments.length
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 252,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Lectura de leads/citas sin métricas financieras."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 253,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 251,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 246,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ jsxDEV(Card, {
						className: "shadow-soft",
						children: [/* @__PURE__ */ jsxDEV(CardHeader, {
							className: "flex flex-row items-center justify-between space-y-0 pb-2",
							children: [/* @__PURE__ */ jsxDEV(CardTitle, {
								className: "text-sm font-medium text-muted-foreground",
								children: "Agendadas"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 259,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV(CheckCircle2, { className: "h-4 w-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 260,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 258,
							columnNumber: 11
						}, this), /* @__PURE__ */ jsxDEV(CardContent, { children: [/* @__PURE__ */ jsxDEV("p", {
							className: "text-3xl font-bold text-deep",
							children: loading ? "..." : scheduled
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 263,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [pending, " pendiente de confirmación o contacto."]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 264,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 262,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 257,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ jsxDEV(Card, {
						className: "shadow-soft",
						children: [/* @__PURE__ */ jsxDEV(CardHeader, {
							className: "flex flex-row items-center justify-between space-y-0 pb-2",
							children: [/* @__PURE__ */ jsxDEV(CardTitle, {
								className: "text-sm font-medium text-muted-foreground",
								children: "No activas"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 270,
								columnNumber: 13
							}, this), /* @__PURE__ */ jsxDEV(Clock3, { className: "h-4 w-4 text-primary" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 271,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 269,
							columnNumber: 11
						}, this), /* @__PURE__ */ jsxDEV(CardContent, { children: [/* @__PURE__ */ jsxDEV("p", {
							className: "text-3xl font-bold text-deep",
							children: loading ? "..." : inactive
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 274,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Canceladas o no asistidas para revisión operativa."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 275,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 273,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 268,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 245,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV("section", {
				className: "grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]",
				children: [/* @__PURE__ */ jsxDEV(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ jsxDEV(CardHeader, {
						className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
						children: [/* @__PURE__ */ jsxDEV("div", { children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Agenda y confirmaciones" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 284,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Vista de solo lectura para recepción, confirmaciones y acompañamiento del paciente." }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 285,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 283,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => void loadAssistantData(),
							disabled: loading,
							children: [/* @__PURE__ */ jsxDEV(RefreshCcw, { className: "mr-2 h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 290,
								columnNumber: 15
							}, this), "Actualizar"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 289,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 282,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(CardContent, {
						className: "space-y-4",
						children: [
							loading ? /* @__PURE__ */ jsxDEV("div", {
								className: "rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground",
								children: "Cargando agenda operativa..."
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 296,
								columnNumber: 15
							}, this) : null,
							!loading && filteredAppointments.length === 0 ? /* @__PURE__ */ jsxDEV("div", {
								className: "rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground",
								children: "No hay registros operativos para mostrar con los filtros actuales."
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 302,
								columnNumber: 15
							}, this) : null,
							filteredAppointments.map((appointment) => /* @__PURE__ */ jsxDEV("article", {
								className: "rounded-2xl border border-border bg-background/70 p-4 transition hover:border-primary/40",
								children: [
									/* @__PURE__ */ jsxDEV("div", {
										className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
										children: [/* @__PURE__ */ jsxDEV("div", { children: [
											/* @__PURE__ */ jsxDEV("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ jsxDEV("span", {
														className: "rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary",
														children: appointment.date
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 315,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ jsxDEV("span", {
														className: "rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground",
														children: appointment.time
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 318,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ jsxDEV(Badge, {
														className: statusClass(appointment.status),
														children: appointment.status
													}, void 0, false, {
														fileName: _jsxFileName$1,
														lineNumber: 321,
														columnNumber: 23
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 314,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ jsxDEV("h3", {
												className: "mt-3 text-lg font-semibold text-deep",
												children: appointment.patient
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 323,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ jsxDEV("p", {
												className: "text-sm text-muted-foreground",
												children: appointment.treatment
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 324,
												columnNumber: 21
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 313,
											columnNumber: 19
										}, this), /* @__PURE__ */ jsxDEV("div", {
											className: "text-sm text-muted-foreground md:text-right",
											children: [
												/* @__PURE__ */ jsxDEV("p", { children: appointment.phone }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 327,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ jsxDEV("p", { children: appointment.email }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 328,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ jsxDEV("p", {
													className: "mt-1 font-medium text-deep",
													children: appointment.id
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 329,
													columnNumber: 21
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 326,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 312,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("p", {
										className: "mt-3 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-muted-foreground",
										children: appointment.note
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 332,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ jsxDEV("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: ["Canal: ", appointment.source]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 335,
										columnNumber: 17
									}, this)
								]
							}, appointment.id, true, {
								fileName: _jsxFileName$1,
								lineNumber: 308,
								columnNumber: 15
							}, this))
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 294,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 281,
					columnNumber: 9
				}, this), /* @__PURE__ */ jsxDEV("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsxDEV(Card, {
						className: "shadow-soft",
						children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Operación" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 344,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Indicadores de lectura. Las acciones reales quedan para una fase posterior." }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 345,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 343,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardContent, {
							className: "space-y-3",
							children: operationalTasks.map((task) => {
								const Icon = task.icon;
								return /* @__PURE__ */ jsxDEV("div", {
									className: "rounded-2xl border border-border bg-background/70 p-4",
									children: [/* @__PURE__ */ jsxDEV("div", {
										className: "flex items-center justify-between gap-4",
										children: [/* @__PURE__ */ jsxDEV("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsxDEV("span", {
												className: "grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary",
												children: /* @__PURE__ */ jsxDEV(Icon, { className: "h-4 w-4" }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 355,
													columnNumber: 27
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 354,
												columnNumber: 25
											}, this), /* @__PURE__ */ jsxDEV("p", {
												className: "font-semibold text-deep",
												children: task.title
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 357,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 353,
											columnNumber: 23
										}, this), /* @__PURE__ */ jsxDEV("span", {
											className: "text-right text-xl font-bold text-deep",
											children: task.value
										}, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 359,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 352,
										columnNumber: 21
									}, this), /* @__PURE__ */ jsxDEV("p", {
										className: "mt-3 text-sm leading-6 text-muted-foreground",
										children: task.description
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 361,
										columnNumber: 21
									}, this)]
								}, task.title, true, {
									fileName: _jsxFileName$1,
									lineNumber: 351,
									columnNumber: 19
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 347,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 342,
						columnNumber: 11
					}, this), /* @__PURE__ */ jsxDEV(Card, {
						className: "shadow-soft",
						children: [/* @__PURE__ */ jsxDEV(CardHeader, { children: [/* @__PURE__ */ jsxDEV(CardTitle, { children: "Pacientes" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 370,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV(CardDescription, { children: "Búsqueda operativa sin historia clínica ni datos financieros." }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 371,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 369,
							columnNumber: 13
						}, this), /* @__PURE__ */ jsxDEV(CardContent, { children: [
							/* @__PURE__ */ jsxDEV("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsxDEV(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 375,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV(Input, {
									className: "pl-9",
									placeholder: "Buscar paciente, teléfono, correo o servicio",
									value: query,
									onChange: (event) => setQuery(event.target.value)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 376,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 374,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ jsxDEV("div", {
								className: "mt-4 rounded-2xl border border-dashed border-border bg-background/70 p-4 text-sm leading-6 text-muted-foreground",
								children: [/* @__PURE__ */ jsxDEV("div", {
									className: "flex items-center gap-3 font-medium text-deep",
									children: [
										/* @__PURE__ */ jsxDEV(UserRound, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName$1,
											lineNumber: 385,
											columnNumber: 19
										}, this),
										filteredPatientProfiles.length,
										" perfil(es) administrativo(s) visibles"
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 384,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV("p", {
									className: "mt-2",
									children: "Esta vista deriva de leads/citas existentes y no expone historia clínica, métricas financieras ni CRM estratégico."
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 388,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 383,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ jsxDEV("div", {
								className: "mt-4 space-y-3",
								children: filteredPatientProfiles.slice(0, 6).map((profile) => /* @__PURE__ */ jsxDEV("article", {
									className: "rounded-2xl border border-border bg-background/70 p-4",
									children: [
										/* @__PURE__ */ jsxDEV("div", {
											className: "flex items-start justify-between gap-3",
											children: [/* @__PURE__ */ jsxDEV("div", { children: [
												/* @__PURE__ */ jsxDEV("p", {
													className: "font-semibold text-deep",
													children: profile.displayName
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 399,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ jsxDEV("p", {
													className: "text-sm text-muted-foreground",
													children: profile.phone
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 400,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ jsxDEV("p", {
													className: "text-sm text-muted-foreground",
													children: profile.email
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 401,
													columnNumber: 25
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 398,
												columnNumber: 23
											}, this), /* @__PURE__ */ jsxDEV(Badge, {
												variant: "outline",
												className: profile.missingFields.length > 0 ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700",
												children: [profile.completionPercentage, "%"]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 403,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 397,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ jsxDEV("div", {
											className: "mt-3 flex items-center gap-2 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ jsxDEV(ShieldCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 415,
												columnNumber: 23
											}, this), profile.missingFields.length > 0 ? `Faltan: ${profile.missingFields.join(", ")}` : "Listo para validación administrativa"]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 414,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ jsxDEV("p", {
											className: "mt-2 text-xs text-muted-foreground",
											children: ["Interés: ", profile.treatmentInterest]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 420,
											columnNumber: 21
										}, this)
									]
								}, profile.id, true, {
									fileName: _jsxFileName$1,
									lineNumber: 396,
									columnNumber: 19
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 394,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ jsxDEV("div", {
								className: "mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground",
								children: [/* @__PURE__ */ jsxDEV("p", {
									className: "font-medium text-deep",
									children: "Validación de perfiles en preparación"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 426,
									columnNumber: 17
								}, this), /* @__PURE__ */ jsxDEV("p", {
									className: "mt-1",
									children: [incompleteProfiles, " perfil(es) requieren datos administrativos antes de habilitar edición segura en la siguiente etapa."]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 427,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 425,
								columnNumber: 15
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 373,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 368,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 341,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 280,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(OperationalAnalyticsWorkspace, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 437,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(OperationalConsolidationWorkspace, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 439,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(LeadOperationsWorkspace, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 441,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ jsxDEV(PatientManagementWorkspace, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 443,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 224,
		columnNumber: 5
	}, this);
}
//#endregion
//#region src/routes/assistant.tsx?tsr-split=component
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/assistant.tsx?tsr-split=component";
function AssistantPage() {
	return /* @__PURE__ */ jsxDEV(RoleRouteGuard, {
		allowedRoles: ["assistant"],
		checkingLabel: "Validando acceso operativo...",
		children: /* @__PURE__ */ jsxDEV(RoleWorkspaceLayout, {
			role: "assistant",
			title: "Asistente",
			children: /* @__PURE__ */ jsxDEV(AssistantDashboard, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 7,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 6,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 5,
		columnNumber: 10
	}, this);
}
//#endregion
export { AssistantPage as component };
