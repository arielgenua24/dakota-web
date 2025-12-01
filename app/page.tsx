"use client";
import Image from "next/image"
import { Playfair_Display, Bebas_Neue, Inter } from "next/font/google"
import ProductGrid from "@/components/product-grid"
import LocationSection from "@/components/location-section"
import CategorySlider from "@/components/category-slider"
import Navbar from "@/components/navbar"
import Link from "next/link"
import WhatsappButton from "@/components/WhatsappButton";
import { Suspense } from 'react';
import { ChristmasTreeAnimation } from "@/components/christmas-tree-animation"

// Declaración de tipo para gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

const playfair = Playfair_Display({ subsets: ["latin"] })
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"] })
const inter = Inter({ weight: "400", subsets: ["latin"] })

export default function Home() {
  const ornaments = [
    { icon: "🎁", className: "top-8 left-6 animate-bounce" },
    { icon: "❄️", className: "top-16 right-10 animate-pulse" },
    { icon: "✨", className: "bottom-16 left-10 animate-pulse" },
    { icon: "🕯️", className: "bottom-10 right-6 animate-bounce" },
    { icon: "🧣", className: "top-24 left-1/2 -translate-x-1/2 animate-bounce" },
  ]

  const sendMessage = () => {
    // Disparar evento de conversión de contacto a Google Ads
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17504961448/xFupCLKPzqYbEKiHgptB',
        'value': 1.0,
        'currency': 'ARS'
      });
    }

    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
    const message = "Hola! He visitado su web y quiero hablar con ustedes.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[529px] w-full mt-12 overflow-hidden">
        <div className="absolute inset-0">
          <ChristmasTreeAnimation className="h-full rounded-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70 pointer-events-none" />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          {ornaments.map((item, idx) => (
            <div
              key={idx}
              className={`absolute text-2xl md:text-3xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] ${item.className}`}
              style={{ animationDelay: `${idx * 0.35}s` }}
            >
              {item.icon}
            </div>
          ))}
          <div
            className="absolute inset-0 opacity-25 mix-blend-screen"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0 6px, transparent 9px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.2) 0 8px, transparent 11px), radial-gradient(circle at 40% 70%, rgba(255,255,255,0.18) 0 7px, transparent 10px)",
            }}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center pt-10 px-4 space-y-3 text-white z-10">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/15 border border-white/25 backdrop-blur">
            <span className="text-lg">🎄</span>
            <p className={`${inter.className} text-sm tracking-[0.15em] uppercase text-white/90`}>Navidad en Thoren</p>
            <span className="text-lg">✨</span>
          </div>
          <h1 className={`${bebasNeue.className} text-[31px] tracking-[0.08em] text-center`}>THOREN</h1>
          <p className={`${inter.className} text-[19px] text-center text-white/80 max-w-xl`}>
            Jeans y buzos mayorista, de alta calidad. Con espíritu navideño, regalos listos y detalles brillantes.
          </p>
          <div className="relative w-full max-w-[520px] h-[359px]">
            {/**<Image
              src="/images/dakota-home.png"
              alt="Colección de moda de lujo"
              fill
              className="object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
              priority
            /> */}
            <div className="absolute inset-x-0 bottom-6 flex justify-center gap-4 z-10 flex-wrap">
              {/*<button
                className="h-[60px] w-[200px] border-2 border-white bg-white/85 text-black transition hover:bg-white"
                style={{ fontFamily: inter.style.fontFamily, fontSize: "16px" }}
                onClick={sendMessage}
              >
                HABLAR CON NOSOTROS AHORA
              </button>
              <Link href="/Store"
                className="h-[60px] w-[200px] border-2 border-white bg-transparent text-white transition hover:bg-white hover:text-black flex items-center justify-center"
                style={{ fontFamily: inter.style.fontFamily, fontSize: "20px" }}
              >
                COMPRAR AHORA
              </Link> */}
              
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-[72px] w-full max-w-[540px] rounded-full bg-white/15 border border-white/20 backdrop-blur flex items-center justify-center gap-3 text-white text-sm tracking-wide">
              <span className="text-lg">🦌</span>
              <span className={`${inter.className} text-center`}>Ropa cálida, envíos navideños y empaques listos para regalar.</span>
              <span className="text-lg">🎁</span>
            </div>
          </div>
        </div>
      </section>



      {/* Nueva Sección Minimalista: Envíos y Tienda */}
      <section
        className="mx-auto my-12 max-w-5xl bg-gradient-to-br from-red-50 via-white to-green-50 border border-red-200 rounded-[16px] px-6 md:px-12 py-12 flex flex-col gap-8 items-center shadow-[0_18px_60px_rgba(220,38,38,0.12)] transition-shadow duration-200"
        style={{ width: '92%' }}
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
        <div className="flex flex-col items-center gap-3 text-center">
          <h2
            className={`${playfair.className} text-black text-2xl md:text-3xl font-normal leading-snug`}
            style={{ letterSpacing: '0.01em' }}
          >
            “Envíos a todo Argentina, calidad inigualable y sin cobro de IVA”
          </h2>
          <p className={`${inter.className} text-base text-gray-700 max-w-3xl`}>
            Este mes agregamos etiquetas festivas, envoltorios listos para regalar y un toque de canela en cada entrega. Queremos que tu pedido llegue con la magia de Navidad.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="flex items-center gap-3 bg-white/80 border border-red-100 rounded-xl px-4 py-4 backdrop-blur">
            <span className="text-2xl">🎄</span>
            <div>
              <p className={`${inter.className} font-semibold text-gray-900`}>Colección Cozy</p>
              <p className={`${inter.className} text-sm text-gray-600`}>Buzos y jeans que combinan abrigo y estilo para las noches frías.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/80 border border-green-100 rounded-xl px-4 py-4 backdrop-blur">
            <span className="text-2xl">🎁</span>
            <div>
              <p className={`${inter.className} font-semibold text-gray-900`}>Packaging de regalo</p>
              <p className={`${inter.className} text-sm text-gray-600`}>Incluimos cintas, tarjetas y un detalle navideño sin costo extra.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/80 border border-red-100 rounded-xl px-4 py-4 backdrop-blur">
            <span className="text-2xl">✨</span>
            <div>
              <p className={`${inter.className} font-semibold text-gray-900`}>Entrega ágil</p>
              <p className={`${inter.className} text-sm text-gray-600`}>Despachos en 24h y seguimiento para que llegue a tiempo al arbolito.</p>
            </div>
          </div>
        </div>
        <Link href="/Store"
          className="mt-2 px-12 py-3 border border-black rounded-[10px] text-black bg-white font-medium text-base md:text-lg transition-all duration-200 shadow-none hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-300"
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
        <h2 className={`${playfair.className} text-3xl mb-8`}>Algunos de nuestros mejores productos</h2>
        <Suspense fallback={<p>Cargando productos...</p>}>
          <ProductGrid limit={6}/>
        </Suspense>
      </section>
      {/* Botón flotante de WhatsApp */}
      <WhatsappButton sendMessage={sendMessage}/>
    </main>
  )
}
