"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  Shield,
  Download,
  Star,
  CheckCircle,
  Mail,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase, type Product } from "@/lib/supabase"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const productId = searchParams?.get("product")

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customerInfo, setCustomerInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    country: "Estonia",
  })

  useEffect(() => {
    if (productId) {
      fetchProduct()
    } else {
      setError("No product ID provided")
      setLoading(false)
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      console.log("Fetching product:", productId)
      const { data: productData, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("status", "active")
        .single()

      if (fetchError) {
        console.error("Database error:", fetchError)
        setError("Failed to load product: " + fetchError.message)
        return
      }

      if (!productData) {
        console.error("Product not found")
        setError("Product not found")
        return
      }

      console.log("Product loaded:", productData)

      if (productData.is_free) {
        console.log("Redirecting free product to product page")
        window.location.href = `/product/${productId}`
        return
      }

      setProduct(productData)
    } catch (error) {
      console.error("Error fetching product:", error)
      setError("Failed to load product")
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setCheckoutLoading(true)
    setError(null)

    try {
      console.log("=== STARTING CHECKOUT ===")
      console.log("Product:", {
        id: product.id,
        title: product.title,
        price: product.price,
      })
      console.log("Customer info:", customerInfo)

      const requestBody = {
        productId: product.id,
        customerEmail: customerInfo.email,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
      }

      console.log("Request body:", requestBody)

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      let responseData
      try {
        const responseText = await response.text()
        console.log("Raw response:", responseText)
        responseData = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response:", parseError)
        throw new Error("Invalid response from server")
      }

      console.log("Parsed response:", responseData)

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} - ${responseData.error || responseData.details || "Unknown error"}`,
        )
      }

      if (responseData.error) {
        throw new Error(responseData.error + (responseData.details ? ` (${responseData.details})` : ""))
      }

      if (!responseData.sessionId) {
        throw new Error("No session ID received from server")
      }

      console.log("Session ID received:", responseData.sessionId)

      // Load Stripe
      console.log("Loading Stripe...")
      const { loadStripe } = await import("@stripe/stripe-js")

      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      console.log("Stripe publishable key:", publishableKey ? "✅ Available" : "❌ Missing")

      if (!publishableKey) {
        throw new Error("Stripe publishable key not configured")
      }

      const stripe = await loadStripe(publishableKey)

      if (!stripe) {
        throw new Error("Failed to load Stripe")
      }

      console.log("Stripe loaded successfully, redirecting to checkout...")

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: responseData.sessionId,
      })

      if (stripeError) {
        console.error("Stripe redirect error:", stripeError)
        throw new Error(`Stripe error: ${stripeError.message}`)
      }
    } catch (error) {
      console.error("=== CHECKOUT ERROR ===")
      console.error("Error:", error)

      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)

      // Show user-friendly error
      alert(`Checkout failed: ${errorMessage}`)
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Checkout Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link href="/products">
              <Button className="w-full">Browse Products</Button>
            </Link>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <p className="text-gray-600 mb-6">The product you're trying to purchase could not be found.</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const savings = product.original_price ? product.original_price - product.price : 0
  const tax = 0
  const total = product.price + tax

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/fyzen-logo-new.png" alt="fyzen" width={600} height={200} className="h-20 w-auto" />
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Debug Info */}
      <div className="bg-blue-100 border border-blue-400 p-4 m-4 rounded">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Product ID: {productId}</p>
        <p>Product Title: {product?.title}</p>
        <p>Product Price: ${product?.price}</p>
        <p>Stripe Publishable Key: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing"}</p>
        <p>Environment: {process.env.NODE_ENV}</p>
      </div>

      {/* Checkout Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link href={`/product/${product.id}`}>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-pink-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Product
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Customer Information */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                <p className="text-gray-600">Complete your purchase securely</p>
              </div>

              {/* Customer Information Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-pink-600" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>We'll send your download link to this email</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        required
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={customerInfo.firstName}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                          className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={customerInfo.lastName}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                          className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        />
                      </div>
                    </div>

                    {/* Payment Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                        disabled={checkoutLoading || !customerInfo.email}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        {checkoutLoading ? "Processing..." : `Pay $${total.toFixed(2)} - Continue to Payment`}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-1">Secure Payment</h3>
                      <p className="text-sm text-green-700">
                        Your payment information is encrypted and processed securely by Stripe. We never store your
                        credit card details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-pink-600" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Product Details */}
                  <div className="flex space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={product.image_url || "/placeholder.svg?height=80&width=80"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="flex items-center mt-2">
                        <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-xs">
                          {product.category}
                        </Badge>
                        <div className="flex items-center ml-3 text-sm text-gray-500">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {product.rating}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product Price</span>
                      <span className="font-medium">${product.price.toFixed(2)}</span>
                    </div>

                    {savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>You Save</span>
                        <span className="font-medium">-${savings.toFixed(2)}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* What's Included */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Instant digital download
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        High-quality files
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Commercial license
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Email support
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Download className="w-4 h-4 text-blue-600 mr-2" />
                        30-day download access
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
