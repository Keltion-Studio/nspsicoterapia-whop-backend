import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `https://api.whop.com/api/v1/courses?company_id=${process.env.NEXT_PUBLIC_WHOP_COMPANY_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Whop API error: ${res.status}`);
    }

    const data = await res.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // 👇 CORS headers
        "Access-Control-Allow-Origin":
          process.env.NODE_ENV === "production"
            ? "https://only-benefits-148004.framer.app"
            : "*", // permite cualquier origen en desarrollo
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (err: any) {
    console.error("Error fetching courses:", err);

    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch courses" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            process.env.NODE_ENV === "production"
              ? "https://only-benefits-148004.framer.app"
              : "*",
        },
      }
    );
  }
}

// ✅ Responder a las solicitudes OPTIONS (preflight CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin":
        process.env.NODE_ENV === "production"
          ? "https://only-benefits-148004.framer.app"
          : "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
