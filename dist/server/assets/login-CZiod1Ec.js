import { t as Button } from "./button-BLeLDVKM.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BATy6eNr.js";
import { n as Input, t as Label } from "./label-DBNUsIZD.js";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsxDEV } from "react/jsx-dev-runtime";
import { LockKeyhole } from "lucide-react";
//#region src/routes/admin/login.tsx?tsr-split=component
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/admin/login.tsx?tsr-split=component";
function AdminLoginPage() {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const onSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const response = await fetch("/api/admin/login", {
				method: "POST",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password })
			});
			const payload = await response.json().catch(() => ({}));
			if (!response.ok || payload.success === false) throw new Error(payload.error ?? "No se pudo iniciar sesión.");
			navigate({
				to: "/admin/dashboard",
				replace: true
			});
		} catch (loginError) {
			setError(loginError instanceof Error ? loginError.message : "Error de autenticación.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsxDEV("main", {
		className: "flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-10",
		children: /* @__PURE__ */ jsxDEV(Card, {
			className: "w-full max-w-md shadow-soft",
			children: [/* @__PURE__ */ jsxDEV(CardHeader, {
				className: "text-center",
				children: [
					/* @__PURE__ */ jsxDEV("span", {
						className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ jsxDEV(LockKeyhole, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 46,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 45,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV(CardTitle, {
						className: "mt-3 text-2xl",
						children: "Acceso administrativo"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 48,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ jsxDEV(CardDescription, { children: "Ingresa la contraseña privada de la clínica." }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 49,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 44,
				columnNumber: 9
			}, this), /* @__PURE__ */ jsxDEV(CardContent, { children: /* @__PURE__ */ jsxDEV("form", {
				className: "space-y-4",
				onSubmit,
				children: [
					/* @__PURE__ */ jsxDEV("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsxDEV(Label, {
							htmlFor: "admin-password",
							children: "Contraseña"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 54,
							columnNumber: 15
						}, this), /* @__PURE__ */ jsxDEV(Input, {
							id: "admin-password",
							type: "password",
							value: password,
							onChange: (event) => setPassword(event.target.value),
							autoComplete: "current-password",
							required: true
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 55,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 53,
						columnNumber: 13
					}, this),
					error ? /* @__PURE__ */ jsxDEV("p", {
						className: "rounded-xl bg-destructive/10 p-3 text-sm text-destructive",
						children: error
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 57,
						columnNumber: 22
					}, this) : null,
					/* @__PURE__ */ jsxDEV(Button, {
						type: "submit",
						className: "w-full",
						disabled: loading,
						children: loading ? "Validando..." : "Entrar"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 58,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 52,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 51,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 43,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 42,
		columnNumber: 10
	}, this);
}
//#endregion
export { AdminLoginPage as component };
