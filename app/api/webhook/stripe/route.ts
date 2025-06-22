import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"
import { headers } from "next/headers"
import { sendPurchaseEmail } from "@/lib/email"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  console.log("🔥 WEBHOOK CALLED - Request received!")
  console.log("🔍 Webhook secret exists:", !!webhookSecret)
  
  const body = await request.text()
  console.log("📦 Body length:", body.length)
  
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")
  console.log("✍️ Signature exists:", !!signature)

  let event: any

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object)
        break

      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object)
        break

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object)
        break

      case "charge.dispute.created":
        await handleChargeDispute(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const { customer_email, metadata, amount_total } = session
  const { productId, productTitle } = metadata

  try {
    // Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()

    if (productError || !product) {
      console.error("Product not found:", productId)
      return
    }

    // Create purchase record
    const { error: purchaseError } = await supabase.from("purchases").insert([
      {
        product_id: productId,
        customer_email,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        amount_paid: amount_total / 100, // Convert from cents
        status: "completed",
        download_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    ])

    if (purchaseError) {
      console.error("Error creating purchase record:", purchaseError)
      return
    }

    // Update product download count
    await supabase
      .from("products")
      .update({ downloads: product.downloads + 1 })
      .eq("id", productId)

    // Send email with download link
    await sendPurchaseEmail({
      customerEmail: customer_email,
      productTitle,
      product,
      sessionId: session.id,
    })

    console.log(`✅ Purchase completed for ${customer_email}: ${productTitle}`)
  } catch (error) {
    console.error("❌ Error handling checkout session:", error)
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    // Update purchase status to confirmed
    const { error } = await supabase
      .from("purchases")
      .update({
        status: "payment_confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_payment_intent_id", paymentIntent.id)

    if (error) {
      console.error("Error updating payment status:", error)
    } else {
      console.log(`✅ Payment confirmed for intent: ${paymentIntent.id}`)
    }
  } catch (error) {
    console.error("❌ Error handling payment success:", error)
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    // Update purchase status to failed
    const { error } = await supabase
      .from("purchases")
      .update({
        status: "payment_failed",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_payment_intent_id", paymentIntent.id)

    if (error) {
      console.error("Error updating failed payment:", error)
    } else {
      console.log(`❌ Payment failed for intent: ${paymentIntent.id}`)
    }
  } catch (error) {
    console.error("❌ Error handling payment failure:", error)
  }
}

async function handleChargeDispute(dispute: any) {
  try {
    // Find purchase by charge ID and mark as disputed
    const { error } = await supabase
      .from("purchases")
      .update({
        status: "disputed",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_session_id", dispute.charge)

    if (error) {
      console.error("Error handling dispute:", error)
    } else {
      console.log(`⚠️ Dispute created for charge: ${dispute.charge}`)
      // Here you could send notification email to admin
    }
  } catch (error) {
    console.error("❌ Error handling dispute:", error)
  }
}

// Email sending is now handled by the imported function from lib/email.ts
