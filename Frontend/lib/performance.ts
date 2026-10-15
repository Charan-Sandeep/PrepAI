export type PerformanceAttempt = {
  id: string
  component: string
  topic: string
  difficulty: string
  score: number
  total: number
  completedAt: string
}

const STORAGE_PREFIX = "prepai:performance:v1:"
const MAX_ATTEMPTS = 300

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${encodeURIComponent(userId)}`
}

export function listPerformance(userId: string | null | undefined): PerformanceAttempt[] {
  if (!userId || typeof window === "undefined") return []
  try {
    const records = JSON.parse(localStorage.getItem(storageKey(userId)) || "[]")
    return Array.isArray(records) ? records : []
  } catch (error) {
    console.warn("Could not read the performance portfolio:", error)
    return []
  }
}

export function recordPerformance(
  userId: string | null | undefined,
  attempt: {
    component: string
    topic?: string
    difficulty?: string
    score: number
    total: number
  }
): PerformanceAttempt {
  if (!userId) {
    throw new Error("A signed-in user is required to save performance.")
  }

  const score = Number(attempt.score)
  const total = Number(attempt.total)
  if (
    !attempt.component ||
    !Number.isFinite(score) ||
    !Number.isFinite(total) ||
    total < 1 ||
    score < 0 ||
    score > total
  ) {
    throw new Error("This performance result is not valid.")
  }

  const saved: PerformanceAttempt = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    component: String(attempt.component),
    topic: String(attempt.topic || "Practice"),
    difficulty: String(attempt.difficulty || ""),
    score,
    total,
    completedAt: new Date().toISOString(),
  }

  const records = [saved, ...listPerformance(userId)].slice(0, MAX_ATTEMPTS)
  localStorage.setItem(storageKey(userId), JSON.stringify(records))
  return saved
}
