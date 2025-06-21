"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { createAdminUser } from "@/lib/auth"
import Link from "next/link"

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters!")
      return
    }

    setLoading(true)

    const result = await createAdminUser(form.email, form.password)

    if (result.success) {
      setSuccess(true)
    } else {
      alert("Failed to create admin user. Email might already exist.")
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Image src="/fyzen-logo.png" alt="fyzen" width={320} height={106} className="h-24 w-auto mx-auto mb-4" />
            <CardTitle className="text-green-600">Success! 🎉</CardTitle>
            <CardDescription>Admin account created successfully</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">You can now sign in with your credentials.</p>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Link href="/admin">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Image src="/fyzen-logo.png" alt="fyzen" width={320} height={106} className="h-24 w-auto mx-auto mb-4" />
          <CardTitle>Create Admin Account</CardTitle>
          <CardDescription>Set up your first admin account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@fyzen.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat your password"
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Admin Account"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/admin" className="text-sm text-gray-600 hover:text-pink-600">
              Already have an account? Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
