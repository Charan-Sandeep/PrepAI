"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase/client"

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const supabase = getSupabaseClient()

    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (cancelled) return
        if (sessionError) {
          setError(sessionError.message)
          setUser(null)
        } else {
          setUser(data.session?.user ?? null)
        }
        setLoading(false)
      })
      .catch((sessionError: unknown) => {
        if (cancelled) return
        console.error("Could not verify sign-in:", sessionError)
        setError("Could not verify your sign-in.")
        setLoading(false)
      })

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return
      setUser(session?.user ?? null)
    })

    return () => {
      cancelled = true
      data.subscription.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}
