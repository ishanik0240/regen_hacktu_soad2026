"use client"

import { UsedImagesProvider } from "@/contexts/used-images-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return <UsedImagesProvider>{children}</UsedImagesProvider>
}
