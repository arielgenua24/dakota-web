"use client";
import Image from "next/image"
import { Playfair_Display, Bebas_Neue, Inter } from "next/font/google"
import ProductGrid from "@/components/product-grid"
import LocationSection from "@/components/location-section"
import CategorySlider from "@/components/category-slider"
import Navbar from "@/components/navbar"
import Link from "next/link"
import WhatsappButton from "@/components/WhatsappButton";
import { Suspense, useEffect, useState } from "react";

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

  const carouselImages = [
    {
      src: "https://i.ibb.co/QjJVbKFp/Foto-3-12-25-9-05-55-a-m.jpg",
      alt: "Look navideño destacado",
      tag: "Destacado",
    },
    {
      src: "https://i.ibb.co/Qjhy3qQd/Foto-20-11-25-8-34-49-p-m.jpg",
      alt: "Jeans y buzos listos para regalar",
      tag: "Edición limitada",
    },
    {
      src: "https://i.ibb.co/KcTsQn9g/Foto-2-12-25-9-34-53-a-m.png",
      alt: "Total denim con acentos rojos",
      tag: "Favorito",
    },
    {
      src: "https://i.ibb.co/bjJ1Zwsf/Foto-2-12-25-9-35-01-a-m.png",
      alt: "Conjunto cozy para fiestas",
      tag: "Listo para el árbol",
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 })

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 4200)

    return () => clearInterval(slideInterval)
  }, [carouselImages.length])

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const thisYearTarget = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
      const target = now > thisYearTarget
        ? new Date(now.getFullYear() + 1, 11, 31, 23, 59, 59)
        : thisYearTarget
      const diff = target.getTime() - now.getTime()
      const totalHours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)))
      const days = Math.floor(totalHours / 24)
      const hours = totalHours % 24

      setTimeLeft({ days, hours })
    }

    updateCountdown()
    const countdownInterval = setInterval(updateCountdown, 1000)

    return () => clearInterval(countdownInterval)
  }, [])

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
      <section className="relative min-h-[820px] md:min-h-[880px] w-full mt-12 overflow-hidden bg-sky-100">
        <div className="absolute inset-0">
<div
  className="absolute inset-0 pointer-events-none bg-gradient-to-b from-gray-50 via-white to-gray-50"
/>
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
        <div className="absolute inset-0 flex flex-col items-center pt-10 px-4 pb-28 space-y-3 text-gray-900 z-10 relative">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/90 border border-white/70 backdrop-blur text-gray-900 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <span className="text-lg">🎄</span>
            <p className={`${inter.className} text-sm tracking-[0.15em] uppercase text-gray-900`}>Navidad en Thoren</p>
            <span className="text-lg">✨</span>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            {/*<span className={`${bebasNeue.className} text-xs tracking-[0.32em] uppercase text-gray-500`}>
              Thoren
            </span>*/}
            <p className={`${inter.className} text-[22px] sm:text-[24px] md:text-[26px] leading-[1.4] text-gray-900 max-w-2xl font-medium`}>
              Jeans y buzos mayorista, de alta calidad.
              <span className="block text-[18px] sm:text-[19px] md:text-[20px] font-normal text-gray-600 mt-2">
                Con espíritu navideño, regalos listos y detalles brillantes.
              </span>
            </p>
            <div className="h-px w-16 bg-gray-300/80" />
          </div>
          <div className="relative w-full max-w-[520px] flex flex-col items-center gap-5">
            <div className="relative w-full overflow-hidden rounded-[18px] border border-white/40 bg-white/40 backdrop-blur-sm shadow-[0_25px_60px_rgba(0,0,0,0.28)]">
              <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-gray-800">
                <span className="flex items-center gap-2">
                  <span>✨</span> Rotación automática
                </span>
                <span className="hidden sm:flex items-center gap-2 bg-white/85 border border-white/70 rounded-full px-3 py-1 shadow-[0_6px_18px_rgba(0,0,0,0.08)] text-gray-900">🎄 Colección Navidad</span>
              </div>
              <div className="relative h-[340px] sm:h-[420px] md:h-[460px]">
                {carouselImages.map((item, idx) => (
                  <div
                    key={item.src}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
                    <div className="absolute top-5 right-5 z-20">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-gray-900 border border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.14)]"><span>🎁</span> {item.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {carouselImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-2 w-2 rounded-full border border-gray-700 transition-all duration-300 ${idx === currentSlide ? "bg-gray-900 shadow-[0_0_0_3px_rgba(0,0,0,0.12)]" : "bg-gray-300"}`}
                  />
                ))}
              </div>
              <div className="absolute inset-x-3 bottom-0 z-20 pb-2">
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-rose-950 via-rose-800 to-rose-600 py-3 text-gray-900 shadow-[0_18px_40px_rgba(0,0,0,0.25)] border border-white/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎅</span>
                    <div className="leading-tight">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white">PROMOCION NAVIDEÑA</p>
                      <p className="text-sm sm:text-base font-semibold text-white">Se acaba {timeLeft.days} días y {timeLeft.hours} horas</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-800">
                    <span className="h-8 w-px bg-gray-300" />
                    <span className="rounded-full bg-white px-3 py-1 border border-gray-200 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">Hasta el 31 de diciembre</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link
            href="/Store"
            className="absolute left-1/2 -translate-x-1/2 top-150 px-7 py-3 rounded-80 border border-green-800 bg-white/95 text-gray-900 shadow-[0_14px_30px_rgba(14,116,144,0.2)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(14,116,144,0.28)] focus:outline-none focus:ring-2 focus:ring-green-300 font-semibold tracking-[0.06em]"
            style={{ fontFamily: inter.style.fontFamily, fontSize: "17px", marginTop: "80px" }}
          >
            🎄 VER PRODUCTOS EN OFERTA
          </Link>
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
