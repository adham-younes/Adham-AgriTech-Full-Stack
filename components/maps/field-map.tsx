"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Satellite, Layers, ZoomIn, ZoomOut } from "lucide-react"

// يجب تعيين توكن Mapbox
if (process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
}

interface FieldMapProps {
  center?: [number, number] // [lng, lat]
  zoom?: number
  fields?: Array<{
    id: string
    name: string
    boundaries?: Array<[number, number]>
    center: [number, number]
    area: number
    crop_type?: string
  }>
  onFieldClick?: (fieldId: string) => void
  height?: string
  showSatellite?: boolean
  interactive?: boolean
}

export function FieldMap({
  center = [31.2357, 30.0444], // القاهرة كموقع افتراضي
  zoom = 10,
  fields = [],
  onFieldClick,
  height = "400px",
  showSatellite = false,
  interactive = true,
}: FieldMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapStyle, setMapStyle] = useState(
    showSatellite ? "mapbox://styles/mapbox/satellite-v9" : "mapbox://styles/mapbox/streets-v12"
  )
  const [currentZoom, setCurrentZoom] = useState(zoom)

  useEffect(() => {
    if (!mapContainer.current || !process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) return

    // إنشاء الخريطة
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: center,
      zoom: zoom,
      interactive: interactive,
    })

    // إضافة عناصر التحكم
    if (interactive) {
      map.current.addControl(new mapboxgl.NavigationControl(), "top-left")
      map.current.addControl(new mapboxgl.ScaleControl({ unit: "metric" }), "bottom-left")
    }

    // تحديث الزووم عند التغيير
    map.current.on("zoom", () => {
      if (map.current) {
        setCurrentZoom(map.current.getZoom())
      }
    })

    // إضافة الحقول إلى الخريطة
    map.current.on("load", () => {
      if (!map.current) return

      // إضافة مصدر البيانات للحقول
      map.current.addSource("fields", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: fields.map((field) => ({
            type: "Feature",
            properties: {
              id: field.id,
              name: field.name,
              area: field.area,
              crop_type: field.crop_type || "غير محدد",
            },
            geometry: field.boundaries
              ? {
                  type: "Polygon",
                  coordinates: [field.boundaries],
                }
              : {
                  type: "Point",
                  coordinates: field.center,
                },
          })),
        },
      })

      // إضافة طبقة للحقول (المضلعات)
      map.current.addLayer({
        id: "fields-fill",
        type: "fill",
        source: "fields",
        filter: ["==", "$type", "Polygon"],
        paint: {
          "fill-color": "#22c55e",
          "fill-opacity": 0.3,
        },
      })

      // إضافة حدود للحقول
      map.current.addLayer({
        id: "fields-outline",
        type: "line",
        source: "fields",
        filter: ["==", "$type", "Polygon"],
        paint: {
          "line-color": "#16a34a",
          "line-width": 2,
        },
      })

      // إضافة نقاط للحقول بدون حدود
      map.current.addLayer({
        id: "fields-points",
        type: "circle",
        source: "fields",
        filter: ["==", "$type", "Point"],
        paint: {
          "circle-color": "#22c55e",
          "circle-radius": 10,
          "circle-stroke-color": "#16a34a",
          "circle-stroke-width": 2,
        },
      })

      // إضافة تسميات للحقول
      map.current.addLayer({
        id: "fields-labels",
        type: "symbol",
        source: "fields",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#000000",
          "text-halo-width": 1,
        },
      })

      // إضافة تفاعل عند النقر
      if (interactive && onFieldClick) {
        map.current.on("click", "fields-fill", (e) => {
          if (e.features && e.features[0]) {
            onFieldClick(e.features[0].properties?.id)
          }
        })

        map.current.on("click", "fields-points", (e) => {
          if (e.features && e.features[0]) {
            onFieldClick(e.features[0].properties?.id)
          }
        })

        // تغيير شكل المؤشر عند المرور فوق الحقول
        map.current.on("mouseenter", "fields-fill", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer"
        })

        map.current.on("mouseleave", "fields-fill", () => {
          if (map.current) map.current.getCanvas().style.cursor = ""
        })

        map.current.on("mouseenter", "fields-points", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer"
        })

        map.current.on("mouseleave", "fields-points", () => {
          if (map.current) map.current.getCanvas().style.cursor = ""
        })
      }

      // إضافة popup عند المرور فوق الحقول
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      })

      map.current.on("mouseenter", "fields-fill", (e) => {
        if (map.current && e.features && e.features[0]) {
          const feature = e.features[0]
          const coordinates = e.lngLat

          popup
            .setLngLat(coordinates)
            .setHTML(
              `<div class="p-2">
                <h3 class="font-bold">${feature.properties?.name}</h3>
                <p>المساحة: ${feature.properties?.area} هكتار</p>
                <p>المحصول: ${feature.properties?.crop_type}</p>
              </div>`
            )
            .addTo(map.current)
        }
      })

      map.current.on("mouseleave", "fields-fill", () => {
        popup.remove()
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // تحديث نمط الخريطة
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle)
    }
  }, [mapStyle])

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut()
    }
  }

  const toggleSatellite = () => {
    setMapStyle((prev) =>
      prev === "mapbox://styles/mapbox/satellite-v9"
        ? "mapbox://styles/mapbox/streets-v12"
        : "mapbox://styles/mapbox/satellite-v9"
    )
  }

  const fitToFields = () => {
    if (map.current && fields.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      fields.forEach((field) => {
        if (field.boundaries) {
          field.boundaries.forEach((coord) => {
            bounds.extend(coord as [number, number])
          })
        } else {
          bounds.extend(field.center)
        }
      })
      map.current.fitBounds(bounds, { padding: 50 })
    }
  }

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return (
      <Card className="flex items-center justify-center" style={{ height }}>
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            الخريطة غير متاحة حالياً. يرجى إضافة NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN في ملف .env.local
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="relative">
      <div ref={mapContainer} style={{ height }} className="rounded-lg overflow-hidden" />
      
      {interactive && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={toggleSatellite}
            className="shadow-lg"
            title={mapStyle.includes("satellite") ? "خريطة الشوارع" : "صورة الأقمار الصناعية"}
          >
            {mapStyle.includes("satellite") ? <Layers className="h-4 w-4" /> : <Satellite className="h-4 w-4" />}
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={fitToFields}
            className="shadow-lg"
            title="عرض جميع الحقول"
            disabled={fields.length === 0}
          >
            <MapPin className="h-4 w-4" />
          </Button>

          <div className="flex flex-col gap-1">
            <Button size="sm" variant="secondary" onClick={handleZoomIn} className="shadow-lg" title="تكبير">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={handleZoomOut} className="shadow-lg" title="تصغير">
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg shadow-lg">
        <p className="text-sm font-medium">Zoom: {currentZoom.toFixed(1)}</p>
      </div>
    </div>
  )
}