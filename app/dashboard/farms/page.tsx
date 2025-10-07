"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"

export default function FarmsPage() {
  const [farms, setFarms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<"ar" | "en">("ar")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchFarms()
  }, [])

  async function fetchFarms() {
    try {
      const { data, error } = await supabase.from("farms").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setFarms(data || [])
    } catch (error) {
      console.error("[v0] Error fetching farms:", error)
    } finally {
      setLoading(false)
    }
  }

  const t = {
    ar: {
      title: "المزارع",
      addFarm: "إضافة مزرعة جديدة",
      noFarms: "لا توجد مزارع",
      noFarmsDesc: "ابدأ بإضافة مزرعتك الأولى",
      area: "المساحة",
      location: "الموقع",
      fields: "حقل",
    },
    en: {
      title: "Farms",
      addFarm: "Add New Farm",
      noFarms: "No Farms",
      noFarmsDesc: "Start by adding your first farm",
      area: "Area",
      location: "Location",
      fields: "fields",
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t[lang].title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
            {lang === "ar" ? "EN" : "ع"}
          </Button>
          <Link href="/dashboard/farms/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t[lang].addFarm}
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : farms.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{t[lang].noFarms}</h3>
            <p className="text-muted-foreground">{t[lang].noFarmsDesc}</p>
            <Link href="/dashboard/farms/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t[lang].addFarm}
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm) => (
            <Link key={farm.id} href={`/dashboard/farms/${farm.id}`}>
              <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{farm.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{farm.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{farm.location}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t[lang].area}</span>
                    <span className="font-semibold">
                      {farm.total_area} {lang === "ar" ? "فدان" : "acres"}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
