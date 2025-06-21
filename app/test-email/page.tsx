"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Send, AlertCircle, CheckCircle } from "lucide-react"

export default function TestEmailPage() {
  const [formData, setFormData] = useState({
    customerEmail: "olive@theolivegroceoffice.eu",
    productTitle: "Test Product",
    sessionId: "test_session_" + Date.now()
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; messageId?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          messageId: data.messageId
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to send email'
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error: ' + (error instanceof Error ? error.message : 'Unknown error')
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Email Testing Tool
            </CardTitle>
            <p className="text-sm text-gray-600">
              Test the email functionality before webhook integration
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  required
                  placeholder="customer@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="productTitle">Product Title</Label>
                <Input
                  id="productTitle"
                  type="text"
                  value={formData.productTitle}
                  onChange={(e) => setFormData({ ...formData, productTitle: e.target.value })}
                  required
                  placeholder="Test Product Name"
                />
              </div>
              
              <div>
                <Label htmlFor="sessionId">Session ID</Label>
                <Input
                  id="sessionId"
                  type="text"
                  value={formData.sessionId}
                  onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
                  required
                  placeholder="test_session_123"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Sending..." : "Send Test Email"}
              </Button>
            </form>
            
            {result && (
              <Alert className={`mt-4 ${result.success ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <AlertDescription>
                    {result.message}
                    {result.messageId && (
                      <div className="text-xs mt-1 text-gray-600">
                        Message ID: {result.messageId}
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </Alert>
            )}
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">⚠️ Development Tool</p>
              <p className="text-xs text-yellow-700 mt-1">
                This page is for testing email functionality. Remove it before production deployment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 