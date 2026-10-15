import { Navigation } from "@/components/landing/navigation";
import { fullStackRoadmapSections } from "@/components/roadmaps/roadmap-data";
import { RoadmapShell } from "@/components/roadmaps/roadmap-shell";

export default function FullStackDevelopmentRoadmapPage() {
  return (
    <>
      <Navigation />
      <RoadmapShell
        title="Full Stack Development"
        description="Build complete web applications by understanding the full product lifecycle: interface design, backend logic, data modeling, authentication, testing, and deployment. This roadmap helps you move from fundamentals to shipping real projects."
        sections={fullStackRoadmapSections}
      />
    </>
  );
}
