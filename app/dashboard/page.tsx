import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, MapPin, Droplets, TrendingUp, AlertTriangle, Cloud } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's farms count
  const { count: farmsCount } = await supabase
    .from("farms")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user!.id)

  // Fetch user's fields count
  const { count: fieldsCount } = await supabase
    .from("fields")
    .select("*, farms!inner(*)", { count: "exact", head: true })
    .eq("farms.owner_id", user!.id)

  // Fetch recent notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user!.id)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold">لوحة التحكم</h2>
        <p className="text-muted-foreground">نظرة عامة على مزارعك وحقولك</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="المزارع" value={farmsCount || 0} icon={<Sprout className="h-5 w-5" />} trend="+2 هذا الشهر" />
        <StatsCard title="الحقول" value={fieldsCount || 0} icon={<MapPin className="h-5 w-5" />} trend="+5 هذا الشهر" />
        <StatsCard
          title="استهلاك المياه"
          value="1,234 م³"
          icon={<Droplets className="h-5 w-5" />}
          trend="-12% عن الشهر الماضي"
          trendPositive
        />
        <StatsCard
          title="الإنتاجية"
          value="87%"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="+5% عن الشهر الماضي"
          trendPositive
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weather Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              حالة الطقس
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">28°C</p>
                  <p className="text-sm text-muted-foreground">صافي جزئياً</p>
                </div>
                <Cloud className="h-16 w-16 text-primary" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">الرطوبة</p>
                  <p className="font-semibold">65%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الرياح</p>
                  <p className="font-semibold">12 كم/س</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الأمطار</p>
                  <p className="font-semibold">0 مم</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              التنبيهات والإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications && notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div
                      className={`mt-0.5 h-2 w-2 rounded-full ${
                        notification.type === "alert"
                          ? "bg-destructive"
                          : notification.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-primary"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title_ar || notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message_ar || notification.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">لا توجد إشعارات جديدة</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionButton title="إضافة مزرعة" href="/dashboard/farms/new" />
            <QuickActionButton title="إضافة حقل" href="/dashboard/fields/new" />
            <QuickActionButton title="تحليل التربة" href="/dashboard/soil/new" />
            <QuickActionButton title="جدولة الري" href="/dashboard/irrigation/new" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({
  title,
  value,
  icon,
  trend,
  trendPositive,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  trendPositive?: boolean
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {trend && (
              <p className={`text-xs mt-1 ${trendPositive ? "text-primary" : "text-muted-foreground"}`}>{trend}</p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionButton({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-center rounded-lg border border-dashed border-primary/50 p-4 text-center transition-colors hover:border-primary hover:bg-primary/5"
    >
      <span className="text-sm font-medium">{title}</span>
    </a>
  )
}
