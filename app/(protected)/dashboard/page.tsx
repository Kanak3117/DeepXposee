"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileAudio, FileVideo, ImageIcon, Upload } from "lucide-react"
import { DETECTION_MODELS } from "@/lib/detection-service"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">DeepXpose Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Upload and analyze media to detect deepfakes with high accuracy
        </p>
      </motion.div>

      <div className="mx-auto max-w-4xl space-y-8">
        {/* Upload CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md dark:from-green-700 dark:to-emerald-800"
        >
          <div className="p-6 text-white">
            <h2 className="text-xl font-semibold">Detect Deepfakes</h2>
            <p className="mt-1 text-emerald-100">Upload videos, images, or audio to analyze for manipulation</p>
          </div>
          <div className="bg-white p-6 dark:bg-gray-800">
            <Link href="/upload">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                size="lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Media for Analysis
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Detection Models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Available Detection Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(DETECTION_MODELS).map(([key, model], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="rounded-lg border p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium">{model.name}</h3>
                      <div className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {model.accuracy.toFixed(1)}% Accuracy
                      </div>
                    </div>
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{model.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {model.bestFor.map((type) => (
                        <span
                          key={type}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detection Services */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: "Video Detection",
              icon: FileVideo,
              description: "Analyze videos for facial manipulation, voice synthesis, and movement anomalies",
              color: "from-blue-500 to-purple-600",
            },
            {
              title: "Audio Detection",
              icon: FileAudio,
              description: "Identify synthetic voices, spliced audio, and AI-generated sound",
              color: "from-orange-500 to-red-600",
            },
            {
              title: "Image Detection",
              icon: ImageIcon,
              description: "Detect manipulated images, face swaps, and generated content",
              color: "from-green-500 to-emerald-600",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-white`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detection Accuracy Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Detection Accuracy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">QuantumDetect</span>
                <span className="font-medium text-green-600 dark:text-green-500">98.5% Accurate</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-full w-[98.5%] rounded-full bg-green-500"></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">DeepForensics™</span>
                <span className="font-medium text-green-600 dark:text-green-500">96.8% Accurate</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-full w-[96.8%] rounded-full bg-green-500"></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">NeuralGuard AI</span>
                <span className="font-medium text-green-600 dark:text-green-500">94.2% Accurate</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-full w-[94.2%] rounded-full bg-green-500"></div>
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Our detection algorithms are continuously improving through machine learning and user feedback. Current
                accuracy rates are based on benchmark testing against known datasets.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
