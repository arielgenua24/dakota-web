import Image from "next/image"
import { Playfair_Display } from "next/font/google"
import ProductGrid from "@/components/product-grid"
import LocationSection from "@/components/location-section"
import CategorySlider from "@/components/category-slider"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full">
        <Image
          src="/images/Chat-GPT-Image-4-abr-2025-09-08-48-a-m.png"
          alt="Colección de moda de lujo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white p-6">
          <h1 className={`${playfair.className} text-4xl md:text-5xl mb-4 text-center`}>Todo el prêt-à-porter</h1>
          <p className="text-center max-w-2xl mb-6">
            Descubre nuestra exclusiva colección de prendas de lujo por mayor. Diseños únicos para boutiques y tiendas
            que buscan ofrecer lo mejor a sus clientes.
          </p>
          <button className="border border-white px-6 py-2 hover:bg-white hover:text-black transition-colors">
            Explorar Colección
          </button>
        </div>
      </section>

      {/* Location and Contact Section */}
      <LocationSection />

      {/* Categories Section */}
      <CategorySlider />

      {/* Products Section */}
      <section className="py-12 px-4 md:px-8 products-two-columns">
        <h2 className={`${playfair.className} text-3xl mb-8`}>Todos nuestros productos</h2>
        <ProductGrid />
      </section>
    </main>
  )
}
