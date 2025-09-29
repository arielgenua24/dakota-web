import { NextRequest, NextResponse } from "next/server";

// Read sensitive URLs from environment variables (defined in .env / .env.development)
// Do NOT expose this URL with NEXT_PUBLIC_ prefix, since it's only used on the server.

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 API /api/lead called");

    const googleUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!googleUrl) {
      console.error("❌ Missing env GOOGLE_APPS_SCRIPT_URL");
      return NextResponse.json(
        { error: "Server misconfiguration: GOOGLE_APPS_SCRIPT_URL is not set" },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log("📝 Received body:", JSON.stringify(body, null, 2));

    // Format data for Google Apps Script (using simple field names that the script expects)
    const formattedData = {
      nombre: body.name?.trim() || "",
      telefono: body.phone?.trim() || "",
      timestamp: body.timestamp || new Date().toISOString(),
      estado: "Nuevo",
      origen: body.source === "modal" ? "Modal Web" : (body.source || "Desconocido")
    };

    console.log("📊 Formatted data for Google Sheets:", JSON.stringify(formattedData, null, 2));
    console.log("🔗 Sending to Google Apps Script URL:", googleUrl);

    // Forward the formatted request to Google Apps Script
    const response = await fetch(googleUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
      redirect: "follow", // Important: Follow redirects automatically
    });

    console.log("📡 Google Apps Script response status:", response.status);
    console.log("📡 Google Apps Script response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Google Apps Script error response:", errorText);
      throw new Error(`Google Apps Script responded with status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Google Apps Script success response:", JSON.stringify(data, null, 2));

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error("❌ Error in /api/lead:", error);

    return NextResponse.json(
      { error: "Failed to process request", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}