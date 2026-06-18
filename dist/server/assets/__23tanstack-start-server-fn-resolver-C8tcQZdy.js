//#region \0%23tanstack-start-server-fn-resolver
var manifest = { "e902254f03c951b9b3f90cb3c328e544d02b3f695eb8e1ffcd219cf02a0d3602": {
	functionName: "createDentalAppointment_createServerFn_handler",
	importer: () => import("./dental.functions-fNVEk68k.js")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
