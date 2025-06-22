import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("🔥 TEST WEBHOOK CALLED!")
  return NextResponse.json({ 
    success: true, 
    message: "Webhook endpoint is reachable!",
    timestamp: new Date().toISOString()
  })
}

export async function GET(request: NextRequest) {
  console.log("🔥 TEST WEBHOOK GET CALLED!")
  return NextResponse.json({ 
    success: true, 
    message: "Webhook endpoint is reachable via GET!",
    timestamp: new Date().toISOString()
  })
} 