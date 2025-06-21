"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, Download, Play, Instagram, Youtube } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase, type Product } from "@/lib/supabase"
import { FreeDownloadModal } from "@/components/free-download-modal"
import { CheckoutButton } from "@/components/checkout-button"

// Default social media links
const DEFAULT_SOCIAL_LINKS = {
  instagram: "https://instagram.com/fyzendigital",
  youtube: "https://youtube.com/@Fyzen-u2p",
  tiktok: "https://tiktok.com/@fyzendigital",
}

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04 0z" />
  </svg>
)

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [siteContent, setSiteContent] = useState<Record<string, any>>({})
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(DEFAULT_SOCIAL_LINKS)
  const [loading, setLoading] = useState(true)
  const [selectedFreeProduct, setSelectedFreeProduct] = useState<Product | null>(null)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterLoading, setNewsletterLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(4)

        // Fetch site content
        const { data: contentData, error: contentError } = await supabase.from("site_content").select("*")

        // Use default social media links directly
        const socialData = Object.entries(DEFAULT_SOCIAL_LINKS).map(([platform, url]) => ({ platform, url }))

        if (productsError) console.error("Products error:", productsError)
        if (contentError) console.error("Content error:", contentError)

        if (productsData) setProducts(productsData)

        if (contentData) {
          const contentMap = contentData.reduce((acc, item) => {
            acc[item.section] = item.content
            return acc
          }, {})
          setSiteContent(contentMap)
        }

        if (socialData) {
          const socialMap = socialData.reduce((acc, item) => {
            acc[item.platform] = item.url
            return acc
          }, {})
          setSocialLinks(socialMap)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        // Set defaults if everything fails
        setSocialLinks(DEFAULT_SOCIAL_LINKS)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterLoading(true)

    try {
      const { error } = await supabase.from("newsletter_subscribers").insert([{ email: newsletterEmail }])

      if (error) {
        if (error.code === "23505") {
          alert("This email is already subscribed!")
        } else if (error.code === "42P01" || error.message?.includes("does not exist")) {
          alert("Newsletter feature is not yet configured. Please contact support.")
        } else {
          throw error
        }
      } else {
        alert("Successfully subscribed to newsletter!")
        setNewsletterEmail("")
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      alert("Failed to subscribe. Please try again.")
    } finally {
      setNewsletterLoading(false)
    }
  }

  const heroContent = siteContent.hero || {}
  const aboutContent = siteContent.about || {}
  const newsletterContent = siteContent.newsletter || {}

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
            <Link href="/" className="flex space-x-2 mx-0 items-stretch leading-3">
              <Image src="/fyzen-logo-new.png" alt="fyzen" width={600} height={200} className="h-24 lg:h-28 w-auto" />
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#products" className="text-gray-600 hover:text-pink-600 transition-colors">
                Products
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-pink-600 transition-colors">
                About
              </Link>
              <Link href="#newsletter" className="text-gray-600 hover:text-pink-600 transition-colors">
                Newsletter
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              {socialLinks.instagram && (
                <Link href={socialLinks.instagram} className="text-gray-400 hover:text-pink-500 transition-colors">
                  <Instagram className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
              )}
              {socialLinks.youtube && (
                <Link href={socialLinks.youtube} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Youtube className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
              )}
              {socialLinks.tiktok && (
                <Link href={socialLinks.tiktok} className="text-gray-400 hover:text-black transition-colors">
                  <TikTokIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920&text=Creative+Workspace+with+Laptop+Design+Tools+Social+Media+Graphics"
            alt="Creative digital workspace background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/95 via-white/90 to-purple-50/95"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-white/30"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight drop-shadow-lg">
              {heroContent.title || "Digital Tools For Your Brand"}
            </h1>
            <p className="text-lg lg:text-xl text-gray-800 mb-6 lg:mb-8 leading-relaxed px-4 drop-shadow-sm font-medium">
              {heroContent.subtitle ||
                "Discover my handcrafted digital products that help you stand out on social media."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 lg:px-8 py-3 shadow-lg"
              >
                {heroContent.cta_primary || "Shop Products"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-pink-300 text-pink-600 hover:bg-pink-50 px-6 lg:px-8 py-3 bg-white/80 backdrop-blur-sm shadow-lg"
                asChild
              >
                <Link href="#newsletter">
                  <Play className="w-4 h-4 mr-2" />
                  Join My Newsletter
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-12 lg:py-16 px-4">
        <div className="container mx-auto px-0.5 py-0.5">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-800">Digital Products </h2>
            <p className="text-gray-600 max-w-2xl mx-auto px-4">
              These are my most loved digital tools that I use in my daily content creation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-0">
                  <Link href={`/product/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={product.image_url || "/placeholder.svg?height=300&width=300"}
                        alt={product.title}
                        width={300}
                        height={300}
                        className="w-full h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.is_free && (
                        <Badge className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-pink-500 text-white text-xs">
                          Free
                        </Badge>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute bottom-2 lg:bottom-3 right-2 lg:right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-pink-600 w-8 h-8 lg:w-10 lg:h-10"
                      >
                        <Heart className="w-3 h-3 lg:w-4 lg:h-4" />
                      </Button>
                    </div>
                  </Link>

                  <div className="p-3 lg:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-700">
                        {product.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {product.rating}
                      </div>
                    </div>

                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors text-sm lg:text-base">
                        {product.title}
                      </h3>
                    </Link>

                    <p className="text-xs lg:text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {product.is_free ? (
                          <span className="text-base lg:text-lg font-bold text-blue-600">Free</span>
                        ) : (
                          <>
                            <span className="text-base lg:text-lg font-bold text-gray-800">${product.price}</span>
                            {product.original_price && (
                              <span className="text-xs lg:text-sm text-gray-400 line-through">
                                ${product.original_price}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Download className="w-3 h-3 mr-1" />
                        {product.downloads}
                      </div>
                    </div>

                    {product.is_free ? (
                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm"
                        onClick={() => setSelectedFreeProduct(product)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Free Download
                      </Button>
                    ) : (
                      <CheckoutButton
                        productId={product.id}
                        productTitle={product.title}
                        price={product.price}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 lg:mt-12">
            <Button variant="outline" size="lg" className="border-pink-300 text-pink-600 hover:bg-pink-50" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 bg-white/50 px-3 lg:py-20 mx-1 my-1">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6 text-gray-800">
                {aboutContent.title || "Fyzen: how my experience fuels your digital growth"}
              </h2>
              <p className="text-gray-600 mb-4 lg:mb-6 leading-relaxed">
                {aboutContent.description ||
                  "I'm a content creation enthusiast who loves helping others develop their brands."}
              </p>
              <p className="text-gray-600 mb-4 lg:mb-6 leading-relaxed">
                {aboutContent.description2 ||
                  "All my products are tested and used in my own videos and social media accounts."}
              </p>
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {(aboutContent.badges || ["Instagram Expert", "Content Creator", "Digital Designer"]).map(
                  (badge: string, index: number) => (
                    <Badge key={index} className="bg-pink-100 text-pink-700 px-2 lg:px-3 py-1 text-xs lg:text-sm">
                      {badge}
                    </Badge>
                  ),
                )}
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/fyzen-profile.png"
                  alt="Fyzen - Digital Growth Expert"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-xl"
                  style={{
                    imageRendering: "crisp-edges",
                    filter: "contrast(1.1) brightness(1.05) saturate(1.1)",
                  }}
                  quality={95}
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-12 lg:py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w2xl mx-auto text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 lg:p-8 text-white">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              {newsletterContent.title || "Be First to Know About New Products! 💌"}
            </h2>
            <p className="mb-6 opacity-90">
              {newsletterContent.description || "Join my newsletter and get free templates plus exclusive content"}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 text-sm lg:text-base"
                required
              />
              <Button
                type="submit"
                className="bg-white text-pink-600 hover:bg-gray-100 px-4 lg:px-6 py-3 text-sm lg:text-base"
                disabled={newsletterLoading}
              >
                {newsletterLoading ? "Joining..." : "Join Now"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 lg:py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/fyzen-logo-new.png"
                  alt="fyzen"
                  width={280}
                  height={90}
                  className="h-20 lg:h-24 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 text-sm">Quality digital tools for your brand</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/products?category=Free+guides" className="hover:text-white transition-colors">
                    Free guides
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=Planners" className="hover:text-white transition-colors">
                    Planners
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=Templates" className="hover:text-white transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=Workbooks" className="hover:text-white transition-colors">
                    Workbooks
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Follow Me</h3>
              <div className="flex space-x-3">
                {socialLinks.instagram && (
                  <Link href={socialLinks.instagram} className="text-gray-400 hover:text-pink-400 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </Link>
                )}
                {socialLinks.youtube && (
                  <Link href={socialLinks.youtube} className="text-gray-400 hover:text-red-400 transition-colors">
                    <Youtube className="w-5 h-5" />
                  </Link>
                )}
                {socialLinks.tiktok && (
                  <Link href={socialLinks.tiktok} className="text-gray-400 hover:text-white transition-colors">
                    <TikTokIcon className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 lg:mt-8 pt-6 lg:pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Fyzen. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Free Download Modal */}
      {selectedFreeProduct && (
        <FreeDownloadModal
          product={selectedFreeProduct}
          isOpen={!!selectedFreeProduct}
          onClose={() => setSelectedFreeProduct(null)}
        />
      )}
    </div>
  )
}
