import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    console.log("=== CREATE CHECKOUT SESSION START ===")

    // Parse request body safely
    let body
    try {
      body = await request.json()
      console.log("Request body:", body)
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { productId, customerEmail, customerName } = body

    // Validate required fields
    if (!productId) {
      console.error("Missing productId")
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    if (!customerEmail) {
      console.error("Missing customerEmail")
      return NextResponse.json({ error: "Customer email is required" }, { status: 400 })
    }

    // Check environment variables
    console.log("Environment check:")
    console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing")
    console.log(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:",
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
    )

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not found in environment")
      return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 })
    }

    // Fetch product from database
    console.log("Fetching product:", productId)
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("status", "active")
      .single()

    if (productError) {
      console.error("Database error:", productError)
      return NextResponse.json({ error: "Database error: " + productError.message }, { status: 500 })
    }

    if (!product) {
      console.error("Product not found for ID:", productId)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log("Product found:", {
      id: product.id,
      title: product.title,
      price: product.price,
      is_free: product.is_free,
    })

    if (product.is_free) {
      console.error("Trying to checkout free product")
      return NextResponse.json({ error: "Cannot create checkout for free product" }, { status: 400 })
    }

    // Validate price
    if (!product.price || product.price <= 0) {
      console.error("Invalid product price:", product.price)
      return NextResponse.json({ error: "Invalid product price" }, { status: 400 })
    }

    // Import and initialize Stripe
    console.log("Importing Stripe...")
    let stripe
    try {
      const Stripe = (await import("stripe")).default
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-06-20",
      })
      console.log("Stripe initialized successfully")
    } catch (stripeError) {
      console.error("Failed to initialize Stripe:", stripeError)
      return NextResponse.json({ error: "Payment system initialization failed" }, { status: 500 })
    }

    // Create checkout session
    console.log("Creating Stripe checkout session...")
    const sessionData = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              description: product.description,
              images: product.image_url ? [product.image_url] : [],
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout?product=${productId}`,
      customer_email: customerEmail,
      metadata: {
        productId: product.id,
        productTitle: product.title,
        customerName: customerName || "",
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    }

    console.log("Session data:", JSON.stringify(sessionData, null, 2))

    let session
    try {
      session = await stripe.checkout.sessions.create(sessionData)
      console.log("Stripe session created successfully:", session.id)
    } catch (stripeError) {
      console.error("Stripe session creation failed:", stripeError)
      return NextResponse.json(
        {
          error: "Payment session creation failed",
          details: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error",
        },
        { status: 500 },
      )
    }

    console.log("=== CREATE CHECKOUT SESSION SUCCESS ===")
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("=== CHECKOUT SESSION UNEXPECTED ERROR ===")
    console.error("Error:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
