import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

// Enum para categorías (necesario para el algoritmo)
enum Category {
  jeans = "jeans",
  shirts = "shirts",
  jackets = "jackets",
  accessories = "accessories",
  other = "other",
}

// Algoritmo para procesar datos
type Product = {
  id?: string
  name: string
  category: string
  productCode?: string
  image1?: string
  image2?: string
  image3?: string
  price?: number
  curvePrice?: number
  size?: string
}

const processJeansData = (products: Product[]): ReturnType<typeof Array.prototype.map> => {
  if (!products || products.length === 0) return []

  // Agrupar productos por nombre
  const groupedProducts = products.reduce<Record<string, Product[]>>((acc, product) => {
    const key = product.name
    if (!acc[key]) acc[key] = []
    acc[key].push(product)
    return acc
  }, {})

  return Object.entries(groupedProducts).map(([name, group]) => {
    // Reordenar: productos con image1 primero
    const prioritizedGroup = [...group].sort((a) => (a.image1 ? -1 : 1))
    const mainProduct = prioritizedGroup[0] || {}

    const codeWithoutHash = mainProduct.productCode?.replace("#", "") || ""
    const productCodeInt = Number.parseInt(codeWithoutHash, 10) || Date.now() // Fallback a timestamp si no hay código

    // Extraer tallas únicas
    const uniqueSizes = [
      ...new Set(
        group.map((p) => {
          const parsed = Number.parseInt(p.size || "", 10)
          return isNaN(parsed) ? p.size : parsed
        }),
      ),
    ]

    return {
      id: productCodeInt,
      name,
      category: mainProduct.category || Category.other,
      specialTag: "",
      images: {
        img1: mainProduct.image1 || "",
        img2: mainProduct.image2 || "",
        img3: mainProduct.image3 || "",
      },
      price: Number(mainProduct.price || "0") || 0,
      curvePrice: Number(mainProduct.curvePrice || "0") || 0,
      state: "",
      sizes: uniqueSizes
        .sort((a, b) => {
          if (typeof a === "number" && typeof b === "number") return a - b
          if (typeof a === "string" && typeof b === "string") return (a || "").localeCompare(b || "")
          return (a?.toString() || "").localeCompare(b?.toString() || "")
        })
        .map((size) => ({ size, quantity: 10 })),
    }
  })
}

export async function GET(request: Request) {
  try {
    // Obtener parámetros de paginación de la URL
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "12", 10)
    const category = searchParams.get("category") || null

    // Calcular offset para paginación
    const offset = (page - 1) * limit

    // Crear la consulta base
    let query: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection("products")

    // Aplicar filtro por categoría si existe
    if (category) {
      query = query.where("category", "==", category)
    }

    const getAllProducts = async () => {
      try {
        const productsRef = db.collection("products");
        const snapshot = await productsRef.get();
        
        if (snapshot.empty) {
          console.log('No se encontraron productos');
          return [];
        }
    
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Product)
        }));
    
        return products;
      } catch (error) {
        console.error('Error al obtener productos:', error);
        throw new Error('Error al cargar los productos');
      }
    };
    
    const rawProducts = await getAllProducts();

    // Procesar los productos con el algoritmo
    const processedProducts = processJeansData(rawProducts)

    // Devolver los productos procesados junto con metadatos de paginación
    return NextResponse.json({
      products: processedProducts,
      pagination: {
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Error al obtener productos:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error al obtener productos", details: message }, { status: 500 })
  }
}
