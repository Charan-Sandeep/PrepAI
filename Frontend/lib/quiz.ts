export type QuizQuestion = {
  question: string
  options: string[]
  answer?: string
  explanation?: string
}

export const N8N_QUESTIONS_ENDPOINT =
  process.env.NEXT_PUBLIC_N8N_QUESTIONS_URL ||
  "https://project-crt.app.n8n.cloud/webhook/generate-questions"

export function text(value: unknown) {
  return value == null ? "" : String(value)
}

export function answerIndex(answer: unknown, options: string[]) {
  const raw = text(answer).trim()
  const letter = raw.match(/^(?:option\s*)?([a-d])(?:[.)\s]|$)/i)
  if (letter) return letter[1].toUpperCase().charCodeAt(0) - 65
  const numeric = raw.match(/^(?:option\s*)?([1-4])(?:[.)\s]|$)/i)
  if (numeric) return Number(numeric[1]) - 1
  return options.findIndex(
    (option) => text(option).trim().toLowerCase() === raw.toLowerCase()
  )
}
