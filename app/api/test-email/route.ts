import { NextRequest, NextResponse } from "next/server"
import { sendPurchaseEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    // This is for testing email functionality only
    // Remove this endpoint in production
    
    const body = await request.json()
    const { customerEmail, productTitle, sessionId } = body
    
    if (!customerEmail || !productTitle || !sessionId) {
      return NextResponse.json({ 
        error: "Missing required fields: customerEmail, productTitle, sessionId" 
      }, { status: 400 })
    }
    
    // Mock product data for testing
    const mockProduct = {
      id: "test-product-id",
      title: productTitle,
      description: "Test product for email testing"
    }
    
    // Send test email
    const result = await sendPurchaseEmail({
      customerEmail,
      productTitle,
      product: mockProduct,
      sessionId
    })
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Test email sent successfully",
        messageId: result.messageId
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error("Error in test email endpoint:", error)
    return NextResponse.json({ 
      error: "Failed to send test email",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 