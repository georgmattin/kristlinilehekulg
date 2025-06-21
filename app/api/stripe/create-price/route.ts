import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, productTitle, productDescription, price, currency = "usd" } = body

    if (!productId || !productTitle || !price) {
      return NextResponse.json({ 
        error: "Missing required fields: productId, productTitle, price" 
      }, { status: 400 })
    }

    // Import and initialize Stripe
    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    })

    // First, create a Stripe Product
    const stripeProduct = await stripe.products.create({
      name: productTitle,
      description: productDescription || `Digital product: ${productTitle}`,
      metadata: {
        product_id: productId,
      }
    })

    // Then create a Price for that Product
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(Number(price) * 100), // Convert to cents
      currency: currency.toLowerCase(),
      product: stripeProduct.id,
      metadata: {
        product_id: productId,
      }
    })

    // Update the product in our database with the new Stripe Price ID
    const { error: updateError } = await supabase
      .from("products")
      .update({ 
        stripe_price_id: stripePrice.id,
        updated_at: new Date().toISOString()
      })
      .eq("id", productId)

    if (updateError) {
      throw new Error(`Failed to update product: ${updateError.message}`)
    }

    return NextResponse.json({
      success: true,
      priceId: stripePrice.id,
      productId: stripeProduct.id,
      amount: stripePrice.unit_amount,
      currency: stripePrice.currency,
      message: "Stripe Price ID created and saved successfully"
    })

  } catch (error) {
    console.error("Error creating Stripe Price:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to create Stripe Price ID"
    }, { status: 500 })
  }
} 