"use client"

import { useState } from "react"
import { ArrowRight, Leaf, Sparkles, Target, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    icon: Sparkles,
    title: "Welcome to ReGen",
    description:
      "Your personal space to track impact, complete goals, and connect with your community for climate action. Let's get started.",
  },
  {
    icon: Leaf,
    title: "Track Your Climate Impact",
    description:
      "Monitor real-time weather, air quality, and understand how your daily choices affect the environment.",
  },
  {
    icon: Target,
    title: "Complete Sustainable Goals",
    description:
      "Build eco-friendly habits with daily challenges. Earn Trees for every goal you complete and grow your impact.",
  },
  {
    icon: Users,
    title: "Collaborate Locally",
    description:
      "Join your community to identify, discuss, and solve environmental issues together. Change starts locally.",
  },
]

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)

  const isLastSlide = step === slides.length - 1

  function handleNext() {
    if (isLastSlide) {
      onComplete()
    } else {
      setStep((s) => s + 1)
    }
  }

  const slide = slides[step]
  const Icon = slide.icon

  return (
    <div className="flex min-h-svh flex-col items-center justify-between bg-primary px-6 py-12 text-primary-foreground">
      <div className="flex items-center gap-2 pt-8">
        <Leaf className="h-8 w-8" />
        <span className="text-2xl font-bold tracking-tight">ReGen</span>
      </div>

      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-foreground/15">
          <Icon className="h-12 w-12" />
        </div>
        <h2 className="text-balance text-2xl font-bold leading-tight">
          {slide.title}
        </h2>
        <p className="max-w-xs text-balance leading-relaxed text-primary-foreground/80">
          {slide.description}
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={`slide-${i}`}
              className={`h-2 rounded-full transition-all ${
                i === step
                  ? "w-8 bg-primary-foreground"
                  : "w-2 bg-primary-foreground/30"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          size="lg"
          className="w-full max-w-xs rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          {isLastSlide ? "Get Started" : "Next"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {!isLastSlide && (
          <button
            type="button"
            onClick={onComplete}
            className="text-sm text-primary-foreground/60 hover:text-primary-foreground/80"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
