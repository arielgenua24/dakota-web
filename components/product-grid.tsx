"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import ProductModal from "./product-modal"
import { useCart } from "@/hooks/use-cart"
import { useProducts, type Product } from "@/hooks/use-products"

export default function ProductGrid({ limit = 15 }: { limit?: number }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { items, addItem } = useCart()
  const { products, loading, error, pagination, loadMoreProducts } = useProducts()
  console.log("consolelog de products")
  console.log(products)

  // Referencia para el observador de intersección
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Configurar el observador de intersección para carga infinita
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.page < pagination.totalPages && !loading) {
          loadMoreProducts()
        }
      },
      { threshold: 0.1 },
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [pagination, loading, loadMoreProducts])

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const isInCart = (productId: number) => {
    return items.some((item) => item.product.id === productId.toString())
  }

  // Convertir el producto de Firestore al formato que espera el carrito
  const convertToCartProduct = (product: Product) => {
    return {
      id: product.id.toString(),
      title: product.name,
      price: `ARS ${product.price.toLocaleString()}`,
      priceNumeric: product.price,
      sizes: product.sizes.map((size) => ({
        size: size.size,
        color: "default",
        quantity: size.quantity,
      })),
      image: product.images.img1 || "/placeholder.svg?height=400&width=300",
      category: product.category,
      isNew: product.specialTag === "new",
    }
  }
  
const formatSizes = (sizes: { size: number; quantity: number }[]): string =>
  sizes.map(({ size }) => size).join("/");


  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {products.slice(0, limit).map((product) => {
        const cartProduct = convertToCartProduct(product)

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
            <div className="mt-4 flex flex-col gap-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900">ARS {product.price.toLocaleString()}</p>
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
                <button onClick={() => handleOpenModal(product)} className="border border-black py-2 px-4 text-sm">
                  Modificar
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleOpenModal(product)}
                className="mt-4 w-full bg-black text-white py-2 px-4 text-sm"
              >
                Ver producto
              </button>
            )}
          </div>
        )
      })}

      {/* Elemento para detectar cuando el usuario llega al final y cargar más productos */}
      {pagination.page < pagination.totalPages && (
        <div ref={loadMoreRef} className="col-span-full h-20 flex items-center justify-center">
          {loading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>}
        </div>
      )}

      {isModalOpen && selectedProduct && (
        <ProductModal product={convertToCartProduct(selectedProduct)} onClose={handleCloseModal} isOpen={isModalOpen} />
      )}
    </div>
  )
}
