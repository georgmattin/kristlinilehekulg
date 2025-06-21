"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, HelpCircle, MessageCircle, Mail, ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Simple Accordion component since it might not be available
function SimpleAccordion({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full text-left py-4 flex items-center justify-between hover:text-pink-600 transition-colors"
      >
        <span className="font-medium">{question}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="pb-4 text-gray-600 leading-relaxed">{answer}</div>}
    </div>
  )
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const faqs = [
    {
      question: "What types of digital products do you offer?",
      answer:
        "I offer a variety of digital products including free guides, planners, templates, and workbooks. All products are designed to help you grow your digital presence and improve your content creation skills.",
    },
    {
      question: "How do I download my purchased products?",
      answer:
        "After completing your purchase, you'll receive an email with download links. All downloads are available immediately after payment confirmation.",
    },
    {
      question: "Are the products compatible with different software?",
      answer:
        "Yes! My templates are designed to work with popular software like Canva, Photoshop, Figma, and other design tools. Each product description includes compatibility information.",
    },
    {
      question: "Can I use these products for commercial purposes?",
      answer:
        "Most of my products come with a commercial license, allowing you to use them for your business and client work. Please check the specific license terms included with each product.",
    },
    {
      question: "What is your refund policy?",
      answer:
        "Due to the digital nature of my products and instant access upon purchase, all sales are final. I do not offer refunds or exchanges. Please review product descriptions carefully before purchasing to ensure the product meets your needs.",
    },
    {
      question: "How often do you release new products?",
      answer:
        "I release new products regularly, typically 2-3 times per month. Subscribe to my newsletter to be the first to know about new releases and exclusive offers.",
    },
    {
      question: "Can I customize the templates?",
      answer:
        "All my templates are fully customizable. You can change colors, fonts, text, and images to match your brand. I also include instructions on how to customize each template.",
    },
    {
      question: "Do you provide customer support?",
      answer:
        "Yes, I provide email support for technical issues related to downloading products. However, I do not provide design support, customization services, or refunds for products that don't meet your expectations.",
    },
    {
      question: "Are there any free products available?",
      answer:
        "Yes! I offer several free guides and resources. Check out my 'Free guides' section to download valuable content at no cost. These are great for getting started with my products.",
    },
    {
      question: "What if I have technical issues with downloading?",
      answer:
        "If you experience technical difficulties downloading your purchased products, please contact me with your order number. I'll help resolve download issues within 48 hours.",
    },
    {
      question: "Can I share or resell your products?",
      answer:
        "No, my products are for personal or business use only and cannot be shared, redistributed, or resold. Each purchase grants a single-user license unless otherwise specified.",
    },
    {
      question: "How do I stay updated on new releases?",
      answer:
        "The best way to stay updated is by subscribing to my newsletter. You can also follow me on social media for regular updates, tips, and behind-the-scenes content.",
    },
  ]

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

      {/* FAQ Content */}
      <section className="py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-pink-600" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about my digital products, downloads, and policies.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <SimpleAccordion>
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openItems.includes(index)}
                    onToggle={() => toggleItem(index)}
                  />
                ))}
              </SimpleAccordion>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5 text-pink-600" />
                Still have questions?
              </CardTitle>
              <CardDescription>
                {"Can't find the answer you're looking for? Contact me for technical support."}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                I'm here to help with technical issues related to downloading products. Please note that I only provide
                support for technical problems, not design assistance or refunds.
              </p>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                <Mail className="w-4 h-4 mr-2" />
                Contact for Technical Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
