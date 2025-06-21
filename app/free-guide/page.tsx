"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Star,
  Download,
  ArrowLeft,
  Gift,
  CheckCircle,
  Users,
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  Play,
  Instagram,
  Youtube,
  TwitterIcon as TikTok,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function FreeGuidePage() {
  const [email, setEmail] = useState("")
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [downloadStep, setDownloadStep] = useState<"email" | "success">("email")
  const [newsletterOptIn, setNewsletterOptIn] = useState(true)

  const handleFreeDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    setDownloadLoading(true)

    try {
      // Simulate download process
      const downloadId = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Save download record
      try {
        const { error } = await supabase.from("free_downloads").insert([
          {
            product_id: "free-guide-social-media", // Static ID for this guide
            email,
            download_link: "https://example.com/social-media-guide.pdf", // Replace with actual file
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

      // Add to newsletter if opted in
      if (newsletterOptIn) {
        try {
          await supabase.from("newsletter_subscribers").insert([{ email }])
        } catch (err) {
          console.log("Newsletter signup failed or already exists")
        }
      }

      setDownloadStep("success")
    } catch (error) {
      console.error("Error creating download:", error)
      alert("Failed to create download link. Please try again.")
    } finally {
      setDownloadLoading(false)
    }
  }

  const guideFeatures = [
    {
      icon: Target,
      title: "Find Your Niche",
      description: "Discover the perfect digital products for your audience",
    },
    {
      icon: Users,
      title: "Build Your Audience",
      description: "Proven strategies to grow your social media following",
    },
    {
      icon: TrendingUp,
      title: "Create & Launch",
      description: "Step-by-step product creation and launch process",
    },
    {
      icon: Zap,
      title: "Scale Your Sales",
      description: "Advanced tactics to increase your revenue",
    },
  ]

  const whatYouGet = [
    "Complete 25-page PDF guide",
    "Social media content templates",
    "Product pricing calculator",
    "Launch checklist",
    "Email templates for customers",
    "Bonus: 30 content ideas",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-0.5 lg:py-1">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/fyzen-logo.png" alt="fyzen" width={600} height={200} className="h-24 lg:h-32 w-auto" />
            </Link>
            <div className="flex items-center space-x-3">
              <Link href="https://instagram.com" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="w-4 h-4 lg:w-5 lg:h-5" />
              </Link>
              <Link href="https://youtube.com" className="text-gray-400 hover:text-red-500 transition-colors">
                <Youtube className="w-4 h-4 lg:w-5 lg:h-5" />
              </Link>
              <Link href="https://tiktok.com" className="text-gray-400 hover:text-black transition-colors">
                <TikTok className="w-4 h-4 lg:w-5 lg:h-5" />
              </Link>
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Content */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center space-x-2 mb-4">
                <Badge className="bg-green-500 text-white">Free Guide</Badge>
                <Badge variant="outline" className="border-green-300 text-green-600">
                  <Gift className="w-3 h-3 mr-1" />
                  No Payment Required
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-gray-900 leading-tight">
                Step-by-Step Guide: How to Start Selling Digital Products on Social Media Today
              </h1>

              <p className="text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 leading-relaxed">
                Transform your social media presence into a profitable digital business. This comprehensive guide shows
                you exactly how to create, market, and sell digital products that your audience will love.
              </p>

              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                  <span>25 Pages</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  <span>2,847+ Downloads</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="w-5 h-5 mr-2 text-yellow-400 fill-current" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <p className="text-green-800 font-medium">
                  🎯 Perfect for beginners and experienced creators looking to monetize their social media
                </p>
              </div>
            </div>

            {/* Right side - Guide Preview */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="p-8 h-full bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">FREE GUIDE</h3>
                      <div className="w-12 h-0.5 bg-white/50 mx-auto"></div>
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-8 leading-tight">
                      How to Start Selling Digital Products on Social Media
                    </h2>

                    <div className="space-y-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        <span>Chapter 1: Finding Your Niche</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        <span>Chapter 2: Content Strategy</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        <span>Chapter 3: Product Creation</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        <span>Chapter 4: Launch & Scale</span>
                      </div>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="text-center text-xs opacity-75">25 Pages • Templates Included</div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold">FREE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-12 lg:py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-800">What You'll Learn</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              This comprehensive guide covers everything you need to know to start your digital product business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guideFeatures.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* What's Included */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">What's Included</h3>
              <div className="space-y-4">
                {whatYouGet.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start">
                  <Gift className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">Bonus Content</h4>
                    <p className="text-green-700 text-sm">
                      Get 30 ready-to-use social media content ideas to promote your digital products!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              {downloadStep === "email" ? (
                <div>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Download className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Get Your Free Guide Now</h3>
                    <p className="text-gray-600">Enter your email to receive instant access to the guide</p>
                  </div>

                  <form onSubmit={handleFreeDownload} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="newsletter"
                        checked={newsletterOptIn}
                        onChange={(e) => setNewsletterOptIn(e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <Label htmlFor="newsletter" className="text-sm text-gray-600">
                        Yes, send me free templates and tips (optional)
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      disabled={downloadLoading}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {downloadLoading ? "Processing..." : "Download Free Guide"}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      No spam, unsubscribe anytime. Your email is safe with us.
                    </p>
                  </form>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Success! 🎉</h3>
                  <p className="text-green-700 mb-6">
                    Your guide is ready for download. We've also sent a copy to your email!
                  </p>
                  <Button
                    onClick={() => window.open("https://example.com/social-media-guide.pdf", "_blank")}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white mb-4"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Guide Now
                  </Button>
                  <p className="text-sm text-green-600">Download link expires in 24 hours</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 lg:py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">What People Are Saying</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "This guide completely changed how I approach social media marketing. I made my first $500 in digital
                  product sales within 2 weeks!"
                </p>
                <div className="flex items-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fyzen%20%287%29-f7BR9oo16rLv6aZXumMtuHTJ7wWSAh.png"
                    alt="Sarah - Content Creator"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Sarah M.</p>
                    <p className="text-sm text-gray-500">Content Creator</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Super practical and easy to follow. The templates saved me hours of work. Highly recommend!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Jake D.</p>
                    <p className="text-sm text-gray-500">Digital Marketer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Finally, a guide that actually works! Clear steps and real examples. My Instagram engagement
                  doubled!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold text-sm">AL</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Anna L.</p>
                    <p className="text-sm text-gray-500">Influencer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 lg:p-8 text-white">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Ready for More?</h2>
            <p className="mb-6 opacity-90">
              Love this free guide? Check out our premium digital product collection for advanced strategies and tools!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100" asChild>
                <Link href="/products">Browse Premium Products</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Success Stories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 lg:py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/fyzen-logo.png"
                  alt="fyzen"
                  width={280}
                  height={90}
                  className="h-16 lg:h-20 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 text-sm">Quality digital tools for your brand</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/free-guide" className="hover:text-white transition-colors">
                    Free Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 lg:mt-8 pt-6 lg:pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Fyzen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
