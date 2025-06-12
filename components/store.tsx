'use client'

import { Suspense } from 'react'
import ProductGrid from './product-grid'

export default function Store() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-light mb-8 text-center uppercase tracking-wider">
        Shop The Collection
      </h1>
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      }>
        <ProductGrid />
      </Suspense>
    </div>
  )
}