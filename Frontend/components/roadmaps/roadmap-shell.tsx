"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RoadmapSection } from "@/components/roadmaps/roadmap-data";

type RoadmapShellProps = {
  title: string;
  description: string;
  sections: RoadmapSection[];
};

export function RoadmapShell({ title, description, sections }: RoadmapShellProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "overview");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -60% 0px",
        threshold: [0.15, 0.45, 0.7],
      },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(sectionId);
    }
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-5 rounded-[28px] border border-foreground/10 bg-card/60 p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Learning path
            </span>
            <Link
              href="/roadmaps"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all roadmaps
            </Link>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <h1 className="font-display text-4xl tracking-tight text-foreground md:text-5xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                {description}
              </p>
            </div>

            <div className="flex items-center justify-end lg:justify-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-foreground/10 bg-background/60 px-4"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
                Sections
              </Button>
            </div>
          </div>
        </header>

        <div className="flex gap-8">
          <aside
            className={cn(
              "hidden lg:block transition-all duration-300 ease-out",
              isSidebarCollapsed ? "w-[70px]" : "w-[280px]",
            )}
          >
            <div className="sticky top-24">
              <div className="rounded-[24px] border border-foreground/10 bg-card/70 p-2 shadow-sm backdrop-blur-sm">
                <div className="mb-2 flex items-center justify-between gap-2 rounded-full border border-foreground/10 bg-background/70 p-2">
                  <span className={cn("text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground", isSidebarCollapsed && "hidden")}>
                    Roadmap
                  </span>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 bg-background text-foreground transition-colors hover:border-foreground/25 hover:bg-accent"
                    onClick={() => setSidebarCollapsed((value) => !value)}
                    aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                  </button>
                </div>

                {!isSidebarCollapsed && (
                  <nav className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1" aria-label={`${title} sections`}>
                    <ul className="space-y-1">
                      {sections.map((section) => (
                        <li key={section.id}>
                          <button
                            type="button"
                            onClick={() => scrollToSection(section.id)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
                              activeId === section.id
                                ? "bg-foreground text-background shadow-sm"
                                : "text-foreground/75 hover:bg-accent hover:text-foreground",
                            )}
                            aria-current={activeId === section.id ? "true" : undefined}
                          >
                            <span>{section.label}</span>
                            <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", activeId === section.id ? "translate-x-0" : "opacity-70")} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </aside>

          <main className={cn("min-w-0 flex-1 space-y-6 transition-all duration-300", isSidebarCollapsed && "lg:pl-0")}>
            {sections.map((section, index) => (
              <section
                id={section.id}
                key={section.id}
                className="scroll-mt-28 rounded-[28px] border border-foreground/10 bg-card/60 p-6 shadow-sm md:p-8"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-foreground/10 bg-background text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    {section.label}
                  </span>
                </div>

                <h2 className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
                  {section.title}
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{section.intro}</p>

                {section.prerequisites && section.prerequisites.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-foreground/10 bg-background/70 p-5">
                    <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-foreground/80">
                      Prerequisites
                    </h3>
                    <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                      {section.prerequisites.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-foreground/60" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.concepts && section.concepts.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-foreground/80">
                      Key concepts
                    </h3>
                    <ul className="grid gap-3 md:grid-cols-2">
                      {section.concepts.map((item) => (
                        <li
                          key={item}
                          className="rounded-2xl border border-foreground/10 bg-background/70 px-4 py-3 text-sm leading-6 text-muted-foreground"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.exercises && section.exercises.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-dashed border-foreground/15 bg-background/50 p-5">
                    <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-foreground/80">
                      Practical exercises
                    </h3>
                    <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                      {section.exercises.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-foreground/60" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.projects && section.projects.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-foreground/10 bg-background/70 p-5">
                    <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-foreground/80">
                      Suggested mini-projects
                    </h3>
                    <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                      {section.projects.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-foreground/60" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </main>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isMobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="absolute right-4 top-4 z-10">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-background text-foreground"
            aria-label="Close section navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[86%] max-w-[320px] border-r border-foreground/10 bg-card p-4 transition-transform duration-300",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-5 mt-5 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Sections</span>
          </div>

          <nav aria-label={`${title} mobile sections`} className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-200",
                  activeId === section.id ? "bg-foreground text-background" : "text-foreground/75 hover:bg-accent hover:text-foreground",
                )}
              >
                <span>{section.label}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
