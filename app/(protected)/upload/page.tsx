"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import {
  AlertCircle,
  CircleCheck,
  CircleX,
  FileAudio,
  FileVideo,
  ImageIcon,
  Loader2,
  Shield,
  UploadCloud,
} from "lucide-react"

import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { detectDeepfake, saveUpload, type DetectionModel, DETECTION_MODELS } from "@/lib/detection-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<"image" | "video" | "audio">("image")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedModel, setSelectedModel] = useState<DetectionModel>("quantumdetect")
  const [result, setResult] = useState<{
    isDeepfake: boolean
    confidence: number
    anomalyScore: number
    detectionTime: number
    modelUsed: DetectionModel
  } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    // Clear previous results
    setResult(null)
    setProgress(0)

    // Validate file type based on selected tab
    let isValidType = false

    switch (fileType) {
      case "image":
        isValidType = file.type.startsWith("image/")
        break
      case "video":
        isValidType = file.type.startsWith("video/")
        break
      case "audio":
        isValidType = file.type.startsWith("audio/")
        break
    }

    if (!isValidType) {
      toast({
        title: "Invalid file type",
        description: `Please upload a ${fileType} file`,
        variant: "destructive",
      })
      return
    }

    // Set the file and create a preview for images or videos
    setUploadedFile(file)

    // Create preview URL for images and videos
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleAnalyze = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)

    try {
      // Call the detection service with selected model
      const detectionResult = await detectDeepfake(uploadedFile, selectedModel, setProgress)

      // Set the result
      setResult({
        isDeepfake: detectionResult.result === "deepfake",
        confidence: detectionResult.confidence,
        anomalyScore: detectionResult.anomalyScore,
        detectionTime: detectionResult.detectionTime,
        modelUsed: detectionResult.modelUsed,
      })

      // Save the upload to history
      const uploadRecord = {
        id: uuidv4(),
        fileName: uploadedFile.name,
        fileType: fileType,
        result: detectionResult.result,
        confidence: detectionResult.confidence,
        uploadDate: new Date().toISOString(),
        isFavorite: false,
        thumbnailUrl: previewUrl || undefined,
        modelUsed: detectionResult.modelUsed,
        detectionTime: detectionResult.detectionTime,
        anomalyScore: detectionResult.anomalyScore,
      }

      saveUpload(uploadRecord)

      toast({
        title: "Analysis complete",
        description: `${uploadedFile.name} has been analyzed successfully.`,
      })
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your file.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const viewHistory = () => {
    router.push("/history")
  }

  const resetUpload = () => {
    setUploadedFile(null)
    setResult(null)
    setProgress(0)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Deepfake Detection</h1>
          <p className="text-gray-600 dark:text-gray-300">Upload media to analyze and detect potential deepfakes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Media Upload & Analysis</CardTitle>
            <CardDescription>Select a file type and upload your media for deepfake detection</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              value={fileType}
              onValueChange={(value) => {
                setFileType(value as "image" | "video" | "audio")
                resetUpload()
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="mt-6">
                <div className="mb-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Image Detection</AlertTitle>
                    <AlertDescription>
                      Upload images to detect face swaps, manipulated content, and AI-generated images
                    </AlertDescription>
                  </Alert>
                </div>

                <UploadSection
                  fileType="image"
                  icon={ImageIcon}
                  uploadedFile={uploadedFile}
                  handleUpload={handleUpload}
                  previewUrl={previewUrl}
                />
              </TabsContent>

              <TabsContent value="video" className="mt-6">
                <div className="mb-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Video Detection</AlertTitle>
                    <AlertDescription>
                      Upload videos to detect facial manipulation, voice synthesis, and movement anomalies
                    </AlertDescription>
                  </Alert>
                </div>

                <UploadSection
                  fileType="video"
                  icon={FileVideo}
                  uploadedFile={uploadedFile}
                  handleUpload={handleUpload}
                  previewUrl={previewUrl}
                />
              </TabsContent>

              <TabsContent value="audio" className="mt-6">
                <div className="mb-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Audio Detection</AlertTitle>
                    <AlertDescription>
                      Upload audio files to detect voice cloning, synthetic speech, and audio manipulation
                    </AlertDescription>
                  </Alert>
                </div>

                <UploadSection
                  fileType="audio"
                  icon={FileAudio}
                  uploadedFile={uploadedFile}
                  handleUpload={handleUpload}
                  previewUrl={previewUrl}
                />
              </TabsContent>
            </Tabs>

            {/* Model Selection */}
            <div className="mt-6">
              <Label htmlFor="model-select" className="mb-2 block">
                Detection Model
              </Label>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <Select
                    value={selectedModel}
                    onValueChange={(value) => setSelectedModel(value as DetectionModel)}
                    disabled={isAnalyzing}
                  >
                    <SelectTrigger id="model-select" className="w-full">
                      <SelectValue placeholder="Select a detection model" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DETECTION_MODELS).map(([key, model]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center justify-between gap-2">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {model.accuracy.toFixed(1)}% Accuracy
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="hidden sm:block">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  >
                    {DETECTION_MODELS[selectedModel].accuracy.toFixed(1)}% Accuracy
                  </Badge>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {DETECTION_MODELS[selectedModel].description}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {DETECTION_MODELS[selectedModel].bestFor.map((type) => (
                  <Badge key={type} variant="outline" className="text-xs">
                    Best for {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Analysis Progress and Results */}
            <AnimatePresence mode="wait">
              {isAnalyzing && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Analyzing file...</span>
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                  </div>

                  <Progress value={progress} className="h-2" />

                  <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Running {DETECTION_MODELS[selectedModel].name} analysis...</span>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 rounded-lg border p-6"
                >
                  <div className="mb-4 flex items-center justify-center">
                    {result.isDeepfake ? (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
                        <CircleX className="h-8 w-8" />
                        <span className="text-xl font-bold">Deepfake Detected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                        <CircleCheck className="h-8 w-8" />
                        <span className="text-xl font-bold">Authentic Media</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4 text-center">
                    <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Confidence Score</div>
                    <div className="text-3xl font-bold">{result.confidence}%</div>
                  </div>

                  <div className="mb-6 flex justify-center">
                    <div
                      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                        result.confidence > 95
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : result.confidence > 85
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {result.confidence > 95
                        ? "Very High Confidence"
                        : result.confidence > 85
                          ? "High Confidence"
                          : "Medium Confidence"}
                    </div>
                  </div>

                  <div className="mb-6 grid gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50 sm:grid-cols-3">
                    <div className="text-center">
                      <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Model Used</div>
                      <div className="mt-1 font-medium">{DETECTION_MODELS[result.modelUsed].name}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                        Anomaly Score
                      </div>
                      <div className="mt-1 font-medium">{result.anomalyScore}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                        Processing Time
                      </div>
                      <div className="mt-1 font-medium">{result.detectionTime}s</div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {result.isDeepfake ? (
                      <p>
                        This media has been identified as likely manipulated or AI-generated. We recommend treating this
                        content with caution.
                      </p>
                    ) : (
                      <p>
                        No significant indications of manipulation were detected. This content appears to be authentic.
                      </p>
                    )}
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <p className="mb-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      Was this detection accurate?
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Thank you for your feedback",
                            description: "Your input helps improve our detection algorithms.",
                          })
                        }}
                      >
                        Yes, correct
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Thank you for your feedback",
                            description: "We'll use this to improve our detection accuracy.",
                          })

                          // In a real app, this would send feedback to the server
                          console.log("User reported incorrect detection for:", uploadedFile?.name)
                        }}
                      >
                        No, incorrect
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
            {uploadedFile && !result && (
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 sm:w-auto"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Start Analysis
                  </>
                )}
              </Button>
            )}

            {result && (
              <Button onClick={resetUpload} variant="outline" className="w-full sm:w-auto">
                Analyze Another File
              </Button>
            )}

            <Button onClick={viewHistory} variant="outline" className="w-full sm:w-auto">
              View History
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

interface UploadSectionProps {
  fileType: "image" | "video" | "audio"
  icon: React.ElementType
  uploadedFile: File | null
  handleUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  previewUrl: string | null
}

function UploadSection({ fileType, icon: Icon, uploadedFile, handleUpload, previewUrl }: UploadSectionProps) {
  return (
    <div className="grid gap-6">
      <div>
        <Label htmlFor={`${fileType}-upload`} className="mb-2 block">
          Upload {fileType}
        </Label>

        <div className="mt-2">
          {!uploadedFile ? (
            <Label
              htmlFor={`${fileType}-upload`}
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <UploadCloud className="mb-3 h-10 w-10 text-gray-400" />
                </motion.div>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {fileType === "image" && "PNG, JPG or GIF"}
                  {fileType === "video" && "MP4, MOV or AVI"}
                  {fileType === "audio" && "MP3, WAV or M4A"}
                </p>
              </div>
              <input
                id={`${fileType}-upload`}
                type="file"
                className="hidden"
                onChange={handleUpload}
                accept={fileType === "image" ? "image/*" : fileType === "video" ? "video/*" : "audio/*"}
              />
            </Label>
          ) : (
            <div className="rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 dark:text-white">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const input = document.getElementById(`${fileType}-upload`) as HTMLInputElement
                    if (input) input.value = ""
                    // Clear the uploaded file
                    if (previewUrl) URL.revokeObjectURL(previewUrl)
                  }}
                >
                  Change
                </Button>
              </div>

              {/* Preview for images and videos */}
              {previewUrl && (
                <div className="mt-4 overflow-hidden rounded-md">
                  {fileType === "image" ? (
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="h-auto max-h-64 w-full object-contain"
                    />
                  ) : fileType === "video" ? (
                    <video src={previewUrl} controls className="h-auto max-h-64 w-full" />
                  ) : null}
                </div>
              )}

              {/* Audio preview */}
              {fileType === "audio" && uploadedFile && (
                <div className="mt-4">
                  <audio controls className="w-full" src={previewUrl || undefined} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
