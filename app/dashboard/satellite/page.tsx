"use client"

import { SatelliteMap } from "@/components/satellite-map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Satellite, 
  MapPin, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Download,
  RefreshCw,
  Eye
} from "lucide-react"

export default function SatellitePage() {
  const handleLocationSelect = (lat: number, lng: number) => {
    console.log("Selected location:", lat, lng)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Satellite Monitoring
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time satellite imagery and field analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Map */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-primary" />
            Live Satellite View
          </CardTitle>
          <CardDescription>
            Interactive satellite imagery with field monitoring and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SatelliteMap 
            height="600px"
            showControls={true}
            onLocationSelect={handleLocationSelect}
          />
        </CardContent>
      </Card>

      {/* Analysis Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NDVI Analysis */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-green-500" />
              NDVI Analysis
            </CardTitle>
            <CardDescription>
              Vegetation health index
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Field Alpha</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                0.85
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Field Beta</span>
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                0.72
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Field Gamma</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                0.91
              </Badge>
            </div>
            <Button className="w-full" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Analysis
            </Button>
          </CardContent>
        </Card>

        {/* Weather Impact */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Weather Impact
            </CardTitle>
            <CardDescription>
              Recent weather effects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Temperature</span>
                <span className="text-blue-400">28°C</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Humidity</span>
                <span className="text-blue-400">65%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rainfall (7d)</span>
                <span className="text-blue-400">12mm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Wind Speed</span>
                <span className="text-blue-400">8 km/h</span>
              </div>
            </div>
            <Button className="w-full" size="sm" variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Weather Forecast
            </Button>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Field Alerts
            </CardTitle>
            <CardDescription>
              Issues requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-sm font-medium text-orange-400">Field Beta</p>
                <p className="text-xs text-gray-400">Low moisture detected</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm font-medium text-yellow-400">Field Alpha</p>
                <p className="text-xs text-gray-400">Pest activity detected</p>
              </div>
            </div>
            <Button className="w-full" size="sm" variant="outline">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common satellite monitoring tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Activity className="h-6 w-6" />
              <span className="text-xs">NDVI Analysis</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-xs">Growth Tracking</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-xs">Issue Detection</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="h-6 w-6" />
              <span className="text-xs">Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}