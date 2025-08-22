"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { fetchCachedProducts } from "../lib/firebaseCache"
import { useSearchParams } from "next/navigation"

export type ProductSize = {
  size: number | string
  quantity: number
}

export type Product = {
  id: number
  name: string
  category: string
  specialTag: string
  images: {
    img1: string
    img2: string
    img3: string
  }
  price: number
  state: string
  sizes: ProductSize[]
}

type PaginationData = {
  total: number
  page: number
  limit: number
  totalPages: number
}

type ProductsResponse = {
  products: Product[]
  pagination: PaginationData
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  })

  const searchParams = useSearchParams()
  const fetchedPagesRef = useRef<Set<number>>(new Set())
  const hasMoreRef = useRef<boolean>(true)

  const fetchProducts = useCallback(async (page = 1, limit = 12, category?: string) => {
    setLoading(true)
    setError(null)

    try {
      // Evitar re-fetch de la misma página
      if (fetchedPagesRef.current.has(page)) {
        console.log(`[useProducts] page ${page} already fetched. Skipping.`)
        return
      }

      // Obtener productos desde la caché Firestore
      const data: ProductsResponse = await fetchCachedProducts(page, limit, category)
      console.log("[useProducts] fetched", data.products.length, "products (page", page, ")")

      // Si no hay productos en una página > 1, no sobreescribimos la lista existente
      if (page > 1 && data.products.length === 0) {
        fetchedPagesRef.current.add(page)
        hasMoreRef.current = false
        setPagination(data.pagination)
        return
      }

      // Verificar si hay productos en sessionStorage
      const storedProducts = sessionStorage.getItem("products")

      // Normalizar categoría: tratar null (no existe en session) como undefined
      const storedCategoryRaw = sessionStorage.getItem("category")
      const storedCategory = storedCategoryRaw ?? undefined
      const currentCategory = category ?? undefined

      // Si la categoría cambió, es la primera página, o no hay productos guardados, reiniciamos la lista.
      if (currentCategory !== storedCategory || page === 1 || !storedProducts) {
        setProducts(data.products);
        sessionStorage.setItem("products", JSON.stringify(data.products));
        // Guardamos la categoría actual para futuras comparaciones.
        if (category) {
          sessionStorage.setItem("category", category);
        } else {
          sessionStorage.removeItem("category");
        }
        // Reset de páginas obtenidas
        fetchedPagesRef.current = new Set([page])
        // Reiniciamos el flag de hasMore, asumimos que habrá más hasta comprobar lo contrario
        hasMoreRef.current = true
      } else {
        // Si estamos en la misma categoría y no es la primera página, añadimos productos (scroll infinito).
        const existingProducts = JSON.parse(storedProducts);
        const updatedProducts = [...existingProducts, ...data.products];
        setProducts(updatedProducts);
        sessionStorage.setItem("products", JSON.stringify(updatedProducts));
        fetchedPagesRef.current.add(page)
        // Si esta página no trajo productos, marcamos que no hay más
        if (data.products.length === 0) {
          hasMoreRef.current = false
        }
      }

      setPagination(data.pagination)
    } catch (err) {
      console.error("Error fetching products:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }

      // Intentar cargar desde sessionStorage si la API falla
      const cachedProducts = sessionStorage.getItem("products")
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar productos cuando cambian los parámetros de búsqueda
  useEffect(() => {
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const category = searchParams.get("category") || searchParams.get("filter") || undefined

    fetchProducts(page, pagination.limit, category)
  }, [searchParams, fetchProducts, pagination.limit])



  const loadMoreProducts = useCallback(() => {
    if (!hasMoreRef.current) return
    if (pagination.page < pagination.totalPages && !loading) {
      const nextPage = pagination.page + 1
      // Evitar re-fetch del nextPage si ya fue obtenido
      if (fetchedPagesRef.current.has(nextPage)) return
      const category = searchParams.get("category") || searchParams.get("filter") || undefined
      fetchProducts(nextPage, pagination.limit, category)
    }
  }, [pagination, loading, fetchProducts, searchParams])

  return {
    products,
    loading,
    error,
    pagination,
    loadMoreProducts,
    fetchProducts,
  }
}
