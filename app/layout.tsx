import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/use-cart";
import { Analytics } from "@vercel/analytics/react";
import LeadCaptureModalWrapper from "@/app/components/LeadCaptureModalWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THOREN | Mayorista de Jeans y Buzos para Hombre en Avellaneda",
  description: "Mayorista de jeans y buzos de hombre de alta calidad. Envíos a toda Argentina. Más de 10000 productos vendidos y 500 clientes en todo el país. Materia prima importada.",
  keywords: "mayorista jeans hombre, buzos hombre, ropa mayorista avellaneda, baggys, joggers, materia prima importada, envío a todo el país, indumentaria masculina",
  authors: [{ name: "THOREN" }],
  creator: "THOREN",
  publisher: "THOREN",
  robots: "index, follow",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "THOREN | Mayorista de Jeans y Buzos para Hombre",
    description: "Mayorista de jeans y buzos de hombre de alta calidad. Envíos a toda Argentina.",
    siteName: "THOREN",
    locale: "es_AR",
    images: [
      {
        url: "https://i.ibb.co/9mTmj9Hd/dakota-home.png",
        width: 1200,
        height: 630,
        alt: "THOREN - Mayorista de Jeans y Buzos para Hombre",
      },
    ],
  },
  verification: {
    google: "verificación-google",
  },
  category: "Moda y Textil",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  metadataBase: new URL("https://www.thoren-jeans.store/"),
};

// Datos estructurados Schema.org para Local Business
export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WholesaleStore",
  "name": "THOREN",
  "description": "Mayorista de jeans y buzos de hombre de alta calidad. Envíos a toda Argentina.",
  "url": "https://www.thoren-jeans.store/",
  "telephone": "+5491169380844",
  "email": "faby198348@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bogota 3239",
    "addressLocality": "Avellaneda",
    "addressRegion": "Buenos Aires",
    "postalCode": "1406",
    "addressCountry": "AR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-34.628500",
    "longitude": "-58.475500"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Productos Estrella",
    "itemListElement": [
      {
        "@type": "OfferCatalog",
        "name": "Baggys",
        "url": "https://www.thoren-jeans.store/Store?filter=baggy"
      },
      {
        "@type": "OfferCatalog",
        "name": "Joggers",
        "url": "https://www.thoren-jeans.store/Store?filter=joggers"
      }
    ]
  },
  "priceRange": "$$",
  "image": "https://i.ibb.co/9mTmj9Hd/dakota-home.png"
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es">
      <head>
        {/* ...otros tags... */}
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W2FF982N');`
        }} />
        {/* End Google Tag Manager */}
        
        {/* Google tag (gtag.js) - Google Ads */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17504961448"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17504961448');
          `
        }} />
        {/* End Google tag */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-W2FF982N"
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <CartProvider>
          <LeadCaptureModalWrapper />
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
