"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sprout, MapPin, Droplets, Cloud, TrendingUp, Satellite } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedView, setSelectedView] = useState<'satellite' | 'terrain'>('satellite')

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // تحميل Mapbox GL JS ديناميكياً
    const loadMapbox = async () => {
      // Load Mapbox CSS
      const link = document.createElement('link')
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css'
      link.rel = 'stylesheet'
      document.head.appendChild(link)

      // Load Mapbox JS
      const script = document.createElement('script')
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js'
      script.async = true

      script.onload = () => {
        const mapboxgl = (window as any).mapboxgl
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
          center: [31.2357, 30.0444], // Cairo, Egypt
          zoom: 12,
          pitch: 45,
          bearing: 0
        })

        map.current.on('load', () => {
          setMapLoaded(true)

          // Add 3D buildings
          map.current.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.6
            }
          })

          // Add demo farm markers
          const demoFarms = [
            { name: 'مزرعة النيل', coords: [31.2357, 30.0444], health: 'excellent' },
            { name: 'مزرعة الدلتا', coords: [31.2557, 30.0644], health: 'good' },
            { name: 'مزرعة الخير', coords: [31.2157, 30.0344], health: 'fair' },
          ]

          demoFarms.forEach(farm => {
            const el = document.createElement('div')
            el.className = 'demo-marker'
            el.style.cssText = `
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background-color: ${farm.health === 'excellent' ? '#22c55e' : farm.health === 'good' ? '#84cc16' : '#eab308'};
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
            `

            new mapboxgl.Marker(el)
              .setLngLat(farm.coords)
              .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`
                    <div style="padding: 8px; direction: rtl; font-family: sans-serif;">
                      <h3 style="font-weight: bold; margin-bottom: 4px;">${farm.name}</h3>
                      <p style="color: #666; font-size: 12px;">الحالة: ${farm.health === 'excellent' ? 'ممتاز' : farm.health === 'good' ? 'جيد' : 'متوسط'}</p>
                    </div>
                  `)
              )
              .addTo(map.current)
          })

          // Add navigation controls
          map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
        })
      }

      document.body.appendChild(script)
    }

    loadMapbox()

    return () => {
      if (map.current) map.current.remove()
    }
  }, [])

  const changeMapStyle = (style: 'satellite' | 'terrain') => {
    if (!map.current) return
    
    const styleMap = {
      satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
      terrain: 'mapbox://styles/mapbox/outdoors-v12'
    }
    
    map.current.setStyle(styleMap[style])
    setSelectedView(style)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Sprout className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Adham AgriTech</h1>
                <p className="text-xs text-muted-foreground">منصة الزراعة الذكية</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="outline">تسجيل الدخول</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>ابدأ الآن</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <Badge className="mb-2">
            <Satellite className="h-3 w-3 ml-1" />
            عرض تجريبي
          </Badge>
          <h1 className="text-4xl font-bold">خريطة الأقمار الصناعية التفاعلية</h1>
          <p className="text-lg text-muted-foreground">
            شاهد مزارعك من الفضاء مع تقنية Mapbox وبيانات Planet Labs
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Sprout className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">مزارع نشطة</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">حقول زراعية</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-cyan-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Droplets className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-sm text-muted-foreground">كفاءة الري</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-orange-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">+15%</p>
                <p className="text-sm text-muted-foreground">نمو الإنتاجية</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Map Container */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-card/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Satellite className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">عرض الخريطة</h2>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedView === 'satellite' ? 'default' : 'outline'}
                onClick={() => changeMapStyle('satellite')}
              >
                أقمار صناعية
              </Button>
              <Button
                size="sm"
                variant={selectedView === 'terrain' ? 'default' : 'outline'}
                onClick={() => changeMapStyle('terrain')}
              >
                تضاريس
              </Button>
            </div>
          </div>
          
          <div 
            ref={mapContainer} 
            className="w-full h-[600px] bg-muted"
            style={{ position: 'relative' }}
          />

          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="text-center space-y-2">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
              </div>
            </div>
          )}
        </Card>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Satellite className="h-6 w-6 text-green-500" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">صور عالية الدقة</h3>
                <p className="text-sm text-muted-foreground">
                  صور أقمار صناعية بدقة عالية من Planet Labs تُحدّث يومياً
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">مؤشرات NDVI</h3>
                <p className="text-sm text-muted-foreground">
                  مراقبة صحة المحاصيل باستخدام مؤشرات الغطاء النباتي
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-500" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">تتبع دقيق</h3>
                <p className="text-sm text-muted-foreground">
                  حدد موقع كل حقل بدقة GPS وتتبع التغيرات بمرور الوقت
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <Card className="p-8 text-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <h2 className="text-2xl font-bold mb-2">جرّب المنصة الكاملة</h2>
          <p className="text-muted-foreground mb-6">
            احصل على وصول كامل لجميع الميزات: تحليل التربة، توقعات الطقس، المساعد الذكي والمزيد
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg">
                <Sprout className="h-4 w-4 ml-2" />
                ابدأ مجاناً
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline">
                معرفة المزيد
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Adham AgriTech. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}
