import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { ShoppingBag, XCircle, Calculator, CheckCircle, TruckIcon, PackageCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "Nuestras Políticas | THOREN - Mayorista de Jeans y Buzos",
    description: "Conoce nuestras políticas de venta: No aceptamos devoluciones ni realizamos cotizaciones. Precios mayoristas transparentes y fijos. Calidad garantizada en todos nuestros productos.",
    keywords: "políticas de venta, términos y condiciones, mayorista jeans, política de devoluciones, precios mayoristas, THOREN",
    authors: [{ name: "THOREN" }],
    creator: "THOREN",
    publisher: "THOREN",
    robots: "index, follow",
    alternates: {
        canonical: "/nuestras-politicas",
    },
    openGraph: {
        type: "website",
        title: "Nuestras Políticas | THOREN",
        description: "Políticas claras y transparentes: No aceptamos devoluciones ni cotizaciones. Trabajamos con precios mayoristas fijos.",
        siteName: "THOREN",
        locale: "es_AR",
    },
};

const playfair = Playfair_Display({ subsets: ["latin"] });
const inter = Inter({ weight: ["400", "500", "600"], subsets: ["latin"] });

export default function NuestrasPoliticas() {
    const policies = [
        {
            icon: <XCircle className="w-8 h-8" />,
            title: "No Aceptamos Devoluciones",
            description: "Todos los productos vendidos son finales. Le recomendamos verificar cuidadosamente las especificaciones antes de realizar su pedido.",
            gradient: "from-rose-50 via-white to-red-50",
            border: "border-red-200",
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            details: [
                "Verifique tallas y especificaciones antes de comprar",
                "Las fotos y descripciones reflejan el producto real",
                "Hacemos controles de calidad antes del envío",
                "En caso de defecto de fábrica, contactar dentro de 24hs de recibido"
            ]
        },
        {
            icon: <Calculator className="w-8 h-8" />,
            title: "No Realizamos Cotizaciones",
            description: "Todos nuestros precios están publicados en el sitio web. Trabajamos con precios fijos y transparentes para ofrecer la mejor calidad al mejor precio.",
            gradient: "from-amber-50 via-white to-orange-50",
            border: "border-orange-200",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            details: [
                "Precios transparentes y visibles en cada producto",
                "Descuentos por volumen aplicados automáticamente",
                "Sin costos ocultos ni sorpresas",
                "Precios mayoristas competitivos"
            ]
        }
    ];

    const whatWeOffer = [
        {
            icon: <CheckCircle className="w-6 h-6" />,
            text: "Calidad garantizada en todos nuestros productos",
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            icon: <TruckIcon className="w-6 h-6" />,
            text: "Envíos a todo Argentina con seguimiento",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            icon: <PackageCheck className="w-6 h-6" />,
            text: "Control de calidad antes de cada envío",
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            icon: <ShoppingBag className="w-6 h-6" />,
            text: "Más de 10,000 productos vendidos",
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        }
    ];

    const ornaments = [
        { icon: "🎁", className: "top-8 left-6 animate-bounce" },
        { icon: "❄️", className: "top-16 right-10 animate-pulse" },
        { icon: "✨", className: "bottom-16 left-10 animate-pulse" },
    ];

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section with Christmas Theme */}
            <section className="relative min-h-[400px] w-full mt-12 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
                <div className="absolute inset-0 pointer-events-none">
                    {ornaments.map((item, idx) => (
                        <div
                            key={idx}
                            className={`absolute text-2xl md:text-3xl drop-shadow-lg ${item.className}`}
                            style={{ animationDelay: `${idx * 0.35}s` }}
                        >
                            {item.icon}
                        </div>
                    ))}
                </div>

                <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/90 border border-white/70 backdrop-blur text-gray-900 shadow-lg mb-6">
                        <span className="text-lg">📋</span>
                        <p className={`${inter.className} text-sm tracking-[0.15em] uppercase text-gray-900 font-medium`}>
                            Políticas de la Tienda
                        </p>
                    </div>

                    <h1 className={`${playfair.className} text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 max-w-4xl`}>
                        Nuestras Políticas
                    </h1>

                    <p className={`${inter.className} text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed`}>
                        En THOREN trabajamos con transparencia y claridad. Aquí te explicamos nuestras políticas para que tengas toda la información antes de realizar tu compra.
                    </p>

                    <div className="h-px w-24 bg-gray-300 mt-8" />
                </div>
            </section>

            {/* Main Policies Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {policies.map((policy, idx) => (
                        <div
                            key={idx}
                            className={`bg-gradient-to-br ${policy.gradient} border ${policy.border} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
                        >
                            <div className={`${policy.iconBg} ${policy.iconColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md`}>
                                {policy.icon}
                            </div>

                            <h2 className={`${playfair.className} text-2xl md:text-3xl text-gray-900 mb-4`}>
                                {policy.title}
                            </h2>

                            <p className={`${inter.className} text-gray-700 text-base leading-relaxed mb-6`}>
                                {policy.description}
                            </p>

                            <div className="space-y-3">
                                {policy.details.map((detail, detailIdx) => (
                                    <div key={detailIdx} className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <div className={`w-1.5 h-1.5 rounded-full ${policy.iconColor.replace('text-', 'bg-')}`} />
                                        </div>
                                        <p className={`${inter.className} text-sm text-gray-600`}>
                                            {detail}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* What We Offer Section */}
            <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h2 className={`${playfair.className} text-3xl md:text-4xl text-gray-900 mb-4`}>
                            Lo Que Sí Ofrecemos
                        </h2>
                        <p className={`${inter.className} text-gray-600 text-lg`}>
                            Aunque no aceptamos devoluciones ni cotizaciones, nos comprometemos a brindarte la mejor experiencia
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {whatWeOffer.map((item, idx) => (
                            <div
                                key={idx}
                                className={`${item.bg} border border-gray-200 rounded-xl p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-200`}
                            >
                                <div className={`${item.color} flex-shrink-0`}>
                                    {item.icon}
                                </div>
                                <p className={`${inter.className} text-gray-800 font-medium`}>
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Important Notice Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200 rounded-2xl p-8 md:p-12 shadow-lg">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">ℹ️</span>
                        </div>
                        <div>
                            <h3 className={`${playfair.className} text-2xl md:text-3xl text-gray-900 mb-4`}>
                                Información Importante
                            </h3>
                            <div className={`${inter.className} text-gray-700 space-y-4`}>
                                <p className="leading-relaxed">
                                    <strong className="font-semibold">Antes de comprar:</strong> Te recomendamos revisar cuidadosamente las fotos, descripciones y tabla de talles de cada producto. Si tienes dudas, contáctanos por WhatsApp antes de realizar tu pedido.
                                </p>
                                <p className="leading-relaxed">
                                    <strong className="font-semibold">Productos mayoristas:</strong> Trabajamos con precios mayoristas fijos que no están sujetos a negociación. Esto nos permite ofrecerte los mejores precios del mercado.
                                </p>
                                <p className="leading-relaxed">
                                    <strong className="font-semibold">Atención personalizada:</strong> Aunque no realizamos cotizaciones, nuestro equipo está disponible para responder todas tus consultas sobre productos, stock y envíos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-red-50 via-white to-green-50 border-t border-gray-200 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className={`${playfair.className} text-3xl md:text-4xl text-gray-900 mb-6`}>
                            ¿Listo para comprar?
                        </h2>
                        <p className={`${inter.className} text-gray-600 text-lg mb-8`}>
                            Explora nuestra colección navideña y encuentra los mejores jeans y buzos mayoristas
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/Store"
                                className={`${inter.className} px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-lg`}
                            >
                                🎄 Ver Productos
                            </Link>
                            <Link
                                href="/"
                                className={`${inter.className} px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-lg`}
                            >
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Note */}
            <section className="container mx-auto px-4 py-8 border-t border-gray-200">
                <p className={`${inter.className} text-center text-sm text-gray-500`}>
                    Última actualización: Diciembre 2025 | THOREN - Mayorista de Jeans y Buzos
                </p>
            </section>
        </main>
    );
}
