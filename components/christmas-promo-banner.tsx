import type { FC } from "react"

export type PromoCountdown = {
  days: number
  hours: number
  minutes: number
  isExpired: boolean
}

type ChristmasPromoBannerProps = {
  countdown: PromoCountdown
}

const ChristmasPromoBanner: FC<ChristmasPromoBannerProps> = ({ countdown }) => {
  return (
    <div className="mt-3 rounded-2xl bg-gradient-to-r from-red-700 to-orange-500 p-3 text-white shadow-lg ring-1 ring-red-200/40">
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wide">
        <div className="flex items-center gap-2">
          <span className="rounded bg-gray-800 px-2 py-1 text-[10px] font-black text-white">🎄 Modo navidad activo.  Precio especial</span>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-black/25 px-2 py-1 text-[11px] font-bold tracking-wide text-amber-100">
          🕒 {countdown.days}d {countdown.hours}h {countdown.minutes}m
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed">
        Aprovecha el precio especial 🎁 Quedan <span className="font-bold underline decoration-amber-200">{countdown.days} dias y {countdown.hours} horas</span>
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] font-medium text-emerald-50">
        <span className="flex items-center gap-1 text-emerald-50">
          <span className="text-lg">🎁</span>
          Regalos listos
        </span>
        <span className="flex items-center gap-1 text-lime-50">
          <span className="text-lg">⚡</span>
          Envio rapido
        </span>
        <span className="flex items-center gap-1 text-amber-50">
          <span className="text-lg">🎅</span>
          Stock calentito
        </span>
      </div>
    </div>
  )
}

export default ChristmasPromoBanner
