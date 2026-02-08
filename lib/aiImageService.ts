/**
 * AI-powered image service using Gemini.
 * Optional real image generation (Gemini 2.5 Flash Image); falls back to pool selection.
 * Used server-side only (e.g. in API routes).
 */

import { GoogleGenerativeAI } from "@google/generative-ai"

export type AIImageContext = "weather-banner" | "community-post"

export interface AIImageInput {
  location: string
  weatherCondition: string
  temperature?: number
  aqi?: number
  context?: AIImageContext
  /** For community: e.g. "cleanliness-drive" | "tree-plantation" | "campaign" */
  postTheme?: string
}

/** Set to "false" to disable real generation and only use fallback pool. */
const ENABLE_REAL_GENERATION =
  (process.env.ENABLE_AI_IMAGE_GENERATION ?? "true").toLowerCase() !== "false"

const FALLBACK_POOL: string[] = [
  "/signin-forest.png",
  "/abc.jpg",
]

const GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image"
const GEMINI_IMAGE_API =
  "https://generativelanguage.googleapis.com/v1beta/models/" +
  GEMINI_IMAGE_MODEL +
  ":generateContent"

const COMMUNITY_IMAGE_PROMPTS: Record<string, string> = {
  "cleanliness-drive":
    "environmental cleanliness drive community activity natural photography realistic",
  "tree-plantation":
    "tree plantation event eco community real-world aesthetic photo",
  campaign: "environmental campaign awareness community activity natural light",
  default: "eco community activity nature realistic photography",
}

function buildPrompt(input: AIImageInput): string {
  const { location, weatherCondition, context, postTheme } = input
  const loc = location || "nature"

  if (context === "community-post" && postTheme) {
    const themePrompt =
      COMMUNITY_IMAGE_PROMPTS[postTheme] || COMMUNITY_IMAGE_PROMPTS.default
    return `${themePrompt}, suitable for post thumbnail, not stock-like, dreamy aesthetic`
  }

  const condition = weatherCondition.toLowerCase()
  if (condition.includes("sunny") || condition.includes("clear"))
    return `sunny clear sky minimal gradient background in ${loc}, dreamy minimal UI background, soft aesthetic`
  if (condition.includes("cloud") || condition.includes("partly"))
    return `soft aesthetic partly cloudy sky in ${loc}, dreamy minimal UI background`
  if (condition.includes("rain") || condition.includes("drizzle"))
    return `light rain atmospheric sky cinematic soft tones, minimal UI friendly`
  if (condition.includes("overcast") || condition.includes("fog"))
    return `overcast soft grey sky minimal dreamy atmosphere in ${loc}`
  if (condition.includes("snow"))
    return `snow soft winter sky minimal dreamy aesthetic`
  if (condition.includes("storm") || condition.includes("thunder"))
    return `storm clouds dramatic sky soft tones minimal UI`
  return `soft aesthetic sky in ${loc}, dreamy minimal UI background`
}

/**
 * Try to generate a real image via Gemini image model (REST).
 * Returns a data URL on success, null on failure (caller should use fallback).
 */
async function tryGenerateRealImage(
  prompt: string,
  apiKey: string
): Promise<string | null> {
  if (!ENABLE_REAL_GENERATION) return null
  try {
    const res = await fetch(GEMINI_IMAGE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.warn("Gemini image generation API error:", res.status, err)
      return null
    }
    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> }
      }>
    }
    const parts = data.candidates?.[0]?.content?.parts
    if (!parts?.length) return null
    for (const part of parts) {
      const inline = part.inlineData
      if (inline?.data) {
        const mime = inline.mimeType || "image/png"
        return `data:${mime};base64,${inline.data}`
      }
    }
    return null
  } catch (e) {
    console.warn("Gemini real image generation failed:", e)
    return null
  }
}

/**
 * Pick a URL from the fallback pool (optionally using Gemini to choose index).
 */
async function pickFromPool(
  prompt: string,
  urlsToPick: string[],
  apiKey: string | undefined
): Promise<string> {
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const result = await model.generateContent(
        `You are an image selector for a climate app. Given this description, reply with ONLY a single number from 0 to ${
          urlsToPick.length - 1
        } to choose an image variant. No other text.\n\nDescription: ${prompt}`
      )
      const text = result.response.text()?.trim() ?? ""
      const index = Math.min(
        Math.max(0, parseInt(text, 10) || 0),
        urlsToPick.length - 1
      )
      return urlsToPick[index]
    } catch (e) {
      console.warn("Gemini image choice failed, using hash:", e)
    }
  }
  const hash = prompt.split("").reduce((a, c) => (a + c.charCodeAt(0)) | 0, 0)
  return urlsToPick[Math.abs(hash) % urlsToPick.length]
}

/**
 * Optional real image generation first; then fallback pool.
 * excludeUrls: list of URLs already used so we return a different one when using pool.
 */
export async function getAIImageUrl(
  input: AIImageInput,
  excludeUrls: string[] = []
): Promise<{ imageUrl: string }> {
  const prompt = buildPrompt(input)
  const excludeSet = new Set(excludeUrls.map((u) => u.trim()).filter(Boolean))

  const pool = [...FALLBACK_POOL]
  const available = pool.filter((url) => !excludeSet.has(url))
  const urlsToPick = available.length > 0 ? available : pool

  const apiKey = process.env.GEMINI_API_KEY

  if (apiKey && ENABLE_REAL_GENERATION) {
    const dataUrl = await tryGenerateRealImage(prompt, apiKey)
    if (dataUrl) return { imageUrl: dataUrl }
  }

  const chosenUrl = await pickFromPool(prompt, urlsToPick, apiKey)
  return { imageUrl: chosenUrl }
}

/**
 * Request an image with uniqueness: retry up to maxRetries if returned URL was already used.
 */
export async function getAIImageUrlUnique(
  input: AIImageInput,
  usedUrls: Set<string>,
  maxRetries = 3
): Promise<{ imageUrl: string }> {
  const exclude = Array.from(usedUrls)
  for (let i = 0; i < maxRetries; i++) {
    const { imageUrl } = await getAIImageUrl(input, exclude)
    if (!usedUrls.has(imageUrl)) return { imageUrl }
    exclude.push(imageUrl)
  }
  return getAIImageUrl(input, [])
}
