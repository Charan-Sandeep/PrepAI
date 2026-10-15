"use client"

import { Navigation } from "@/components/landing/navigation"
import { RequireAuth } from "@/components/auth/require-auth"
import { ResumeAnalyzerWorkspace } from "@/components/resume-analyzer/resume-analyzer-workspace"

export default function ResumeAnalyzerPage() {
  return (
    <RequireAuth>
      <Navigation />
      <ResumeAnalyzerWorkspace />
    </RequireAuth>
  )
}