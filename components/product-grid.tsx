"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useProducts, type Product } from "@/hooks/use-products"
import ChristmasPromoBanner, { type PromoCountdown } from "./christmas-promo-banner"

const getPromoDeadline = () => {
  const now = new Date()
  const deadline = new Date(now.getFullYear(), 11, 26, 23, 59, 59) // 26 de diciembre 23:59
  // Si ya pasó, corremos al siguiente año para mantener vivo el mensaje navideño
  if (now > deadline) {
    deadline.setFullYear(now.getFullYear() + 1)
  }
  return deadline
}

const calculatePromoCountdown = (): PromoCountdown => {
  const now = new Date()
  const deadline = getPromoDeadline()
  const diff = deadline.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true }
  }

  const totalMinutes = Math.floor(diff / (1000 * 60))
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  return { days, hours, minutes, isExpired: false }
}

export default function ProductGrid({ limit = undefined, filter = undefined }: { limit?: number, filter?: string }) {
  const router = useRouter()
  const [promoCountdown, setPromoCountdown] = useState<PromoCountdown>(calculatePromoCountdown)
  const { items } = useCart()
  const { products, loading, error, pagination, loadMoreProducts } = useProducts()
  console.log("consolelog de products")
  console.log(products)

  // Referencia para el observador de intersección
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoCountdown(calculatePromoCountdown())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Configurar el observador de intersección para carga infinita
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Deshabilitar scroll infinito cuando se usa "limit" (p.ej. sección Home)
    if (limit !== undefined) {
      return
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.page < pagination.totalPages && !loading) {
          loadMoreProducts()
        }
      },
      { threshold: 0 },
    )

    if (loadMoreRef.current && pagination.page < pagination.totalPages) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [pagination, loading, loadMoreProducts, limit])

  const isInCart = (productId: number) => {
    return items.some((item) => item.product.id === productId.toString())
  }

  const formatSizes = (sizes: { size: number | string; quantity: number }[]): string =>
    sizes.map(({ size }) => String(size)).join("/");

  const normalizedFilter = filter?.trim().toLowerCase()
  const isAll = normalizedFilter === undefined || normalizedFilter === "" || normalizedFilter === "todos" || normalizedFilter === "todos los productos" || normalizedFilter === "all"

  const displayed = products
    .filter((product) => {
      // Tratar "Todos los productos" como sin filtro
      if (isAll) return true
      return product.category.trim().toLowerCase() === normalizedFilter
    })
    // 2. Luego aplico el límite (si viene)
    .slice(0, limit ?? products.length);




  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {displayed.map((product) => {
        return (
          <div key={product.id} className="group relative">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <Image
                src={product.images.img1 || "/placeholder.svg?height=400&width=300"}
                alt={product.name}
                fill
                className="object-cover object-center group-hover:opacity-75 transition-opacity"
                loading="lazy"
              />
              {product.specialTag && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {product.specialTag.toUpperCase()}
                </div>
              )}
            </div>
            <ChristmasPromoBanner countdown={promoCountdown} />
            <div className="mt-4 flex flex-col gap-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-900">Precio normal: ARS {product.price.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-900">Precio curva completa: ARS {(((product as any).curvePrice ?? product.price)).toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-900">Talles: {formatSizes(product.sizes)}</p>
              </div>
            </div>

            {isInCart(product.id) ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => (window.location.href = "/carrito")}
                  className="bg-black text-white py-2 px-4 text-sm"
                >
                  Ir a carrito
                </button>
                <button onClick={() => router.push(`/producto/${product.id}`)} className="border border-black py-2 px-4 text-sm">
                  Modificar
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push(`/producto/${product.id}`)}
                className="mt-4 w-full bg-black text-white py-2 px-4 text-sm"
              >
                Ver producto
              </button>
            )}
          </div>
        )
      })}

      {/* Infinite scroll UI (only when no limit and there are more pages) */}
      {limit === undefined && pagination.page < pagination.totalPages && (
        <>
          {/* Invisible sentinel to trigger loading next chunk */}
          <div
            ref={loadMoreRef}
            className="col-span-full h-1 opacity-0 pointer-events-none"
            aria-hidden="true"
          />

          {/* Visible loader */}
          {loading && (
            <div className="col-span-full h-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
