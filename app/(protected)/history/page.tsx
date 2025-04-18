"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FileAudio, FileVideo, ImageIcon, Search, SortAsc, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getUploads, toggleFavorite, type UploadRecord, DETECTION_MODELS } from "@/lib/detection-service"
import { Badge } from "@/components/ui/badge"

export default function HistoryPage() {
  const [uploads, setUploads] = useState<UploadRecord[]>([])
  const [filter, setFilter] = useState<"all" | "deepfake" | "real">("all")
  const [sortBy, setSortBy] = useState<"date" | "confidence">("date")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Load uploads from localStorage
    const loadedUploads = getUploads()
    setUploads(loadedUploads)

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      const updatedUploads = getUploads()
      setUploads(updatedUploads)
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id)
    // Update the local state
    setUploads((prev) =>
      prev.map((upload) => (upload.id === id ? { ...upload, isFavorite: !upload.isFavorite } : upload)),
    )
  }

  // Filter and sort uploads
  const filteredUploads = uploads
    .filter((upload) => {
      // Apply result filter
      if (filter === "deepfake" && upload.result !== "deepfake") return false
      if (filter === "real" && upload.result !== "real") return false

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return upload.fileName.toLowerCase().includes(query)
      }

      return true
    })
    .sort((a, b) => {
      // Sort by date or confidence
      if (sortBy === "date") {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      } else {
        return b.confidence - a.confidence
      }
    })

  return (
    <div className="container mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Upload History</h1>
          <p className="text-gray-600 dark:text-gray-300">View and manage your previous detections</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Previous Uploads</CardTitle>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Search by filename..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <SortAsc className="h-4 w-4" />
                      <span className="hidden sm:inline">Sort by</span> {sortBy === "date" ? "Date" : "Confidence"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value as "date" | "confidence")}
                    >
                      <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="confidence">Confidence</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-24">
                      {filter === "all" ? "All" : filter === "deepfake" ? "Deepfake" : "Real"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={filter}
                      onValueChange={(value) => setFilter(value as "all" | "deepfake" | "real")}
                    >
                      <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="deepfake">Deepfake</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="real">Real</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence>
              {filteredUploads.length > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12 text-center">Type</TableHead>
                          <TableHead>Filename</TableHead>
                          <TableHead className="w-24 text-center">Result</TableHead>
                          <TableHead className="w-28 text-center">Confidence</TableHead>
                          <TableHead className="hidden md:table-cell">Model</TableHead>
                          <TableHead className="w-40">Upload Date</TableHead>
                          <TableHead className="w-20 text-center">Favorite</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUploads.map((upload) => (
                          <TableRow key={upload.id}>
                            <TableCell className="text-center">
                              {upload.fileType === "image" ? (
                                <ImageIcon className="mx-auto h-5 w-5" />
                              ) : upload.fileType === "video" ? (
                                <FileVideo className="mx-auto h-5 w-5" />
                              ) : (
                                <FileAudio className="mx-auto h-5 w-5" />
                              )}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate font-medium">{upload.fileName}</TableCell>
                            <TableCell className="text-center">
                              <Badge
                                className={
                                  upload.result === "deepfake"
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-green-500 hover:bg-green-600"
                                }
                              >
                                {upload.result === "deepfake" ? "Deepfake" : "Real"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{upload.confidence}%</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {upload.modelUsed ? DETECTION_MODELS[upload.modelUsed]?.name || "Standard" : "Standard"}
                            </TableCell>
                            <TableCell>
                              {new Date(upload.uploadDate).toLocaleDateString()}{" "}
                              {new Date(upload.uploadDate).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleFavorite(upload.id)}
                                className={
                                  upload.isFavorite
                                    ? "text-yellow-500 hover:text-yellow-600"
                                    : "text-gray-400 hover:text-gray-500"
                                }
                              >
                                <Star className={`h-5 w-5 ${upload.isFavorite ? "fill-current" : ""}`} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-md border py-20 text-center"
                >
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    {uploads.length === 0
                      ? "No uploads found. Start by analyzing some files!"
                      : "No results matching your filters."}
                  </p>
                  {uploads.length === 0 && (
                    <Button
                      className="mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                      onClick={() => (window.location.href = "/upload")}
                    >
                      Go to Upload
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
