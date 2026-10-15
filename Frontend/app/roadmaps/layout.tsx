import { RequireAuth } from "@/components/auth/require-auth";

export default function RoadmapsLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}