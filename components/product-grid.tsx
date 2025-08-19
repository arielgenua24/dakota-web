"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import ProductModal from "./product-modal"
import { useCart } from "@/hooks/use-cart"
import { useProducts, type Product, type ProductSize } from "@/hooks/use-products"

export default function ProductGrid({ limit = undefined, filter = undefined }: { limit?: number, filter?: string }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { items } = useCart()
  const { products, allProducts, loading, error } = useProducts()
  
  // Log para depuración
  useEffect(() => {
    console.log('ProductGrid - Received products:', products)
    console.log('ProductGrid - Total products (sin filtrar):', allProducts?.length || 0)
    console.log('ProductGrid - Filter:', filter)
    console.log('ProductGrid - Loading state:', loading)
    console.log('ProductGrid - Error state:', error)
    
    // Verificar si hay productos sin filtrar pero ninguno con el filtro actual
    if ((products?.length || 0) === 0 && (allProducts?.length || 0) > 0 && filter) {
      console.warn(`No hay productos para la categoría "${filter}" pero sí hay ${allProducts.length} productos sin filtrar`)
      // Mostrar categorías disponibles para ayudar en el diagnóstico
      const categories = [...new Set(allProducts.map(p => p.category))]
      console.log('Categorías disponibles:', categories)
    }
  }, [products, allProducts, filter, loading, error])

  // Ya no necesitamos el observador de intersección porque no hay paginación

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const isInCart = (productId: string | number) => {
    return items.some((item) => item.product.id === productId.toString())
  }

  const formatSizes = (sizes: ProductSize[]): string => {
    if (!Array.isArray(sizes)) {
      return ""; // Devuelve una cadena vacía si los talles no están definidos
    }
    return sizes.map(({ size }) => size).join("/");
  };

  // Verificar si products es válido usando useMemo
  const validProducts = useMemo(() => {
    return Array.isArray(products) ? products : [];
  }, [products]);
  
  // Log para depuración antes de filtrar
  useEffect(() => {
    if (validProducts.length === 0) {
      console.log('No hay productos para mostrar antes del filtrado')
    } else {
      console.log(`Hay ${validProducts.length} productos antes del filtrado`)
      // Mostrar algunos ejemplos de los productos
      console.log('Ejemplos de productos:', validProducts.slice(0, 2))
    }
  }, [validProducts])
  
  // Usamos useMemo para el filtrado de productos
  const displayed = useMemo(() => {
    return validProducts
      .filter((product) => {
        // Validación más estricta
        if (!product) {
          console.log('Producto inválido encontrado, filtrando')
          return false;
        }
        if (!product.category) {
          console.log(`Producto sin categoría: ${product.id} - ${product.name}`)
          return false;
        }
        
        // Si no viene filter, no filtro y devuelvo todos
        if (filter == null || filter === "") {
          return true;
        }
        
        // Si filter viene definido, comparo category
        const match = product.category.trim().toLowerCase() === filter.trim().toLowerCase();
        return match;
      })
      // Luego aplico el límite (si viene)
      .slice(0, limit ?? validProducts.length);
  }, [validProducts, filter, limit]);

  // Log después del filtrado
  useEffect(() => {
    console.log(`Después del filtrado quedan ${displayed.length} productos para mostrar`)
  }, [displayed])

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>
  }
  
  if (loading) {
    return <div className="text-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4">Cargando productos...</p>
    </div>
  }
  
  if (validProducts.length === 0 && !loading) {
    return <div className="text-center py-10">
      <p>No se encontraron productos. Por favor intenta más tarde.</p>
    </div>
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {displayed.length === 0 ? (
        <div className="col-span-full text-center py-10">
          <p>No se encontraron productos{filter ? ` en la categoría ${filter}` : ''}.</p>
        </div>
      ) : (
        displayed.map((product) => {

        return (
          <div key={product.id} className="group relative">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <Image
                src={product.img1 || "/placeholder.svg?height=400&width=300"}
                alt={product.name || `Product ${product.id}`}
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
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-900">Precio normal: ARS {(product.price ?? 0).toLocaleString()}</p>
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
      }))
      }

      {/* Ya no necesitamos el detector de scroll infinito porque eliminamos la paginación */}

      {isModalOpen && selectedProduct && (
        <ProductModal
          product={{
            id: selectedProduct.id.toString(),
            title: selectedProduct.name || 'Producto sin nombre',
            price: `ARS ${(selectedProduct.price || 0).toLocaleString()}`,
            priceNumeric: selectedProduct.price || 0,
            // Añadir un precio de curva adecuado para evitar errores en el componente modal
            // Usando el mismo precio normal como valor por defecto si no se especifica
            curvePrice: ('curvePrice' in selectedProduct ? (selectedProduct as {curvePrice: number}).curvePrice : selectedProduct.price) || 0,
            category: selectedProduct.category || 'Sin categoría',
            isNew: selectedProduct.specialTag === "new",
            images: { 
              img1: selectedProduct.img1 || "/placeholder.svg?height=400&width=300", 
              img2: selectedProduct.img2 || "", 
              img3: selectedProduct.img3 || "" 
            },
            image: selectedProduct.img1 || "/placeholder.svg?height=400&width=300",
            sizes: Array.isArray(selectedProduct.sizes) 
              ? selectedProduct.sizes.map((size) => ({
                  size: size.size || 'U',
                  // Asegurarnos de que quantity sea un número válido para permitir añadir al carrito
                  quantity: typeof size.quantity === 'number' ? size.quantity : 10, // Valor por defecto si no tiene quantity
                  color: "default", // Añadido para cumplir con el tipo SizeOption
                }))
              : [{ size: 'U', quantity: 10, color: "default" }], // Cantidad por defecto para permitir añadir al carrito
          }}
          onClose={handleCloseModal}
          isOpen={isModalOpen}
        />
      )}
    </div>
  )
}
