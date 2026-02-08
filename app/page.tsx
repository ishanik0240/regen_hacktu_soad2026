"use client"

import { useState, useCallback } from "react"
import { BottomNav, type TabId } from "@/components/bottom-nav"
import { SignIn } from "@/components/sign-in"
import { Onboarding } from "@/components/onboarding"
import { LocationStep } from "@/components/location-step"
import { HomeScreen } from "@/components/home-screen"
import { GoalsScreen } from "@/components/goals-screen"
import { CommunityScreen } from "@/components/community-screen"
import { ExploreScreen } from "@/components/explore-screen"
import { ProfileScreen } from "@/components/profile-screen"
import { dailyGoals, communityPosts } from "@/lib/mock-data"
import { communitySamplePosts } from "@/data/community-sample"

function mapSampleToPost(
  s: (typeof communitySamplePosts)[0]
): (typeof communityPosts)[0] & { title?: string; imageUrl?: string } {
  return {
    id: s.id,
    username: s.user,
    avatar: s.user.slice(0, 2).toUpperCase(),
    content: s.content,
    upvotes: 42,
    comments: 8,
    category: "deforestation",
    city: "Patiala",
    timeAgo: "2h ago",
    title: s.title,
    imageUrl: s.image,
  }
}

const mergedCommunityPosts = [
  ...communitySamplePosts.map(mapSampleToPost),
  ...communityPosts,
]

export default function Page() {
  const [signedIn, setSignedIn] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [showLocationStep, setShowLocationStep] = useState(false)
  const [selectedCity, setSelectedCity] = useState("Patiala")
  const [activeTab, setActiveTab] = useState<TabId>("home")
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
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

  const handleAddGoal = useCallback(
    (title: string, description?: string) => {
      setGoals((prev) => [
        ...prev,
        {
          id: `custom-${Date.now()}`,
          title,
          description: description || "Your personal climate action.",
          why: "Every small action counts toward a healthier planet.",
          impact: "Custom goal — you're making a difference!",
          trees: 5,
          completed: false,
          category: "custom",
        },
      ])
    },
    []
  )

  const handlePointsEarned = useCallback(
    (amount: number, _action: string) => {
      setTotalTrees((t) => t + amount)
    },
    []
  )

  if (!signedIn) {
    return <SignIn onSignIn={() => setSignedIn(true)} />
  }

  if (showOnboarding) {
    return (
      <Onboarding
        onComplete={() => {
          setShowOnboarding(false)
          setShowLocationStep(true)
        }}
      />
    )
  }

  if (showLocationStep) {
    return (
      <LocationStep
        onComplete={(cityName) => {
          setSelectedCity(cityName)
          setShowLocationStep(false)
        }}
        onSkip={() => setShowLocationStep(false)}
      />
    )
  }

  return (
    <main className="mx-auto min-h-svh max-w-lg bg-background">
      {activeTab === "home" && (
        <HomeScreen
          completedGoals={completedGoals}
          totalGoals={goals.length}
          trees={totalTrees}
          cityName={selectedCity}
          communityPosts={mergedCommunityPosts}
          onNavigateToGoals={() => setActiveTab("goals")}
          onNavigateToCommunityPost={(postId) => {
            setSelectedPostId(postId)
            setActiveTab("community")
          }}
        />
      )}
      {activeTab === "goals" && (
        <GoalsScreen
          goals={goals}
          onToggleGoal={handleToggleGoal}
          onAddGoal={handleAddGoal}
          streak={streak}
          totalTrees={totalTrees}
        />
      )}
      {activeTab === "community" && (
        <CommunityScreen
          posts={mergedCommunityPosts}
          cityName={selectedCity}
          onPointsEarned={handlePointsEarned}
          selectedPostId={selectedPostId}
          onClearSelectedPost={() => setSelectedPostId(null)}
        />
      )}
      {activeTab === "explore" && (
        <ExploreScreen
          onPointsEarned={handlePointsEarned}
          defaultCity={selectedCity}
        />
      )}
      {activeTab === "profile" && (
        <ProfileScreen
          profile={{
            name: "Arjun Singh",
            email: "arjun.singh@gmail.com",
            totalTrees,
            goalsCompleted: completedGoals + 42,
            streak,
            postsCreated: 12,
            postsUpvoted: 34,
          }}
          onLogout={() => {
            setSignedIn(false)
            setShowOnboarding(true)
            setShowLocationStep(false)
          }}
        />
      )}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}
