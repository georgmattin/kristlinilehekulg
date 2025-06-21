"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Star, Download, ArrowLeft, Share2, Mail, Gift, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase, type Product } from "@/lib/supabase"
import { CheckoutButton } from "@/components/checkout-button"

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [downloadStep, setDownloadStep] = useState<"email" | "success">("email")
  const [downloadLink, setDownloadLink] = useState("")

  useEffect(() => {
    async function fetchProduct() {
      if (!params.id) return

      try {
        const { data: productData } = await supabase.from("products").select("*").eq("id", params.id).single()

        if (productData) {
          setProduct(productData)
          const { data: relatedData } = await supabase
            .from("products")
            .select("*")
            .eq("category", productData.category)
            .neq("id", productData.id)
            .eq("status", "active")
            .limit(3)

          if (relatedData) setRelatedProducts(relatedData)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleFreeDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setDownloadLoading(true)

    try {
      const downloadId = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

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

      await supabase
        .from("products")
        .update({ downloads: product.downloads + 1 })
        .eq("id", product.id)

      setDownloadLink(product.download_file_url || "#")
      setDownloadStep("success")
    } catch (error) {
      console.error("Error creating download:", error)
      alert("Failed to create download link. Please try again.")
    } finally {
      setDownloadLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (product.is_free) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-0.5 lg:py-1">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/fyzen-logo-new.png" alt="fyzen" width={600} height={200} className="h-24 lg:h-32 w-auto" />
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Shop
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="py-8 lg:py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                  <Image
                    src={product.image_url || "/placeholder.svg?height=600&width=600"}
                    alt={product.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-500 text-white">Free Download</Badge>
                  {product.featured && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                      Popular
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 mb-3">
                    {product.category} • Free
                  </Badge>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-lg font-semibold">{product.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Download className="w-4 h-4 mr-1" />
                      <span>{product.downloads} downloads</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-green-600">Free</span>
                    <Badge className="bg-green-100 text-green-700">
                      <Gift className="w-4 h-4 mr-1" />
                      No payment required
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 lg:p-8">
                  {downloadStep === "email" ? (
                    <div>
                      <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                        <Mail className="w-5 h-5 mr-2" />
                        Get Your Free Download
                      </h3>
                      <p className="text-green-700 mb-6">
                        Enter your email address to receive the download link instantly. No spam, just great content!
                      </p>
                      <form onSubmit={handleFreeDownload} className="space-y-4">
                        <div>
                          <Label htmlFor="email" className="text-green-800">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border-green-300 focus:border-green-500"
                          />
                        </div>
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                          disabled={downloadLoading}
                        >
                          <Download className="w-5 h-5 mr-2" />
                          {downloadLoading ? "Processing..." : "Get Free Download"}
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-green-800 mb-2">Download Ready!</h3>
                      <p className="text-green-700 mb-6">
                        Your download link is ready. Click below to download your free resource.
                      </p>
                      <Button
                        onClick={() => window.open(downloadLink, "_blank")}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white mb-4"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Now
                      </Button>
                      <p className="text-sm text-green-600">
                        Link expires in 24 hours. Check your email for a backup copy!
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 border-green-300 text-green-600 hover:bg-green-50"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Save for Later
                  </Button>
                  <Button size="lg" variant="outline" className="flex-1 border-gray-300">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">What's included:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Instant digital download</li>
                    <li>• High-quality files</li>
                    <li>• Commercial license included</li>
                    <li>• Email support if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-0.5 lg:py-1">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/fyzen-logo-new.png" alt="fyzen" width={600} height={200} className="h-24 lg:h-32 w-auto" />
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-pink-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-8 lg:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                <Image
                  src={product.image_url || "/placeholder.svg?height=600&width=600"}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
                {product.featured && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    Popular
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="bg-pink-100 text-pink-700 mb-3">
                  {product.category}
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-lg font-semibold">{product.rating}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Download className="w-4 h-4 mr-1" />
                    <span>{product.downloads} downloads</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                  {product.original_price && (
                    <span className="text-xl text-gray-400 line-through">${product.original_price}</span>
                  )}
                  {product.original_price && (
                    <Badge className="bg-green-100 text-green-700">
                      Save ${(product.original_price - product.price).toFixed(2)}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <CheckoutButton
                    productId={product.id}
                    productTitle={product.title}
                    price={product.price}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  />
                  <Button size="lg" variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                    <Heart className="w-5 h-5 mr-2" />
                    Save
                  </Button>
                  <Button size="lg" variant="outline" className="border-gray-300">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="bg-pink-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">What's included:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Instant digital download</li>
                    <li>• High-quality files</li>
                    <li>• Commercial license included</li>
                    <li>• 30-day money-back guarantee</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
