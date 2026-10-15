import { Navigation } from "@/components/landing/navigation";
import { gameDevelopmentRoadmapSections } from "@/components/roadmaps/roadmap-data";
import { RoadmapShell } from "@/components/roadmaps/roadmap-shell";

export default function GameDevelopmentRoadmapPage() {
  return (
    <>
      <Navigation />
      <RoadmapShell
        title="Game Development"
        description="Learn how to design playable systems, build game logic, and create interactive experiences through engines, math, physics, animation, and level design. This roadmap introduces the technical and creative foundations behind modern games."
        sections={gameDevelopmentRoadmapSections}
      />
    </>
  );
}
