"use client"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface SatelliteMapProps {
  center?: [number, number]
  zoom?: number
  height?: string
  showControls?: boolean
  onLocationSelect?: (lat: number, lng: number) => void
}

export function SatelliteMap({ 
  center = [30.0444, 31.2357], // Cairo, Egypt
  zoom = 10,
  height = "400px",
  showControls = true,
  onLocationSelect
}: SatelliteMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center)
  const [mapZoom, setMapZoom] = useState(zoom)
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null)
  const [satelliteData, setSatelliteData] = useState<any>(null)

  // Demo satellite data
  const demoFields = [
    {
      id: 1,
      name: "Field Alpha",
      coordinates: [30.0444, 31.2357] as [number, number],
      crop: "Wheat",
      health: 85,
      area: 2.5,
      lastUpdate: "2025-01-21"
    },
    {
      id: 2,
      name: "Field Beta", 
      coordinates: [30.0544, 31.2457] as [number, number],
      crop: "Corn",
      health: 72,
      area: 3.2,
      lastUpdate: "2025-01-21"
    },
    {
      id: 3,
      name: "Field Gamma",
      coordinates: [30.0344, 31.2257] as [number, number],
      crop: "Rice",
      health: 91,
      area: 1.8,
      lastUpdate: "2025-01-21"
    }
  ]

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng
    setSelectedLocation([lat, lng])
    onLocationSelect?.(lat, lng)
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-500"
    if (health >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getHealthStatus = (health: number) => {
    if (health >= 80) return "Excellent"
    if (health >= 60) return "Good"
    return "Needs Attention"
  }

  return (
    <div className="w-full">
      {showControls && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setMapCenter([30.0444, 31.2357])}
            className="px-3 py-1 text-xs bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
          >
            Cairo
          </button>
          <button
            onClick={() => setMapCenter([31.2001, 29.9187])}
            className="px-3 py-1 text-xs bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
          >
            Alexandria
          </button>
          <button
            onClick={() => setMapCenter([25.6872, 32.6396])}
            className="px-3 py-1 text-xs bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
          >
            Luxor
          </button>
          <button
            onClick={() => setMapCenter([26.8206, 30.8025])}
            className="px-3 py-1 text-xs bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
          >
            Aswan
          </button>
        </div>
      )}

      <div 
        className="rounded-xl overflow-hidden border border-primary/20 shadow-lg"
        style={{ height }}
      >
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
          onClick={handleMapClick}
        >
          {/* Satellite Layer */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />
          
          {/* Roads Layer */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            opacity={0.7}
          />

          {/* Field Markers */}
          {demoFields.map((field) => (
            <Marker key={field.id} position={field.coordinates}>
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-lg mb-2">{field.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Crop:</span> {field.crop}</p>
                    <p><span className="font-medium">Area:</span> {field.area} hectares</p>
                    <p><span className="font-medium">Health:</span> 
                      <span className={`ml-1 ${getHealthColor(field.health)}`}>
                        {field.health}% - {getHealthStatus(field.health)}
                      </span>
                    </p>
                    <p><span className="font-medium">Last Update:</span> {field.lastUpdate}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary/80 transition-colors">
                      View Details
                    </button>
                    <button className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                      Analyze
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Selected Location Marker */}
          {selectedLocation && (
            <Marker position={selectedLocation}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold mb-2">Selected Location</h3>
                  <p className="text-sm">
                    <span className="font-medium">Lat:</span> {selectedLocation[0].toFixed(6)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Lng:</span> {selectedLocation[1].toFixed(6)}
                  </p>
                  <button 
                    onClick={() => setSelectedLocation(null)}
                    className="mt-2 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Satellite Data Summary */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <h3 className="font-semibold text-sm mb-2">Total Fields Monitored</h3>
          <p className="text-2xl font-bold text-primary">{demoFields.length}</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <h3 className="font-semibold text-sm mb-2">Average Health</h3>
          <p className="text-2xl font-bold text-green-500">
            {Math.round(demoFields.reduce((acc, field) => acc + field.health, 0) / demoFields.length)}%
          </p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <h3 className="font-semibold text-sm mb-2">Total Area</h3>
          <p className="text-2xl font-bold text-blue-500">
            {demoFields.reduce((acc, field) => acc + field.area, 0).toFixed(1)} ha
          </p>
        </div>
      </div>
    </div>
  )
}