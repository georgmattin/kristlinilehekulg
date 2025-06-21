import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RefreshCw, Clock, CheckCircle, AlertCircle, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-0.5 lg:py-1">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/fyzen-logo-new.png" alt="fyzen" width={600} height={200} className="h-24 lg:h-32 w-auto" />
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-pink-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Returns Content */}
      <section className="py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Returns & Refunds
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We want you to be completely satisfied with your purchase. Learn about our return policy and how to
              request a refund.
            </p>
          </div>

          {/* Return Policy Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                30-Day Money-Back Guarantee
              </CardTitle>
              <CardDescription>
                We offer a full refund within 30 days of purchase for all paid digital products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We stand behind the quality of our digital products. If you're not completely satisfied with your
                purchase, you can request a full refund within 30 days of your purchase date. No questions asked.
              </p>
            </CardContent>
          </Card>

          {/* How to Request a Refund */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How to Request a Refund</CardTitle>
              <CardDescription>Follow these simple steps to request your refund</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Our Support Team</h3>
                    <p className="text-gray-600">
                      Send us an email with your order details and the reason for your refund request. Include your
                      order number and the email address used for the purchase.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">We'll Process Your Request</h3>
                    <p className="text-gray-600">
                      Our team will review your request within 24 hours and confirm your refund eligibility. We'll send
                      you a confirmation email once approved.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Receive Your Refund</h3>
                    <p className="text-gray-600">
                      Refunds are processed back to your original payment method within 3-5 business days. You'll
                      receive an email confirmation when the refund is complete.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Conditions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Refund Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Refunds must be requested within 30 days of purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Original proof of purchase required (order number or receipt)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Free products are not eligible for refunds (as they are free)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Refunds are processed to the original payment method only</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Digital products cannot be "returned" but access may be revoked after refund</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Processing Time */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Processing Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Request Review</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-1">24 hours</p>
                  <p className="text-sm text-blue-700">We'll review and respond to your request</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Refund Processing</h3>
                  <p className="text-2xl font-bold text-green-600 mb-1">3-5 days</p>
                  <p className="text-sm text-green-700">Refund appears in your account</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Need Help with a Return?</CardTitle>
              <CardDescription>Our support team is here to assist you with your refund request</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Have questions about our return policy or need to request a refund? Contact our friendly support team
                and we'll help you right away.
              </p>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support for Refund
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
