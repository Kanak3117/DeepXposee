"use client"

import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CircleIcon as CircleNotch, History, Home, Info, LogOut, Star, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import Link from "next/link"

export function MainNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!mounted) return null

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="mr-2 rounded-full bg-green-600 p-1.5 text-white"
          >
            <CircleNotch className="h-5 w-5" />
          </motion.div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">DeepXpose</span>
        </div>

        <nav className="hidden md:flex">
          <ul className="flex space-x-1">
            {[
              { href: "/dashboard", icon: Home, label: "Dashboard" },
              { href: "/upload", icon: Upload, label: "Upload" },
              { href: "/history", icon: History, label: "History" },
              { href: "/favorites", icon: Star, label: "Favorites" },
              { href: "/about", icon: Info, label: "About" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-green-600 dark:bg-green-400"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>

      {/* Mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 md:hidden">
        <nav className="mx-auto max-w-md">
          <ul className="flex justify-around">
            {[
              { href: "/dashboard", icon: Home, label: "Home" },
              { href: "/upload", icon: Upload, label: "Upload" },
              { href: "/history", icon: History, label: "History" },
              { href: "/favorites", icon: Star, label: "Favorites" },
              { href: "/about", icon: Info, label: "About" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2 px-4 text-xs",
                    pathname === item.href ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.div>
  )
}
