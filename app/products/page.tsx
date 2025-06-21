"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Star, Download, Search, Filter, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase, type Product } from "@/lib/supabase"
import { useSearchParams } from "next/navigation"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  const searchParams = useSearchParams()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: productsData } = await supabase
          .from("products")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })

        if (productsData) {
          setProducts(productsData)
          setFilteredProducts(productsData)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    // Set initial category from URL params
    const categoryParam = searchParams?.get("category")
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case "featured":
        filtered = filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      case "price-low":
        filtered = filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered = filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered = filtered.sort((a, b) => b.rating - a.rating)
        break
      case "downloads":
        filtered = filtered.sort((a, b) => b.downloads - a.downloads)
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, sortBy])

  const categories = [...new Set(products.map((product) => product.category))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-0.5 lg:py-1">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/fyzen-logo-new.png" alt="fyzen" width={600} height={200} className="h-20 lg:h-24 w-auto" />
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

      {/* Page Header */}
      <section className="py-12 lg:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              All Products
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover all my digital tools and resources to elevate your brand
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 mb-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="downloads">Most Downloaded</SelectItem>
                </SelectContent>
              </Select>

              {/* Results Count */}
              <div className="flex items-center justify-center lg:justify-end">
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                </span>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-0">
                  <Link href={`/product/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={product.image_url || "/placeholder.svg?height=300&width=300"}
                        alt={product.title}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.featured && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs">
                          Popular
                        </Badge>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-pink-600 w-8 h-8"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-700">
                        {product.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {product.rating}
                      </div>
                    </div>

                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                        {product.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-800">${product.price}</span>
                        {product.original_price && (
                          <span className="text-sm text-gray-400 line-through">${product.original_price}</span>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Download className="w-3 h-3 mr-1" />
                        {product.downloads}
                      </div>
                    </div>

                    {product.custom_link ? (
                      <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                        onClick={() => window.open(product.custom_link, "_blank")}
                      >
                        Buy Now
                      </Button>
                    ) : product.stripe_price_id ? (
                      <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                        onClick={() => window.open(`https://buy.stripe.com/${product.stripe_price_id}`, "_blank")}
                      >
                        Buy Now
                      </Button>
                    ) : (
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
