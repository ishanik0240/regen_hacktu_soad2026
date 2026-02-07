"use client"

import { useState } from "react"
import {
  Check,
  ChevronDown,
  ChevronUp,
  Droplets,
  Flame,
  Leaf,
  Recycle,
  Train,
  TreePine,
  Zap,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Goal {
  id: string
  title: string
  description: string
  why: string
  impact: string
  trees: number
  completed: boolean
  category: string
}

const categoryIcons: Record<string, typeof Leaf> = {
  water: Droplets,
  waste: Recycle,
  transport: Train,
  energy: Zap,
  food: Leaf,
}

const categoryColors: Record<string, string> = {
  water: "bg-blue-100 text-blue-700",
  waste: "bg-amber-100 text-amber-700",
  transport: "bg-sky-100 text-sky-700",
  energy: "bg-yellow-100 text-yellow-700",
  food: "bg-emerald-100 text-emerald-700",
}

function GoalCard({
  goal,
  onToggle,
}: {
  goal: Goal
  onToggle: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const Icon = categoryIcons[goal.category] || Leaf
  const colorClass = categoryColors[goal.category] || "bg-muted text-muted-foreground"

  return (
    <Card
      className={cn(
        "transition-all",
        goal.completed && "border-primary/30 bg-primary/5"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onToggle(goal.id)}
            className={cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
              goal.completed
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/50"
            )}
            aria-label={goal.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {goal.completed && <Check className="h-3.5 w-3.5" />}
          </button>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "font-semibold text-foreground",
                    goal.completed && "line-through text-muted-foreground"
                  )}
                >
                  {goal.title}
                </h3>
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    colorClass
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {goal.category}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                <TreePine className="h-3.5 w-3.5" />
                +{goal.trees}
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {goal.description}
            </p>

            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 self-start text-xs font-medium text-primary hover:text-primary/80"
            >
              {expanded ? "Less info" : "Why this matters?"}
              {expanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>

            {expanded && (
              <div className="flex flex-col gap-2 rounded-lg bg-secondary p-3">
                <p className="text-xs leading-relaxed text-secondary-foreground">
                  {goal.why}
                </p>
                <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                  <Flame className="h-3.5 w-3.5" />
                  <span>{goal.impact}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function GoalsScreen({
  goals,
  onToggleGoal,
  streak,
  totalTrees,
}: {
  goals: Goal[]
  onToggleGoal: (id: string) => void
  streak: number
  totalTrees: number
}) {
  const completed = goals.filter((g) => g.completed).length
  const percentage = Math.round((completed / goals.length) * 100)

  return (
    <div className="flex flex-col gap-4 px-4 pb-24 pt-4">
      <h1 className="text-xl font-bold text-foreground">Daily Goals</h1>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="flex flex-col items-center p-3">
            <span className="text-2xl font-bold text-primary">{completed}</span>
            <span className="text-xs text-muted-foreground">Completed</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-3">
            <span className="text-2xl font-bold text-foreground">
              {streak}
            </span>
            <span className="text-xs text-muted-foreground">Day Streak</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-3">
            <div className="flex items-center gap-1">
              <TreePine className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {totalTrees}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Trees</span>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Daily Progress</span>
            <span className="font-semibold text-foreground">{percentage}%</span>
          </div>
          <Progress value={percentage} className="mt-2 h-3" />
          {percentage === 100 && (
            <p className="mt-2 text-center text-sm font-medium text-primary">
              Amazing! All goals completed today!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Goal cards */}
      <div className="flex flex-col gap-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onToggle={onToggleGoal} />
        ))}
      </div>
    </div>
  )
}
