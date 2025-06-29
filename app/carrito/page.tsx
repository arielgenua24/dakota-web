"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Trash2, Edit } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import ProductModal from "@/components/product-modal"
import type { Product } from "@/types"

export default function CartPage() {
  const { items, removeItem, getTotalPrice } = useCart()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-gray-600 hover:text-black">
            <ChevronLeft size={20} />
            <span>Volver a la tienda</span>
          </Link>
        </div>

        <div className="text-center py-16">
          <h1 className="text-2xl font-medium mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">Agrega productos a tu carrito para continuar con la compra</p>
          <Link href="/" className="inline-block bg-black text-white px-6 py-3">
            Explorar productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center mb-8">
        <Link href="/" className="flex items-center text-gray-600 hover:text-black">
          <ChevronLeft size={20} />
          <span>Volver a la tienda</span>
        </Link>
      </div>

      <h1 className="text-2xl font-medium mb-8 text-center">ORDEN</h1>

      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="border rounded-md p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/4">
                <div className="relative aspect-square">
                  <Image
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="md:w-3/4">
                <h2 className="text-lg font-medium mb-2">{item.product.title}</h2>

                <div className="mb-4">
                  <div className="flex justify-between mb-2 font-medium text-sm">
                    <span>Talles</span>
                    <span>Cantidad</span>
                  </div>

                  {item.selectedSizes.map((sizeOption, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-t border-gray-200 text-sm">
                      <span>
                        {sizeOption.size} {sizeOption.color !== "default" ? `- ${sizeOption.color}` : ""}
                      </span>
                      <span>{sizeOption.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm mb-4">
                  <span className="font-medium">CANTIDAD TOTAL</span>
                  <span>{item.totalQuantity}</span>
                </div>

                <div className="flex justify-between text-sm mb-6">
                  <span className="font-medium">PRECIO TOTAL</span>
                  <span>ARS {(item.totalQuantity * item.product.priceNumeric).toLocaleString()}</span>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEdit(item.product)}
                    className="flex items-center text-gray-600 hover:text-black"
                  >
                    <Edit size={18} className="mr-1" />
                    <span>EDITAR</span>
                  </button>

                  <button
                    onClick={() => removeItem(index)}
                    className="flex items-center text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} className="mr-1" />
                    <span>Eliminar del carrito</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Subtotal</span>
          <span>ARS {getTotalPrice().toLocaleString()}</span>
        </div>

        <Link href="/checkout" className="w-full bg-blue-500 text-white py-3 font-medium text-center block">
          Siguiente
        </Link>
      </div>

      {isModalOpen && editingProduct && (
        <ProductModal product={editingProduct} onClose={handleCloseModal} isOpen={isModalOpen} />
      )}
    </div>
  )
}
