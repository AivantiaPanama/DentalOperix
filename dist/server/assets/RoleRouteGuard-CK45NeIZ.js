import { p as isRoleAllowed } from "../server.js";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
//#region src/components/admin/RoleRouteGuard.tsx
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/RoleRouteGuard.tsx";
function AccessDenied({ allowedRoles }) {
	return /* @__PURE__ */ jsxDEV("main", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxDEV("section", {
			className: "max-w-lg rounded-3xl border border-border bg-white p-8 text-center shadow-soft",
			children: [
				/* @__PURE__ */ jsxDEV("p", {
					className: "text-sm uppercase tracking-[0.2em] text-muted-foreground",
					children: "Acceso restringido"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 15,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("h1", {
					className: "mt-3 text-3xl font-bold tracking-tight text-deep",
					children: "No tienes permiso para ver esta área"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 16,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("p", {
					className: "mt-4 text-sm leading-6 text-muted-foreground",
					children: [
						"Esta sección está disponible únicamente para los roles autorizados: ",
						allowedRoles.join(", "),
						"."
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 17,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ jsxDEV("a", {
					href: "/",
					className: "mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90",
					children: "Volver al inicio"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 20,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 14,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 13,
		columnNumber: 5
	}, this);
}
function RoleRouteGuard({ allowedRoles, children, checkingLabel = "Validando acceso..." }) {
	const navigate = useNavigate();
	const allowedRoleKey = allowedRoles.join("|");
	const [authorized, setAuthorized] = useState(false);
	const [forbidden, setForbidden] = useState(false);
	const [checking, setChecking] = useState(true);
	useEffect(() => {
		let mounted = true;
		fetch("/api/admin/session", { credentials: "same-origin" }).then(async (response) => {
			if (!mounted) return;
			if (response.status === 401) {
				navigate({
					to: "/admin/login",
					replace: true
				});
				return;
			}
			const payload = await response.json().catch(() => ({}));
			if (response.ok && payload.authenticated && payload.role && isRoleAllowed(payload.role, allowedRoleKey.split("|"))) {
				setAuthorized(true);
				return;
			}
			setForbidden(true);
		}).catch(() => {
			if (mounted) navigate({
				to: "/admin/login",
				replace: true
			});
		}).finally(() => {
			if (mounted) setChecking(false);
		});
		return () => {
			mounted = false;
		};
	}, [allowedRoleKey, navigate]);
	if (checking) return /* @__PURE__ */ jsxDEV("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4 text-sm text-muted-foreground",
		children: checkingLabel
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 89,
		columnNumber: 7
	}, this);
	if (forbidden) return /* @__PURE__ */ jsxDEV(AccessDenied, { allowedRoles }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 96,
		columnNumber: 12
	}, this);
	return authorized ? /* @__PURE__ */ jsxDEV(Fragment, { children }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 99,
		columnNumber: 23
	}, this) : null;
}
//#endregion
export { RoleRouteGuard as t };
