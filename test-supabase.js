// // Test script to verify Supabase connection
// // Run with: node test-supabase.js

// require("dotenv").config({ path: ".env.local" })
// const { createClient } = require("@supabase/supabase-js")

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// console.log("🔍 Testing Supabase connection...\n")
// console.log("URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
// console.log("Key:", supabaseKey ? "✅ Set" : "❌ Missing")
// console.log("")

// if (!supabaseUrl || !supabaseKey) {
//   console.error("❌ Missing environment variables!")
//   console.log("\nMake sure you have created .env.local with:")
//   console.log("NEXT_PUBLIC_SUPABASE_URL=your-url")
//   console.log("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...")
//   process.exit(1)
// }

// const supabase = createClient(supabaseUrl, supabaseKey)

// async function testConnection() {
//   try {
//     console.log("📝 Attempting to insert a test event...\n")

//     const testEvent = {
//       slug: "test-event-" + Date.now(),
//       name: "Test Event",
//       date: new Date().toISOString(),
//       location: "Test Location",
//       description: "This is a test event created by the test script",
//       tier_label: "Test Tier",
//     }

//     const { data, error } = await supabase
//       .from("events")
//       .insert([testEvent])
//       .select()
//       .single()

//     if (error) {
//       console.error("❌ Error inserting test event:")
//       console.error(error.message)
//       console.log("\nPossible issues:")
//       console.log("1. Have you run the SQL schema from supabase-schema.sql?")
//       console.log("2. Is the events table created?")
//       console.log("3. Is RLS enabled with the correct policies?")
//       process.exit(1)
//     }

//     console.log("✅ Successfully inserted test event!")
//     console.log("Event ID:", data.id)
//     console.log("Event slug:", data.slug)
//     console.log("\n📖 Now testing read access...\n")

//     // Test reading the event back
//     const { data: readData, error: readError } = await supabase
//       .from("events")
//       .select("*")
//       .eq("slug", data.slug)
//       .single()

//     if (readError) {
//       console.error("❌ Error reading test event:")
//       console.error(readError.message)
//       process.exit(1)
//     }

//     console.log("✅ Successfully read test event!")
//     console.log("Event name:", readData.name)
//     console.log("Event location:", readData.location)

//     console.log(
//       "\n🎉 All tests passed! Your Supabase connection is working correctly.",
//     )
//     console.log("\nTest event slug:", data.slug)
//     console.log("You can view it at: http://localhost:3000/i/" + data.slug)
//     console.log(
//       "\n💡 Tip: You can delete this test event from your Supabase dashboard if you want.",
//     )
//   } catch (err) {
//     console.error("❌ Unexpected error:")
//     console.error(err)
//     process.exit(1)
//   }
// }

// testConnection()
