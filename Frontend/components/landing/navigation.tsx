"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { PracticeLink } from "@/components/landing/practice-link";
import { useAuthSession } from "@/hooks/use-auth-session";
import { getSupabaseClient } from "@/lib/supabase/client";

type NavigationLink = { name: string; href: string | null; disabled?: boolean };

const authenticatedNavLinks: NavigationLink[] = [
  { name: "Roadmaps", href: "/roadmaps" },
  { name: "AI Resume Analyzer", href: "/resume-analyzer" },
  { name: "Interview Practice", href: "/quiz" },
] as const;

const publicNavLinks: NavigationLink[] = [
  { name: "Features", href: "/#features" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Roadmaps", href: "/roadmaps" },
] as const;

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const navLinks = user ? authenticatedNavLinks : publicNavLinks;

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError("");
    try {
      const { error } = await getSupabaseClient().auth.signOut();
      if (error) throw error;
      setIsMobileMenuOpen(false);
      router.replace("/auth?mode=login");
    } catch (error) {
      console.error("Could not sign out:", error);
      setSignOutError("Could not sign out. Please try again.");
      setSigningOut(false);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveLink = (href: string | null) => {
    if (!href) return false;
    if (href.startsWith("/#")) return false;
    if (href === "/roadmaps") return pathname === "/roadmaps" || pathname.startsWith("/roadmaps/");
    return pathname === href;
  };

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "max-w-[1200px] rounded-2xl border border-foreground/10 bg-background/80 shadow-lg backdrop-blur-xl"
            : "max-w-[1400px] bg-transparent"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <span className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl"}`}>
              PrepAI
            </span>
            <span className={`mt-1 font-mono text-muted-foreground transition-all duration-500 ${isScrolled ? "text-[10px]" : "text-xs"}`}>
              AI
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);
              const href = link.name === "Roadmaps" && !user ? "/auth?mode=login" : link.href;

              if (link.disabled || !href) {
                return (
                  <button
                    key={link.name}
                    type="button"
                    aria-disabled="true"
                    className="relative cursor-not-allowed text-sm text-muted-foreground/80 transition-colors duration-300"
                    title="Coming soon"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-current/30" />
                  </button>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative text-sm transition-colors duration-300 ${
                    active ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle className={isScrolled ? "h-8 w-8" : "h-9 w-9"} />
            {!user && (
              <PracticeLink
                mode="login"
                className={`text-foreground/70 transition-all duration-500 hover:text-foreground ${isScrolled ? "text-xs" : "text-sm"}`}
              >
                Sign in
              </PracticeLink>
            )}
            <Button
              asChild={!user}
              size="sm"
              variant={user ? "outline" : "default"}
              disabled={user ? signingOut : undefined}
              onClick={user ? handleSignOut : undefined}
              className={`rounded-full transition-all duration-500 ${
                user
                  ? "px-4"
                  : `bg-foreground text-background hover:bg-foreground/90 ${isScrolled ? "h-8 px-4 text-xs" : "px-6"}`
              }`}
            >
              {user ? "Sign Out" : <PracticeLink>Start Practicing</PracticeLink>}
            </Button>
            {signOutError && <span className="text-xs text-destructive" role="status">{signOutError}</span>}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle className="h-9 w-9" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-background transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex h-full flex-col px-8 pb-8 pt-28">
          <div className="flex flex-1 flex-col justify-center gap-8">
            {navLinks.map((link, index) => {
              const active = isActiveLink(link.href);
              const href = link.name === "Roadmaps" && !user ? "/auth?mode=login" : link.href;

              if (link.disabled || !href) {
                return (
                  <button
                    key={link.name}
                    type="button"
                    className="text-left text-4xl font-display text-muted-foreground/80"
                    aria-disabled="true"
                    onClick={() => setIsMobileMenuOpen(false)}
                    title="Coming soon"
                  >
                    {link.name}
                  </button>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-4xl font-display transition-all duration-500 ${
                    active ? "text-foreground" : "text-foreground/75 hover:text-foreground"
                  }`}
                  style={{ transitionDelay: isMobileMenuOpen ? `${index * 75}ms` : "0ms" }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-foreground/10 py-6">
            <span className="font-mono text-sm text-muted-foreground">Appearance</span>
            <ThemeToggle showLabel className="h-10 w-auto px-3" />
          </div>

          <div className="flex gap-4 border-t border-foreground/10 pt-6">
            {!user && (
              <Button asChild variant="outline" className="h-14 flex-1 rounded-full text-base">
                <PracticeLink mode="login" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign in
                </PracticeLink>
              </Button>
            )}
            {user ? (
              <Button
                variant="outline"
                className="h-14 flex-1 rounded-full text-base"
                disabled={signingOut}
                onClick={handleSignOut}
              >
                {signingOut ? "Signing Out..." : "Sign Out"}
              </Button>
            ) : (
              <Button asChild className="h-14 flex-1 rounded-full bg-foreground text-base text-background">
                <PracticeLink onClick={() => setIsMobileMenuOpen(false)}>Start Practicing</PracticeLink>
              </Button>
            )}
          </div>
          {signOutError && <p className="pt-3 text-sm text-destructive" role="status">{signOutError}</p>}
        </div>
      </div>
    </header>
  );
}
