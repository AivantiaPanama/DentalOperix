import { a as createServerFn, m as TSS_SERVER_FUNCTION } from "./esm-vQsjfqSA.js";
import { z } from "zod";
//#region node_modules/@tanstack/start-server-core/dist/esm/createServerRpc.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/lib/api/dental.functions.ts?tss-serverfn-split
var appointmentSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	phone: z.string().min(8).max(15),
	service: z.string().min(1),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	time: z.string().regex(/^\d{2}:\d{2}$/),
	notes: z.string().optional()
});
var createDentalAppointment_createServerFn_handler = createServerRpc({
	id: "e902254f03c951b9b3f90cb3c328e544d02b3f695eb8e1ffcd219cf02a0d3602",
	name: "createDentalAppointment",
	filename: "src/lib/api/dental.functions.ts"
}, (opts) => createDentalAppointment.__executeServer(opts));
var createDentalAppointment = createServerFn({ method: "POST" }).validator(appointmentSchema).handler(createDentalAppointment_createServerFn_handler, async ({ data }) => {
	const { processDentalLead } = await import("../server.js").then((n) => n.c);
	return processDentalLead({
		...data,
		appointmentId: `dental_${Date.now()}`,
		source: "web-form"
	});
});
//#endregion
export { createDentalAppointment_createServerFn_handler };
