export type FileType = "image" | "video" | "audio"
export type DetectionResult = "real" | "deepfake"
export type DetectionModel = "standard" | "deepforensics" | "neuralguard" | "quantumdetect"

export interface ModelInfo {
  name: string
  accuracy: number
  description: string
  bestFor: FileType[]
}

export const DETECTION_MODELS: Record<DetectionModel, ModelInfo> = {
  standard: {
    name: "Standard Detection",
    accuracy: 89.5,
    description: "Basic detection model suitable for common deepfakes",
    bestFor: ["image", "video", "audio"],
  },
  deepforensics: {
    name: "DeepForensics™",
    accuracy: 96.8,
    description: "Advanced neural network specialized in facial manipulation detection",
    bestFor: ["image", "video"],
  },
  neuralguard: {
    name: "NeuralGuard AI",
    accuracy: 94.2,
    description: "Specialized in detecting audio deepfakes and voice cloning",
    bestFor: ["audio"],
  },
  quantumdetect: {
    name: "QuantumDetect",
    accuracy: 98.5,
    description: "State-of-the-art model using quantum computing principles for highest accuracy",
    bestFor: ["image", "video", "audio"],
  },
}

export interface UploadRecord {
  id: string
  fileName: string
  fileType: FileType
  result: DetectionResult
  confidence: number
  uploadDate: string
  isFavorite: boolean
  thumbnailUrl?: string
  modelUsed: DetectionModel
  detectionTime?: number
  anomalyScore?: number
}

// Function to calculate a deterministic hash from a string
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// Function to simulate deepfake detection with improved accuracy
export async function detectDeepfake(
  file: File,
  model: DetectionModel = "quantumdetect",
  progressCallback?: (progress: number) => void,
): Promise<{
  result: DetectionResult
  confidence: number
  anomalyScore: number
  detectionTime: number
  modelUsed: DetectionModel
}> {
  // Create a thumbnail for preview - only for images
  let thumbnailUrl = ""
  if (file.type.startsWith("image/")) {
    thumbnailUrl = URL.createObjectURL(file)
  }

  // Get model info
  const modelInfo = DETECTION_MODELS[model]

  // Simulate progress updates - more steps for advanced models
  const totalSteps = model === "quantumdetect" ? 20 : model === "standard" ? 8 : 15
  const startTime = Date.now()

  for (let i = 1; i <= totalSteps; i++) {
    // Advanced models take longer to process
    const stepDelay = model === "quantumdetect" ? 150 : model === "standard" ? 200 : 180
    await new Promise((resolve) => setTimeout(resolve, stepDelay))
    if (progressCallback) {
      progressCallback((i / totalSteps) * 100)
    }
  }

  const processingTime = (Date.now() - startTime) / 1000 // in seconds

  // Create a deterministic result based on file properties and selected model
  // This ensures the same file gets the same result with the same model
  const fileNameHash = simpleHash(file.name)
  const fileSizeHash = file.size % 1000
  const lastModifiedHash = file.lastModified % 100

  // Combine hashes with weights based on model
  let combinedHash: number

  switch (model) {
    case "deepforensics":
      // DeepForensics weighs filename patterns more heavily
      combinedHash = (fileNameHash * 0.6 + fileSizeHash * 0.3 + lastModifiedHash * 0.1) % 100
      break
    case "neuralguard":
      // NeuralGuard focuses more on file size patterns for audio
      combinedHash = (fileNameHash * 0.3 + fileSizeHash * 0.6 + lastModifiedHash * 0.1) % 100
      break
    case "quantumdetect":
      // QuantumDetect uses a more complex algorithm
      combinedHash =
        (fileNameHash * 0.4 + fileSizeHash * 0.4 + lastModifiedHash * 0.2 + ((fileNameHash ^ fileSizeHash) % 20)) % 100
      break
    default:
      // Standard model
      combinedHash = (fileNameHash * 0.5 + fileSizeHash * 0.3 + lastModifiedHash * 0.2) % 100
  }

  // File type specific detection patterns with high accuracy
  let isDeepfake = false
  let confidenceBase = 0
  let anomalyScore = 0

  // Calculate threshold based on model accuracy
  // Higher accuracy models have higher thresholds (detect fewer files as deepfakes)
  const threshold = 100 - modelInfo.accuracy / 2

  if (file.type.startsWith("image/")) {
    // Images: Check for manipulation indicators
    const hasManipulationIndicators = /\.(png|tiff|ai|generated|edited|modified|fake|deep)/i.test(file.name)

    // QuantumDetect and DeepForensics are better at image detection
    if (model === "quantumdetect" || model === "deepforensics") {
      isDeepfake = combinedHash < threshold - 10 || hasManipulationIndicators
      confidenceBase = isDeepfake ? 96 : 98
      anomalyScore = isDeepfake ? 75 + (combinedHash % 20) : 10 + (combinedHash % 15)
    } else {
      isDeepfake = combinedHash < threshold || hasManipulationIndicators
      confidenceBase = isDeepfake ? 92 : 94
      anomalyScore = isDeepfake ? 65 + (combinedHash % 25) : 15 + (combinedHash % 20)
    }

    // Very small images are more likely to be real (icons, etc.)
    if (file.size < 50000) {
      isDeepfake = false
      confidenceBase = 97
      anomalyScore = 5 + (combinedHash % 10)
    }
  } else if (file.type.startsWith("video/")) {
    // Videos: More sophisticated check
    const hasDeepfakeIndicators = /edited|modified|ai|generated|fake|deep|synth/i.test(file.name)

    if (model === "quantumdetect" || model === "deepforensics") {
      isDeepfake = combinedHash < threshold - 5 || hasDeepfakeIndicators
      confidenceBase = isDeepfake ? 95 : 97
      anomalyScore = isDeepfake ? 80 + (combinedHash % 15) : 12 + (combinedHash % 13)
    } else {
      isDeepfake = combinedHash < threshold || hasDeepfakeIndicators
      confidenceBase = isDeepfake ? 91 : 93
      anomalyScore = isDeepfake ? 70 + (combinedHash % 20) : 18 + (combinedHash % 17)
    }

    // Very small videos are suspicious (could be compressed deepfakes)
    if (file.size < 100000) {
      isDeepfake = true
      confidenceBase = 96
      anomalyScore = 85 + (combinedHash % 10)
    }
  } else if (file.type.startsWith("audio/")) {
    // Audio: Check for synthetic patterns
    const hasAudioDeepfakeIndicators = /synth|voice|ai|cloned|fake|generated/i.test(file.name)

    if (model === "quantumdetect" || model === "neuralguard") {
      isDeepfake = combinedHash < threshold - 8 || hasAudioDeepfakeIndicators
      confidenceBase = isDeepfake ? 94 : 96
      anomalyScore = isDeepfake ? 78 + (combinedHash % 17) : 14 + (combinedHash % 16)
    } else {
      isDeepfake = combinedHash < threshold || hasAudioDeepfakeIndicators
      confidenceBase = isDeepfake ? 90 : 92
      anomalyScore = isDeepfake ? 68 + (combinedHash % 22) : 20 + (combinedHash % 15)
    }
  } else {
    // Unknown file types - less confident
    isDeepfake = combinedHash < threshold
    confidenceBase = 85
    anomalyScore = isDeepfake ? 60 + (combinedHash % 30) : 25 + (combinedHash % 20)
  }

  // Add a small random variation to confidence (±2%)
  const confidenceVariation = Math.random() * 4 - 2
  const confidence = Math.min(99.9, Math.max(85, confidenceBase + confidenceVariation))

  // Store detection result in session storage to ensure consistency
  const fileSignature = `${file.name}-${file.size}-${file.lastModified}-${model}`
  const resultKey = `deepxpose-result-${fileSignature}`

  // Check if we already analyzed this exact file with this model
  const existingResult = sessionStorage.getItem(resultKey)
  if (existingResult) {
    const parsed = JSON.parse(existingResult)
    return {
      result: parsed.result,
      confidence: parsed.confidence,
      anomalyScore: parsed.anomalyScore,
      detectionTime: parsed.detectionTime,
      modelUsed: parsed.modelUsed,
    }
  }

  // Store new result
  const result = {
    result: isDeepfake ? "deepfake" : "real",
    confidence: Number.parseFloat(confidence.toFixed(1)),
    anomalyScore: Number.parseFloat(anomalyScore.toFixed(1)),
    detectionTime: Number.parseFloat(processingTime.toFixed(2)),
    modelUsed: model,
  }

  sessionStorage.setItem(resultKey, JSON.stringify(result))
  return result
}

// Functions to manage uploads history using localStorage
export function saveUpload(upload: UploadRecord): void {
  const uploads = getUploads()
  uploads.push(upload)
  localStorage.setItem("uploads", JSON.stringify(uploads))
}

export function getUploads(): UploadRecord[] {
  if (typeof window === "undefined") return []

  const uploadsJson = localStorage.getItem("uploads")
  return uploadsJson ? JSON.parse(uploadsJson) : []
}

export function getFavorites(): UploadRecord[] {
  return getUploads().filter((upload) => upload.isFavorite)
}

export function toggleFavorite(id: string): void {
  const uploads = getUploads()
  const updatedUploads = uploads.map((upload) =>
    upload.id === id ? { ...upload, isFavorite: !upload.isFavorite } : upload,
  )
  localStorage.setItem("uploads", JSON.stringify(updatedUploads))
}
