"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-cache"

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
  curvePrice?: number
  state: string
  sizes: ProductSize[]
}

export const useProducts = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [docIndex, setDocIndex] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const searchParams = useSearchParams()
  const category = searchParams.get("category") || undefined

  // Usamos una ref para evitar que fetchProducts se recree innecesariamente
  const hasMoreRef = useRef(hasMore);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const fetchProducts = useCallback(async (index: number) => {
    if (!hasMoreRef.current) return;
    setLoading(true)
    setError(null)

    try {
      const docRef = doc(db, "cached_products", `parsed_data_${index}`)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        // Convertir el mapa de productos a un array
        const newProducts: Product[] = Object.values(data)
        setAllProducts(prev => [...prev, ...newProducts])
        setDocIndex(index + 1)
      } else {
        // No hay más documentos para cargar
        setHasMore(false)
      }
    } catch (err) {
      console.error("Error fetching products from Firestore:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }, []) // Eliminamos hasMore de las dependencias

  // Efecto para la carga inicial y cambios de categoría
  useEffect(() => {
    setAllProducts([]);
    setFilteredProducts([]);
    setDocIndex(1);
    setHasMore(true);
    // Reiniciamos y volvemos a cargar desde el principio cuando cambia la categoría
    // Esto asegura que el fetch se ejecute con el estado reiniciado.
    fetchProducts(1);
  }, [category, fetchProducts]); // Se ejecuta al inicio y si cambia la categoría

  // Efecto para filtrar productos cuando cambia la categoría o se cargan nuevos productos
  useEffect(() => {
    if (category) {
      const filtered = allProducts.filter(p => p.category === category)
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(allProducts)
    }
  }, [category, allProducts])

  const loadMoreProducts = useCallback(() => {
    if (!loading && hasMore) {
      fetchProducts(docIndex)
    }
  }, [loading, hasMore, docIndex, fetchProducts])

  return {
    products: filteredProducts,
    loading,
    error,
    hasMore,
    loadMoreProducts,
  }
}
