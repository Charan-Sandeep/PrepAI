import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in · PrepAI",
  description:
    "Sign in to PrepAI or create an account to begin your AI-powered interview preparation journey.",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}
