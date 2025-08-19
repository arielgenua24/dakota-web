"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { collection, getDocs } from "firebase/firestore"
import { db, type Firestore } from "@/lib/firebase-cache"

export type ProductSize = {
  size: number | string
  quantity: number
  color?: string // Añadimos color para compatibilidad con SizeOption en @/types
}

export type Product = {
  id: number | string
  name: string
  category: string
  specialTag?: string
  img1?: string
  img2?: string
  img3?: string
  price: number
  // Agregar curvePrice para compatibilidad con ProductModal
  curvePrice?: number
  state?: string
  sizes: ProductSize[]
}

// Tipo para procesar los productos antes de validarlos completamente
interface PotentialProduct {
  id?: number | string
  name?: string
  category?: string
  price?: number
  specialTag?: string
  state?: string
  img1?: string
  img2?: string
  img3?: string
  sizes?: ProductSize[]
  images?: {
    img1?: string
    img2?: string
    img3?: string
    [key: string]: unknown
  }
  [key: string]: unknown // Para otras propiedades que pueden estar presentes
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || undefined

  // Cargar todos los productos sin paginación
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true)
      setError(null)
      setProducts([])
      setFilteredProducts([])
      
      try {
        // Verificar si tenemos una instancia válida de Firestore
        if (!db) {
          console.error('No hay conexión a Firestore, revise la configuración de Firebase')
          setError('Error de conexión a la base de datos')
          return
        }
        
        console.log('Fetching all products from Firestore cache')
        
        // Intentar cargar datos de un documento de prueba primero para verificar la conexión
        try {
          const collectionRef = collection(db as Firestore, 'cached_products')
          const querySnapshot = await getDocs(collectionRef)
          
          console.log(`Número de documentos encontrados: ${querySnapshot.size}`)
          
          if (querySnapshot.empty) {
            console.warn('La colección cached_products está vacía')
            setProducts([])
            setError('No se encontraron productos en la base de datos')
            return
          }
          
          const allProductsData: Product[] = []
          
          // Procesamos todos los documentos de la colección
          querySnapshot.forEach((doc) => {
            console.log(`Processing document: ${doc.id}`)
            const data = doc.data()
            
            // Cada documento puede contener múltiples productos o estar en diferentes formatos
            if (data && typeof data === 'object') {
              try {
                console.log(`Estructura del documento ${doc.id}:`, data);
                
                // Detectamos el formato del documento
                let productsToProcess: PotentialProduct[] = [];
                
                // Si es un array (formato [productos[], metadata{}])
                if (Array.isArray(data)) {
                  console.log(`Documento ${doc.id} es un array con ${data.length} elementos`);
                  
                  // El primer elemento suele ser el array de productos
                  if (data.length > 0 && Array.isArray(data[0])) {
                    productsToProcess = data[0];
                    console.log(`Usando primer elemento del array con ${productsToProcess.length} productos`);
                  }
                  // Si hay productos directamente en el array
                  else if (data.length > 0 && typeof data[0] === 'object') {
                    // Filtramos los elementos que no son productos (como metadatos)
                    productsToProcess = data.filter(item => 
                      typeof item === 'object' && 
                      item !== null && 
                      !('totalChunks' in item) && 
                      !('timestamp' in item)
                    );
                    console.log(`Filtrando array, encontrados ${productsToProcess.length} posibles productos`);
                  }
                }
                // Si es un objeto con productos como valores
                else {
                  const values = Object.values(data);
                  console.log(`Documento ${doc.id} es un objeto con ${values.length} valores`);
                  
                  // Verificamos si algún valor es un array de productos
                  const arrayValues = values.filter(v => Array.isArray(v));
                  if (arrayValues.length > 0) {
                    // Usamos el primer array encontrado
                    productsToProcess = arrayValues[0];
                    console.log(`Encontrado array de productos con ${productsToProcess.length} elementos`);
                  } else {
                    // Asumimos que los valores son los productos
                    productsToProcess = values.filter(v => typeof v === 'object' && v !== null);
                    console.log(`Usando valores como productos: ${productsToProcess.length} posibles productos`);
                  }
                }
                
                // Validar cada producto
                // Filtrar productos potenciales y convertirlos al tipo Product correcto
                const validProducts = productsToProcess
                  .filter(product => {
                    if (!product || typeof product !== 'object') {
                      console.warn('Producto inválido encontrado');
                      return false;
                    }
                    if (!product.id || !product.name) {
                      console.warn('Producto sin ID o nombre:', product);
                      return false;
                    }
                    // Verificar que tenga las propiedades mínimas necesarias
                    if (product.price === undefined || product.category === undefined) {
                      console.warn('Producto sin precio o categoría:', product);
                      return false;
                    }
                    return true;
                  })
                  // Convertir explícitamente al formato Product, asegurando campos obligatorios
                  .map(product => {
                    // Log de depuración para ver la estructura completa del producto
                    console.log(`Procesando producto raw:`, {
                      id: product.id,
                      name: product.name,
                      hasPrice: product.price !== undefined,
                      hasCurvePrice: product.curvePrice !== undefined,
                      hasSizes: Array.isArray(product.sizes),
                      sizeCount: Array.isArray(product.sizes) ? product.sizes.length : 0
                    });
                    
                    // Procesar y convertir el producto a nuestro formato
                    return {
                      id: product.id,
                      name: product.name,
                      category: product.category || '',
                      specialTag: product.specialTag,
                      img1: product.img1 || (product.images as {img1?: string})?.img1,
                      img2: product.img2 || (product.images as {img2?: string})?.img2,
                      img3: product.img3 || (product.images as {img3?: string})?.img3,
                      price: Number(product.price) || 0,
                      // Extraer curvePrice si existe, o usar el mismo precio normal
                      curvePrice: typeof product.curvePrice === 'number' ? 
                        product.curvePrice : 
                        (typeof product.curvePrice === 'string' ? 
                          Number(product.curvePrice) : 
                          Number(product.price) || 0),
                      state: product.state,
                      // Asegurar que sizes siempre sea un array válido y que cada size tenga un color
                      sizes: Array.isArray(product.sizes) 
                        ? product.sizes.map(size => ({
                            ...size,
                            // Si no tiene color, agregarlo con valor por defecto
                            color: size.color || 'default',
                            // Asegurar que quantity sea un número
                            quantity: typeof size.quantity === 'number' ? size.quantity : 10
                          }))
                        : []
                    } as Product;
                  });
                
                console.log(`Documento ${doc.id}: ${validProducts.length} productos válidos de ${productsToProcess.length} procesados`);
                if (validProducts.length > 0) {
                  console.log('Ejemplo de producto válido:', validProducts[0]);
                }
                
                allProductsData.push(...validProducts);
              } catch (parseError) {
                console.error(`Error procesando documento ${doc.id}:`, parseError);
              }
            }
          })
          
          console.log(`Total products found: ${allProductsData.length}`)
          if (allProductsData.length > 0) {
            // Mostrar un ejemplo del primer producto para depuración
            console.log('Ejemplo de producto:', allProductsData[0])
          }
          
          setProducts(allProductsData)
        } catch (firestoreError) {
          console.error('Error consultando Firestore:', firestoreError)
          setError(firestoreError instanceof Error ? firestoreError.message : 'Error consultando la base de datos')
        }
      } catch (err) {
        console.error('Error general fetching products from Firestore:', err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAllProducts()
  }, []) // Solo se ejecuta una vez al montar el componente

  // Efecto para actualizar productos filtrados cuando cambia la categoría o se cargan nuevos productos
  useEffect(() => {
    if (loading) return;

    console.log(`Filtrando productos por categoría: ${category || 'TODOS'}`)
    console.log(`Total de productos disponibles para filtrar: ${products.length}`)
    
    if (!category) {
      setFilteredProducts(products)
      console.log('Mostrando todos los productos (sin filtro de categoría)')
      return
    }
    
    const filtered = products.filter(product => {
      // Validar que product.category exista y sea string
      if (!product.category || typeof product.category !== 'string') {
        console.warn(`Producto ${product.id} sin categoría válida:`, product.category)
        return false
      }
      return product.category.toLowerCase().trim() === category.toLowerCase().trim();
    })
    
    console.log(`Encontrados ${filtered.length} productos para la categoría ${category}`)
    // Mostrar algunos ejemplos de productos filtrados (si hay)
    if (filtered.length > 0) {
      console.log('Ejemplo de producto filtrado:', filtered[0])
    } else {
      console.log('Categorías disponibles:', [...new Set(products.map(p => p.category))])
    }
    
    setFilteredProducts(filtered)
  }, [category, products, loading])

  // Log adicional cuando devolvemos productos
  useEffect(() => {
    if (!loading && filteredProducts.length === 0 && products.length > 0) {
      console.log('ADVERTENCIA: Hay productos cargados pero ninguno pasa el filtro de categoría')
      console.log('Categoría solicitada:', category)
      console.log('Categorías disponibles:', [...new Set(products.map(p => p.category))])
    }
  }, [filteredProducts, products, loading, category])
  
  return { 
    products: filteredProducts, 
    allProducts: products, // Exportamos también todos los productos sin filtrar
    loading, 
    error, 
    hasMore: false, 
    loadMoreProducts: () => {} 
  }
}
