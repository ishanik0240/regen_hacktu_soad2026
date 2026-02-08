"use client"

import { useState } from "react"
import {
  Check,
  ChevronDown,
  ChevronUp,
  Droplets,
  Flame,
  Leaf,
  Plus,
  Recycle,
  Train,
  TreePine,
  Zap,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  custom: Plus,
}

const categoryColors: Record<string, string> = {
  water: "bg-sky-100/90 text-sky-800",
  waste: "bg-slate-100/90 text-slate-700",
  transport: "bg-cyan-100/90 text-cyan-800",
  energy: "bg-teal-100/90 text-teal-800",
  food: "bg-emerald-100/90 text-emerald-800",
  custom: "bg-indigo-100/90 text-indigo-800",
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

function AddGoalDialog({ onAddGoal }: { onAddGoal: (title: string, description?: string) => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return
    onAddGoal(trimmedTitle, description.trim() || undefined)
    setTitle("")
    setDescription("")
    setOpen(false)
  }



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="border-dashed border-2 border-muted-foreground/30 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center gap-2 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Add your own goal
            </span>
            <span className="text-xs text-muted-foreground">
              +5 trees when completed
            </span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add your own goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Goal title</Label>
            <Input
              id="goal-title"
              placeholder="e.g. Bike to work today"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-desc">Description (optional)</Label>
            <Input
              id="goal-desc"
              placeholder="Add a short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Add goal (+5 trees)
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function GoalsScreen({
  goals,
  onToggleGoal,
  onAddGoal,
  streak,
  totalTrees,
}: {
  goals: Goal[]
  onToggleGoal: (id: string) => void
  onAddGoal: (title: string, description?: string) => void
  streak: number
  totalTrees: number
}) {
  const completed = goals.filter((g) => g.completed).length
  const percentage = goals.length > 0 ? Math.round((completed / goals.length) * 100) : 0

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
        <AddGoalDialog onAddGoal={onAddGoal} />
      </div>
    </div>
  )
}
