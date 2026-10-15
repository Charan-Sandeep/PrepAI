"use client"

import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react"
import Script from "next/script"
import styles from "@/app/resume-analyzer/resume-analyzer.module.css"

const ANALYZE_ENDPOINT =
  process.env.NEXT_PUBLIC_N8N_RESUME_ANALYZER_URL ||
  "https://kushallll.app.n8n.cloud/webhook/levelup-analyze"
const PDF_JS_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"
const PDF_WORKER_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js"
const MAMMOTH_URL = "https://cdn.jsdelivr.net/npm/mammoth@1.9.0/mammoth.browser.min.js"

type PdfPage = {
  getTextContent(): Promise<{ items: Array<{ str?: string }> }>
}

type PdfDocument = {
  numPages: number
  getPage(pageNumber: number): Promise<PdfPage>
}

type PdfJsLibrary = {
  GlobalWorkerOptions: { workerSrc: string }
  getDocument(options: { data: ArrayBuffer }): { promise: Promise<PdfDocument> }
}

type MammothLibrary = {
  extractRawText(options: { arrayBuffer: ArrayBuffer }): Promise<{ value: string }>
}

declare global {
  interface Window {
    pdfjsLib?: PdfJsLibrary
    mammoth?: MammothLibrary
  }
}

type AnalysisResult = Record<string, unknown>
type ResultSection = { title: string; values: string[] }

const resultFields: Array<[string, string]> = [
  ["Matched skills", "matched_skills"],
  ["Skills to build", "missing_skills"],
  ["Learning path", "learning_path"],
  ["ATS tips", "ats_score_improving_tips"],
  ["GitHub recommendations", "github_recommendations"],
]

function asText(value: unknown) {
  return value == null ? "" : String(value)
}

function scoreText(value: unknown) {
  if (value == null || value === "") return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 && number <= 100
    ? `${Math.round(number)} / 100`
    : null
}

function errorMessage(error: unknown) {
  if (error instanceof TypeError) {
    return "Could not reach the analyzer. Check your connection and try again."
  }
  return error instanceof Error ? error.message : "Resume analysis failed. Please try again."
}

function apiError(data: unknown, status: number) {
  if (data && typeof data === "object" && "error" in data) {
    const error = (data as { error?: unknown }).error
    if (typeof error === "string") return error
    if (error && typeof error === "object" && "message" in error) {
      return asText((error as { message?: unknown }).message)
    }
  }
  return `Analysis failed (HTTP ${status}).`
}

async function extractPdfText(file: File) {
  const pdfjsLib = window.pdfjsLib
  if (!pdfjsLib) {
    throw new Error("The PDF reader could not load. Refresh the page or paste your resume text instead.")
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise
  const pages: string[] = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => item.str ?? "").join(" "))
  }
  return pages.join("\n")
}

async function extractWordText(file: File) {
  if (!window.mammoth) {
    throw new Error("The Word reader could not load. Refresh the page or paste your resume text instead.")
  }
  const extracted = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
  return extracted.value
}

export function ResumeAnalyzerWorkspace() {
  const fileInput = useRef<HTMLInputElement>(null)
  const analysisInFlight = useRef(false)
  const [resumeText, setResumeText] = useState("")
  const [jobRole, setJobRole] = useState("Full Stack Developer")
  const [githubUrl, setGithubUrl] = useState("")
  const [fileName, setFileName] = useState("")
  const [fileStatus, setFileStatus] = useState("")
  const [fileStatusKind, setFileStatusKind] = useState<"error" | "success" | "">("")
  const [readingFile, setReadingFile] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [status, setStatus] = useState("")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

  async function processFile(file: File) {
    if (analysisInFlight.current) return
    setFileName(file.name)
    setFileStatus("Reading your document…")
    setFileStatusKind("")
    setReadingFile(true)
    setResumeText("")
    setAnalysis(null)
    setStatus("")

    try {
      const extension = file.name.toLowerCase().split(".").pop()
      if (extension !== "pdf" && extension !== "docx") {
        throw new Error("Please choose a PDF or Word (.docx) file.")
      }
      const extractedText = extension === "pdf"
        ? await extractPdfText(file)
        : await extractWordText(file)
      if (extractedText.trim().length < 50) {
        throw new Error("Could not find enough text. This may be a scanned PDF; paste selectable text or use a text-based document.")
      }
      setResumeText(extractedText.trim())
      setFileStatus(`Text extracted from ${file.name}. Review it below before analysis.`)
      setFileStatusKind("success")
    } catch (error) {
      console.error("Could not read resume file:", error)
      setFileStatus(error instanceof Error ? error.message : "Could not read this document.")
      setFileStatusKind("error")
    } finally {
      setReadingFile(false)
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    if (file) void processFile(file)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) void processFile(file)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (analysisInFlight.current) return

    const nextResumeText = resumeText.trim()
    if (nextResumeText.length < 50) {
      setStatus("Please enter at least 50 characters of resume text.")
      return
    }

    analysisInFlight.current = true
    setAnalyzing(true)
    setAnalysis(null)
    setStatus("Analyzing your resume. This usually takes 10–25 seconds…")
    try {
      const response = await fetch(ANALYZE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: nextResumeText,
          job_role: jobRole.trim(),
          github_url: githubUrl.trim(),
        }),
      })
      let data: unknown
      try {
        data = await response.json()
      } catch {
        throw new Error(response.ok
          ? "The analyzer returned an unreadable response."
          : `Analysis failed (HTTP ${response.status}).`)
      }
      if (!response.ok) throw new Error(apiError(data, response.status))
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("The analyzer returned an invalid response.")
      }
      setAnalysis(data as AnalysisResult)
      setStatus("Analysis complete.")
    } catch (error) {
      console.error("Resume analysis failed:", error)
      setStatus(errorMessage(error))
    } finally {
      analysisInFlight.current = false
      setAnalyzing(false)
    }
  }

  function handleNewAnalysis() {
    setAnalysis(null)
    setResumeText("")
    setJobRole("Full Stack Developer")
    setGithubUrl("")
    setFileName("")
    setFileStatus("")
    setFileStatusKind("")
    setStatus("")
    if (fileInput.current) fileInput.current.value = ""
    fileInput.current?.focus()
  }

  const sections: ResultSection[] = analysis
    ? resultFields.map(([title, field]) => ({
        title,
        values: Array.isArray(analysis[field])
          ? (analysis[field] as unknown[]).map(asText).filter(Boolean)
          : [],
      })).filter((section) => section.values.length > 0)
    : []
  const readinessScore = analysis ? scoreText(analysis.readiness_score) : null
  const atsScore = analysis ? scoreText(analysis.ats_score) : null
  const aretaMessage = analysis ? asText(analysis.areta_message) : ""
  const meta = analysis?.meta
  const disclaimer = meta && typeof meta === "object" && "disclaimer" in meta
    ? asText((meta as { disclaimer?: unknown }).disclaimer)
    : ""

  return (
    <div className={styles.root}>
      <Script src={PDF_JS_URL} strategy="afterInteractive" />
      <Script src={MAMMOTH_URL} strategy="afterInteractive" />
      <main className={styles.main}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Career tools</p>
          <h1>AI Resume Analyzer</h1>
          <p className={styles.description}>
            Analyze your resume, identify strengths and improvement areas, and get actionable feedback to help you prepare for your next opportunity.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.uploadSection} aria-labelledby="upload-title">
            <div className={styles.sectionHeading}>
              <div>
                <h2 id="upload-title">Your resume</h2>
                <p>Upload a document or paste your resume text.</p>
              </div>
              {fileName && (
                <button
                  className={styles.textButton}
                  type="button"
                  onClick={() => {
                    setFileName("")
                    setFileStatus("")
                    setFileStatusKind("")
                    setResumeText("")
                    setAnalysis(null)
                    if (fileInput.current) fileInput.current.value = ""
                  }}
                  disabled={readingFile || analyzing}
                >
                  Remove file
                </button>
              )}
            </div>

            <div
              className={styles.dropArea}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              aria-busy={readingFile}
            >
              <input
                ref={fileInput}
                className={styles.fileInput}
                id="resume-file"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                disabled={readingFile || analyzing}
              />
              <div className={styles.uploadMark} aria-hidden="true">↑</div>
              <p className={styles.dropTitle}>{fileName || "Drop your resume here"}</p>
              <p className={styles.dropHint}>PDF or Word document (.docx)</p>
              <p className={styles.privacyHint}>Your resume text is sent to the analyzer only when you submit.</p>
              <label className={styles.browseButton} htmlFor="resume-file">
                Browse Files
              </label>
              {fileStatus && (
                <p className={`${styles.fileStatus} ${fileStatusKind === "error" ? styles.error : fileStatusKind === "success" ? styles.success : ""}`} role="status" aria-live="polite">
                  {readingFile && <span className={styles.spinner} aria-hidden="true" />}
                  {fileStatus}
                </p>
              )}
            </div>

            <label className={styles.field} htmlFor="resume-text">
              Resume text
              <textarea
                id="resume-text"
                name="resume_text"
                minLength={50}
                required
                value={resumeText}
                placeholder="Upload a PDF or Word document, or paste your resume text here (at least 50 characters)."
                onChange={(event) => {
                  setResumeText(event.target.value)
                  setAnalysis(null)
                  setStatus("")
                }}
                disabled={readingFile || analyzing}
              />
            </label>
          </section>

          <section className={styles.details} aria-labelledby="role-title">
            <div className={styles.sectionHeading}>
              <div>
                <h2 id="role-title">Target role</h2>
                <p>Get feedback tailored to the position you want.</p>
              </div>
            </div>
            <div className={styles.fields}>
              <label className={styles.field} htmlFor="job-role">
                Job role
                <input
                  id="job-role"
                  name="job_role"
                  value={jobRole}
                  maxLength={120}
                  required
                  onChange={(event) => {
                    setJobRole(event.target.value)
                    setAnalysis(null)
                    setStatus("")
                  }}
                  disabled={analyzing}
                />
              </label>
              <label className={styles.field} htmlFor="github-url">
                GitHub profile URL <span className={styles.optional}>(optional)</span>
                <input
                  id="github-url"
                  name="github_url"
                  type="url"
                  value={githubUrl}
                  placeholder="https://github.com/username"
                  onChange={(event) => {
                    setGithubUrl(event.target.value)
                    setAnalysis(null)
                    setStatus("")
                  }}
                  disabled={analyzing}
                />
                <span className={styles.fieldHint}>Leave blank if you don’t want GitHub recommendations.</span>
              </label>
            </div>
          </section>

          <div className={styles.actions}>
            <button className={styles.analyzeButton} type="submit" disabled={analyzing || readingFile}>
              {analyzing && <span className={styles.spinner} aria-hidden="true" />}
              {analyzing ? "Analyzing…" : "Analyze Resume"}
            </button>
            <p className={`${styles.status} ${status && !analysis && !analyzing ? styles.error : ""}`} role="status" aria-live="polite">
              {status}
            </p>
          </div>
        </form>

        {analysis && (
          <section className={styles.results} aria-labelledby="results-title" aria-live="polite">
            <div className={styles.resultsHeader}>
              <div>
                <p className={styles.eyebrow}>Analysis complete</p>
                <h2 id="results-title">Your resume review</h2>
              </div>
              <button className={styles.secondaryButton} type="button" onClick={handleNewAnalysis}>
                Analyze another resume
              </button>
            </div>

            {(readinessScore || atsScore) && (
              <div className={styles.scores}>
                {readinessScore && <div className={styles.score}><span>Readiness score</span><strong>{readinessScore}</strong></div>}
                {atsScore && <div className={styles.score}><span>ATS score</span><strong>{atsScore}</strong></div>}
              </div>
            )}

            {aretaMessage && <p className={styles.analysisMessage}>{aretaMessage}</p>}
            {sections.length > 0 && (
              <div className={styles.resultGrid}>
                {sections.map((section) => (
                  <section className={styles.resultSection} key={section.title}>
                    <h3>{section.title}</h3>
                    <ul>{section.values.map((value, index) => <li key={`${index}-${value}`}>{value}</li>)}</ul>
                  </section>
                ))}
              </div>
            )}
            {disclaimer && <p className={styles.disclaimer}>{disclaimer}</p>}
          </section>
        )}
      </main>
    </div>
  )
}