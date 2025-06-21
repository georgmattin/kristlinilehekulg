import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Check recent purchases
    const { data: purchases, error } = await supabase
      .from("purchases")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Webhook debug info",
      recentPurchases: purchases,
      environment: {
        hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Debug failed" }, { status: 500 })
  }
}
