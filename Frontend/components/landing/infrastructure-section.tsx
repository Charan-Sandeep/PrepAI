"use client";

import { useEffect, useState, useRef } from "react";

const modules = [
  { topic: "Data Structures & Algorithms", detail: "Arrays, Trees, Graphs & Dynamic Programming", status: "Core" },
  { topic: "Frontend Architecture", detail: "React, Next.js, Web APIs & State Patterns", status: "Popular" },
  { topic: "Backend Engineering", detail: "APIs, Databases, Caching & Microservices", status: "High Impact" },
  { topic: "System Design", detail: "Scalability, Message Queues & Distributed Systems", status: "Advanced" },
  { topic: "Python Development", detail: "OOP, FastAPI, Django & Data Concepts", status: "In Demand" },
  { topic: "Java & Enterprise Patterns", detail: "Concurrency, Spring Boot & Design Patterns", status: "Enterprise" },
];

export function InfrastructureSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeModule, setActiveModule] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModule((prev) => (prev + 1) % modules.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Platform Overview
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              Built for Your
              <br />
              <span className="text-muted-foreground">Next Opportunity.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              PrepAI brings interview practice, AI-powered question generation, and developer learning resources together to help you prepare more effectively for technical interviews.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">100+</div>
                <div className="text-sm text-muted-foreground">Technical topics</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">10k+</div>
                <div className="text-sm text-muted-foreground">Questions generated</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Interview readiness</div>
              </div>
            </div>
          </div>

          {/* Right: Module list */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10 dark:border-border dark:bg-card">
              {/* Header */}
              <div className="px-6 py-4 border-b border-foreground/10 dark:border-border flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">Curated Modules</span>
                <span className="flex items-center gap-2 text-xs font-mono text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Ready to practice
                </span>
              </div>

              {/* Modules */}
              <div>
                {modules.map((item, index) => (
                  <div
                    key={item.topic}
                    className={`px-6 py-5 border-b border-foreground/5 last:border-b-0 flex items-center justify-between transition-all duration-300 ${
                      activeModule === index ? "bg-foreground/[0.02] dark:bg-accent/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span 
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          activeModule === index ? "bg-foreground" : "bg-foreground/20"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{item.topic}</div>
                        <div className="text-sm text-muted-foreground">{item.detail}</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground uppercase">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
