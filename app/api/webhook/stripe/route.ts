import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"
import { headers } from "next/headers"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = headers()
  const signature = headersList.get("stripe-signature")!

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

async function sendPurchaseEmail({
  customerEmail,
  productTitle,
  product,
  sessionId,
}: {
  customerEmail: string
  productTitle: string
  product: any
  sessionId: string
}) {
  console.log(`📧 Sending purchase email to ${customerEmail} for ${productTitle}`)

  const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/download/${sessionId}`

  // TODO: Implement actual email sending with your preferred service
  // Example with Resend:
  /*
  import { Resend } from 'resend'
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: customerEmail,
    subject: `Your purchase: ${productTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e91e63;">Thank you for your purchase! 🎉</h1>
        <p>You have successfully purchased: <strong>${productTitle}</strong></p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Download your product:</h3>
          <a href="${downloadUrl}" style="background: #e91e63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Now</a>
        </div>
        <p><small>This download link will expire in 30 days. You can download the product up to 5 times.</small></p>
        <hr>
        <p><small>If you have any questions, please contact our support team.</small></p>
      </div>
    `
  })
  */
}
