"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useRequiredUser } from "@/components/auth/require-auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { QuizWorkspace } from "@/components/quiz/quiz-workspace"
import { listPerformance, type PerformanceAttempt } from "@/lib/performance"
import { getSupabaseClient } from "@/lib/supabase/client"
import styles from "@/app/dashboard/dashboard.module.css"

function PortfolioRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.portfolioRow}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

export function DashboardShell() {
  const router = useRouter()
  const user = useRequiredUser()
  const [signingOut, setSigningOut] = useState(false)
  const [records, setRecords] = useState<PerformanceAttempt[]>(() =>
    listPerformance(user.id)
  )

  const summary = useMemo(() => {
    if (!records.length) {
      return { average: "—", best: "—", groups: [] as Array<[string, { attempts: number; points: number }]> }
    }
    const percentages = records.map((item) => (item.total > 0 ? (item.score / item.total) * 100 : 0))
    const average = percentages.reduce((sum, value) => sum + value, 0) / percentages.length
    const groups = new Map<string, { attempts: number; points: number }>()
    for (const item of records) {
      const group = groups.get(item.component) || { attempts: 0, points: 0 }
      group.attempts++
      group.points += item.total > 0 ? (item.score / item.total) * 100 : 0
      groups.set(item.component, group)
    }
    return {
      average: `${Math.round(average)}%`,
      best: `${Math.round(Math.max(...percentages))}%`,
      groups: Array.from(groups.entries()),
    }
  }, [records])

  async function handleSignOut() {
    setSigningOut(true)
    const { error } = await getSupabaseClient().auth.signOut()
    if (error) {
      console.error("Could not sign out:", error)
      setSigningOut(false)
      return
    }
    router.replace("/auth?mode=login")
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          Prep<span>AI</span>
        </Link>
        <div className={styles.account}>
          <span>{user.email || "Signed in"}</span>
          <ThemeToggle />
          <button
            className={styles.signOut}
            type="button"
            disabled={signingOut}
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Dashboard components">
          <div className={styles.sideLabel}>Components</div>
          <nav className={styles.menu} aria-label="Component menu">
            <Link className={`${styles.menuLink} ${styles.menuLinkActive}`} href="/quiz">
              <span className={styles.menuIcon} aria-hidden="true">
                ✦
              </span>
              <span>MCQ Generation</span>
            </Link>
            <div className={styles.future}>
              <span className={styles.menuIcon} aria-hidden="true">
                ＋
              </span>
              <span>More components</span>
              <small>Coming soon</small>
            </div>
          </nav>
        </aside>

        <div className={styles.dashboardContent}>
          <section className={styles.workspace} aria-label="Selected component">
            <div className={styles.workspaceHeading}>
              <h1>MCQ Generation</h1>
              <span>Choose a topic to begin</span>
            </div>
            <div className={styles.moduleFrame}>
              <QuizWorkspace
                userId={user.id}
                embedded
                onPerformanceUpdated={() => setRecords(listPerformance(user.id))}
              />
            </div>
          </section>

          <section className={styles.portfolio} aria-labelledby="portfolio-title">
            <div className={styles.portfolioHeading}>
              <h2 id="portfolio-title">Performance portfolio</h2>
              <span>Saved on this device</span>
            </div>
            <div className={styles.portfolioBody}>
              <div className={styles.metrics} aria-label="Performance summary">
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Practice sessions</span>
                  <strong className={styles.metricValue}>{records.length}</strong>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Average score</span>
                  <strong className={styles.metricValue}>{summary.average}</strong>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Best score</span>
                  <strong className={styles.metricValue}>{summary.best}</strong>
                </div>
              </div>
              <div className={styles.portfolioLists}>
                <section>
                  <h3>By component</h3>
                  <div className={styles.portfolioList}>
                    {summary.groups.length ? (
                      summary.groups.map(([component, group]) => (
                        <PortfolioRow
                          key={component}
                          label={component}
                          value={`${group.attempts} sessions · ${Math.round(group.points / group.attempts)}% avg`}
                        />
                      ))
                    ) : (
                      <p className={styles.emptyPortfolio}>
                        Complete a practice session to start your portfolio.
                      </p>
                    )}
                  </div>
                </section>
                <section>
                  <h3>Recent practice</h3>
                  <div className={styles.portfolioList}>
                    {records.length ? (
                      records.slice(0, 5).map((item) => {
                        const date = new Date(item.completedAt)
                        const when = Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString()
                        return (
                          <PortfolioRow
                            key={item.id}
                            label={`${item.topic} · ${item.component}${when ? ` · ${when}` : ""}`}
                            value={`${item.score}/${item.total}`}
                          />
                        )
                      })
                    ) : (
                      <p className={styles.emptyPortfolio}>
                        Your completed sessions will appear here.
                      </p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className={styles.footer}>PrepAI · Interview practice workspace</footer>
    </div>
  )
}
