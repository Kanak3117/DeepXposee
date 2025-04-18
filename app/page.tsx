"use client"

import { LoginForm } from "@/components/login-form"
import { CircleIcon as CircleNotch } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <div className="mb-8 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-3 flex items-center justify-center rounded-full bg-green-500 p-3 text-white shadow-lg"
          >
            <CircleNotch className="h-8 w-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-2 text-3xl font-bold text-gray-900 dark:text-white"
          >
            DeepXpose
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center text-gray-600 dark:text-gray-300"
          >
            Advanced deepfake detection for videos, audio, and images
          </motion.p>
        </div>
        <LoginForm />
      </motion.div>
    </main>
  )
}
