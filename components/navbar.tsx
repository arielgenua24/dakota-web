"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { Playfair_Display } from "next/font/google"
import Store from "../app/Store/page"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items } = useCart()

  return (
    <header className="fixed top-0 w-full bg-black/30 text-white  z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Mobile View */}
        <div className="md:hidden flex items-center justify-between w-full">
          <Link href="/" className="text-base hover:underline text-white">
            Inicio
          </Link>

          <Link href="/Store" className="text-center">
            <span className={`text-base font-bold text-white ${playfair.className}`}>Tienda</span>
          </Link>

          <Link href="/carrito" className="relative">
            <ShoppingBag size={20} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-sm rounded-full h-6 w-6 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between space-x-8 w-full">
            <Link href="/" className="hover:underline text-white">
              Inicio
            </Link>
            <Link href="/Store" className="text-2xl font-bold">
              <span className={`text-white ${playfair.className}`}>Tienda</span>
            </Link>


          <Link href="/carrito" className="relative">
            <ShoppingBag size={24} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
