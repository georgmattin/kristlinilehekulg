import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  title: string
  description: string
  price: number
  original_price?: number
  category: string
  image_url?: string
  stripe_price_id?: string
  custom_link?: string
  featured: boolean
  status: string
  rating: number
  downloads: number
  is_free: boolean
  download_file_url?: string
  created_at: string
  updated_at: string
}

export type SiteContent = {
  id: string
  section: string
  content: any
  updated_at: string
}

export type SocialMediaLink = {
  id: string
  platform: string
  url: string
  updated_at: string
}

export type NewsletterSubscriber = {
  id: string
  email: string
  subscribed_at: string
  status: string
}

export type FreeDownload = {
  id: string
  product_id: string
  email: string
  download_link: string
  downloaded_at: string
  expires_at: string
}
