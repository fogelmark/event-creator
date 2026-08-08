import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Get filename from query params (following Vercel Blob docs pattern)
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 },
      )
    }

    // Upload file directly from request body
    // Using 'public' access so event invite images are viewable by anyone
    const blob = await put(filename, request.body!, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    )
  }
}
