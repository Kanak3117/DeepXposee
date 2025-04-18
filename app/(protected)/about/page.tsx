"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AlertCircle, Github, Linkedin, Twitter } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">About DeepXpose</h1>
          <p className="text-gray-600 dark:text-gray-300">Learn about our platform and mission</p>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>Fighting misinformation through advanced deepfake detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                DeepXpose is a cutting-edge platform designed to detect deepfakes in videos, images, and audio with high
                accuracy. Our mission is to combat the spread of synthetic media by providing accessible tools that can
                verify the authenticity of digital content.
              </p>
              <p>
                As artificial intelligence advances, so does the sophistication of synthetic media. DeepXpose stays
                ahead of these developments by continuously improving our detection algorithms and techniques.
              </p>

              <Alert className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Educational Purpose</AlertTitle>
                <AlertDescription>
                  Please note that this platform is a demonstration project and uses simulated detection results. In a
                  production environment, it would integrate with real AI models for accurate deepfake detection.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Technology</CardTitle>
              <CardDescription>Advanced techniques for deepfake detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>DeepXpose employs multiple detection strategies to identify manipulated media:</p>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-1 font-semibold">Video Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our system examines inconsistencies between frames, unnatural facial expressions, irregular blinking
                    patterns, and other temporal anomalies that often appear in deepfake videos.
                  </p>
                </div>

                <div>
                  <h3 className="mb-1 font-semibold">Image Inspection</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    DeepXpose analyzes pixel-level details, lighting inconsistencies, unusual textures, and other
                    artifacts that may indicate image manipulation or synthetic generation.
                  </p>
                </div>

                <div>
                  <h3 className="mb-1 font-semibold">Audio Detection</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our audio analysis identifies irregularities in speech patterns, unnatural transitions, and spectral
                    anomalies that often appear in synthesized or manipulated voice recordings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detection Accuracy</CardTitle>
              <CardDescription>How we ensure reliable deepfake detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>DeepXpose employs a multi-layered approach to ensure high detection accuracy:</p>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-1 font-semibold">Advanced Neural Networks</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our core detection engine uses state-of-the-art convolutional neural networks trained on diverse
                    datasets of both authentic and manipulated media, achieving over 90% accuracy in controlled tests.
                  </p>
                </div>

                <div>
                  <h3 className="mb-1 font-semibold">Continuous Learning</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The system improves over time through user feedback and new training data, adapting to emerging
                    deepfake techniques and reducing false positives/negatives.
                  </p>
                </div>

                <div>
                  <h3 className="mb-1 font-semibold">Multi-factor Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Rather than relying on a single detection method, DeepXpose analyzes multiple factors including
                    visual inconsistencies, audio anomalies, and metadata patterns to provide comprehensive results.
                  </p>
                </div>

                <div>
                  <h3 className="mb-1 font-semibold">Confidence Scoring</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Each analysis includes a confidence score that indicates the reliability of the detection result,
                    giving users transparency about potential edge cases or limitations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Get in touch with the DeepXpose team</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Have questions about our platform or interested in learning more about deepfake detection? We'd love to
                hear from you. Reach out through the following channels:
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <a href="mailto:contact@deepxpose.ai" className="text-green-600 hover:underline dark:text-green-500">
                    contact@deepxpose.ai
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">Website:</span>
                  <a href="#" className="text-green-600 hover:underline dark:text-green-500">
                    www.deepxpose.ai
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">Social:</span>
                  <div className="flex gap-2">
                    <Link href="#" className="text-gray-500 hover:text-green-600 dark:hover:text-green-500">
                      <Twitter className="h-4 w-4" />
                    </Link>
                    <Link href="#" className="text-gray-500 hover:text-green-600 dark:hover:text-green-500">
                      <Github className="h-4 w-4" />
                    </Link>
                    <Link href="#" className="text-gray-500 hover:text-green-600 dark:hover:text-green-500">
                      <Linkedin className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
