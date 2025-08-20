export interface SizeOption {
  size: number | string
  color: string
  quantity: number
}

export interface Product {
  id: string
  title: string
  price: string
  priceNumeric: number
  curvePrice: number
  sizes: SizeOption[]
  image: string
  images: {
    img1: string
    img2: string
    img3: string
  }
  category: string
  isNew?: boolean
}

export interface CartItem {
  product: Product
  selectedSizes: SizeOption[]
  totalQuantity: number
  totalPrice: number
  useCurvePrice: boolean
  curveUnits: number
  normalUnits: number
}

export interface StoreProps {
  // Desde Next.js 15, searchParams es una Promise que debe ser awaited.
  searchParams: Promise<{
    filter?: string;
    limit?: string;
  }>;
}