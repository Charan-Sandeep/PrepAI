import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard · PrepAI",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
