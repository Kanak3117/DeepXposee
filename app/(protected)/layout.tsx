import type React from "react"
import { MainNavigation } from "@/components/main-navigation"
import { AuthCheck } from "@/components/auth-check"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthCheck>
      <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
        <MainNavigation />
        <main className="flex-1">{children}</main>
      </div>
    </AuthCheck>
  )
}
