"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Edit, Trash2, LogOut, Save, Plus, Users, Mail } from "lucide-react"
import Image from "next/image"
import { supabase, type Product, type NewsletterSubscriber } from "@/lib/supabase"
import { signIn } from "@/lib/auth"
import type React from "react"
import Link from "next/link"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [products, setProducts] = useState<Product[]>([])
  const [siteContent, setSiteContent] = useState<Record<string, any>>({})
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({})
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    original_price: "",
    category: "",
    stripe_price_id: "",
    custom_link: "",
    featured: false,
    image_url: "",
    is_free: false,
    download_file_url: "",
  })

  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterLoading, setNewsletterLoading] = useState(false)

  useEffect(() => {
    // Check if already authenticated (simple session check)
    const isAuth = localStorage.getItem("admin_authenticated") === "true"
    setIsAuthenticated(isAuth)

    if (isAuth) {
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    try {
      console.log("Fetching data...")

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      // Fetch site content
      const { data: contentData, error: contentError } = await supabase.from("site_content").select("*")

      // Fetch social media links - handle if table doesn't exist yet
      let socialData = null
      let socialError = null
      try {
        const result = await supabase.from("social_media_links").select("*")
        socialData = result.data
        socialError = result.error
      } catch (err) {
        console.log("Social media links table not found - using defaults")
        socialData = [
          { platform: "instagram", url: "https://instagram.com" },
          { platform: "youtube", url: "https://youtube.com" },
          { platform: "tiktok", url: "https://tiktok.com" },
          { platform: "x", url: "https://x.com" },
        ]
      }

      // Fetch newsletter subscribers - handle if table doesn't exist yet
      let subscribersData = null
      let subscribersError = null
      try {
        const result = await supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("subscribed_at", { ascending: false })
        subscribersData = result.data
        subscribersError = result.error
      } catch (err) {
        console.log("Newsletter subscribers table not found - using empty array")
        subscribersData = []
      }

      console.log("Products data:", productsData)
      console.log("Content data:", contentData)
      console.log("Social data:", socialData)
      console.log("Subscribers data:", subscribersData)

      if (productsError) console.error("Products error:", productsError)
      if (contentError) console.error("Content error:", contentError)
      if (socialError) console.error("Social error:", socialError)
      if (subscribersError) console.error("Subscribers error:", subscribersError)

      if (productsData) setProducts(productsData)
      if (subscribersData) setSubscribers(subscribersData)

      if (contentData) {
        const contentMap = contentData.reduce((acc, item) => {
          acc[item.section] = item.content
          return acc
        }, {})
        console.log("Content map:", contentMap)
        setSiteContent(contentMap)
      }

      if (socialData) {
        const socialMap = socialData.reduce((acc, item) => {
          acc[item.platform] = item.url
          return acc
        }, {})
        setSocialLinks(socialMap)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn(loginForm.email, loginForm.password)

    if (result.success) {
      setIsAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
      fetchData()
    } else {
      alert("Invalid credentials")
    }

    setLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_authenticated")
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...newProduct,
        price: newProduct.is_free ? 0 : Number.parseFloat(newProduct.price),
        original_price: newProduct.original_price ? Number.parseFloat(newProduct.original_price) : null,
      }

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id)
      } else {
        // Create new product
        const { error } = await supabase.from("products").insert([productData])
      }

      setNewProduct({
        title: "",
        description: "",
        price: "",
        original_price: "",
        category: "",
        stripe_price_id: "",
        custom_link: "",
        featured: false,
        image_url: "",
        is_free: false,
        download_file_url: "",
      })
      setShowAddForm(false)
      setEditingProduct(null)
      fetchData()
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await supabase.from("products").delete().eq("id", id)
        fetchData()
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const handleEditProduct = (product: Product) => {
    setNewProduct({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      category: product.category,
      stripe_price_id: product.stripe_price_id || "",
      custom_link: product.custom_link || "",
      featured: product.featured,
      image_url: product.image_url || "",
      is_free: product.is_free,
      download_file_url: product.download_file_url || "",
    })
    setEditingProduct(product)
    setShowAddForm(true)
  }

  const handleContentUpdate = async (section: string, content: any) => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("site_content")
        .upsert(
          {
            section,
            content,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "section",
            ignoreDuplicates: false,
          },
        )
        .select()

      if (error) {
        console.error("Database error:", error)
        alert(`Error updating content: ${error.message}`)
        return
      }

      console.log("Content updated successfully:", data)
      setSiteContent((prev) => ({ ...prev, [section]: content }))
      alert("Content updated successfully!")
      await fetchData()
    } catch (error) {
      console.error("Error updating content:", error)
      alert("Failed to update content. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLinkUpdate = async (platform: string, url: string) => {
    try {
      setLoading(true)

      const { error } = await supabase.from("social_media_links").upsert(
        {
          platform,
          url,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "platform",
          ignoreDuplicates: false,
        },
      )

      if (error) {
        if (error.code === "42P01") {
          // Table doesn't exist
          alert("Social media links feature is not yet configured. Please run the database setup first.")
          return
        }
        console.error("Database error:", error)
        alert(`Error updating social link: ${error.message}`)
        return
      }

      setSocialLinks((prev) => ({ ...prev, [platform]: url }))
      alert("Social media link updated successfully!")
      await fetchData()
    } catch (error) {
      console.error("Error updating social link:", error)
      alert("Failed to update social link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterLoading(true)

    try {
      const { error } = await supabase.from("newsletter_subscribers").insert([{ email: newsletterEmail }])

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          alert("This email is already subscribed!")
        } else if (error.code === "42P01") {
          // Table doesn't exist
          alert("Newsletter feature is not yet configured. Please run the database setup first.")
        } else {
          throw error
        }
      } else {
        alert("Successfully subscribed to newsletter!")
        setNewsletterEmail("")
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      alert("Failed to subscribe. Please try again.")
    } finally {
      setNewsletterLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Image src="/fyzen-logo.png" alt="fyzen" width={320} height={106} className="h-24 w-auto mx-auto mb-4" />
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Sign in to manage your website</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image src="/fyzen-logo.png" alt="fyzen" width={320} height={106} className="h-16 w-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                console.log("Current site content:", siteContent)
                fetchData()
              }}
              variant="outline"
              size="sm"
            >
              Debug & Refresh
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="content">Site Content</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900">{products.length}</div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600">
                    ${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600">{products.filter((p) => p.featured).length}</div>
                  <div className="text-sm text-gray-600">Featured</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-purple-600">{products.filter((p) => p.is_free).length}</div>
                  <div className="text-sm text-gray-600">Free Products</div>
                </CardContent>
              </Card>
            </div>

            {/* Add Product Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Products</h2>
              <div className="flex gap-2">
                <Button onClick={fetchData} variant="outline" size="sm">
                  Refresh Data
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(!showAddForm)
                    setEditingProduct(null)
                    setNewProduct({
                      title: "",
                      description: "",
                      price: "",
                      original_price: "",
                      category: "",
                      stripe_price_id: "",
                      custom_link: "",
                      featured: false,
                      image_url: "",
                      is_free: false,
                      download_file_url: "",
                    })
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {showAddForm ? "Cancel" : "Add Product"}
                </Button>
              </div>
            </div>

            {/* Add/Edit Product Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
                  <CardDescription>
                    {editingProduct ? "Update product information" : "Fill in all fields to add a new product"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Product Name</Label>
                        <Input
                          id="title"
                          value={newProduct.title}
                          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                          placeholder="Enter product name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Free guides">Free guides</SelectItem>
                            <SelectItem value="Planners">Planners</SelectItem>
                            <SelectItem value="Templates">Templates</SelectItem>
                            <SelectItem value="Workbooks">Workbooks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Describe your product..."
                        rows={3}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_free"
                        checked={newProduct.is_free}
                        onChange={(e) => setNewProduct({ ...newProduct, is_free: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="is_free">Free Product</Label>
                    </div>

                    {!newProduct.is_free && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price ($)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="0.00"
                            required={!newProduct.is_free}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="original_price">Original Price ($)</Label>
                          <Input
                            id="original_price"
                            type="number"
                            step="0.01"
                            value={newProduct.original_price}
                            onChange={(e) => setNewProduct({ ...newProduct, original_price: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="stripe_price_id">Stripe Price ID</Label>
                          <Input
                            id="stripe_price_id"
                            value={newProduct.stripe_price_id}
                            onChange={(e) => setNewProduct({ ...newProduct, stripe_price_id: e.target.value })}
                            placeholder="price_1234567890"
                          />
                        </div>
                      </div>
                    )}

                    {!newProduct.is_free && (
                      <div className="space-y-2">
                        <Label htmlFor="custom_link">Custom Buy Now Link</Label>
                        <Input
                          id="custom_link"
                          value={newProduct.custom_link}
                          onChange={(e) => setNewProduct({ ...newProduct, custom_link: e.target.value })}
                          placeholder="https://your-custom-checkout-link.com"
                        />
                        <p className="text-xs text-gray-500">
                          If provided, this link will be used instead of Stripe. Leave empty to use Stripe or show "Add
                          to Cart".
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="image_url">Product Image URL</Label>
                      <Input
                        id="image_url"
                        placeholder="https://example.com/image.jpg"
                        value={newProduct.image_url}
                        onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                      />
                    </div>

                    {newProduct.is_free && (
                      <div className="space-y-2">
                        <Label htmlFor="download_file_url">Download File URL</Label>
                        <Input
                          id="download_file_url"
                          placeholder="https://example.com/file.pdf"
                          value={newProduct.download_file_url}
                          onChange={(e) => setNewProduct({ ...newProduct, download_file_url: e.target.value })}
                          required={newProduct.is_free && !newProduct.download_file_url}
                        />
                        <p className="text-xs text-gray-500">Direct link to your file (PDF, ZIP, DOC, etc.)</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={newProduct.featured}
                        onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        disabled={loading}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddForm(false)
                          setEditingProduct(null)
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your existing products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="relative">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <Image
                            src={product.image_url || "/placeholder.svg?height=200&width=200"}
                            alt={product.title}
                            width={200}
                            height={200}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Badge
                            className={`absolute top-2 left-2 ${product.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {product.status}
                          </Badge>
                          {product.featured && (
                            <Badge className="absolute top-2 right-2 bg-pink-100 text-pink-800">Featured</Badge>
                          )}
                          {product.is_free && (
                            <Badge className="absolute bottom-2 left-2 bg-green-500 text-white">Free</Badge>
                          )}
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                        <div className="flex items-center justify-between mb-4">
                          {product.is_free ? (
                            <span className="text-lg font-bold text-green-600">Free</span>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">${product.price}</span>
                          )}
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1" asChild>
                            <Link href={`/product/${product.id}`}>
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid gap-6">
              {/* Hero Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Edit the main hero section content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={siteContent.hero?.title || ""}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, title: e.target.value },
                        }))
                      }
                      placeholder="Digital Tools For Your Brand"
                    />
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Textarea
                      value={siteContent.hero?.subtitle || ""}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, subtitle: e.target.value },
                        }))
                      }
                      placeholder="Discover my handcrafted digital products..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Primary CTA</Label>
                      <Input
                        value={siteContent.hero?.cta_primary || ""}
                        onChange={(e) =>
                          setSiteContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, cta_primary: e.target.value },
                          }))
                        }
                        placeholder="Shop Products"
                      />
                    </div>
                    <div>
                      <Label>Secondary CTA</Label>
                      <Input
                        value={siteContent.hero?.cta_secondary || ""}
                        onChange={(e) =>
                          setSiteContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, cta_secondary: e.target.value },
                          }))
                        }
                        placeholder="Watch Video"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleContentUpdate("hero", siteContent.hero)}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Hero Content
                  </Button>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About Section</CardTitle>
                  <CardDescription>Edit the about section content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={siteContent.about?.title || ""}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, title: e.target.value },
                        }))
                      }
                      placeholder="Hi, I'm Sarah! 👋"
                    />
                  </div>
                  <div>
                    <Label>Description 1</Label>
                    <Textarea
                      value={siteContent.about?.description || ""}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, description: e.target.value },
                        }))
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Description 2</Label>
                    <Textarea
                      value={siteContent.about?.description2 || ""}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, description2: e.target.value },
                        }))
                      }
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={() => handleContentUpdate("about", siteContent.about)}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save About Content
                  </Button>
                </CardContent>
              </Card>

              {/* Newsletter Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Newsletter Section</CardTitle>
                  <CardDescription>Edit the newsletter signup content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={siteContent.newsletter?.title || ""}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          newsletter: { ...prev.newsletter, title: e.target.value },
                        }))
                      }
                      placeholder="Be First to Know About New Products! 💌"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={siteContent.newsletter?.description || ""}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          newsletter: { ...prev.newsletter, description: e.target.value },
                        }))
                      }
                      placeholder="Join my newsletter and get free templates plus exclusive content"
                      rows={2}
                    />
                  </div>
                  <Button
                    onClick={() => handleContentUpdate("newsletter", siteContent.newsletter)}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Newsletter Content
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Manage your social media links that appear in header and footer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Instagram URL</Label>
                    <Input
                      value={socialLinks.instagram || ""}
                      onChange={(e) => setSocialLinks((prev) => ({ ...prev, instagram: e.target.value }))}
                      placeholder="https://instagram.com/yourusername"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube URL</Label>
                    <Input
                      value={socialLinks.youtube || ""}
                      onChange={(e) => setSocialLinks((prev) => ({ ...prev, youtube: e.target.value }))}
                      placeholder="https://youtube.com/@yourusername"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>TikTok URL</Label>
                    <Input
                      value={socialLinks.tiktok || ""}
                      onChange={(e) => setSocialLinks((prev) => ({ ...prev, tiktok: e.target.value }))}
                      placeholder="https://tiktok.com/@yourusername"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>X (Twitter) URL</Label>
                    <Input
                      value={socialLinks.x || ""}
                      onChange={(e) => setSocialLinks((prev) => ({ ...prev, x: e.target.value }))}
                      placeholder="https://x.com/yourusername"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleSocialLinkUpdate("instagram", socialLinks.instagram || "")}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Instagram
                  </Button>
                  <Button
                    onClick={() => handleSocialLinkUpdate("youtube", socialLinks.youtube || "")}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save YouTube
                  </Button>
                  <Button
                    onClick={() => handleSocialLinkUpdate("tiktok", socialLinks.tiktok || "")}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save TikTok
                  </Button>
                  <Button
                    onClick={() => handleSocialLinkUpdate("x", socialLinks.x || "")}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save X
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscribers</CardTitle>
                <CardDescription>View and manage newsletter subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900">{subscribers.length}</div>
                  <div className="text-sm text-gray-600">Total Subscribers</div>
                </div>
                <div className="space-y-2">
                  {subscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{subscriber.email}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {subscribers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No subscribers yet</p>
                    </div>
                  )}
                </div>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="newsletterEmail">Email</Label>
                    <Input
                      id="newsletterEmail"
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      placeholder="Enter email to test newsletter signup"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    disabled={newsletterLoading}
                  >
                    {newsletterLoading ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900">
                    {products.reduce((sum, p) => sum + p.downloads, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Downloads</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600">
                    ${products.reduce((sum, p) => sum + p.price * p.downloads, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Estimated Revenue</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((products.reduce((sum, p) => sum + p.rating, 0) / products.length) * 10) / 10 || 0}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-purple-600">{subscribers.length}</div>
                  <div className="text-sm text-gray-600">Newsletter Subscribers</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Top performing products by downloads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products
                    .sort((a, b) => b.downloads - a.downloads)
                    .slice(0, 5)
                    .map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{product.title}</h4>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{product.downloads} downloads</div>
                          <div className="text-sm text-gray-600">{product.is_free ? "Free" : `$${product.price}`}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
