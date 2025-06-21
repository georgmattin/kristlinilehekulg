import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Eye, Lock, Database, Mail, UserCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PrivacyPage() {
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

      {/* Privacy Policy Content */}
      <section className="py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: December 2024</p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Commitment to Your Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                At Fyzen, we are committed to protecting your privacy and ensuring the security of your personal
                information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you visit our website and purchase our digital products.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Email address (for purchases and newsletter)</li>
                  <li>• Name (if provided during checkout)</li>
                  <li>• Payment information (processed securely by our payment providers)</li>
                  <li>• Communication preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• IP address and location data</li>
                  <li>• Browser type and version</li>
                  <li>• Device information</li>
                  <li>• Website usage patterns and analytics</li>
                  <li>• Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Process and fulfill your orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Send you download links and order confirmations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Provide customer support and respond to inquiries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Send newsletter updates (only if you subscribe)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Improve our website and services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Analyze website usage and performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Comply with legal obligations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• SSL encryption for all data transmission</li>
                <li>• Secure payment processing through trusted providers</li>
                <li>• Regular security audits and updates</li>
                <li>• Limited access to personal information on a need-to-know basis</li>
                <li>• Secure data storage with backup and recovery procedures</li>
              </ul>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use trusted third-party services to provide our services. These partners have their own privacy
                policies:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>
                  • <strong>Supabase:</strong> Database and authentication services
                </li>
                <li>
                  • <strong>Stripe:</strong> Payment processing
                </li>
                <li>
                  • <strong>Vercel:</strong> Website hosting and analytics
                </li>
                <li>
                  • <strong>Email service providers:</strong> Newsletter and transactional emails
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>
                  • <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  • <strong>Correction:</strong> Request correction of inaccurate information
                </li>
                <li>
                  • <strong>Deletion:</strong> Request deletion of your personal data
                </li>
                <li>
                  • <strong>Portability:</strong> Request transfer of your data
                </li>
                <li>
                  • <strong>Unsubscribe:</strong> Opt out of marketing communications at any time
                </li>
                <li>
                  • <strong>Object:</strong> Object to processing of your personal data
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your browsing experience and analyze website traffic.
                You can control cookie settings through your browser preferences.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>
                  • <strong>Essential cookies:</strong> Required for website functionality
                </li>
                <li>
                  • <strong>Analytics cookies:</strong> Help us understand website usage
                </li>
                <li>
                  • <strong>Marketing cookies:</strong> Used for personalized content (optional)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Mail className="w-5 h-5 text-pink-600" />
                Questions About Privacy?
              </CardTitle>
              <CardDescription>Contact us if you have any questions about this Privacy Policy</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                If you have any questions about this Privacy Policy or how we handle your personal information, please
                don't hesitate to contact us.
              </p>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                <Mail className="w-4 h-4 mr-2" />
                Contact Us About Privacy
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
