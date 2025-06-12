import Image from "next/image"
import { Playfair_Display, Bebas_Neue, Inter } from "next/font/google"
import ProductGrid from "@/components/product-grid"
import LocationSection from "@/components/location-section"
import CategorySlider from "@/components/category-slider"
import Navbar from "@/components/navbar"

const playfair = Playfair_Display({ subsets: ["latin"] })
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"] })
const inter = Inter({ weight: "400", subsets: ["latin"] })

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[529px] w-full bg-[#E7D1AB]/[0.29] mt-12">
  <div className="absolute inset-0 flex flex-col items-center pt-10 px-4 space-y-1">
    <h1 className={`${bebasNeue.className} text-[31px]`}>
      DAKOTA JEANS
    </h1>
    <p className={`${inter.className} text-[19px] text-center`}>
      Jeans y buzos mayorista, de alta calidad.
    </p>
    <div className="relative w-full h-[359px]">
      <Image
        src="/images/dakota-home.png"
        alt="Colección de moda de lujo"
        fill
        className="object-cover z-0"
        priority
      />
      <div className="absolute inset-x-0 top-[calc(50%+100px)] -translate-y-1/2 flex justify-center gap-4 z-10">
        <button
          className="h-[60px] w-[200px] border-2 border-black bg-white "
          style={{ fontFamily: inter.style.fontFamily, fontSize: "16px" }}
        >
          HABLAR CON NOSOTROS AHORA
        </button>
        <button
          className="h-[60px] w-[200px] border-2 border-black bg-white "
          style={{ fontFamily: inter.style.fontFamily, fontSize: "20px" }}
        >
          COMPRAR AHORA
        </button>
      </div>
    </div>
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