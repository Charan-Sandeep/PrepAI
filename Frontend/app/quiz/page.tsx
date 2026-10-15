"use client"

import { RequireAuth, useRequiredUser } from "@/components/auth/require-auth"
import { Navigation } from "@/components/landing/navigation"
import { QuizWorkspace } from "@/components/quiz/quiz-workspace"

function QuizContent() {
  const user = useRequiredUser()
  return (
    <>
      <Navigation />
      <QuizWorkspace userId={user.id} />
    </>
  )
}

export default function QuizPage() {
  return (
    <RequireAuth>
      <QuizContent />
    </RequireAuth>
  )
}
