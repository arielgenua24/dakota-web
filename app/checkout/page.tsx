"use client";

import FormularioCompra from "@/components/formulario-compra"
import CarritoPage from "@/app/carrito/page"; // Renombrado para seguir convenciones
import { useState } from "react";
import Link from "next/link"
import { ChevronLeft } from "lucide-react"


export default function CheckoutPage() {
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const toggleResumen = () => {
    setMostrarResumen(!mostrarResumen);
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="flex items-center justify-between mb-8 px-4 md:px-6"> {/* Añadido justify-between y padding horizontal */}
        <Link href="/" className="flex items-center text-gray-600 hover:text-black p-2.5 rounded-md"> {/* Añadido p-2.5 (10px padding) y rounded-md */}
          <ChevronLeft size={20} />
          <span>Volver a la tienda</span>
        </Link>
        <button
          onClick={toggleResumen}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150 ease-in-out"
        >
          {mostrarResumen ? "Cerrar resumen" : "Ver resumen de compra"}
        </button>
      </div>
      <FormularioCompra />
      {mostrarResumen && (
        <div className="fixed top-0 right-0 h-full w-full sm:w-2/5 md:w-1/3 lg:w-1/4 bg-white shadow-xl z-50 p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out translate-x-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Resumen de Compra</h2>
            <button 
              onClick={toggleResumen} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Cerrar resumen de compra"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <CarritoPage checkout={true} toggleResumen={toggleResumen}/>
        </div>
      )}
      {/* Overlay para cuando el carrito está abierto en móviles */} 
      {mostrarResumen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={toggleResumen}
        ></div>
      )}
    </div>
  )
}
