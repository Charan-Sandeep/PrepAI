"use client"

import { FormEvent, useState } from "react"
import { recordPerformance } from "@/lib/performance"
import {
  answerIndex,
  N8N_QUESTIONS_ENDPOINT,
  text,
  type QuizQuestion,
} from "@/lib/quiz"
import styles from "@/app/quiz/quiz.module.css"

const technicalTopics = [
  "Operating Systems",
  "Data Structures and Algorithms",
  "Database Management Systems (DBMS)",
  "Computer Networks",
  "Object-Oriented Programming (OOP)",
  "Computer Organization and Architecture",
  "Software Engineering",
  "Theory of Computation",
  "Compiler Design",
  "Python Programming",
  "C Programming",
  "C++ Programming",
  "Java Programming",
  "JavaScript",
  "Web Development",
  "React.js",
  "Node.js",
  "SQL",
  "Machine Learning",
  "Artificial Intelligence",
  "Cloud Computing",
  "Cybersecurity",
  "Git and GitHub",
  "Other",
]

type QuizWorkspaceProps = {
  userId: string
  embedded?: boolean
  onPerformanceUpdated?: () => void
}

export function QuizWorkspace({
  userId,
  embedded = false,
  onPerformanceUpdated,
}: QuizWorkspaceProps) {
  const [topic, setTopic] = useState("")
  const [customTopic, setCustomTopic] = useState("")
  const [generatedTopic, setGeneratedTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [count, setCount] = useState(5)
  const [status, setStatus] = useState("")
  const [result, setResult] = useState("")
  const [resultKind, setResultKind] = useState<"" | "error" | "success">("")
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [generating, setGenerating] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [feedback, setFeedback] = useState<Record<number, { correct: boolean; text: string }>>(
    {}
  )
  const correctCount = Object.values(feedback).filter((item) => item.correct).length
  const incorrectCount = questions.length - correctCount
  const scorePercentage = questions.length
    ? Math.round((correctCount / questions.length) * 100)
    : 0

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextCount = Number(count)
    const selectedTopic = topic === "Other" ? customTopic.trim() : topic
    if (!selectedTopic) {
      setResult(topic === "Other" ? "Enter a technical topic to continue." : "Select a topic to continue.")
      setResultKind("error")
      return
    }
    if (!Number.isInteger(nextCount) || nextCount < 1 || nextCount > 25) {
      setResult("Please select between 1 and 25 questions.")
      setResultKind("error")
      return
    }

    setGenerating(true)
    setStatus("Generating questions…")
    setResult("")
    setResultKind("")
    setShowQuiz(false)
    setQuestions([])
    setAnswers({})
    setFeedback({})
    setSubmitted(false)

    try {
      const response = await fetch(N8N_QUESTIONS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty,
          count: nextCount,
          question_type: "mcq",
        }),
      })
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const data = await response.json()
      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("The webhook response did not contain any questions.")
      }
      if (
        data.questions.some(
          (q: QuizQuestion) =>
            !q || !q.question || !Array.isArray(q.options) || q.options.length < 2
        )
      ) {
        throw new Error("The webhook returned a question with missing options.")
      }
      setQuestions(data.questions)
      setGeneratedTopic(selectedTopic)
      setShowQuiz(true)
      setStatus("Questions generated. Submit when you’re ready to see your score.")
    } catch (error) {
      console.error(error)
      setStatus("Failed to generate questions.")
      setResult(error instanceof Error ? error.message : "Failed to generate questions.")
      setResultKind("error")
    } finally {
      setGenerating(false)
    }
  }

  function handleSubmitQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitted || !questions.length) return

    const selected = questions.map((_, index) => answers[index])
    if (selected.some((value) => value == null)) {
      setResult("Choose an answer for every question before submitting.")
      setResultKind("error")
      return
    }

    setSubmitted(true)
    let score = 0
    const nextFeedback: Record<number, { correct: boolean; text: string }> = {}

    questions.forEach((question, index) => {
      const chosen = Number(selected[index])
      const correct = answerIndex(question.answer, question.options)
      const isCorrect = chosen === correct
      if (isCorrect) score++
      const answerLabel =
        correct >= 0 && correct < question.options.length
          ? `${String.fromCharCode(65 + correct)}. ${text(question.options[correct])}`
          : text(question.answer)
      nextFeedback[index] = {
        correct: isCorrect,
        text: `${isCorrect ? "Correct" : `Correct answer: ${answerLabel}`}${
          question.explanation ? ` — ${text(question.explanation)}` : ""
        }`,
      }
    })

    setFeedback(nextFeedback)

    try {
      recordPerformance(userId, {
        component: "MCQ Generation",
        topic: generatedTopic,
        difficulty,
        score,
        total: questions.length,
      })
      onPerformanceUpdated?.()
    } catch (error) {
      console.error("Could not save performance:", error)
      setStatus("Your score is shown, but this session could not be saved to your portfolio.")
    }

    setResult(`You got ${score} out of ${questions.length} correct.`)
    setResultKind("success")
  }

  function handleTryAgain() {
    setAnswers({})
    setFeedback({})
    setSubmitted(false)
    setResult("")
    setResultKind("")
    setStatus("")
  }

  return (
    <div className={`${styles.root} ${embedded ? styles.embedded : ""}`}>
      <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Interview Practice</h1>
          <p>
            Strengthen your technical knowledge with focused practice questions tailored to your learning goals.
          </p>
        </section>

        <form className={styles.settingsForm} onSubmit={handleGenerate}>
          <div className={styles.settings}>
            <div className={styles.topicGroup}>
              <label htmlFor="topic">
                Topic
                <select
                  id="topic"
                  value={topic}
                  required
                  onChange={(event) => {
                    const nextTopic = event.target.value
                    setTopic(nextTopic)
                    if (nextTopic !== "Other") setCustomTopic("")
                    setResult("")
                    setResultKind("")
                  }}
                >
                  <option value="">Select a topic</option>
                  {technicalTopics.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              {topic === "Other" && (
                <label htmlFor="custom-topic">
                  Enter your topic
                  <input
                    id="custom-topic"
                    value={customTopic}
                    placeholder="e.g., Distributed Systems"
                    required
                    onChange={(event) => {
                      setCustomTopic(event.target.value)
                      setResult("")
                      setResultKind("")
                    }}
                  />
                </label>
              )}
            </div>
            <label htmlFor="difficulty">
              Difficulty
              <select
                id="difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label htmlFor="count">
              Number of questions
              <input
                id="count"
                type="number"
                value={count}
                min={1}
                max={25}
                step={1}
                required
                onChange={(event) => setCount(Number(event.target.value))}
              />
            </label>
          </div>
          <div className={styles.bar}>
            <button className={styles.action} type="submit" disabled={generating}>
              Generate questions
            </button>
            <p className={styles.hint} role="status" aria-live="polite">
              {status}
            </p>
          </div>
        </form>

        {resultKind === "error" && (
          <p className={`${styles.result} ${styles.error}`} role="status" aria-live="polite">
            {result}
          </p>
        )}

        {showQuiz && (
          <form onSubmit={handleSubmitQuiz}>
            <div>
              {questions.map((question, index) => (
                <section
                  key={`${question.question}-${index}`}
                  className={`${styles.question} ${
                    feedback[index]
                      ? feedback[index].correct
                        ? styles.correct
                        : styles.incorrect
                      : ""
                  }`}
                >
                  <h2>
                    {index + 1}. {text(question.question)}
                  </h2>
                  <div className={styles.options}>
                    {question.options.map((choice, optionIndex) => (
                      <label key={`${index}-${optionIndex}`} className={styles.option}>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optionIndex}
                          required
                          disabled={submitted}
                          checked={answers[index] === optionIndex}
                          onChange={() =>
                            setAnswers((current) => ({ ...current, [index]: optionIndex }))
                          }
                        />
                        <span>
                          {String.fromCharCode(65 + optionIndex)}. {text(choice)}
                        </span>
                      </label>
                    ))}
                  </div>
                  {feedback[index] && (
                    <p className={styles.feedback}>{feedback[index].text}</p>
                  )}
                </section>
              ))}
            </div>
            <button className={styles.action} type="submit" disabled={submitted}>
              Submit quiz
            </button>
          </form>
        )}

        {submitted && (
          <section className={styles.resultsPanel} aria-labelledby="quiz-results-title" aria-live="polite">
            <div className={styles.resultsHeading}>
              <div>
                <h2 id="quiz-results-title">Quiz Results</h2>
                <p>{questions.length} questions evaluated</p>
              </div>
              <strong className={styles.resultsScore}>{scorePercentage}%</strong>
            </div>
            <dl className={styles.resultsStats}>
              <div>
                <dt>Total Questions</dt>
                <dd>{questions.length}</dd>
              </div>
              <div>
                <dt>Correct Answers</dt>
                <dd className={styles.correctCount}>{correctCount}</dd>
              </div>
              <div>
                <dt>Incorrect Answers</dt>
                <dd className={styles.incorrectCount}>{incorrectCount}</dd>
              </div>
            </dl>
            <button className={styles.action} type="button" onClick={handleTryAgain}>
              Try Again
            </button>
          </section>
        )}
      </main>
    </div>
  )
}
