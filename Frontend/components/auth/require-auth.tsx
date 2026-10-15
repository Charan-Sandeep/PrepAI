"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { useAuthSession } from "@/hooks/use-auth-session"

const AuthUserContext = createContext<User | null>(null)

export function useRequiredUser() {
  const user = useContext(AuthUserContext)
  if (!user) {
    throw new Error("useRequiredUser must be used inside RequireAuth")
  }
  return user
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading, error } = useAuthSession()

  useEffect(() => {
    if (!loading && !error && !user) {
      router.replace("/auth?mode=login")
    }
  }, [loading, error, user, router])

  if (error) {
    return (
      <p className="mx-auto my-[24vh] text-center text-muted-foreground" role="status">
        Could not verify your sign-in.{" "}
        <Link href="/auth?mode=login" className="underline underline-offset-4">
          Log in again
        </Link>
        .
      </p>
    )
  }

  if (loading || !user) {
    return (
      <p
        className="mx-auto my-[24vh] text-center text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        Checking your sign-in…
      </p>
    )
  }

  return <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>
}
