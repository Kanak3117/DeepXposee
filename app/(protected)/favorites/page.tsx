"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FileAudio, FileVideo, ImageIcon, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getFavorites, toggleFavorite, type UploadRecord } from "@/lib/detection-service"
import { Badge } from "@/components/ui/badge"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<UploadRecord[]>([])

  useEffect(() => {
    // Load favorites from localStorage
    const loadedFavorites = getFavorites()
    setFavorites(loadedFavorites)

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      const updatedFavorites = getFavorites()
      setFavorites(updatedFavorites)
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id)
    // Update the local state
    setFavorites((prev) => prev.filter((favorite) => favorite.id !== id))
  }

  return (
    <div className="container mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Favorites</h1>
          <p className="text-gray-600 dark:text-gray-300">View and manage your favorite detections</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Favorite Uploads</CardTitle>
          </CardHeader>

          <CardContent>
            <AnimatePresence>
              {favorites.length > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12 text-center">Type</TableHead>
                          <TableHead>Filename</TableHead>
                          <TableHead className="w-24 text-center">Result</TableHead>
                          <TableHead className="w-28 text-center">Confidence</TableHead>
                          <TableHead className="w-40">Upload Date</TableHead>
                          <TableHead className="w-20 text-center">Favorite</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {favorites.map((favorite) => (
                          <TableRow key={favorite.id}>
                            <TableCell className="text-center">
                              {favorite.fileType === "image" ? (
                                <ImageIcon className="mx-auto h-5 w-5" />
                              ) : favorite.fileType === "video" ? (
                                <FileVideo className="mx-auto h-5 w-5" />
                              ) : (
                                <FileAudio className="mx-auto h-5 w-5" />
                              )}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate font-medium">{favorite.fileName}</TableCell>
                            <TableCell className="text-center">
                              <Badge
                                className={
                                  favorite.result === "deepfake"
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-green-500 hover:bg-green-600"
                                }
                              >
                                {favorite.result === "deepfake" ? "Deepfake" : "Real"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{favorite.confidence}%</TableCell>
                            <TableCell>
                              {new Date(favorite.uploadDate).toLocaleDateString()}{" "}
                              {new Date(favorite.uploadDate).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleFavorite(favorite.id)}
                                className="text-yellow-500 hover:text-yellow-600"
                              >
                                <Star className="h-5 w-5 fill-current" />
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
                    No favorites yet. Star items from your History to add them here!
                  </p>
                  <Button
                    className="mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                    onClick={() => (window.location.href = "/history")}
                  >
                    Go to History
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
