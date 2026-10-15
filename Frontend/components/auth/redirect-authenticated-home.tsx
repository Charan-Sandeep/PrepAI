"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthSession } from "@/hooks/use-auth-session"

export function RedirectAuthenticatedHome({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuthSession()

  useEffect(() => {
    if (!loading && user) router.replace("/roadmaps")
  }, [loading, user, router])

  if (loading || user) {
    return (
      <p className="mx-auto my-[24vh] text-center text-muted-foreground" role="status" aria-live="polite">
        Checking your sign-in…
      </p>
    )
  }

  return children
}