import { siteServices } from "@/data/siteServices";

export const careJourneyStories = siteServices.map(({ id, slug, title, message, image, alt }) => ({
  id,
  slug,
  title,
  message,
  image,
  alt,
}));
