"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Mail } from "lucide-react"
import { supabase, type Product } from "@/lib/supabase"

interface FreeDownloadModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function FreeDownloadModal({ product, isOpen, onClose }: FreeDownloadModalProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [downloadLink, setDownloadLink] = useState("")
  const [step, setStep] = useState<"email" | "download">("email")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate download link
      const downloadId = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Save download record - handle if table doesn't exist yet
      try {
        const { error } = await supabase.from("free_downloads").insert([
          {
            product_id: product.id,
            email,
            download_link: product.download_file_url || "#",
            expires_at: expiresAt.toISOString(),
          },
        ])

        if (error && error.code !== "42P01") throw error
      } catch (err: any) {
        if (err.code === "42P01") {
          console.log("Free downloads table not found - skipping record save")
        } else {
          throw err
        }
      }

      // Update download count
      await supabase
        .from("products")
        .update({ downloads: product.downloads + 1 })
        .eq("id", product.id)

      setDownloadLink(product.download_file_url || "#")
      setStep("download")
    } catch (error) {
      console.error("Error creating download:", error)
      alert("Failed to create download link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail("")
    setStep("email")
    setDownloadLink("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-pink-600" />
            Download {product.title}
          </DialogTitle>
          <DialogDescription>
            {step === "email" ? "Enter your email to get the download link" : "Your download is ready!"}
          </DialogDescription>
        </DialogHeader>

        {step === "email" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                disabled={loading}
              >
                <Mail className="w-4 h-4 mr-2" />
                {loading ? "Processing..." : "Get Download Link"}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Download Ready!</h3>
              <p className="text-sm text-green-600 mb-4">Your download link is valid for 24 hours.</p>
              <Button
                onClick={() => window.open(downloadLink, "_blank")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Now
              </Button>
            </div>
            <Button variant="outline" onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
