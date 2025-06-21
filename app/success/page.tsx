"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Mail, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get("session_id")
  const [downloadInfo, setDownloadInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetchDownloadInfo()
    }
  }, [sessionId])

  const fetchDownloadInfo = async () => {
    try {
      const response = await fetch(`/api/download/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setDownloadInfo(data)
      }
    } catch (error) {
      console.error("Error fetching download info:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (downloadInfo?.downloadUrl) {
      window.open(downloadInfo.downloadUrl, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your purchase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-0.5 lg:py-1">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/fyzen-logo-new.png" alt="fyzen" width={600} height={200} className="h-24 lg:h-32 w-auto" />
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-pink-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <section className="py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">Payment Successful! 🎉</CardTitle>
              <CardDescription>
                Thank you for your purchase. Your digital product is ready for download.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {downloadInfo ? (
                <>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Your Purchase:</h3>
                    <p className="text-gray-700">{downloadInfo.product?.title}</p>
                  </div>

                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Your Product
                  </Button>

                  <div className="text-sm text-gray-600 space-y-2">
                    <p className="flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2" />A download link has also been sent to your email
                    </p>
                    <p>Downloads remaining: {downloadInfo.downloadsRemaining}</p>
                    <p>Link expires: {new Date(downloadInfo.expiresAt).toLocaleDateString()}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    We're processing your purchase. You'll receive an email with download instructions shortly.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/">Return to Home</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
