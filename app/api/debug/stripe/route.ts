import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== STRIPE DEBUG INFO ===")

    const envCheck = {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    }

    console.log("Environment variables:", envCheck)

    // Test Stripe initialization
    let stripeTest = "❌ Failed"
    try {
      const Stripe = (await import("stripe")).default
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2024-06-20",
      })

      // Test a simple API call
      await stripe.products.list({ limit: 1 })
      stripeTest = "✅ Success"
    } catch (error) {
      console.error("Stripe test failed:", error)
      stripeTest = `❌ Failed: ${error instanceof Error ? error.message : "Unknown error"}`
    }

    return NextResponse.json({
      environment: envCheck,
      stripeConnection: stripeTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
