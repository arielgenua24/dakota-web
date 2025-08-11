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
  //*Selected sizes shows the structure of the sizes that the user selected and all the sizes that the user did not select*/
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: number }>({})
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [useCurvePrice, setUseCurvePrice] = useState(false)
  // NEW: cantidad de unidades a las que se aplica el descuento y las que pagan precio normal
  const [curveUnits, setCurveUnits] = useState(0)
  const [normalUnits, setNormalUnits] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addItem, updateItem, items } = useCart()

  // Check if this product is already in cart to pre-fill selections
  useEffect(() => {
    const existingItem = items.find((item) => item.product.id === product.id)
    console.log(existingItem)
    if (existingItem) {
      const sizes: { [key: string]: number } = {}
      existingItem.selectedSizes.forEach((s) => {
        const key = `${s.size}-${s.color}`
        sizes[key] = s.quantity
      })
      setSelectedSizes(sizes)
    }
  }, [product.id, items])

  // Re-calcula precios y cantidades cada vez que cambian las selecciones
  useEffect(() => {
    // Cantidad total de unidades elegidas
    const quantity = Object.values(selectedSizes).reduce((acc, q) => acc + q, 0)
    setTotalQuantity(quantity)

    if (!product.sizes || product.sizes.length === 0) {
      setUseCurvePrice(false)
      setCurveUnits(0)
      setNormalUnits(quantity)
      setTotalPrice(quantity * product.priceNumeric)
      return
    }

    // Obtiene cantidades por talle y calcula la cantidad mínima elegida en todos los talles
    const quantitiesPerSize = product.sizes.map((sizeOption) => {
      const key = `${sizeOption.size}-${sizeOption.color}`
      return selectedSizes[key] || 0
    })

    const minQtyAcrossSizes = Math.min(...quantitiesPerSize)

    const curveApplies = minQtyAcrossSizes > 0 && product.curvePrice > 0
    setUseCurvePrice(curveApplies)

    // Cantidad total de unidades con precio de curva y normal
    const curveQty = curveApplies ? minQtyAcrossSizes * product.sizes.length : 0
    const normalQty = quantity - curveQty

    setCurveUnits(curveQty)
    setNormalUnits(normalQty)

    // Precio total
    const total = curveQty * product.curvePrice + normalQty * product.priceNumeric
    setTotalPrice(total)
  }, [selectedSizes, product])

  const handleQuantityChange = (size: number | string, color: string, change: number) => {
    const key = `${size}-${color}`
    const currentQuantity = selectedSizes[key] || 0
    const newQuantity = Math.max(0, currentQuantity + change)

    const updatedSizes = {
      ...selectedSizes,
      [key]: newQuantity,
    }
    console.log(selectedSizes)

    /*if (newQuantity === 0) {
      delete updatedSizes[key]
    }*/

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
      useCurvePrice,
      curveUnits,
      normalUnits
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
    product.image2, // Duplicated for demo, would be different images in real app
    product.image3,
  ]

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + productImages.length) % productImages.length)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0801e0] bg-opacity-50">
      {useCurvePrice && (
        <div 
          className="fixed top-[100px] left-0 z-[60] w-full shadow-lg flex items-center justify-center" 
          style={{
            backgroundColor: 'rgba(40, 167, 69, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: 'white',
            fontWeight: 500,
            height: '100px',
            animation: 'slideDown 0.5s ease-out forwards',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '600px',
          }}
        >
          <div className="flex flex-col items-center justify-center text-center px-4">
            <div className="flex items-center gap-3 mb-2">
              <span style={{ fontSize: '22px', fontWeight: 600 }}>¡Felicitaciones!</span>
              <span style={{ fontSize: '24px' }}>✅</span>
            </div>
            <span style={{ fontSize: '18px', maxWidth: '600px', lineHeight: '1.4' }}>
              Estás aplicando al descuento por comprar curva completa
            </span>
          </div>
          <style jsx>{`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-auto rounded">
        <div className="sticky top-0 z-10 bg-[#f9f3e8] p-4 flex justify-between items-center">
          <button onClick={onClose} className="text-black">
            <ChevronLeft size={24} />
          </button>
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
                  Prendas de alta calidad confeccionada con los mejores materiales. Ideal para tiendas de jeans de hombre, generar exclusividad tanto como un impacto visual para tus clintes.
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
                {/* Precios unitarios */}
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Precio unitario</span>
                  <span>ARS {product.priceNumeric.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium" style={{
                    fontSize: '15px',
                    backgroundColor: 'rgb(219 253 223)',
                    border: '1px solid rgb(185 218 192)',
                    color: 'rgb(29 190 17)',
                    padding: '4px',
                    borderRadius: '4px'
                  }}>Precio unitario con curva</span>
                  <span style={{
                    fontSize: '17px',
                    backgroundColor: 'rgb(219 253 223)',
                    border: '1px solid rgb(185 218 192)',
                    color: 'rgb(29 190 17)',
                    padding: '5px',
                    borderRadius: '4px'
                  }}>ARS {product.curvePrice.toLocaleString()}</span>
                </div>

                {/* Cantidades */}
                {useCurvePrice && (
                  <>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Unidades con curva</span>
                      <span>{curveUnits}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Unidades precio normal</span>
                      <span>{normalUnits}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Cantidad total</span>
                  <span>{totalQuantity}</span>
                </div>

                {/* Precio final */}
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
