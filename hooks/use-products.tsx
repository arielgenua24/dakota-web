"use client"

import { useState, useEffect, useCallback } from "react"
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

  const fetchProducts = useCallback(async (page = 1, limit = 12, category?: string) => {
    setLoading(true)
    setError(null)

    try {
      // Construir la URL con parámetros de consulta
      let url = `/api/products?page=${page}&limit=${limit}`
      if (category) {
        url += `&category=${category}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data: ProductsResponse = await response.json()

      // Verificar si hay productos en sessionStorage
      const storedProducts = sessionStorage.getItem("products")

      if (!storedProducts || page === 1) {
        // Si no hay productos almacenados o es la primera página, guardar los nuevos
        sessionStorage.setItem("products", JSON.stringify(data.products))
        setProducts(data.products)
      } else {
        // Si hay productos almacenados y no es la primera página, añadir los nuevos
        const existingProducts = JSON.parse(storedProducts)
        const updatedProducts = [...existingProducts, ...data.products]
        sessionStorage.setItem("products", JSON.stringify(updatedProducts))
        setProducts(updatedProducts)
      }

      setPagination(data.pagination)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err.message || "Error al cargar los productos")

      // Intentar cargar desde sessionStorage si la API falla
      const storedProducts = sessionStorage.getItem("products")
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar productos cuando cambian los parámetros de búsqueda
  useEffect(() => {
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const category = searchParams.get("category") || undefined

    fetchProducts(page, pagination.limit, category)
  }, [searchParams, fetchProducts, pagination.limit])

  // Cargar productos iniciales o desde sessionStorage
  useEffect(() => {
    const storedProducts = sessionStorage.getItem("products")

    if (storedProducts) {
      // Si hay productos en sessionStorage, usarlos primero para mostrar algo rápido
      setProducts(JSON.parse(storedProducts))
      setLoading(false)
    }

    // Luego, obtener los productos frescos de la API
    fetchProducts(1, pagination.limit)
  }, [])

  const loadMoreProducts = useCallback(() => {
    if (pagination.page < pagination.totalPages && !loading) {
      fetchProducts(pagination.page + 1, pagination.limit)
    }
  }, [pagination, loading, fetchProducts])

  return {
    products,
    loading,
    error,
    pagination,
    loadMoreProducts,
    fetchProducts,
  }
}
