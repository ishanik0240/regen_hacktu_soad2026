/**
 * Contact sync and friends activity service.
 * Fetches contacts (simulated when device API unavailable), matches to app users,
 * returns friend activity for the Community "Friends Activity" feed.
 */

export type ActivityType = "post" | "event"

export interface FriendActivityItem {
  id: string
  name: string
  avatar?: string
  activityType: ActivityType
  title: string
  image?: string
  timestamp: string
}

export interface ContactMatch {
  id: string
  name: string
  avatar: string
  phone?: string
}

const MOCK_APP_USERS: ContactMatch[] = [
  { id: "u1", name: "Ishani", avatar: "IS", phone: "+91 98765 43210" },
  { id: "u2", name: "Arjun", avatar: "AR", phone: "+91 98765 43211" },
  { id: "u3", name: "Priya", avatar: "PR", phone: "+91 98765 43212" },
  { id: "u4", name: "ReGen Community", avatar: "RC" },
  { id: "u5", name: "Mandeep", avatar: "MR", phone: "+91 98765 43213" },
  { id: "u6", name: "Simran", avatar: "SI", phone: "+91 98765 43214" },
]

const MOCK_FRIEND_ACTIVITY: FriendActivityItem[] = [
  {
    id: "fa1",
    name: "Ishani",
    avatar: "IS",
    activityType: "event",
    title: "joined Clean City Drive 🌱",
    image: "/signin-forest.png",
    timestamp: "2h ago",
  },
  {
    id: "fa2",
    name: "Arjun",
    avatar: "AR",
    activityType: "post",
    title: "Posted about canal clean-up",
    image: "/abc.jpg",
    timestamp: "5h ago",
  },
  {
    id: "fa3",
    name: "Priya",
    avatar: "PR",
    activityType: "event",
    title: "joined Tree plantation drive 🌱",
    image: "/signin-forest.png",
    timestamp: "1d ago",
  },
  {
    id: "fa4",
    name: "ReGen Community",
    avatar: "RC",
    activityType: "event",
    title: "Organized Cleanliness Drive at Baradari Garden",
    image: "/signin-forest.png",
    timestamp: "1d ago",
  },
  {
    id: "fa5",
    name: "Mandeep",
    avatar: "MR",
    activityType: "post",
    title: "Posted about AQI and stubble burning",
    timestamp: "2d ago",
  },
]

const STORAGE_KEY = "regen_synced_friend_ids"

/**
 * Simulate fetching device contacts.
 * In a real app would use Contacts API or similar with user permission.
 */
export async function fetchContacts(): Promise<ContactMatch[]> {
  await new Promise((r) => setTimeout(r, 600))
  return [
    { id: "c1", name: "Ishani", avatar: "IS", phone: "+91 98765 43210" },
    { id: "c2", name: "Arjun", avatar: "AR", phone: "+91 98765 43211" },
    { id: "c3", name: "Priya", avatar: "PR", phone: "+91 98765 43212" },
    { id: "c4", name: "Mandeep", avatar: "MR", phone: "+91 98765 43213" },
    { id: "c5", name: "Simran", avatar: "SI", phone: "+91 98765 43214" },
  ]
}

/**
 * Match contacts to app users (by name or phone in real impl).
 */
export function matchContactsToAppUsers(
  contacts: ContactMatch[]
): ContactMatch[] {
  const names = new Set(contacts.map((c) => c.name.toLowerCase()))
  return MOCK_APP_USERS.filter((u) =>
    names.has(u.name.toLowerCase())
  )
}

/**
 * Persist synced friend IDs (e.g. to localStorage for session).
 */
export function saveSyncedFriendIds(ids: string[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // ignore
  }
}

export function getSyncedFriendIds(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Sync contacts: fetch, match, save, return matched friends.
 */
export async function syncContacts(): Promise<{
  success: boolean
  matchedCount: number
  friends: ContactMatch[]
}> {
  const contacts = await fetchContacts()
  const friends = matchContactsToAppUsers(contacts)
  const ids = friends.map((f) => f.id)
  saveSyncedFriendIds(ids)
  return {
    success: true,
    matchedCount: friends.length,
    friends,
  }
}

/**
 * Get activity feed for synced friends.
 */
export function getFriendActivity(): FriendActivityItem[] {
  const ids = getSyncedFriendIds()
  if (ids.length === 0) return []
  const idSet = new Set(ids)
  const nameSet = new Set(
    MOCK_APP_USERS.filter((u) => idSet.has(u.id)).map((u) => u.name)
  )
  return MOCK_FRIEND_ACTIVITY.filter((a) => nameSet.has(a.name))
}
