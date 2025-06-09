"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import type { Product, CartItem, SizeOption } from "@/types"

interface ProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: number }>({})
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addItem, updateItem, items } = useCart()

  // Check if this product is already in cart to pre-fill selections
  useEffect(() => {
    const existingItem = items.find((item) => item.product.id === product.id)
    if (existingItem) {
      const sizes: { [key: string]: number } = {}
      existingItem.selectedSizes.forEach((s) => {
        const key = `${s.size}-${s.color}`
        sizes[key] = s.quantity
      })
      setSelectedSizes(sizes)
    }
  }, [product.id, items])

  // Calculate totals whenever selections change
  useEffect(() => {
    let quantity = 0
    Object.values(selectedSizes).forEach((q) => {
      quantity += q
    })
    setTotalQuantity(quantity)
    setTotalPrice(quantity * product.priceNumeric)
  }, [selectedSizes, product.priceNumeric])

  const handleQuantityChange = (size: number | string, color: string, change: number) => {
    const key = `${size}-${color}`
    const currentQuantity = selectedSizes[key] || 0
    const newQuantity = Math.max(0, currentQuantity + change)

    const updatedSizes = {
      ...selectedSizes,
      [key]: newQuantity,
    }

    if (newQuantity === 0) {
      delete updatedSizes[key]
    }

    setSelectedSizes(updatedSizes)
  }

  const handleAddToCart = () => {
    // Convert selectedSizes object to array format for cart
    const selectedSizesArray: SizeOption[] = []
    Object.entries(selectedSizes).forEach(([key, quantity]) => {
      const [sizeStr, color] = key.split("-")
      // Handle both numeric and string sizes
      const size = !isNaN(Number(sizeStr)) ? Number(sizeStr) : sizeStr
      selectedSizesArray.push({ size, color, quantity })
    })

    if (selectedSizesArray.length === 0) return

    const cartItem: CartItem = {
      product,
      selectedSizes: selectedSizesArray,
      totalQuantity,
      totalPrice,
    }

    const existingItemIndex = items.findIndex((item) => item.product.id === product.id)
    if (existingItemIndex >= 0) {
      updateItem(existingItemIndex, cartItem)
    } else {
      addItem(cartItem)
    }

    onClose()
  }

  // Get product images (in a real app, these would come from the product data)
  const productImages = [
    product.image,
    product.image, // Duplicated for demo, would be different images in real app
    product.image,
  ]

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + productImages.length) % productImages.length)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-auto rounded">
        <div className="sticky top-0 z-10 bg-[#f9f3e8] p-4 flex justify-between items-center">
          <button onClick={onClose} className="text-black">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-medium">NAVBAR</h2>
          <button onClick={onClose} className="text-black">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Images */}
            <div className="md:w-1/2 relative">
              <div className="relative aspect-square">
                <Image
                  src={productImages[currentImageIndex] || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                <button onClick={prevImage} className="bg-white rounded-full p-1 shadow-md">
                  <ChevronLeft size={20} />
                </button>
              </div>

              <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                <button onClick={nextImage} className="bg-white rounded-full p-1 shadow-md">
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="flex justify-center mt-4 space-x-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 w-2 rounded-full ${currentImageIndex === index ? "bg-black" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-1/2">
              <h1 className="text-xl font-medium mb-4">{product.title}</h1>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Detalle del producto</h3>
                <p className="text-sm text-gray-600">
                  Prenda de alta calidad confeccionada con los mejores materiales. Ideal para boutiques y tiendas de
                  moda exclusiva.
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Talles</span>
                  <span className="text-sm font-medium">Cantidad</span>
                </div>

                {product.sizes.map((sizeOption) => {
                  const key = `${sizeOption.size}-${sizeOption.color}`
                  const quantity = selectedSizes[key] || 0

                  return (
                    <div key={key} className="flex justify-between items-center py-2 border-t border-gray-200">
                      <span className="text-sm">{sizeOption.size}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(sizeOption.size, sizeOption.color, -1)}
                          className="text-gray-500 hover:text-black"
                          disabled={quantity === 0}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(sizeOption.size, sizeOption.color, 1)}
                          className="text-gray-500 hover:text-black"
                          disabled={quantity >= sizeOption.quantity}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Cantidad total</span>
                  <span>{totalQuantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Precio total</span>
                  <span>ARS {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 font-medium"
                disabled={totalQuantity === 0}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
