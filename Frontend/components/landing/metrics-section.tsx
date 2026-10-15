"use client";

import { useEffect, useRef, useState } from "react";

const benefits = [
  {
    number: "01",
    title: "AI-Powered Practice",
    description: "Generate targeted questions and interactive quizzes tailored dynamically to your skill level and interview focus.",
  },
  {
    number: "02",
    title: "Multiple Technical Topics",
    description: "Comprehensive coverage across algorithms, web development, backend systems, database engineering, and system design.",
  },
  {
    number: "03",
    title: "Developer Learning Roadmaps",
    description: "Structured learning pathways detailing the skills, tools, and best practices required for modern engineering careers.",
  },
  {
    number: "04",
    title: "Flexible Interview Preparation",
    description: "Practice at your own pace with instant answer assessments, explanations, and continuous confidence tracking.",
  },
];

export function MetricsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Key Highlights
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Preparation built for
            <br />
            <span className="text-muted-foreground">interview readiness.</span>
          </h2>
        </div>
        
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10 dark:bg-border">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`bg-background dark:bg-card p-8 lg:p-12 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="font-mono text-sm text-muted-foreground mb-4">
                {benefit.number}
              </div>
              <h3 className="font-display text-2xl lg:text-3xl text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
