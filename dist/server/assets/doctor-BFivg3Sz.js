import { t as RoleRouteGuard } from "./RoleRouteGuard-CK45NeIZ.js";
import { t as RoleDashboardShell } from "./RoleDashboardShell-CWFQuo-W.js";
import { jsxDEV } from "react/jsx-dev-runtime";
//#region src/routes/doctor.tsx?tsr-split=component
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/doctor.tsx?tsr-split=component";
function DoctorPage() {
	return /* @__PURE__ */ jsxDEV(RoleRouteGuard, {
		allowedRoles: ["doctor"],
		checkingLabel: "Validando acceso clínico...",
		children: /* @__PURE__ */ jsxDEV(RoleDashboardShell, { role: "doctor" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 5,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 4,
		columnNumber: 10
	}, this);
}
//#endregion
export { DoctorPage as component };
