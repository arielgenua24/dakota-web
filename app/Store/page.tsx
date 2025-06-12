import Navbar from "@/components/navbar"
import ProductGrid from "@/components/product-grid"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function StorePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="container mx-auto px-4 py-24">
        <h1 className={`${playfair.className} text-3xl md:text-4xl mb-2`}>
          Todos nuestros productos.
        </h1>
        <span className="text-gray-500">
          Toca en agregar al carrito para elegir los talles y las cantidades
        </span>
        <div className="mt-8">
          <ProductGrid />
        </div>
      </section>
    </main>
  )
}