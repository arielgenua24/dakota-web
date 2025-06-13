import { MapPin, Clock, Phone } from "lucide-react"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function LocationSection() {
  return (
    <section className="py-12 px-4 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className={`${playfair.className} text-3xl mb-8 text-center`}>Nuestra Ubicación y Contacto</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <MapPin className="mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Dirección y telefono de contacto</h3>
                <p className="text-gray-600">
                  Nos encontramos en Bogotá 3239, CP.1406 , Ciudad autónoma de Buenos Aires, Argentina.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Horarios de atención:</h3>
                <p className="text-gray-600">
                  Lunes a Viernes: 7:00 - 17:00
                  <br />
                  Sábados: 8:00 - 13:00
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Teléfono y email de contacto:</h3>
                <p className="text-gray-600">
                  +54 11 6938-0844
                  <br />
                  faby198348@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
