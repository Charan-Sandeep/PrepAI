"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { getSupabaseClient } from "@/lib/supabase/client"
import styles from "@/app/auth/auth.module.css"

type AuthMode = "login" | "signup"
type MessageKind = "error" | "success" | null

function classifyMessage(text: string): MessageKind {
  if (!text) return null
  return /fail|error|invalid|incorrect|wrong|denied/.test(text.toLowerCase())
    ? "error"
    : "success"
}

function ArrowIcon() {
  return (
    <span className={styles.btnArrow} aria-hidden="true">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </span>
  )
}

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<AuthMode>("login")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [messageKind, setMessageKind] = useState<MessageKind>(null)

  useEffect(() => {
    const queryMode = searchParams.get("mode")
    const hashMode =
      typeof window !== "undefined" && window.location.hash === "#signup"
        ? "signup"
        : "login"
    setMode(queryMode === "signup" || hashMode === "signup" ? "signup" : "login")
  }, [searchParams])

  function showMessage(text: string) {
    setMessage(text)
    setMessageKind(classifyMessage(text))
  }

  function switchMode(next: AuthMode) {
    setMode(next)
    const url = next === "signup" ? "/auth?mode=signup" : "/auth?mode=login"
    window.history.replaceState(null, "", url)
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password")
      return
    }

    setSubmitting(true)
    try {
      const { data, error } = await getSupabaseClient().auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (error) {
        console.error(error)
        alert("Login failed: " + error.message)
        return
      }

      console.log("Logged in:", data.user)
      router.replace("/roadmaps")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!signupEmail || !signupPassword) {
      alert("Please enter email and password")
      return
    }

    setSubmitting(true)
    try {
      const { data, error } = await getSupabaseClient().auth.signUp({
        email: signupEmail,
        password: signupPassword,
      })

      if (error) {
        console.error(error)
        alert("Account creation failed: " + error.message)
        return
      }

      console.log("Account created:", data)
      if (data.session?.user) {
        router.replace("/roadmaps")
        return
      }

      showMessage("Account created. Confirm your email, then log in to continue.")
      switchMode("login")
    } finally {
      setSubmitting(false)
    }
  }

  const isSignup = mode === "signup"

  return (
    <div className={styles.root}>
      <header className={styles.siteHeader}>
        <div className={styles.siteHeaderInner}>
          <Link className={styles.brand} href="/" aria-label="PrepAI — go to homepage">
            PrepAI<span className={styles.brandSub}>AI</span>
          </Link>
          <div className={styles.headerRight}>
            <Link className={styles.backLink} href="/">
              ← Back to home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.brandPanel} aria-hidden="true">
          <div className={styles.brandPanelContent}>
            <div>
              <div className={styles.brandEyebrow}>
                <span className={styles.brandEyebrowLine} />
                Your interview practice space
              </div>
              <h2 className={styles.brandHeadline}>
                Prepare Smarter.
                <br />
                Interview Better.
              </h2>
              <p className={styles.brandDesc}>
                Practice technical concepts, strengthen your knowledge, and take the
                next step in your development journey — all in one place.
              </p>
            </div>
            <div className={styles.brandStats}>
              <div className={styles.brandStat}>
                <span className={styles.brandStatValue}>500+</span>
                <span className={styles.brandStatLabel}>
                  curated questions
                  <span className={styles.brandStatSub}>TECH TOPICS</span>
                </span>
              </div>
              <div className={styles.brandStat}>
                <span className={styles.brandStatValue}>10+</span>
                <span className={styles.brandStatLabel}>
                  developer roadmaps
                  <span className={styles.brandStatSub}>CAREER PATHS</span>
                </span>
              </div>
              <div className={styles.brandStat}>
                <span className={styles.brandStatValue}>AI</span>
                <span className={styles.brandStatLabel}>
                  instant MCQ generation
                  <span className={styles.brandStatSub}>REAL-TIME</span>
                </span>
              </div>
            </div>
            <p className={styles.brandFooterText}>
              Build confidence one question at a time.
            </p>
          </div>
        </div>

        <div className={styles.authPanel}>
          <div className={styles.authPanelInner}>
            <section className={styles.authPage}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowLine} />
                PrepAI
              </div>
              <h1 className={styles.formTitle}>
                {isSignup ? "Start your PrepAI journey." : "Welcome back."}
              </h1>
              <p className={styles.formSubtitle}>
                {isSignup
                  ? "Build your skills, practice with AI, and prepare for your next opportunity."
                  : "Continue your journey toward interview readiness."}
              </p>

              <nav className={styles.switch} aria-label="Authentication options">
                <a
                  href="/auth?mode=login"
                  aria-current={!isSignup ? "page" : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    switchMode("login")
                  }}
                >
                  Sign In
                </a>
                <a
                  href="/auth?mode=signup"
                  aria-current={isSignup ? "page" : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    switchMode("signup")
                  }}
                >
                  Create Account
                </a>
              </nav>

              {!isSignup ? (
                <form className={styles.form} onSubmit={handleLogin} noValidate>
                  <label htmlFor="loginEmail">
                    Email address
                    <input
                      type="email"
                      id="loginEmail"
                      name="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      value={loginEmail}
                      onChange={(event) => setLoginEmail(event.target.value)}
                    />
                  </label>
                  <label htmlFor="loginPassword">
                    Password
                    <input
                      type="password"
                      id="loginPassword"
                      name="password"
                      placeholder="Your password"
                      autoComplete="current-password"
                      required
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                    />
                  </label>
                  <button className={styles.submit} type="submit" disabled={submitting}>
                    Sign In
                    <ArrowIcon />
                  </button>
                </form>
              ) : (
                <form className={styles.form} onSubmit={handleCreateAccount} noValidate>
                  <label htmlFor="signupEmail">
                    Email address
                    <input
                      type="email"
                      id="signupEmail"
                      name="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      value={signupEmail}
                      onChange={(event) => setSignupEmail(event.target.value)}
                    />
                  </label>
                  <label htmlFor="signupPassword">
                    Password
                    <input
                      type="password"
                      id="signupPassword"
                      name="password"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      required
                      value={signupPassword}
                      onChange={(event) => setSignupPassword(event.target.value)}
                    />
                  </label>
                  <button className={styles.submit} type="submit" disabled={submitting}>
                    Create Account
                    <ArrowIcon />
                  </button>
                </form>
              )}
            </section>

            <div
              className={`${styles.message} ${
                messageKind === "error"
                  ? styles.isError
                  : messageKind === "success"
                    ? styles.isSuccess
                    : ""
              }`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.siteFooter}>
        <div className={styles.siteFooterInner}>
          <span className={styles.siteFooterText}>© 2025 PrepAI. All rights reserved.</span>
          <span className={styles.footerStatus}>
            <span className={styles.footerStatusDot} />
            All systems operational
          </span>
        </div>
      </footer>
    </div>
  )
}
