"use client"

import Link from "next/link"
import { forwardRef } from "react"
import { useAuthSession } from "@/hooks/use-auth-session"

type PracticeLinkProps = {
  children: React.ReactNode
  className?: string
  mode?: "login" | "signup"
  onClick?: () => void
}

export const PracticeLink = forwardRef<HTMLAnchorElement, PracticeLinkProps>(
  function PracticeLink({ children, className, mode = "signup", onClick }, ref) {
    const { user } = useAuthSession()
    const href = user
      ? "/roadmaps"
      : mode === "login"
        ? "/auth?mode=login"
        : "/auth?mode=signup"

    return (
      <Link ref={ref} href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    )
  }
)
