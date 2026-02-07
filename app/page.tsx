"use client"

import { useState, useCallback } from "react"
import { BottomNav, type TabId } from "@/components/bottom-nav"
import { Onboarding } from "@/components/onboarding"
import { HomeScreen } from "@/components/home-screen"
import { GoalsScreen } from "@/components/goals-screen"
import { CommunityScreen } from "@/components/community-screen"
import { ExploreScreen } from "@/components/explore-screen"
import { ProfileScreen } from "@/components/profile-screen"
import { dailyGoals, communityPosts } from "@/lib/mock-data"

export default function Page() {
  
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("home")
  const [goals, setGoals] = useState(dailyGoals)
  const [totalTrees, setTotalTrees] = useState(47)
  const [streak] = useState(5)

  const completedGoals = goals.filter((g) => g.completed).length

  const handleToggleGoal = useCallback(
    (id: string) => {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id === id) {
            const newCompleted = !g.completed
            if (newCompleted) {
              setTotalTrees((t) => t + g.trees)
            } else {
              setTotalTrees((t) => Math.max(0, t - g.trees))
            }
            return { ...g, completed: newCompleted }
          }
          return g
        })
      )
    },
    []
  )

  const handlePointsEarned = useCallback(
    (amount: number, _action: string) => {
      setTotalTrees((t) => t + amount)
    },
    []
  )

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />
  }

  return (
    <main className="mx-auto min-h-svh max-w-lg bg-background">
      {activeTab === "home" && (
        <HomeScreen
          completedGoals={completedGoals}
          totalGoals={goals.length}
          trees={totalTrees}
        />
      )}
      {activeTab === "goals" && (
        <GoalsScreen
          goals={goals}
          onToggleGoal={handleToggleGoal}
          streak={streak}
          totalTrees={totalTrees}
        />
      )}
      {activeTab === "community" && (
        <CommunityScreen
          posts={communityPosts}
          cityName="Patiala"
          onPointsEarned={handlePointsEarned}
        />
      )}
      {activeTab === "explore" && (
        <ExploreScreen onPointsEarned={handlePointsEarned} />
      )}
      {activeTab === "profile" && (
        <ProfileScreen
          profile={{
            name: "Arjun Singh",
            email: "arjun.singh@gmail.com",
            dob: "March 15, 2001",
            totalTrees,
            goalsCompleted: completedGoals + 42,
            streak,
            postsCreated: 12,
            postsUpvoted: 34,
          }}
          onLogout={() => setShowOnboarding(true)}
        />
      )}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}
