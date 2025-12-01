"use client"

import clsx from "clsx"
import { useCallback, useEffect, useState } from "react"

interface Particle {
  id: number
  treeX: number
  treeY: number
  currentX: number
  currentY: number
  velocityX: number
  velocityY: number
  isLight: boolean
}

type Phase = "flock" | "forming" | "complete"

export function ChristmasTreeAnimation({ className }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>("flock")
  const [particles, setParticles] = useState<Particle[]>([])
  const [cycle, setCycle] = useState(0)

  const generateParticles = useCallback(() => {
    const points: Particle[] = []
    let id = 0

    const rows = [
      { y: 50, count: 1, width: 0 },
      { y: 80, count: 3, width: 24 },
      { y: 110, count: 5, width: 48 },
      { y: 140, count: 7, width: 72 },
      { y: 170, count: 9, width: 96 },
      { y: 200, count: 11, width: 120 },
      { y: 230, count: 13, width: 144 },
      { y: 260, count: 15, width: 168 },
      { y: 290, count: 5, width: 30 },
      { y: 320, count: 5, width: 30 },
    ]

    const centerX = 200

    rows.forEach((row, rowIndex) => {
      const spacing = row.count > 1 ? row.width / (row.count - 1) : 0
      const startX = centerX - row.width / 2

      for (let i = 0; i < row.count; i++) {
        const treeX = row.count === 1 ? centerX : startX + spacing * i
        const treeY = row.y
        const isLight = rowIndex < 8 && Math.random() > 0.65

        points.push({
          id: id++,
          treeX,
          treeY,
          currentX: Math.random() * 400,
          currentY: Math.random() * 380,
          velocityX: (Math.random() - 0.5) * 3,
          velocityY: (Math.random() - 0.5) * 3,
          isLight,
        })
      }
    })

    return points
  }, [])

  useEffect(() => {
    setParticles(generateParticles())
    setPhase("flock")
  }, [cycle, generateParticles])

  useEffect(() => {
    if (phase !== "flock") return

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          let vx = p.velocityX
          let vy = p.velocityY

          // Cohesion toward flock center
          const centerX = 200
          const centerY = 190
          vx += (centerX - p.currentX) * 0.001
          vy += (centerY - p.currentY) * 0.001

          // Organic wobble
          vx += (Math.random() - 0.5) * 0.3
          vy += (Math.random() - 0.5) * 0.3

          // Boundary nudge
          if (p.currentX < 40) vx += 0.5
          if (p.currentX > 360) vx -= 0.5
          if (p.currentY < 30) vy += 0.5
          if (p.currentY > 350) vy -= 0.5

          // Cap speed
          const speed = Math.sqrt(vx * vx + vy * vy)
          const maxSpeed = 2.5
          if (speed > maxSpeed) {
            vx = (vx / speed) * maxSpeed
            vy = (vy / speed) * maxSpeed
          }

          return {
            ...p,
            currentX: p.currentX + vx,
            currentY: p.currentY + vy,
            velocityX: vx,
            velocityY: vy,
          }
        }),
      )
    }, 16)

    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    const formingTimer = setTimeout(() => {
      setPhase("forming")
    }, 2000)

    const completeTimer = setTimeout(() => {
      setPhase("complete")
    }, 2500)

    const resetTimer = setTimeout(() => {
      setCycle((c) => c + 1)
    }, 5500)

    return () => {
      clearTimeout(formingTimer)
      clearTimeout(completeTimer)
      clearTimeout(resetTimer)
    }
  }, [cycle])

  return (
    <div className={clsx("relative w-full h-full overflow-hidden rounded-2xl", className)}>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(30, 30, 30, 0.8) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 100%, rgba(20, 20, 20, 0.6) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)
          `,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <svg
        viewBox="0 0 400 380"
        className="absolute inset-0 w-full h-full"
        style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.1))" }}
      >
        {particles.map((particle) => {
          const isForming = phase === "forming" || phase === "complete"
          const x = isForming ? particle.treeX : particle.currentX
          const y = isForming ? particle.treeY : particle.currentY

          return (
            <g key={particle.id}>
              <circle
                cx={x}
                cy={y}
                r={particle.isLight ? 3.5 : 2}
                fill="white"
                style={{
                  transition: isForming
                    ? "cx 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), cy 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : "none",
                }}
              />
              {particle.isLight && phase === "complete" && (
                <circle
                  cx={particle.treeX}
                  cy={particle.treeY}
                  r={10}
                  fill="white"
                  className="animate-pulse"
                  style={{
                    opacity: 0.2,
                    animationDuration: "1.5s",
                  }}
                />
              )}
            </g>
          )
        })}
      </svg>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </div>
  )
}
