"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Sprout,
  MapPin,
  Droplets,
  Cloud,
  MessageSquare,
  Bell,
  FileText,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react"

interface SidebarProps {
  user: any
  profile: any
}

const navigation = [
  { name: "لوحة التحكم", nameEn: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "المزارع", nameEn: "Farms", href: "/dashboard/farms", icon: Sprout },
  { name: "الحقول", nameEn: "Fields", href: "/dashboard/fields", icon: MapPin },
  { name: "تحليل التربة", nameEn: "Soil Analysis", href: "/dashboard/soil", icon: Droplets },
  { name: "مراقبة المحاصيل", nameEn: "Crop Monitoring", href: "/dashboard/crops", icon: Sprout },
  { name: "الطقس", nameEn: "Weather", href: "/dashboard/weather", icon: Cloud },
  { name: "الري", nameEn: "Irrigation", href: "/dashboard/irrigation", icon: Droplets },
  { name: "المساعد الذكي", nameEn: "AI Assistant", href: "/dashboard/ai-assistant", icon: MessageSquare },
  { name: "التقارير", nameEn: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "الإشعارات", nameEn: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "السوق", nameEn: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingCart },
  { name: "المنتدى", nameEn: "Forum", href: "/dashboard/forum", icon: Users },
]

export function DashboardSidebar({ user, profile }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-l bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Sprout className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Adham AgriTech</span>
          <span className="text-xs text-muted-foreground">منصة الزراعة الذكية</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="border-t p-4">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/dashboard/settings"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <Settings className="h-5 w-5" />
          <span>الإعدادات</span>
        </Link>
      </div>
    </aside>
  )
}
