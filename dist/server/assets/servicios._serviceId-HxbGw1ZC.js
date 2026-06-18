import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/servicios.$serviceId.tsx
var $$splitComponentImporter = () => import("./servicios._serviceId-DjT5JIny.js");
var Route = createFileRoute("/servicios/$serviceId")({
	head: () => ({ meta: [{ title: "Detalle de servicio — DentalOperix" }, {
		name: "description",
		content: "Conoce el enfoque general del servicio dental y agenda una consulta para recibir orientación personalizada."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
