import { t as RoleRouteGuard } from "./RoleRouteGuard-CK45NeIZ.js";
import { t as RoleDashboardShell } from "./RoleDashboardShell-CWFQuo-W.js";
import { jsxDEV } from "react/jsx-dev-runtime";
//#region src/routes/patient.tsx?tsr-split=component
var _jsxFileName = "C:/AIVANTIA/ClinicaDental/expert-dental-hub/src/routes/patient.tsx?tsr-split=component";
function PatientPage() {
	return /* @__PURE__ */ jsxDEV(RoleRouteGuard, {
		allowedRoles: ["patient"],
		checkingLabel: "Validando acceso del paciente...",
		children: /* @__PURE__ */ jsxDEV(RoleDashboardShell, { role: "patient" }, void 0, false, {
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
export { PatientPage as component };
