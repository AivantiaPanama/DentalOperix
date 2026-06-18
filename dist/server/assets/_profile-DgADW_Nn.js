import { s as getUserPortalByPublicSlug } from "./dialog-DrreS9S0.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/portal/$profile.tsx
var $$splitComponentImporter = () => import("./_profile-D7YFwtf5.js");
var Route = createFileRoute("/portal/$profile")({
	head: ({ params }) => {
		const portal = getUserPortalByPublicSlug(params.profile);
		return { meta: [
			{ title: portal ? `${portal.title} — DentalOperix` : "Portal — DentalOperix" },
			{
				name: "description",
				content: "Referencias de acceso por perfil para pacientes, doctores, asistentes y administración DentalOperix."
			},
			{
				name: "robots",
				content: "noindex,nofollow"
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
