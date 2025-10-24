"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Leaf, 
  MapPin, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  BarChart3,
  Satellite,
  Droplets,
  Sun,
  Wind,
  Thermometer,
  Calendar,
  Download,
  Filter,
  Search
} from "lucide-react"
import { useState } from "react"

interface FieldData {
  id: string
  name: string
  crop: string
  area: number
  health: number
  ndvi: number
  lastUpdate: string
  coordinates: [number, number]
  status: 'healthy' | 'warning' | 'critical'
  weather: {
    temperature: number
    humidity: number
    rainfall: number
  }
  alerts: string[]
}

export default function CropMonitoringPage() {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

  const fields: FieldData[] = [
    {
      id: '1',
      name: 'Field Alpha',
      crop: 'Wheat',
      area: 2.5,
      health: 85,
      ndvi: 0.72,
      lastUpdate: '2 hours ago',
      coordinates: [30.0444, 31.2357],
      status: 'healthy',
      weather: {
        temperature: 28,
        humidity: 65,
        rainfall: 12
      },
      alerts: []
    },
    {
      id: '2',
      name: 'Field Beta',
      crop: 'Corn',
      area: 3.2,
      health: 72,
      ndvi: 0.58,
      lastUpdate: '4 hours ago',
      coordinates: [30.0544, 31.2457],
      status: 'warning',
      weather: {
        temperature: 32,
        humidity: 58,
        rainfall: 8
      },
      alerts: ['Low moisture detected', 'Pest activity detected']
    },
    {
      id: '3',
      name: 'Field Gamma',
      crop: 'Rice',
      area: 1.8,
      health: 91,
      ndvi: 0.85,
      lastUpdate: '1 hour ago',
      coordinates: [30.0344, 31.2257],
      status: 'healthy',
      weather: {
        temperature: 26,
        humidity: 78,
        rainfall: 15
      },
      alerts: []
    },
    {
      id: '4',
      name: 'Field Delta',
      crop: 'Tomatoes',
      area: 1.2,
      health: 68,
      ndvi: 0.45,
      lastUpdate: '6 hours ago',
      coordinates: [30.0644, 31.2557],
      status: 'critical',
      weather: {
        temperature: 35,
        humidity: 45,
        rainfall: 3
      },
      alerts: ['Drought stress', 'Heat damage', 'Irrigation needed']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/20 border-green-500/30 text-green-400'
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
      case 'critical':
        return 'bg-red-500/20 border-red-500/30 text-red-400'
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-400'
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-500'
    if (health >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getNDVIColor = (ndvi: number) => {
    if (ndvi >= 0.7) return 'text-green-500'
    if (ndvi >= 0.4) return 'text-yellow-500'
    return 'text-red-500'
  }

  const selectedFieldData = fields.find(f => f.id === selectedField)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Crop Monitoring
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time monitoring of crop health using satellite imagery and AI analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Grid View
          </Button>
          <Button 
            variant={viewMode === 'map' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Map View
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{fields.length}</div>
            <p className="text-xs text-muted-foreground">Active monitoring</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Healthy Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {fields.filter(f => f.status === 'healthy').length}
            </div>
            <p className="text-xs text-muted-foreground">No issues detected</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {Math.round(fields.reduce((acc, f) => acc + f.health, 0) / fields.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Overall crop health</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {fields.reduce((acc, f) => acc + f.alerts.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {fields.map((field) => (
          <Card 
            key={field.id} 
            className={`glass-card hover:shadow-3d-lg transition-all duration-300 cursor-pointer ${
              selectedField === field.id ? 'ring-2 ring-primary/50' : ''
            }`}
            onClick={() => setSelectedField(field.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{field.name}</CardTitle>
                    <CardDescription>{field.crop} • {field.area} hectares</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(field.status)}>
                  {field.status === 'healthy' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {field.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {field.status === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {field.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Health Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Health Score</p>
                    <p className={`text-lg font-semibold ${getHealthColor(field.health)}`}>
                      {field.health}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NDVI Index</p>
                    <p className={`text-lg font-semibold ${getNDVIColor(field.ndvi)}`}>
                      {field.ndvi}
                    </p>
                  </div>
                </div>

                {/* Weather Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <span>{field.weather.temperature}°C</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>{field.weather.humidity}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span>{field.weather.rainfall}mm</span>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {field.alerts.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-orange-400">Active Alerts:</p>
                    <div className="space-y-1">
                      {field.alerts.slice(0, 2).map((alert, index) => (
                        <p key={index} className="text-xs text-orange-300 bg-orange-500/10 px-2 py-1 rounded">
                          {alert}
                        </p>
                      ))}
                      {field.alerts.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{field.alerts.length - 2} more alerts
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Last Update */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last update: {field.lastUpdate}</span>
                  <Button size="sm" variant="ghost" className="h-6 px-2">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Field Details Modal */}
      {selectedFieldData && (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{selectedFieldData.name}</CardTitle>
                <CardDescription>
                  {selectedFieldData.crop} • {selectedFieldData.area} hectares • 
                  Last updated {selectedFieldData.lastUpdate}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedField(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Health Analysis */}
              <div className="space-y-4">
                <h3 className="font-semibold">Health Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Overall Health</span>
                    <span className={`font-semibold ${getHealthColor(selectedFieldData.health)}`}>
                      {selectedFieldData.health}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">NDVI Index</span>
                    <span className={`font-semibold ${getNDVIColor(selectedFieldData.ndvi)}`}>
                      {selectedFieldData.ndvi}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                      style={{ width: `${selectedFieldData.health}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Weather Conditions */}
              <div className="space-y-4">
                <h3 className="font-semibold">Weather Conditions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Temperature</span>
                    </div>
                    <span className="font-semibold">{selectedFieldData.weather.temperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Humidity</span>
                    </div>
                    <span className="font-semibold">{selectedFieldData.weather.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Rainfall (7d)</span>
                    </div>
                    <span className="font-semibold">{selectedFieldData.weather.rainfall}mm</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    <Satellite className="h-4 w-4 mr-2" />
                    View Satellite
                  </Button>
                  <Button className="w-full" size="sm" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Detailed Analysis
                  </Button>
                  <Button className="w-full" size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
