"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const toggleTheme = () => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("theme-transition");
      setTheme(isDark ? "light" : "dark");
      window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 350);
    } else {
      setTheme(isDark ? "light" : "dark");
    }
  };

  const label = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";

  if (!mounted) {
    return (
      <button
        type="button"
        className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-foreground/15 text-foreground/40 transition-colors ${className}`}
        aria-label="Toggle theme"
        disabled
      >
        <div className="w-4 h-4 rounded-full border border-foreground/20 border-dashed" />
      </button>
    );
  }

  const toggleButton = (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-foreground/15 hover:border-foreground/40 hover:bg-foreground/5 active:scale-95 transition-all duration-300 text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer ${className}`}
      aria-label={label}
      title={label}
    >
      <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
        {/* Sun Icon for Light Mode */}
        <Sun
          className={`w-4 h-4 transition-all duration-300 transform ${
            isDark
              ? "rotate-90 scale-0 opacity-0 -translate-y-2 pointer-events-none"
              : "rotate-0 scale-100 opacity-100 translate-y-0"
          }`}
          aria-hidden="true"
        />
        {/* Moon Icon for Dark Mode */}
        <Moon
          className={`w-4 h-4 absolute transition-all duration-300 transform ${
            isDark
              ? "rotate-0 scale-100 opacity-100 translate-y-0"
              : "-rotate-90 scale-0 opacity-0 translate-y-2 pointer-events-none"
          }`}
          aria-hidden="true"
        />
      </div>
      {showLabel && (
        <span className="ml-2 font-mono text-xs">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        {toggleButton}
      </TooltipTrigger>
      <TooltipContent side="bottom" align="center" className="text-xs font-sans">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
