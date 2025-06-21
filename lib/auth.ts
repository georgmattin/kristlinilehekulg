import { supabase } from "./supabase"
import bcrypt from "bcryptjs"

export async function signIn(email: string, password: string) {
  try {
    // Get user from database
    const { data: user, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

    if (error || !user) {
      throw new Error("Invalid credentials")
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      throw new Error("Invalid credentials")
    }

    return { success: true, user: { id: user.id, email: user.email } }
  } catch (error) {
    return { success: false, error: "Invalid credentials" }
  }
}

export async function createAdminUser(email: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from("admin_users")
      .insert([{ email, password_hash: hashedPassword }])
      .select()
      .single()

    if (error) throw error

    return { success: true, user: data }
  } catch (error) {
    return { success: false, error: "Failed to create user" }
  }
}
