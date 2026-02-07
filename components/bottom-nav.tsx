"use client"

import { Home, Target, Users, Search, User } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "goals", label: "Goals", icon: Target },
  { id: "community", label: "Community", icon: Users },
  { id: "explore", label: "Explore", icon: Search },
  { id: "profile", label: "Profile", icon: User },
] as const

export type TabId = (typeof tabs)[number]["id"]

export function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all",
                  isActive && "scale-110"
                )}
              />
              <span className={cn("font-medium", isActive && "font-bold")}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
