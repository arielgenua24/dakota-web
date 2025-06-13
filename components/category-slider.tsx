"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

const categories = [
  {
    id: 1,
    name: "Buzos",
    image: "/placeholder.svg?height=300&width=200",
    slug: "buzos",
  },
  {
    id: 2,
    name: "Moms",
    image: "/placeholder.svg?height=300&width=200",
    slug: "accesorios",
  },
  {
    id: 3,
    name: "Joggers",
    image: "/placeholder.svg?height=300&width=200",
    slug: "dresses",
  },
  {
    id: 4,
    name: "Bermudas",
    image: "/placeholder.svg?height=300&width=200",
    slug: "pantalones",
  },
]

export default function CategorySlider() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      const scrollAmount = 300

      const newScrollLeft = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount

      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })

      // Update arrow visibility after scroll
      setTimeout(() => {
        if (sliderRef.current) {
          setShowLeftArrow(sliderRef.current.scrollLeft > 0)
          setShowRightArrow(
            sliderRef.current.scrollLeft + sliderRef.current.clientWidth < sliderRef.current.scrollWidth - 10,
          )
        }
      }, 300)
    }
  }

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`${playfair.className} text-3xl`}>Categorías</h2>
          <p className="text-sm text-gray-500">Elige una categoría para filtrar los productos</p>
        </div>

        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-hide space-x-6 py-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={() => {
              if (sliderRef.current) {
                setShowLeftArrow(sliderRef.current.scrollLeft > 0)
                setShowRightArrow(
                  sliderRef.current.scrollLeft + sliderRef.current.clientWidth < sliderRef.current.scrollWidth - 10,
                )
              }
            }}
          >
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="flex-shrink-0 w-[180px]">
                <div className="relative h-[240px] w-full overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <h3 className="mt-2 text-center text-sm font-medium">{category.name}</h3>
              </Link>
            ))}
          </div>

          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
