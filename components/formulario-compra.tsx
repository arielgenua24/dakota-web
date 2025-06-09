"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/hooks/use-cart"

export default function FormularioCompra() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    tipoEntrega: "",
    direccion: "",
    localidad: "",
    provincia: "",
    codigoPostal: "",
    empresaTransporte: "",
    tipoSeguro: "", // Nuevo campo para el tipo de seguro
    aclaracion: "",
  })
  const [errors, setErrors] = useState({})
  const [animation, setAnimation] = useState(false)
  const totalSteps = 3
  const { items, getTotalPrice } = useCart()

  useEffect(() => {
    if (formData.tipoEntrega) {
      setAnimation(true)
      setTimeout(() => setAnimation(false), 1000)
    }
  }, [formData.tipoEntrega])

  const validate = (step) => {
    const newErrors = {}
    if (step === 1) {
      if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
      if (!formData.telefono.trim()) {
        newErrors.telefono = "El teléfono es requerido"
      } else if (!/^[0-9]{2}-[0-9]{4}-[0-9]{4}$/.test(formData.telefono)) {
        newErrors.telefono = "Formato inválido. Ej: 11-3543-3221"
      }
      if (!formData.email.trim()) {
        newErrors.email = "El email es requerido"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email inválido"
      }
    } else if (step === 2 && formData.tipoEntrega === "envio") {
      if (!formData.direccion.trim()) newErrors.direccion = "La dirección es requerida"
      if (!formData.localidad.trim()) newErrors.localidad = "La localidad es requerida"
      if (!formData.provincia.trim()) newErrors.provincia = "La provincia es requerida"
      if (!formData.codigoPostal.trim()) newErrors.codigoPostal = "El código postal es requerido"
      if (!formData.empresaTransporte) newErrors.empresaTransporte = "Debe seleccionar una empresa de transporte"
    }
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "")
    if (value.length > 10) value = value.slice(0, 10)
    if (value.length > 4) {
      value = `${value.slice(0, 2)}-${value.slice(2, 6)}-${value.slice(6)}`
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}-${value.slice(2)}`
    }
    setFormData({
      ...formData,
      telefono: value,
    })
    if (errors.telefono) {
      setErrors({
        ...errors,
        telefono: "",
      })
    }
  }

  const handleNext = () => {
    const stepErrors = validate(currentStep)
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    } else {
      setErrors(stepErrors)
    }
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    const messageParts = [
      `*Nueva Compra*`,
      `*Nombre:* ${formData.nombre}`,
      `*Teléfono:* +54 ${formData.telefono}`,
      `*Email:* ${formData.email}`,
      `*Tipo de Entrega:* ${formData.tipoEntrega === "envio" ? "Envío" : "Retiro en local"}`,
      ``,
      `*PRODUCTOS:*`,
    ]

    // Add cart items to the message
    items.forEach((item, index) => {
      messageParts.push(`${index + 1}. ${item.product.title}`)
      item.selectedSizes.forEach((size) => {
        messageParts.push(`   - Talle ${size.size} (${size.color}): ${size.quantity} unidades`)
      })
      messageParts.push(`   - Subtotal: ${item.product.price}`)
      messageParts.push(``)
    })

    messageParts.push(`*TOTAL: ARS ${getTotalPrice().toLocaleString()}*`)
    messageParts.push(``)

    if (formData.tipoEntrega === "envio") {
      messageParts.push(
        `*Dirección:* ${formData.direccion}`,
        `*Localidad:* ${formData.localidad}`,
        `*Provincia:* ${formData.provincia}`,
        `*CP:* ${formData.codigoPostal}`,
        `*Empresa de Transporte:* ${formData.empresaTransporte}`,
      )
      if (formData.tipoSeguro) {
        messageParts.push(`*Tipo de Seguro:* ${formData.tipoSeguro}`)
      }
      if (formData.aclaracion) {
        messageParts.push(`*Aclaración:* ${formData.aclaracion}`)
      } else {
        messageParts.push(`*Aclaración:* Sin aclaraciones`)
      }
    }

    const message = encodeURIComponent(messageParts.join("\n"))
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 p-6 bg-white shadow-sm rounded-b-md">
            <h2 className="text-lg font-semibold text-gray-800">Información Personal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`pl-10 w-full p-2.5 border rounded-sm focus:ring-1 focus:ring-[#3483FA] focus:border-[#3483FA] ${
                      errors.nombre ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ingrese su nombre completo"
                  />
                </div>
                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-gray-100 text-gray-500 border border-r-0 border-gray-300 rounded-l-sm">
                      +54
                    </span>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handlePhoneChange}
                      className={`flex-1 p-2.5 border rounded-r-sm focus:ring-1 focus:ring-[#3483FA] focus:border-[#3483FA] ${
                        errors.telefono ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="11-3543-3221"
                    />
                  </div>
                </div>
                {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 w-full p-2.5 border rounded-sm focus:ring-1 focus:ring-[#3483FA] focus:border-[#3483FA] ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 p-6 bg-white shadow-sm rounded-b-md">
            <h2 className="text-lg font-semibold text-gray-800">Método de Entrega</h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setFormData({ ...formData, tipoEntrega: "envio", tipoSeguro: "" })}
                className={`flex-1 p-4 border rounded-sm flex items-center justify-center gap-2 transition-all ${
                  formData.tipoEntrega === "envio"
                    ? "bg-[#EAF6FA] border-[#3483FA] text-[#3483FA]"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>Envío a domicilio</span>
              </button>

              <button
                onClick={() => setFormData({ ...formData, tipoEntrega: "retiro", tipoSeguro: "" })}
                className={`flex-1 p-4 border rounded-sm flex items-center justify-center gap-2 transition-all ${
                  formData.tipoEntrega === "retiro"
                    ? "bg-[#EAF6FA] border-[#3483FA] text-[#3483FA]"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Retiro en el local</span>
              </button>
            </div>

            {formData.tipoEntrega && (
              <div
                className={`mt-6 p-4 bg-[#F5F5F5] rounded-sm border border-gray-200 ${animation ? "animate-pulse" : ""}`}
              >
                <p className="font-medium text-gray-800">
                  {formData.tipoEntrega === "envio"
                    ? "¡Perfecto, te lo enviamos!"
                    : "¡Genial, te esperamos en el local!"}
                </p>
                <p className="mt-2 text-sm text-gray-600">Recordá que trabajamos de lunes a sábado de 8am a 4pm.</p>
              </div>
            )}

            {formData.tipoEntrega === "envio" && (
              <div className="space-y-4 mt-6">
                <h3 className="font-medium text-gray-800">Datos de envío</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className={`w-full p-2.5 border rounded-sm focus:ring-1 focus:ring-[#3483FA] ${errors.direccion ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Ingrese su dirección completa"
                  />
                  {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localidad</label>
                    <input
                      type="text"
                      name="localidad"
                      value={formData.localidad}
                      onChange={handleChange}
                      className={`w-full p-2.5 border rounded-sm focus:ring-1 focus:ring-[#3483FA] ${errors.localidad ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Ej: Buenos Aires"
                    />
                    {errors.localidad && <p className="mt-1 text-sm text-red-600">{errors.localidad}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                    <input
                      type="text"
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      className={`w-full p-2.5 border rounded-sm focus:ring-1 focus:ring-[#3483FA] ${errors.provincia ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Ej: CABA"
                    />
                    {errors.provincia && <p className="mt-1 text-sm text-red-600">{errors.provincia}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    className={`w-full p-2.5 border rounded-sm focus:ring-1 focus:ring-[#3483FA] ${errors.codigoPostal ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Ej: C1425"
                  />
                  {errors.codigoPostal && <p className="mt-1 text-sm text-red-600">{errors.codigoPostal}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa de Transporte</label>
                  <select
                    name="empresaTransporte"
                    value={formData.empresaTransporte}
                    onChange={handleChange}
                    className={`w-full p-2.5 border rounded-sm bg-white focus:ring-1 focus:ring-[#3483FA] ${errors.empresaTransporte ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Seleccione una empresa</option>
                    <option value="SEND BOX">SEND BOX</option>
                    <option value="Crucero express">Crucero express</option>
                    <option value="Via cargo">Via cargo</option>
                    <option value="Central de carga terrestre">Central de carga terrestre</option>
                    <option value="Correo argentino">Correo argentino</option>
                    <option value="Md cargas">Md cargas</option>
                  </select>
                  {errors.empresaTransporte && <p className="mt-1 text-sm text-red-600">{errors.empresaTransporte}</p>}
                </div>

                <div className="bg-[#FFF9ED] p-3 rounded-sm border border-[#FFE6B3] my-2">
                  <p className="text-sm text-[#A05E03] font-medium">
                    Seguro corre a cargo de la empresa de transporte seleccionada.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipos de seguro</label>
                  <select
                    name="tipoSeguro"
                    value={formData.tipoSeguro}
                    onChange={handleChange}
                    className={`w-full p-2.5 border rounded-sm bg-white focus:ring-1 focus:ring-[#3483FA] ${errors.tipoSeguro ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Seleccione un tipo de seguro (opcional)</option>
                    <option value="Seguro mínimo">Seguro mínimo</option>
                    <option value="Seguro valor total">Seguro valor total</option>
                  </select>
                  {errors.tipoSeguro && <p className="mt-1 text-sm text-red-600">{errors.tipoSeguro}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aclaraciones adicionales</label>
                  <textarea
                    name="aclaracion"
                    value={formData.aclaracion}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-sm focus:ring-1 focus:ring-[#3483FA]"
                    placeholder="Agrega alguna aclaración si así lo deseas"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 p-6 bg-white shadow-sm rounded-b-md">
            <h2 className="text-lg font-semibold text-gray-800">Resumen de tu compra</h2>

            <div className="bg-[#F5F5F5] p-4 rounded-sm border border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Información Personal</h3>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-sm text-[#3483FA] hover:underline flex items-center"
                  >
                    Editar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Nombre:</p>
                    <p className="font-medium">{formData.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono:</p>
                    <p className="font-medium">+54 {formData.telefono}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Email:</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between pb-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Método de Entrega</h3>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-sm text-[#3483FA] hover:underline flex items-center"
                  >
                    Editar
                  </button>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Tipo:</p>
                  <p className="font-medium flex items-center gap-2">
                    {formData.tipoEntrega === "envio" ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="1" y="3" width="15" height="13"></rect>
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                          <circle cx="5.5" cy="18.5" r="2.5"></circle>
                          <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                        Envío a domicilio
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Retiro en el local
                      </>
                    )}
                  </p>
                </div>

                {formData.tipoEntrega === "envio" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Dirección:</p>
                        <p className="font-medium">{formData.direccion}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Localidad:</p>
                        <p className="font-medium">{formData.localidad}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Provincia:</p>
                        <p className="font-medium">{formData.provincia}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Código Postal:</p>
                        <p className="font-medium">{formData.codigoPostal}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Empresa de Transporte:</p>
                        <p className="font-medium">{formData.empresaTransporte}</p>
                      </div>
                      {formData.tipoSeguro && (
                        <div>
                          <p className="text-sm text-gray-500">Tipo de Seguro:</p>
                          <p className="font-medium">{formData.tipoSeguro}</p>
                        </div>
                      )}
                    </div>

                    {formData.aclaracion && (
                      <div>
                        <p className="text-sm text-gray-500">Aclaraciones:</p>
                        <p className="text-sm">{formData.aclaracion}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="bg-[#EAF6FA] p-4 rounded-sm border border-[#BFE6F2] flex items-start gap-3">
              <div className="text-[#3483FA] mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-700">Horario de atención</p>
                <p className="text-sm text-gray-600">Lunes a sábado de 8am a 4pm</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full p-3.5 bg-[#3483FA] text-white rounded-sm flex items-center justify-center gap-2 hover:bg-[#2968c8] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span>Finalizar compra por WhatsApp</span>
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-100 rounded-md shadow-md my-10">
      <div className="p-4 bg-[#EFEFE5] shadow-sm rounded-t-md">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Formulario de Compra</h1>
        <p className="text-sm text-gray-600 mb-4">
          Paso {currentStep} de {totalSteps}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <div
            className="bg-[#3483FA] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-3 mb-2 px-1">
          <span className="text-md font-semibold text-gray-700">
            Compra total ARS {getTotalPrice().toLocaleString()}
          </span>
        </div>
      </div>

      {renderStep()}

      <div className="p-4 bg-white border-t flex justify-between rounded-b-md">
        {currentStep > 1 ? (
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-white border border-gray-300 rounded-sm text-gray-700 flex items-center gap-1 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Atrás</span>
          </button>
        ) : (
          <div></div>
        )}

        {currentStep < totalSteps && (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-[#3483FA] text-white rounded-sm flex items-center gap-1 hover:bg-[#2968c8]"
          >
            <span>Siguiente</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
