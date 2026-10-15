import { Suspense } from "react"
import { AuthForm } from "@/components/auth/auth-form"

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <p className="mx-auto my-[24vh] text-center text-muted-foreground">
          Loading…
        </p>
      }
    >
      <AuthForm />
    </Suspense>
  )
}
