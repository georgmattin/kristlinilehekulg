// Manual script to update products via Supabase client
// Run this in the browser console on your admin page

async function updateProductCategories() {
  // First, delete all existing products
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all

  if (deleteError) {
    console.error("Error deleting products:", deleteError)
    return
  }

  // Insert new products
  const newProducts = [
    // Free guides
    {
      title: "Social Media Strategy Guide",
      description: "Complete guide to building your social media presence from scratch",
      price: 0.0,
      original_price: null,
      category: "Free guides",
      featured: true,
      rating: 4.9,
      downloads: 1247,
      is_free: true,
      download_file_url: "https://example.com/social-media-guide.pdf",
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: null,
      status: "active",
    },
    {
      title: "Content Creation Basics",
      description: "Learn the fundamentals of creating engaging content for your audience",
      price: 0.0,
      original_price: null,
      category: "Free guides",
      featured: false,
      rating: 4.7,
      downloads: 892,
      is_free: true,
      download_file_url: "https://example.com/content-basics.pdf",
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: null,
      status: "active",
    },
    {
      title: "Instagram Growth Secrets",
      description: "Proven strategies to grow your Instagram following organically",
      price: 0.0,
      original_price: null,
      category: "Free guides",
      featured: true,
      rating: 4.8,
      downloads: 1534,
      is_free: true,
      download_file_url: "https://example.com/instagram-growth.pdf",
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: null,
      status: "active",
    },
    // Planners
    {
      title: "Content Calendar Planner",
      description: "Monthly content planning template to organize your social media posts",
      price: 15.0,
      original_price: 25.0,
      category: "Planners",
      featured: true,
      rating: 4.9,
      downloads: 456,
      is_free: false,
      download_file_url: null,
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: "price_content_planner",
      status: "active",
    },
    {
      title: "Business Goal Tracker",
      description: "Track and achieve your business goals with this comprehensive planner",
      price: 22.0,
      original_price: null,
      category: "Planners",
      featured: false,
      rating: 4.8,
      downloads: 234,
      is_free: false,
      download_file_url: null,
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: "price_goal_tracker",
      status: "active",
    },
    {
      title: "Social Media Audit Planner",
      description: "Analyze and improve your social media performance with this detailed planner",
      price: 18.0,
      original_price: 30.0,
      category: "Planners",
      featured: false,
      rating: 4.7,
      downloads: 189,
      is_free: false,
      download_file_url: null,
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: "price_audit_planner",
      status: "active",
    },
    // Templates
    {
      title: "Instagram Story Templates Pack",
      description: "50 beautiful Instagram story templates for your brand",
      price: 35.0,
      original_price: 50.0,
      category: "Templates",
      featured: true,
      rating: 4.9,
      downloads: 789,
      is_free: false,
      download_file_url: null,
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: "price_story_templates",
      status: "active",
    },
    {
      title: "Social Media Post Templates",
      description: "Ready-to-use templates for Facebook, Instagram, and LinkedIn posts",
      price: 28.0,
      original_price: null,
      category: "Templates",
      featured: true,
      rating: 4.8,
      downloads: 567,
      is_free: false,
      download_file_url: null,
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: "price_post_templates",
      status: "active",
    },
    {
      title: "Email Newsletter Templates",
      description: "Professional email templates to engage your subscribers",
      price: 25.0,
      original_price: 40.0,
      category: "Templates",
      featured: false,
      rating: 4.7,
      downloads: 345,
      is_free: false,
      download_file_url: null,
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: "price_email_templates",
      status: "active",
    },
    {
      title: "Brand Identity Template Kit",
      description: "Complete brand identity templates including logos, colors, and fonts",
      price: 45.0,
      original_price: null,
      category: "Templates",
      featured: false,
      rating: 4.9,
      downloads: 234,
      is_free: false,
      download_file_url: null,
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: "price_brand_kit",
      status: "active",
    },
    // Workbooks
    {
      title: "Social Media Marketing Workbook",
      description: "Step-by-step workbook to master social media marketing",
      price: 32.0,
      original_price: 45.0,
      category: "Workbooks",
      featured: true,
      rating: 4.8,
      downloads: 423,
      is_free: false,
      download_file_url: null,
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: "price_marketing_workbook",
      status: "active",
    },
    {
      title: "Content Strategy Workbook",
      description: "Develop your content strategy with exercises and templates",
      price: 28.0,
      original_price: null,
      category: "Workbooks",
      featured: false,
      rating: 4.7,
      downloads: 312,
      is_free: false,
      download_file_url: null,
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: "price_strategy_workbook",
      status: "active",
    },
    {
      title: "Brand Building Workbook",
      description: "Build a strong personal or business brand with this comprehensive workbook",
      price: 38.0,
      original_price: 55.0,
      category: "Workbooks",
      featured: false,
      rating: 4.9,
      downloads: 267,
      is_free: false,
      download_file_url: null,
      image_url: "/placeholder.svg?height=300&width=300",
      stripe_price_id: "price_brand_workbook",
      status: "active",
    },
  ]

  const { data, error } = await supabase.from("products").insert(newProducts)

  if (error) {
    console.error("Error inserting products:", error)
  } else {
    console.log("Products updated successfully!", data)
  }
}

// Run the function
// Assuming supabase is available in the global scope, e.g., from a script tag
// If not, you'll need to import or declare it appropriately.
updateProductCategories()
