"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Trash2, Edit } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import ProductModal from "@/components/product-modal"
import type { Product } from "@/types"

export default function CartPage({checkout, toggleResumen}: {checkout: boolean, toggleResumen: () => void}) {
  const { items, removeItem, getTotalPrice } = useCart()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false)

  const totalQuantity = items.reduce((total, item) => total + item.totalQuantity, 0)

  const handleEdit = (product: Product) => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    console.log("top")
    // Selecciona el producto a editar
    setEditingProduct(product)
    // Abre el modal de edición
    setIsModalOpen(true)
    // Oculta el scroll vertical del body
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
      {isModalOpen && editingProduct ? (
        <ProductModal product={editingProduct} onClose={handleCloseModal} isOpen={isModalOpen} />
      ) : (
        <>
          <div className="flex items-center mb-8">
            {!checkout && (
            <Link href="/" className="flex items-center text-gray-600 hover:text-black">
              <ChevronLeft size={20} />
              <span>Volver a la tienda</span>
            </Link> ) || (
              <button
                onClick={toggleResumen}
                className="w-full bg-black text-white py-3 font-medium text-center block flex items-center justify-center"
              >
                <ChevronLeft size={20} />
                Volver atras
              </button>
            )}
          </div>

          <h1 className="text-2xl font-medium mb-8 text-center">ORDEN</h1>

          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="border rounded-md p-4">
                {item.useCurvePrice && (
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "5px",
                      backgroundColor: "rgb(219, 253, 223)",
                      color: "rgb(29, 190, 17)",
                      fontWeight: "bold",
                      border: "1px solid",
                    }}
                    className="flex mb-4"
                  >
                    <span className="font-medium">Aplicas al descuento por curva completa</span>
                  </div>
                )}
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

                    {item.useCurvePrice && (
                      <div className="flex justify-between text-sm mb-6">
                        <span className="font-medium">Precio unitario por curva completa</span>
                        <span style={{}}>ARS {item.product.curvePrice.toLocaleString()}</span>
                      </div>
                    ) || (
                      <div className="flex justify-between text-sm mb-6">
                        <span className="font-medium">Precio unitario</span>
                        <span style={{}}>ARS {item.product.priceNumeric.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm mb-6">
                      <span className="font-medium" style={{fontSize: "16px", fontWeight: "bold"}}>PRECIO TOTAL</span>
                      {item.useCurvePrice && (
                        <span style={{ fontSize: "16px", fontWeight: "bold", color: "rgb(29, 190, 17)", backgroundColor: "rgb(219, 253, 223)", padding: "5px", borderRadius: "5px" }}> Aplicado descuento por curva completa ARS {(item.totalQuantity * item.product.curvePrice).toLocaleString()}</span>
                      ) || (
                        <span>ARS {(item.totalQuantity * item.product.priceNumeric).toLocaleString()}</span>
                      )}
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
              <span className="font-medium">Total final</span>
              <span>ARS {getTotalPrice().toLocaleString()}</span>
            </div>

            {!checkout && (
              <Link
                href="/checkout"
                onClick={(e) => {
                  if (totalQuantity < 15) {
                    e.preventDefault();
                    setIsQuantityModalOpen(true);
                  }
                }}
                className="w-full bg-blue-500 text-white py-3 font-medium text-center block"
              >
                Siguiente
              </Link>
            ) || (
              <button
                onClick={toggleResumen}
                className="w-full bg-black text-white py-3 font-medium text-center block flex items-center justify-center"
              >
                <ChevronLeft size={20} />
                Volver atras
              </button>
            )}
          </div>
        </>
      )}

      {isQuantityModalOpen && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm mx-4">
            <h2 className="text-xl font-bold mb-4">¡Hola querido cliente!</h2>
            <p className="mb-6">{`La compra mínima es de 15 artículos y tú has comprado ${totalQuantity} en total.`}</p>
            <button
              onClick={() => setIsQuantityModalOpen(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
