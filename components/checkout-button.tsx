"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface CheckoutButtonProps {
  productId: string
  productTitle: string
  price: number
  className?: string
}

export function CheckoutButton({ productId, productTitle, price, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)

    try {
      // Redirect to checkout page with product ID
      window.location.href = `/checkout?product=${productId}`
    } catch (error) {
      console.error("Error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} className={className} disabled={loading}>
      <ShoppingCart className="w-4 h-4 mr-2" />
      {loading ? "Loading..." : `Buy Now - $${price}`}
    </Button>
  )
}
