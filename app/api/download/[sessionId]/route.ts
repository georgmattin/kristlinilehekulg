import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    // Find purchase by session ID
    const { data: purchase, error } = await supabase
      .from("purchases")
      .select(`
        *,
        products (*)
      `)
      .eq("stripe_session_id", sessionId)
      .eq("status", "completed")
      .single()

    if (error || !purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    // Check if download has expired
    if (new Date() > new Date(purchase.download_expires_at)) {
      return NextResponse.json({ error: "Download link has expired" }, { status: 410 })
    }

    // Check download limit
    if (purchase.download_count >= purchase.max_downloads) {
      return NextResponse.json({ error: "Download limit exceeded" }, { status: 429 })
    }

    // Update download count
    await supabase
      .from("purchases")
      .update({
        download_count: purchase.download_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", purchase.id)

    // Get the actual file URL (you'll need to implement file storage)
    const fileUrl = purchase.products.download_file_url_paid || purchase.products.download_file_url

    if (!fileUrl) {
      return NextResponse.json({ error: "Download file not available" }, { status: 404 })
    }

    // Redirect to the actual file or return download info
    return NextResponse.json({
      downloadUrl: fileUrl,
      product: purchase.products,
      downloadsRemaining: purchase.max_downloads - purchase.download_count - 1,
      expiresAt: purchase.download_expires_at,
    })
  } catch (error) {
    console.error("Error processing download:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
