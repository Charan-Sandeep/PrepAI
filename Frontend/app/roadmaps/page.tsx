import Link from "next/link";
import { ArrowRight, Code2, Gamepad2 } from "lucide-react";

import { Navigation } from "@/components/landing/navigation";
import { roadmapCatalog } from "@/components/roadmaps/roadmap-data";

const roadmapCards = roadmapCatalog.map((roadmap) => ({
  ...roadmap,
  icon: roadmap.slug === "full-stack-development" ? Code2 : Gamepad2,
}));

export default function RoadmapsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <header className="pt-8 md:pt-12">
          <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            <span className="h-px w-8 bg-foreground/30" />
            Learning paths
          </span>

          <h1 className="mt-6 max-w-3xl font-display text-4xl tracking-tight text-foreground md:text-6xl">
            Choose Your Development Roadmap.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Explore structured learning paths that guide you from the fundamentals to building real-world projects. Learn the technologies, tools, and skills needed to progress in your development journey.
          </p>
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {roadmapCards.map(({ slug, title, summary, tags, icon: Icon }) => (
            <Link
              key={slug}
              href={`/roadmaps/${slug}`}
              className="group block rounded-[28px] border border-foreground/10 bg-card/60 p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:bg-card md:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-foreground/10 bg-background/80 text-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-foreground/10 bg-background/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="mt-6 font-display text-3xl tracking-tight text-foreground md:text-4xl">
                {title}
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">{summary}</p>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors duration-300 group-hover:bg-foreground/90">
                Explore Roadmap
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

