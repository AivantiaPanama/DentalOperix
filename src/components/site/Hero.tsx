
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { careJourneyStories } from "@/data/careJourneyStories";
import { cn } from "@/lib/utils";

const STORY_ROTATION_MS = 7000;

export function Hero({
  onBook,
  onServiceInfo,
}: {
  onBook: () => void;
  onServiceInfo?: (serviceIdOrSlug: string) => void;
}) {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const activeStory = careJourneyStories[activeStoryIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStoryIndex((currentIndex) =>
        currentIndex === careJourneyStories.length - 1 ? 0 : currentIndex + 1,
      );
    }, STORY_ROTATION_MS);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[88vh] min-h-[700px] overflow-hidden">
      {careJourneyStories.map((story, index) => (
        <img
          key={story.title}
          src={story.image}
          alt={story.alt}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            index === activeStoryIndex ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/20" />
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="max-w-3xl text-white">
            <div aria-hidden="true" className="h-40 md:h-44" />

            <div>
              <a
                href={`/servicios/${activeStory.slug}`}
                className="inline-block rounded-2xl text-4xl font-bold leading-tight text-white underline-offset-8 transition-colors hover:text-white/85 hover:underline md:text-5xl"
                onClick={(event) => {
                  if (!onServiceInfo) return;
                  event.preventDefault();
                  onServiceInfo(activeStory.id);
                }}
              >
                {activeStory.title}
              </a>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
                “{activeStory.message}”
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {careJourneyStories.map((story, index) => (
                <button
                  key={story.title}
                  type="button"
                  onClick={() => setActiveStoryIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === activeStoryIndex ? "w-8 bg-white" : "w-2 bg-white/40",
                  )}
                />
              ))}
            </div>

            <div className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={onBook} size="lg" className="rounded-full px-8">
                  Agendar consulta <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/40 bg-white/10 px-8 text-white backdrop-blur hover:bg-white/20 hover:text-white"
                >
                  <a
                    href={`/servicios/${activeStory.slug}`}
                    onClick={(event) => {
                      if (!onServiceInfo) return;
                      event.preventDefault();
                      onServiceInfo(activeStory.id);
                    }}
                  >
                    Ver servicio
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
