import { NextResponse } from "next/server";
// import { auth } from "../auth";
import { auth } from "../../../auth";

export async function GET() {
  try {
    // 1️⃣ Obtener la sesión y el username del usuario logueado
    const session = await auth();
    //const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`);
    //const session = await res.json();
    console.log("SESSION:", session);

    if (!session || !session.user?.name) {
      return new NextResponse(
        JSON.stringify({ error: "No autorizado" }),
        {
          status: 401,
          headers: corsHeaders(),
        }
      );
    }

    const username = session.user.name;

    // 2️⃣ Listar todos los productos de Whop usando la API key privada
    const productsRes = await fetch(
      `https://api.whop.com/api/v1/products?company_id=${process.env.NEXT_PUBLIC_WHOP_COMPANY_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
        },
      }
    );

    if (!productsRes.ok) {
      throw new Error(`Whop API error: ${productsRes.status}`);
    }

    const productsData = await productsRes.json();
    const allProducts = productsData.data || [];

    // 3️⃣ Filtrar los productos que el usuario puede acceder
    const accessibleProducts: any[] = [];

    // ⚡ Ejecutar las comprobaciones en paralelo para más velocidad
    const checks = allProducts.map(async (product: any) => {
      const accessRes = await fetch(
        `https://api.whop.com/api/v1/users/${username}/access/${product.id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
          },
        }
      );

      if (!accessRes.ok) return null;

      const accessData = await accessRes.json();
      return accessData.has_access ? product : null;
    });

    const results = await Promise.all(checks);
    const filtered = results.filter((p) => p !== null);

    // 4️⃣ Devolver los productos accesibles
    return new NextResponse(
      JSON.stringify({ data: filtered }),
      {
        status: 200,
        headers: corsHeaders(),
      }
    );
  } catch (err: any) {
    console.error("Error fetching user courses:", err);

    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch user courses" }),
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}

// ✅ Responder a las solicitudes OPTIONS (preflight CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

// 🔧 Función auxiliar para CORS headers
function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin":
      process.env.NODE_ENV === "production"
        ? "https://only-benefits-148004.framer.app"
        : "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}