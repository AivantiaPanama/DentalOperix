import { t as RoleRouteGuard } from "./RoleRouteGuard-CK45NeIZ.js";
import { jsxDEV } from "react/jsx-dev-runtime";
//#region src/components/admin/AdminRouteGuard.tsx
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/components/admin/AdminRouteGuard.tsx";
function AdminRouteGuard({ children }) {
	return /* @__PURE__ */ jsxDEV(RoleRouteGuard, {
		allowedRoles: ["admin"],
		checkingLabel: "Validando acceso administrativo...",
		children
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 6,
		columnNumber: 5
	}, this);
}
//#endregion
export { AdminRouteGuard as t };
