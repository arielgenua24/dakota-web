"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import ProductModal from "@/components/product-modal"
import type { Product as FirestoreProduct } from "@/hooks/use-products"
import type { Product } from "@/types"

interface ProductPageProps {
    params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
    const router = useRouter()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [productId, setProductId] = useState<string | null>(null)

    // Unwrap params promise
    useEffect(() => {
        params.then((p) => setProductId(p.id))
    }, [params])

    useEffect(() => {
        if (!productId) return

        const fetchProduct = async () => {
            try {
                // First, try to find the product in sessionStorage (faster)
                const cachedProductsStr = sessionStorage.getItem("products")
                if (cachedProductsStr) {
                    const cachedProducts = JSON.parse(cachedProductsStr) as FirestoreProduct[]
                    const foundInCache = cachedProducts.find((p) => p.id.toString() === productId)

                    if (foundInCache) {
                        const convertedProduct: Product = {
                            id: foundInCache.id.toString(),
                            title: foundInCache.name,
                            price: `ARS ${foundInCache.price.toLocaleString()}`,
                            priceNumeric: foundInCache.price,
                            curvePrice: (foundInCache as any).curvePrice ?? foundInCache.price,
                            sizes: foundInCache.sizes.map((size) => ({
                                size: size.size,
                                color: "default",
                                quantity: size.quantity,
                            })),
                            image: foundInCache.images?.img1 || "/placeholder.svg?height=400&width=300",
                            images: {
                                img1: foundInCache.images?.img1 || "",
                                img2: foundInCache.images?.img2 || "",
                                img3: foundInCache.images?.img3 || "",
                            },
                            category: foundInCache.category,
                            isNew: foundInCache.specialTag === "new",
                        }
                        setProduct(convertedProduct)
                        setLoading(false)
                        return
                    }
                }

                // If not in sessionStorage, search through cached_products in Firestore
                let foundProduct: FirestoreProduct | null = null
                let pageNum = 1
                const maxPages = 10 // Limit search to avoid infinite loops

                while (!foundProduct && pageNum <= maxPages) {
                    const docRef = doc(db, "cached_products", `parsed_data_${pageNum}`)
                    const docSnap = await getDoc(docRef)

                    if (docSnap.exists()) {
                        const data = docSnap.data() as { product_parsed?: Record<string, any> }
                        const products = data?.product_parsed ?? {}

                        // Search through all products in this document
                        for (const key in products) {
                            const product = products[key] as FirestoreProduct
                            if (product.id?.toString() === productId) {
                                foundProduct = product
                                break
                            }
                        }
                    }

                    if (!foundProduct) {
                        pageNum++
                    }
                }

                if (foundProduct) {
                    // Convert Firestore product to cart product format
                    const convertedProduct: Product = {
                        id: foundProduct.id.toString(),
                        title: foundProduct.name,
                        price: `ARS ${foundProduct.price.toLocaleString()}`,
                        priceNumeric: foundProduct.price,
                        curvePrice: (foundProduct as any).curvePrice ?? foundProduct.price,
                        sizes: foundProduct.sizes.map((size) => ({
                            size: size.size,
                            color: "default",
                            quantity: size.quantity,
                        })),
                        image: foundProduct.images?.img1 || "/placeholder.svg?height=400&width=300",
                        images: {
                            img1: foundProduct.images?.img1 || "",
                            img2: foundProduct.images?.img2 || "",
                            img3: foundProduct.images?.img3 || "",
                        },
                        category: foundProduct.category,
                        isNew: foundProduct.specialTag === "new",
                    }

                    setProduct(convertedProduct)
                } else {
                    console.error("Product not found")
                    // Redirect to store if product doesn't exist
                    router.push("/Store")
                }
            } catch (error) {
                console.error("Error fetching product:", error)
                router.push("/Store")
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [productId, router])

    const handleClose = () => {
        router.back()
    }

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        )
    }

    if (!product) {
        return null
    }

    return <ProductModal product={product} isOpen={true} onClose={handleClose} />
}
