import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { slug, name, date, location, description, image_url, tier_label } =
      body

    // Insert event into Supabase
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          slug,
          name,
          date,
          location,
          description,
          image_url,
          tier_label,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ slug: data.slug })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    )
  }
}
