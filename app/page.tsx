import Image from "next/image"
import { Playfair_Display, Bebas_Neue, Inter } from "next/font/google"
import ProductGrid from "@/components/product-grid"
import LocationSection from "@/components/location-section"
import CategorySlider from "@/components/category-slider"
import Navbar from "@/components/navbar"
import Link from "next/link"

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
      DAKOTA MEN
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
        <Link href="/Store"
          className="h-[60px] w-[200px] border-2 border-black bg-white "
          style={{ fontFamily: inter.style.fontFamily, fontSize: "20px" }}
        >
          COMPRAR AHORA
        </Link>
      </div>
    </div>
  </div>
</section>



      {/* Nueva Sección Minimalista: Envíos y Tienda */}
      <section
        className="mx-auto my-12 max-w-xl bg-white border border-black rounded-[12px] px-6 py-10 flex flex-col items-center shadow-none transition-shadow duration-200"
        style={{ borderRadius: '4px', width: '90%' }}
      >
        <div className="w-full flex justify-center mb-6">
          <Image
            src="/images/dakota-studio.png"
            alt="Dakota Studio"
            width={220}
            height={180}
            className="object-contain"
            priority
          />
        </div>
        <h2
          className={`${playfair.className} text-center text-black text-2xl md:text-3xl font-normal mb-4 leading-snug`}
          style={{ letterSpacing: '0.01em' }}
        >
          “Envíos a todo Argentina, calidad inigualable y sin cobro de IVA”
        </h2>
        <Link href="/Store"
          className="mt-2 px-12 py-3 border border-black rounded-[4px] text-black bg-white font-medium text-base md:text-lg transition-all duration-200 shadow-none hover:shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black"
          style={{ fontFamily: inter.style.fontFamily }}
        >
          IR A LA TIENDA
        </Link>
      </section>

      {/* Location and Contact Section */}
      <LocationSection />

      {/* Categories Section */}
      <CategorySlider />

      {/* Products Section */}
      <section className="py-12 px-4 md:px-8 products-two-columns">
        <h2 className={`${playfair.className} text-3xl mb-8`}>Algunos de nuestros productos mejores productos</h2>
        <ProductGrid limit={6}/>
      </section>
    </main>
  )
}