"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface SatelliteMapProps {
  latitude: number
  longitude: number
  fieldName: string
  ndviValue?: number
  healthStatus?: string
  lang: "ar" | "en"
}

export function SatelliteMap({
  latitude,
  longitude,
  fieldName,
  ndviValue = 0.5,
  healthStatus = "good",
  lang,
}: SatelliteMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw satellite map background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#1a1a2e")
    gradient.addColorStop(0.5, "#16213e")
    gradient.addColorStop(1, "#0f3460")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw NDVI heatmap
    const cellSize = 20
    for (let x = 0; x < canvas.width; x += cellSize) {
      for (let y = 0; y < canvas.height; y += cellSize) {
        // Create variation based on position and NDVI value
        const variation = Math.sin(x / 50) * Math.cos(y / 50) * 0.3
        const value = Math.max(0, Math.min(1, ndviValue + variation))

        // Color based on NDVI value (red to green)
        let color: string
        if (value < 0.3) {
          color = `rgb(${Math.floor(255 * (1 - value))}, 0, 0)` // Red
        } else if (value < 0.6) {
          color = `rgb(255, ${Math.floor((255 * (value - 0.3)) / 0.3)}, 0)` // Orange to Yellow
        } else {
          color = `rgb(${Math.floor(255 * (1 - (value - 0.6) / 0.4))}, 255, 0)` // Yellow to Green
        }

        ctx.fillStyle = color
        ctx.globalAlpha = 0.6
        ctx.fillRect(x, y, cellSize, cellSize)
      }
    }

    ctx.globalAlpha = 1

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw center marker
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const markerSize = 15

    // Glow effect
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, markerSize * 2)
    glowGradient.addColorStop(0, "rgba(34, 197, 94, 0.6)")
    glowGradient.addColorStop(1, "rgba(34, 197, 94, 0)")
    ctx.fillStyle = glowGradient
    ctx.fillRect(centerX - markerSize * 2, centerY - markerSize * 2, markerSize * 4, markerSize * 4)

    // Center circle
    ctx.fillStyle = "#22c55e"
    ctx.beginPath()
    ctx.arc(centerX, centerY, markerSize, 0, Math.PI * 2)
    ctx.fill()

    // Inner circle
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(centerX, centerY, markerSize / 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw coordinates text
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`${latitude.toFixed(4)}°`, centerX, canvas.height - 20)
    ctx.fillText(`${longitude.toFixed(4)}°`, centerX, canvas.height - 5)
  }, [latitude, longitude, ndviValue])

  const t = {
    ar: {
      satelliteMap: "خريطة الأقمار الصناعية",
      ndvi: "مؤشر NDVI",
      coordinates: "الإحداثيات",
      health: "الحالة الصحية",
    },
    en: {
      satelliteMap: "Satellite Map",
      ndvi: "NDVI Index",
      coordinates: "Coordinates",
      health: "Health Status",
    },
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{t[lang].satelliteMap}</h2>
          <p className="text-sm text-muted-foreground">{fieldName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{t[lang].ndvi}</p>
          <p className="text-2xl font-bold text-primary">{(ndviValue * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-lg bg-card">
        <canvas ref={canvasRef} className="h-96 w-full" style={{ display: "block" }} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-card/50 p-3">
          <p className="text-xs text-muted-foreground">{t[lang].coordinates}</p>
          <p className="font-mono text-sm font-semibold">{latitude.toFixed(4)}°N</p>
          <p className="font-mono text-sm font-semibold">{longitude.toFixed(4)}°E</p>
        </div>
        <div className="rounded-lg bg-card/50 p-3">
          <p className="text-xs text-muted-foreground">{t[lang].health}</p>
          <p className="text-sm font-semibold capitalize">{healthStatus}</p>
        </div>
        <div className="rounded-lg bg-card/50 p-3">
          <p className="text-xs text-muted-foreground">Legend</p>
          <div className="mt-1 flex gap-1">
            <div className="h-3 w-3 rounded bg-red-500" />
            <div className="h-3 w-3 rounded bg-yellow-500" />
            <div className="h-3 w-3 rounded bg-green-500" />
          </div>
        </div>
      </div>
    </Card>
  )
}
